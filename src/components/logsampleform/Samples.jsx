import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiFormRow,
} from "@elastic/eui";
import { useEffect } from "react";
import { useGlobalState } from "../hooks/GlobalState";
import { runPipeline } from "../helpers/Helpers";

const Samples = () => {
  const ingestPipeline = useGlobalState((state) => state.ingestPipeline);
  const logSamples = useGlobalState((state) => state.samples);
  const setSample = useGlobalState((state) => state.setSample);

  useEffect(() => {
    if (logSamples.length === 0) {
      return;
    }
    try {
      JSON.parse(JSON.stringify(ingestPipeline));
    } catch (error) {
      console.log(error);
      return;
    }
    const getData = setTimeout(() => {
      runPipeline(ingestPipeline, logSamples);
    }, 500);
    return () => clearTimeout(getData);
  }, [logSamples]);

  const handleLogSampleChange = (index, value) => {
    setSample(index, value);
  };

  return (
    <EuiFlexGroup direction="column">
      {logSamples?.map((sample, index) => (
        <EuiFlexItem key={index}>
          <EuiFormRow fullWidth label={`Log Sample ${index + 1}`}>
            <EuiFieldText
              fullWidth
              placeholder="May  5 17:51:17 dev01: %FTD-7-609002: Teardown local-host net:192.168.1.1 duration 0:00:00"
              value={sample}
              onChange={(e) => handleLogSampleChange(index, e.target.value)}
            />
          </EuiFormRow>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};

export default Samples;
