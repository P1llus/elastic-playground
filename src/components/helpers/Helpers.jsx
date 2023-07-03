import { htmlIdGenerator } from "@elastic/eui";
import ECS_FIELDS from "./Ecs";
import axios from "axios";
import { getEncoding } from "js-tiktoken";
import { useGlobalState } from "../hooks/GlobalState";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const esUser = import.meta.env.VITE_ES_USER;
const esPass = import.meta.env.VITE_ES_PASS;
const esHost = import.meta.env.VITE_ES_HOST;

const aiEndpoint = import.meta.env.VITE_OPENAI_ENDPOINT;
const aiKey = import.meta.env.VITE_OPENAI_APIKEY;
const aiEngine = import.meta.env.VITE_OPENAI_ENGINE;
const aiTokenLimit = import.meta.env.VITE_OPENAI_TOKEN_LIMIT;

const globalState = useGlobalState.getState();

const examplePipeline = `{"processors":[{"json":{"field":"message","target_field":"mysqlenterprise.audit"}},{"remove":{"field":["message"]}},{"set":{"field":"event.kind","value":"event"}},{"append":{"field":"event.category","value":"database"}},{"append":{"field":"event.category","value":"network","if":"ctx?.mysqlenterprise?.audit?.event == 'connect'"}},{"append":{"field":"event.category","value":"iam","if":"['create_user', 'delete_user', 'drop_user', 'grant', 'flush_privileges'].contains(ctx.mysqlenterprise.audit?.general_data?.sql_command)"}},{"append":{"field":"event.type","value":"access","if":"ctx?.mysqlenterprise?.audit?.class != 'audit'"}},{"set":{"field":"event.outcome","value":"success","if":"ctx?.mysqlenterprise?.audit?.connection_data?.status != null && ctx?.mysqlenterprise?.audit?.connection_data?.status == 0 || ctx?.mysqlenterprise?.audit?.general_data?.status != null && ctx?.mysqlenterprise?.audit?.general_data?.status == 0"}},{"set":{"field":"event.outcome","value":"failure","if":"ctx?.mysqlenterprise?.audit?.connection_data?.status != null && ctx?.mysqlenterprise?.audit?.connection_data?.status > 0 || ctx?.mysqlenterprise?.audit?.general_data?.status != null && ctx?.mysqlenterprise?.audit?.general_data?.status > 0"}},{"set":{"field":"event.action","value":"mysql-{{ mysqlenterprise.audit.event }}","if":"ctx?.mysqlenterprise?.audit?.event != null"}},{"rename":{"field":"mysqlenterprise.audit.account.user","target_field":"server.user.name","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.account.host","target_field":"client.domain","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.login.os","target_field":"client.user.name","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.login.ip","target_field":"client.ip","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.startup_data.os_version","target_field":"host.os.full","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.startup_data.mysql_version","target_field":"service.version","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.startup_data.server_id","target_field":"service.id","ignore_missing":true}},{"rename":{"field":"mysqlenterprise.audit.startup_data.args","target_field":"process.args","ignore_missing":true}},{"set":{"field":"user.name","value":"{{server.user.name}}","ignore_empty_value":true,"if":"ctx.user?.target != null"}},{"append":{"field":"related.user","value":"{{server.user.name}}","allow_duplicates":false,"if":"ctx?.server?.user?.name != null"}},{"append":{"field":"related.user","value":"{{client.user.name}}","allow_duplicates":false,"if":"ctx?.client?.user?.name != null"}},{"append":{"field":"related.user","value":"{{user.target.name}}","allow_duplicates":false,"if":"ctx?.user?.target?.name != null"}},{"append":{"field":"related.ip","value":"{{client.ip}}","allow_duplicates":false,"if":"ctx?.client?.ip != null"}},{"append":{"field":"related.hosts","value":"{{client.domain}}","allow_duplicates":false,"if":"ctx?.client?.domain != null"}},{"date":{"field":"mysqlenterprise.audit.timestamp","formats":["yyyy-MM-dd HH:mm:ss"],"if":"ctx?.mysqlenterprise?.audit?.timestamp != null"}}]}`;

