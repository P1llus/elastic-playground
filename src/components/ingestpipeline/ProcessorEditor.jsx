import { useGlobalState } from '../hooks/GlobalState';
import { Editor } from '@monaco-editor/react';

const ProcessorEditor = ({ data, tag, processor }) => {
  const updatePipelineItem = useGlobalState((state) => state.updatePipelineItem);
  const handlePipelineEditorChange = (tag, newContent, processor) => {
    updatePipelineItem(tag, newContent, processor);
  };

  return (
    <div style={{ height: '180px' }}>
      <Editor
        language="json"
        theme="vs-dark"
        value={typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          hideCursorInOverviewRuler: true,
          minimap: { enabled: false },
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: true,
          },
        }}
        onChange={(newValue) => handlePipelineEditorChange(tag, newValue, processor)}
      />
    </div>
  );
};

export default ProcessorEditor;
