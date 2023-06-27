import { EuiCodeBlock, EuiFlexItem, EuiSpacer, EuiPanel } from "@elastic/eui";

import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";

import { icon as EuiCopyClipboard } from "@elastic/eui/es/components/icon/assets/copy_clipboard";

appendIconComponentCache({
  copyClipboard: EuiCopyClipboard,
});

const Results = ({ runResults, ingestPipelineStatsTotal }) => {
  if (!runResults || runResults.length === 0) {
    return (
      <EuiFlexItem grow={1}>
        <EuiPanel>
          <p>No results available.</p>
        </EuiPanel>
      </EuiFlexItem>
    );
  }

  return (
    <EuiFlexItem grow={1}>
      <div style={{ maxWidth: 5000 }}>
        {runResults.map((result, index) => (
          <EuiFlexItem key={index}>
            <EuiPanel>
              <h2>
                {ingestPipelineStatsTotal &&
                ingestPipelineStatsTotal.errorDocIndex &&
                ingestPipelineStatsTotal.errorDocIndex.includes(index)
                  ? `Document: ${index + 1} - State before Error`
                  : `Output Results - Document: ${index + 1}`}
              </h2>
              <EuiSpacer size="m" />
              <EuiCodeBlock language="json" isCopyable>
                {JSON.stringify(result || {}, null, 2)}
              </EuiCodeBlock>
            </EuiPanel>
            <EuiSpacer size="m" />
          </EuiFlexItem>
        ))}
      </div>
    </EuiFlexItem>
  );
};

export default Results;
