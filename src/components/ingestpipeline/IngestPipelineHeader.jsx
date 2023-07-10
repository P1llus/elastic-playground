import { EuiFlexGroup, EuiFlexItem, EuiText, EuiBadge } from '@elastic/eui';
import { useGlobalState } from '../hooks/GlobalState';

const IngestPipelineHeader = () => {
  const totalDuration = useGlobalState((state) => state.totalDuration);
  const successCount = useGlobalState((state) => state.successCount);
  const errorCount = useGlobalState((state) => state.errorCount);
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiText aria-label="success-text">Success:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiBadge aria-label="success-badge" color="success">
          {successCount}
        </EuiBadge>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText aria-label="errors-text">Errors:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiBadge aria-label="errors-badge" color="danger">
          {errorCount}
        </EuiBadge>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText aria-label="duration-text">Duration: {totalDuration} (ns)</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default IngestPipelineHeader;
