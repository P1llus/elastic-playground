import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { icon as EuiPlus } from '@elastic/eui/es/components/icon/assets/plus';
import { icon as EuiMinus } from '@elastic/eui/es/components/icon/assets/minus';

import Forms from './Forms';
import Samples from './Samples';
import Buttons from './Buttons';

appendIconComponentCache({
  plus: EuiPlus,
  minus: EuiMinus,
});

const LogSampleForm = () => {
  return (
    <EuiPanel>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <Buttons />
        </EuiFlexItem>
        <EuiPanel>
          <EuiFlexItem>
            <Forms />
            <EuiSpacer size="m" />
            <Samples />
          </EuiFlexItem>
        </EuiPanel>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default LogSampleForm;
