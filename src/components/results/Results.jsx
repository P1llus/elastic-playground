import { EuiCodeBlock, EuiFlexItem, EuiSpacer, EuiPanel } from '@elastic/eui';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { icon as EuiCopyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard';
import { useGlobalState } from '../hooks/GlobalState';

appendIconComponentCache({
  copyClipboard: EuiCopyClipboard,
});

const Results = () => {
  const pipelineRunResults = useGlobalState((state) => state.pipelineRunResults);
  const errorDocIndices = useGlobalState((state) => state.errorDocIndices);
  if (!pipelineRunResults || pipelineRunResults.length === 0) {
    return (
      <EuiFlexItem grow={1}>
        <EuiPanel>
          <p>No results available.</p>
        </EuiPanel>
      </EuiFlexItem>
    );
  }

  return (
    <EuiFlexItem grow={2}>
      <div style={{ maxWidth: 5000 }}>
        {pipelineRunResults.map((result, index) => (
          <EuiFlexItem key={index}>
            <EuiPanel>
              <h2>
                {errorDocIndices?.includes(index)
                  ? `Document: ${index + 1} - State before Error`
                  : `Output Results - Document: ${index + 1}`}
              </h2>
              <EuiSpacer size="m" />
              {/* c8 ignore next 3 */}
              <EuiCodeBlock language="json" isCopyable className="eui-textBreakWord">
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
