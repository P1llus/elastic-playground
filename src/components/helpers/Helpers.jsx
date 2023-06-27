import { htmlIdGenerator } from "@elastic/eui";
import ECS_FIELDS from "./Ecs";
import axios from "axios";
import { getEncoding, encodingForModel } from "js-tiktoken";

const username = import.meta.env.VITE_ES_USER;
const password = import.meta.env.VITE_ES_PASS;

const host = import.meta.env.VITE_ES_HOST;
let url = "";

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

export const runPipeline = (ingestPipeline, messageArray, setResponse) => {
  if (ingestPipeline.length > 0) {
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
      setResponse(response.data);
    })
    .catch((error) => {
      console.log("response err: ", error);
    });
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
