import { EuiFlexGroup, EuiFlexItem, EuiComboBox, htmlIdGenerator } from '@elastic/eui';
import { processors } from '../processor/Processor';
import { useGlobalState } from '../hooks/GlobalState';

const makeId = htmlIdGenerator();

const ComboBox = () => {
  const addPipelineItem = useGlobalState((state) => state.addPipelineItem);
  const onComboBoxChange = (selectedOptions) => {
    const newProcessor = selectedOptions[0].label;
    const content = selectedOptions[0].content;
    const key = makeId();
    const status = 'unknown';
    const error = '';
    const duration = '';
    const percentage = 0;
    const newItem = {
      key,
      newProcessor,
      content,
      status,
      error,
      duration,
      percentage,
    };
    addPipelineItem(newItem);
  };
  return (
    <EuiFlexGroup gutterSize="l">
      <EuiFlexItem>
        <EuiComboBox
          fullWidth={true}
          placeholder="Select a processor"
          aria-label="processor-combobox"
          singleSelection={{ asPlainText: true }}
          options={processors.map((processor) => ({
            label: processor.key,
            content: processor.content,
          }))}
          onChange={onComboBoxChange}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default ComboBox;