const messages = [
  {
    role: "system",
    content:
      'You are an AI assistant that helps people create Elasticsearch Ingest Pipelines based on user provided data which is a JSON string that is stored in the "message" field. Please provide a single codeblock on a single line containing a Ingest Pipeline and nothing else. The content from the user should include the vendor and product, and one or more JSON strings for example data to be transformed with the ingest pipeline.\nWhen creating the Ingest Pipeline, follow these rules:\nFirst use the JSON processor to process the JSON string in the message field. The configured target_field for the JSON processor should be the vendor and product, for example mysql.audit or microsoft.defender.\nAfter that you should use the remove processor to remove the message field.\nAfter that you should use the rename processor, on any field that matches the Elastic Common Schema, to rename the field and path to match the ECS schema. For example mysql.audit.username should be moved to user.name. Only use one rename processor per field, as it does not allow arrays.\nNever try to rename two fields to the same ECS field if they are in the same log sample, as it will overwrite eachother. If the user provides multiple log samples, and each has different fields that would result in the same ECS destination field then that is fine.\nIf you find any field that indicates the timestamp the event happened, use a date processor to parse this field into @timestamp.',
  },
  {
    role: "user",
    content:
      'Vendor: MySQL Enterprise, Product: Audit\nTest Data: { "timestamp": "2020-10-19 19:31:47", "id": 0, "class": "general", "event": "status", "connection_id": 16, "account": { "user": "audit_test_user2", "host": "hades.home" }, "login": { "user": "audit_test_user2", "os": "", "ip": "192.168.2.5", "proxy": "" }, "general_data": { "command": "Query", "sql_command": "create_table", "query": "CREATE TABLE audit_test_table (firstname VARCHAR(20), lastname VARCHAR(20))", "status": 0 } }',
  },
  {
    role: "assistant",
    content: "```" + examplePipeline + "```",
  },
];

const makeId = htmlIdGenerator();

export const calculateTokenCount = (textArray) => {
  let fullText = "";

  messages.forEach((message) => {
    fullText += message.content + "\n";
  });

  textArray.forEach((text) => {
    fullText += "\n" + text;
  });

  const enc = getEncoding("cl100k_base");
  const tokens = enc.encode(fullText);
  return tokens.length;
};

export const runPipeline = (ingestPipeline, messageArray) => {
  let verbose = false;
  let url = "";
  if (ingestPipeline.length > 0) {
    verbose = true;
  }
  if (verbose) {
    url = esHost + "/_ingest/pipeline/_simulate?verbose=true";
  } else {
    url = esHost + "/_ingest/pipeline/_simulate";
  }
  const result = {
    pipeline: {
      description: "",
      processors: [],
    },
    docs: [],
  };

  ingestPipeline.forEach((processor) => {
    let processedContent;
    if (typeof processor.content === "string") {
      try {
        processedContent = JSON.parse(processor.content);
      } catch (e) {
        return;
      }
    } else {
      // Create a deep copy of processor.content
      processedContent = JSON.parse(JSON.stringify(processor.content));
    }
    let rootField = Object.keys(processedContent)[0];
    processedContent[rootField]["tag"] = processor.key;
    result.pipeline.processors.push(processedContent);
  });

  messageArray.forEach((message, index) => {
    const doc = {
      _index: "index",
      _id: `${index}`,
      _source: {
        message: message,
      },
    };
    result.docs.push(doc);
  });

  axios
    .post(url, result, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(esUser + ":" + esPass),
      },
    })
    .then((response) => {
      handleRunResults(response.data, verbose);
    })
    .catch((error) => {
      console.log("response err: ", error);
    });
};

