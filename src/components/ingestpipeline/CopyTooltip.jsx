import { EuiToolTip, EuiButtonIcon, copyToClipboard } from '@elastic/eui';
import { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '../hooks/GlobalState';

const CopyTooltip = () => {
  const ingestPipeline = useGlobalState((state) => state.ingestPipeline);

  const [copyPipeline, setCopyPipeline] = useState({});
  const buttonRefCopyClipboard = useRef();
  const [isTextCopiedCopyClipboard, setTextCopiedCopyClipboard] = useState(false);

  const onBlurCopyClipboard = () => {
    setTextCopiedCopyClipboard(false);
  };
  const onClickCopyClipboard = () => {
    buttonRefCopyClipboard.current.focus(); // sets focus for safari
    copyToClipboard(copyPipeline);
    setTextCopiedCopyClipboard(true);
  };

  useEffect(() => {
    const prepareCopyPipeline = () => {
      let finalPipeline = {
        processors: [],
      };
      ingestPipeline.forEach((item) => {
        if (typeof item.content === 'string') {
          try {
            const processedContent = JSON.parse(item.content);
            finalPipeline.processors.push(processedContent);
          } catch (e) {
            return;
          }
        } else {
          finalPipeline.processors.push(item.content);
        }
      });
      const jsonString = `PUT _ingest/pipeline/my-pipeline-id
  ${JSON.stringify(finalPipeline, null, 2)}`;
      setCopyPipeline(jsonString);
    };
    const updateClipboard = setTimeout(() => {
      prepareCopyPipeline();
    }, 1000);
    return () => clearTimeout(updateClipboard);
  }, [ingestPipeline]);

  return (
    <EuiToolTip content={isTextCopiedCopyClipboard ? 'Pipeline Copied' : 'Copy Pipeline'}>
      <EuiButtonIcon
        buttonRef={buttonRefCopyClipboard}
        aria-label="Copy Pipeline to clipboard"
        color="text"
        iconType="copyClipboard"
        onClick={onClickCopyClipboard}
        onBlur={onBlurCopyClipboard}
      />
    </EuiToolTip>
  );
};

export default CopyTooltip;
