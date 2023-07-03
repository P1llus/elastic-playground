import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiButton,
  EuiButtonIcon,
  EuiSpacer,
  htmlIdGenerator,
} from "@elastic/eui";
import { useGlobalState } from "../hooks/GlobalState";
import { calculateTokenCount, openAIRequest } from "../helpers/Helpers";
import { useEffect } from "react";

const makeId = htmlIdGenerator();

const Buttons = () => {
  const increaseSample = useGlobalState((state) => state.increaseSample);
  const decreaseSample = useGlobalState((state) => state.decreaseSample);
  const samples = useGlobalState((state) => state.samples);
  const vendor = useGlobalState((state) => state.vendor);
  const product = useGlobalState((state) => state.product);
  const tokenCount = useGlobalState((state) => state.tokenCount);
  const setTokenCount = useGlobalState((state) => state.setTokenCount);
  const setIngestPipelineState = useGlobalState(
    (state) => state.setIngestPipelineState
  );
  const handleRemoveLogSample = () => {
    decreaseSample();
  };
  const handleAddLogSample = () => {
    increaseSample();
  };

  const runGPT = () => {
    (async () => {
      await openAIRequest(vendor, product, samples);
    })();
  };

  useEffect(() => {
    if (samples.length === 0) {
      return;
    }
    const getTokenCount = setTimeout(() => {
      const count = calculateTokenCount(samples);
      setTokenCount(count);
    }, 5000);

    return () => clearTimeout(getTokenCount);
  }, [samples]);

  return (
    <EuiPanel>
      <EuiFlexGroup direction="column" gutterSize="s">
        <EuiFlexGroup
          direction="column"
          alignItems="flexEnd"
          justifyContent="flexEnd"
        >
          <EuiFlexItem>
            <EuiButton
              fill={true}
              onClick={() => {
                runGPT();
              }}
            >
              Analyze with ChatGPT
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            Current Token Count: {tokenCount}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>Price per 1k Token: $0.002</EuiFlexItem>
          <EuiFlexGroup alignItems="flexEnd" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="fill"
                color="primary"
                onClick={() => {
                  handleRemoveLogSample();
                }}
                iconType="minus"
                aria-label="Remove Log Sample"
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="fill"
                color="primary"
                onClick={() => {
                  handleAddLogSample();
                }}
                iconType="plus"
                aria-label="Add Log Sample"
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexGroup>
        <EuiSpacer size="s" />
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default Buttons;