export const handleRunResults = (runResults, verbose) => {
  if (!verbose) {
    const lastSuccessfulResults = runResults.docs.map((doc) => doc.doc._source);
    globalState.setPipelineRunResults(lastSuccessfulResults);
  } else if (verbose && runResults.docs.length > 0) {
    let lastSuccessfulResults = [];
    let errorDocIndices = [];
    let pipelineSteps = {};
    let pipelineSkippedSteps = {};
    let pipelineErrors = {};
    let pipelineStats = {};
    let successCount = 0;
    let errorCount = 0;
    let totalDuration = 0;

    runResults.docs.forEach((doc) => {
      let lastSuccessfulResult = null;

      doc.processor_results.forEach((result, index) => {
        const { status, tag, doc: resultDoc } = result;

        if (status === "success") {
          lastSuccessfulResult = resultDoc._source;
          if (!pipelineSteps[tag]) pipelineSteps[tag] = [];
          pipelineSteps[tag].push(resultDoc._source);

          successCount++;
          totalDuration += resultDoc._ingest.duration;
        } else if (status === "skipped") {
          if (!pipelineSkippedSteps[tag]) pipelineSkippedSteps[tag] = [];
          const skippedResult = { ...result };
          if (doc.processor_results[index - 1]) {
            skippedResult.skipped_doc =
              doc.processor_results[index - 1].doc._source;
          }
          pipelineSkippedSteps[tag].push(skippedResult);
        } else {
          if (!pipelineErrors[tag]) pipelineErrors[tag] = [];
          pipelineErrors[tag].push(result);
          errorDocIndices.push(index);

          errorCount++;
        }

        const stats = {
          status: result.status,
          duration:
            result.status === "success" ? resultDoc._ingest.duration : 0,
        };

        if (!pipelineStats[tag]) pipelineStats[tag] = [];
        pipelineStats[tag].push(stats);
      });

      lastSuccessfulResults.push(lastSuccessfulResult);
    });

    globalState.setPipelineSteps(pipelineSteps);
    globalState.setPipelineSkippedSteps(pipelineSkippedSteps);
    globalState.setPipelineErrors(pipelineErrors);
    globalState.setPipelineStats(pipelineStats);
    globalState.setPipelineStatsTotalSuccessCount(successCount);
    globalState.setPipelineStatsTotalErrorCount(errorCount);
    globalState.setPipelineStatsTotalDuration(totalDuration);
    globalState.setPipelineStatsTotalErrorDocIndices(errorDocIndices);
    globalState.setPipelineRunResults(lastSuccessfulResults);
  }
};

export const extractFields = (obj, parent) => {
  let result = [];
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let newKey = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result = result.concat(extractFields(obj[key], newKey));
      } else {
        const isEcs = Object.prototype.hasOwnProperty.call(ECS_FIELDS, newKey);
        const description = isEcs ? ECS_FIELDS[newKey] : "";
        result.push({
          field: newKey,
          is_ecs: isEcs,
          description: description,
          id: makeId(),
        });
      }
    }
  }

  return result;
};

export const openAIRequest = async (vendor, product, textArray) => {
  if (!vendor || !product || textArray.length === 0) return;

  const client = new OpenAIClient(aiEndpoint, new AzureKeyCredential(aiKey));

  let fullText = `Vendor: ${vendor}, Product: ${product}\n`;
  textArray.forEach((text, index) => {
    fullText += `Test Data ${index + 1}: ${text}\n`;
  });
  const allMessages = [
    ...messages,
    {
      role: "user",
      content: fullText,
    },
  ];
  const result = await client.getChatCompletions(aiEngine, allMessages, {
    maxTokens: parseInt(aiTokenLimit),
  });

  const pipeline = extractPipeline(result?.choices[0]?.message?.content);
  let processedPipeline = null;
  try {
    processedPipeline = JSON.parse(pipeline);
  } catch (e) {
    console.log(e);
    return;
  }
  let items = [];
  processedPipeline.processors.forEach((item) => {
    const key = makeId();
    const newProcessor = Object.keys(item)[0];
    const content = JSON.stringify(item, null, 2);
    const newItem = {
      key,
      newProcessor,
      content,
    };
    items.push(newItem);
  });
  globalState.setIngestPipelineState(items);
};

function extractPipeline(str) {
  const matches = str.match(/```([^`]*)```/);
  return matches && matches[1] ? matches[1] : null;
}
