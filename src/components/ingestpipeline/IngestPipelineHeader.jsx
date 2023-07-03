import { EuiFlexGroup, EuiFlexItem, EuiText, EuiBadge } from '@elastic/eui';
import { useGlobalState } from '../hooks/GlobalState';

const IngestPipelineHeader = () => {
  const totalDuration = useGlobalState((state) => state.totalDuration);
  const successCount = useGlobalState((state) => state.successCount);
  const errorCount = useGlobalState((state) => state.errorCount);
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiText>Success:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiBadge color="success">{successCount}</EuiBadge>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText>Errors:</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiBadge color="danger">{errorCount}</EuiBadge>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText>Duration: {totalDuration} (ns)</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default IngestPipelineHeader;
