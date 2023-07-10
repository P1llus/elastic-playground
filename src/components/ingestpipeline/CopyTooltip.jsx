import { EuiToolTip, EuiButtonIcon, copyToClipboard } from '@elastic/eui';
import { useRef, useEffect } from 'react';
import { useGlobalState } from '../hooks/GlobalState';

const CopyTooltip = () => {
  const ingestPipeline = useGlobalState((state) => state.ingestPipeline);
  const copyPipeline = useGlobalState((state) => state.copyPipeline);
  const setCopyPipeline = useGlobalState((state) => state.setCopyPipeline);
  const isTextCopied = useGlobalState((state) => state.isTextCopied);
  const setIsTextCopied = useGlobalState((state) => state.setIsTextCopied);

  const buttonRefCopyClipboard = useRef();

  const onBlurCopyClipboard = () => {
    setIsTextCopied(false);
  };
  const onClickCopyClipboard = () => {
    buttonRefCopyClipboard.current.focus(); // sets focus for safari
    copyToClipboard(copyPipeline);
    setIsTextCopied(true);
  };

  useEffect(() => {
    if (ingestPipeline.length === 0) return;
    let processedContent;
    const prepareCopyPipeline = () => {
      let finalPipeline = {
        processors: [],
      };
      ingestPipeline.forEach((item) => {
        if (typeof item.content === 'string') {
          try {
            processedContent = JSON.parse(item.content);
            finalPipeline.processors.push(processedContent);
          } catch (e) {
            console.log('Prepare Copy Pipeline error: ', e);
            return;
          }
        }
        finalPipeline.processors.push(item.content);
      });
      if (finalPipeline.processors.length === 0) return;
      const jsonString = `PUT _ingest/pipeline/my-pipeline-id
  ${JSON.stringify(finalPipeline, null, 2)}`;
      setCopyPipeline(jsonString);
    };
    prepareCopyPipeline();
  }, [ingestPipeline, setCopyPipeline]);

  return (
    <EuiToolTip content={isTextCopied ? 'Pipeline Copied' : 'Copy Pipeline'}>
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
