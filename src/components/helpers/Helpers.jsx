import { htmlIdGenerator } from "@elastic/eui";
import ECS_FIELDS from "./Ecs";
import axios from "axios";
import { getEncoding, encodingForModel } from "js-tiktoken";
import { useGlobalState } from "../hooks/GlobalState";

const username = import.meta.env.VITE_ES_USER;
const password = import.meta.env.VITE_ES_PASS;

const host = import.meta.env.VITE_ES_HOST;
let url = "";
let verbose = false;

const makeId = htmlIdGenerator();

export const calculateTokenCount = (textArray) => {
  let fullText =
    'When responding to the question, please only respond with the Ingest Pipeline without any text or descriptions. When using Elasticsearch Ingest Pipelines to ingest the below log sample, which is a JSON string stored in the "message" field, try to expand the "json" field into a new field called "mysql", rename any fields that belongs into the Elastic Common Schema (ECS), and leave the rest of the fields under the mysql parent field name. Remember that rename processors is not needed when field and target field is the same, and set processors are not used to set the value of the same fieldname';

  textArray.forEach((text) => {
    fullText += "\n" + text;
  });

  const enc = getEncoding("cl100k_base");
  const tokens = enc.encode(fullText);
  return tokens.length;
};

export const runPipeline = (ingestPipeline, messageArray) => {
  if (ingestPipeline.length > 0) {
    verbose = true;
  }
  if (verbose) {
    url = host + "/_ingest/pipeline/_simulate?verbose=true";
  } else {
    url = host + "/_ingest/pipeline/_simulate";
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
        Authorization: "Basic " + btoa(username + ":" + password),
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
  const globalState = useGlobalState.getState();

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
