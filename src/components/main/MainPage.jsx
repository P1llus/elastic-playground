import { EuiFlexItem, EuiFlexGroup, EuiSpacer } from '@elastic/eui';

import LogSampleForm from '../logsampleform/LogSampleForm';
import EcsTable from '../ecstable/EcsTable';
import IngestPipeline from '../ingestpipeline/IngestPipeline';
import Results from '../results/Results';

const MainPage = () => {
  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <LogSampleForm />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiFlexGroup>
        <IngestPipeline />
        <Results />
        <EcsTable />
      </EuiFlexGroup>
    </div>
  );
};

export default MainPage;
