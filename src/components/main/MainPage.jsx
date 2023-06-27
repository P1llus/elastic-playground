import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
  htmlIdGenerator,
} from "@elastic/eui";
import { useState, useEffect } from "react";

import LogSampleForm from "../logsampleform/LogSampleForm";
import EcsTable from "../ecstable/EcsTable";
import IngestPipeline from "../ingestpipeline/IngestPipeline";
import Results from "../results/Results";
import { runPipeline, calculateTokenCount } from "../helpers/Helpers";

const makeId = htmlIdGenerator();

const MainPage = () => {
  const [runResults, setRunResults] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [currentError, setCurrentError] = useState([]);
  const [response, setResponse] = useState();
  const [hasProcessors, setHasProcessors] = useState(false);
  const [ingestPipelineState, setIngestPipelineState] = useState([]);
  const [ingestPipelineSteps, setIngestPipelineSteps] = useState([]);
  const [ingestPipelineStats, setIngestPipelineStats] = useState([]);
  const [ingestPipelineSkippedSteps, setIngestPipelineSkippedSteps] = useState(
    []
  );
  const [ingestPipelineStatsTotal, setIngestPipelineStatsTotal] = useState({});
  const [logSamples, setLogSamples] = useState([""]);
  const [formState, setFormState] = useState({
    vendor: "",
    product: "",
    description: "",
  });

  const runGPT = (pipeline) => {
    setIngestPipelineState([]);
    pipeline.processors.forEach((item) => {
      const key = makeId();
      const newProcessor = Object.keys(item)[0];
      const content = JSON.stringify(item, null, 2);
      const newItem = {
        key,
        newProcessor,
        content,
      };
      setIngestPipelineState((prevList) => [...prevList, newItem]);
    });
  };

  useEffect(() => {
    const getStats = setTimeout(() => {
      const newStatsTotal = Object.values(ingestPipelineStats).reduce(
        (total, current) => {
          current.forEach((item, index) => {
            total.totalDuration += item.duration;
            if (item.status === "success") total.successCount += 1;
            if (item.status === "error") {
              total.errorCount += 1;
              total.errorDocIndex.push(index);
            }
          });

          return total;
        },
        {
          totalDuration: 0,
          successCount: 0,
          errorCount: 0,
          errorDocIndex: [],
        }
      );
      setIngestPipelineStatsTotal(newStatsTotal);
    }, 1000);
    return () => clearTimeout(getStats);
  }, [ingestPipelineStats]);

  const handleRunResults = (runResults, verbose) => {
    if (!verbose) {
      let lastSuccessfulResults = [];
      runResults.docs.forEach((doc) => {
        lastSuccessfulResults.push(doc.doc._source);
      });
      setRunResults(lastSuccessfulResults);
    } else if (verbose && runResults.docs.length > 0) {
      let lastSuccessfulResults = [];
      let pipelineStepsArray = {}; // Initialize as an object, will include nested arrays on each processor UUID
      let pipelineStepsSkippedArray = {}; // Initialize as an object, will include nested arrays on each processor UUID
      let errorsArray = {}; // Initialize as an object will include nested arrays on each processor UUID
      let statsArray = {}; // Initialize as an object will include nested arrays on each processor UUID

      runResults.docs.forEach((doc) => {
        let lastSuccessfulResult = null; // Initialize the last successful result as null for each doc

        doc.processor_results.forEach((result, index) => {
          if (result.status === "success") {
            lastSuccessfulResult = result.doc._source; // Update the last successful result for each success
            if (!pipelineStepsArray[result.tag]) {
              pipelineStepsArray[result.tag] = []; // Create an empty array for the specific tag if it doesn't exist
            }
            pipelineStepsArray[result.tag].push(result.doc?._source); // Push result.doc into the array for the specific tag
          } else if (result.status === "skipped") {
            if (!pipelineStepsSkippedArray[result.tag]) {
              pipelineStepsSkippedArray[result.tag] = []; // Create an empty array for the specific tag if it doesn't exist
            }
            if (doc.processor_results[index - 1]) {
              result.skipped_doc = doc.processor_results[index - 1].doc._source; // Add the skipped doc to the skipped result
            }
            pipelineStepsSkippedArray[result.tag].push(result); // Push the skipped message to the array for the specific tag
          } else {
            if (result.status !== "skipped") {
              if (!errorsArray[result.tag]) {
                errorsArray[result.tag] = []; // Create an empty array for the specific tag if it doesn't exist
              }
              errorsArray[result.tag].push(result); // Push the error message to the array for the specific tag
            }
          }

          if (!statsArray[result.tag]) {
            statsArray[result.tag] = []; // Create an empty array for the specific tag if it doesn't exist
          }

          statsArray[result.tag].push({
            status: result.status,
            duration:
              result.status === "success" ? result.doc?._ingest?.duration : 0,
          });
        });

        lastSuccessfulResults.push(lastSuccessfulResult); // Add the last successful result to the lastSuccessfulResults array
      });

      setIngestPipelineSteps(pipelineStepsArray); // Pass newResults directly
      setCurrentError(errorsArray); // Convert object values to an array
      setIngestPipelineStats(statsArray); // Set the pipeline stats using newArray
      setIngestPipelineSkippedSteps(pipelineStepsSkippedArray); // Set the skipped steps using newArray

      setRunResults(lastSuccessfulResults); // Set the last successful result
    }
  };

  // When the API sets a response, we want to update the Results component.
  // The state is set differently depending on whether the ingest pipeline has any processors yet.
  // The format of the response body differs if no processors exists.
  useEffect(() => {
    if (!response) {
      return;
    }
    if (hasProcessors) {
      handleRunResults(response, true);
    } else {
      handleRunResults(response, false);
    }
  }, [response]);

  // When the user adds or removes a processor, or changes the message field
  // we want to run the pipeline.
  useEffect(() => {
    if (logSamples.length === 0) {
      return;
    }
    try {
      JSON.parse(JSON.stringify(ingestPipelineState));
    } catch (error) {
      console.log(error);
      return;
    }
    const getData = setTimeout(() => {
      runPipeline(ingestPipelineState, logSamples, setResponse);
    }, 500);
    if (ingestPipelineState.length > 0) {
      setHasProcessors(true);
    } else {
      setHasProcessors(false);
    }
    return () => clearTimeout(getData);
  }, [ingestPipelineState, logSamples]);

  useEffect(() => {
    if (logSamples.length === 0) {
      return;
    }
    const getTokenCount = setTimeout(() => {
      let tokenCount = calculateTokenCount(logSamples);
      setTokenCount(tokenCount);
    }, 500);

    return () => clearTimeout(getTokenCount);
  }, [logSamples]);

  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <LogSampleForm
            formState={formState}
            setFormState={setFormState}
            logSamples={logSamples}
            setLogSamples={setLogSamples}
            runGPT={runGPT}
            tokenCount={tokenCount}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiFlexGroup>
        <IngestPipeline
          ingestPipelineState={ingestPipelineState}
          setIngestPipelineState={setIngestPipelineState}
          ingestPipelineStats={ingestPipelineStats}
          ingestPipelineStatsTotal={ingestPipelineStatsTotal}
          ingestPipelineSteps={ingestPipelineSteps}
          ingestPipelineSkippedSteps={ingestPipelineSkippedSteps}
          currentError={currentError}
        />
        <Results
          runResults={runResults}
          ingestPipelineStatsTotal={ingestPipelineStatsTotal}
        />
        <EcsTable runResults={runResults} />
      </EuiFlexGroup>
    </div>
  );
};

export default MainPage;
