import {
  EuiDraggable,
  EuiButtonIcon,
  EuiBadge,
  EuiDroppable,
  EuiPanel,
  EuiFlexItem,
  EuiComboBox,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiSpacer,
  EuiDragDropContext,
  EuiPopover,
  htmlIdGenerator,
  euiDragDropReorder,
  copyToClipboard,
  EuiToolTip,
  EuiText,
} from "@elastic/eui";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { processors } from "../processor/Processor";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowDown } from "@elastic/eui/es/components/icon/assets/arrow_down";
import { icon as EuiEmpty } from "@elastic/eui/es/components/icon/assets/empty";
import { icon as EuiCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiError } from "@elastic/eui/es/components/icon/assets/error";
import { icon as EuiClock } from "@elastic/eui/es/components/icon/assets/clock";
import { icon as EuiCheckIn } from "@elastic/eui/es/components/icon/assets/checkInCircleFilled";
import { icon as EuiCopyClipboard } from "@elastic/eui/es/components/icon/assets/copy_clipboard";
import { useGlobalState } from "../hooks/globalState";

appendIconComponentCache({
  arrowDown: EuiIconArrowDown,
  empty: EuiEmpty,
  cross: EuiCross,
  error: EuiError,
  clock: EuiClock,
  checkInCircleFilled: EuiCheckIn,
  copyClipboard: EuiCopyClipboard,
});

const makeId = htmlIdGenerator();

const IngestPipeline = ({}) => {
  const pipelineState = useGlobalState((state) => state.pipelineState);
  const addPipelineItem = useGlobalState((state) => state.addPipelineItem);
  const updatePipelineItem = useGlobalState(
    (state) => state.updatePipelineItem
  );
  const [copyPipeline, setCopyPipeline] = useState({});
  const [isBadgePopoverOpen, setIsBadgePopoverOpen] = useState([]);
  const buttonRef = useRef();
  const [isTextCopied, setTextCopied] = useState(false);

  const handlePipelineEditorChange = (key, newContent, newProcessor) => {
    updatePipelineItem(key, newContent, newProcessor);
  };

  useEffect(() => {
    const updateClipboard = setTimeout(() => {
      prepareCopyPipeline();
    }, 5000);
    return () => clearTimeout(updateClipboard);
  }, [ingestPipelineState]);

  const remove = (index) => {
    setIngestPipelineState((prevList) => {
      const currentList = [...prevList];
      currentList.splice(index, 1);
      return currentList;
    });
  };

  const toggleBadgePopover = (identifier) => {
    setIsBadgePopoverOpen((prevOpen) => ({
      ...prevOpen,
      [identifier]: !prevOpen[identifier],
    }));
  };

  const closeBadgePopover = (identifier) => {
    setIsBadgePopoverOpen((prevOpen) => ({
      ...prevOpen,
      [identifier]: false,
    }));
  };

  const prepareCopyPipeline = () => {
    let test = {
      processors: [],
    };
    ingestPipelineState.forEach((item) => {
      if (typeof item.content === "string") {
        try {
          processedContent = JSON.parse(processor.content);
        } catch (e) {
          return;
        }
      } else {
        test.processors.push(item.content);
      }
    });
    const jsonString = `PUT _ingest/pipeline/my-pipeline-id
${JSON.stringify(test, null, 2)}`;
    setCopyPipeline(jsonString);
  };

  const onDragEnd = ({ source, destination }) => {
    if (source && destination) {
      const items = euiDragDropReorder(
        ingestPipelineState,
        source.index,
        destination.index
      );
      setIngestPipelineState(items);
    }
  };
  const onBlur = () => {
    setTextCopied(false);
  };
  const onClick = () => {
    buttonRef.current.focus(); // sets focus for safari
    copyToClipboard(copyPipeline);
    setTextCopied(true);
  };
  const onComboBoxChange = (selectedOptions) => {
    const newProcessor = selectedOptions[0].label;
    const content = selectedOptions[0].content;
    const key = makeId();
    const status = "unknown";
    const error = "";
    const duration = "";
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
    <EuiFlexItem grow={1}>
      <EuiPanel>
        <EuiDragDropContext onDragEnd={onDragEnd}>
          <EuiPanel>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiFlexGroup>
                  <EuiFlexItem grow={false}>
                    <EuiText>Success:</EuiText>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiBadge color="success">
                      {ingestPipelineStatsTotal.successCount}
                    </EuiBadge>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiText>Errors:</EuiText>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiBadge color="danger">
                      {ingestPipelineStatsTotal.errorCount}
                    </EuiBadge>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiText>
                      Duration: {ingestPipelineStatsTotal.totalDuration} (ns)
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiToolTip
                content={isTextCopied ? "Pipeline Copied" : "Copy Pipeline"}
              >
                <EuiButtonIcon
                  buttonRef={buttonRef}
                  aria-label="Copy Pipeline to clipboard"
                  color="text"
                  iconType="copyClipboard"
                  onClick={onClick}
                  onBlur={onBlur}
                />
              </EuiToolTip>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiComboBox
                  fullWidth={true}
                  placeholder="Select a processor"
                  singleSelection={{ asPlainText: true }}
                  options={processors.map((processor) => ({
                    label: processor.key,
                    content: processor.content,
                  }))}
                  onChange={onComboBoxChange}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
          <div
            tabIndex={0}
            role="region"
            aria-label=""
            className="eui-scrollBar"
          >
            <EuiDroppable droppableId="pipelineArea" spacing="m">
              {ingestPipelineState.map(({ key, content }, idx) => (
                <EuiDraggable
                  spacing="s"
                  key={key}
                  index={idx}
                  draggableId={key}
                  hasInteractiveChildren={true}
                >
                  {() => (
                    <div>
                      <EuiPanel>
                        <EuiPanel
                          color={
                            ingestPipelineStats[key]?.every(
                              (obj) => obj.status !== "error"
                            )
                              ? "success"
                              : ingestPipelineStats[key]?.some(
                                  (obj) => obj.status === "error"
                                )
                              ? "danger"
                              : "primary"
                          }
                        >
                          <EuiFlexGroup gutterSize="s">
                            <EuiFlexItem>
                              <EuiText>
                                {ingestPipelineState[idx].newProcessor}
                              </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem>
                              <EuiText>
                                Duration in nano:{" "}
                                {ingestPipelineStats[key]?.duration}
                              </EuiText>
                            </EuiFlexItem>
                            <EuiPopover
                              key={"error-" + idx}
                              button={
                                <EuiBadge
                                  onClickAriaLabel="Error"
                                  onClick={() => {
                                    toggleBadgePopover("error-" + idx);
                                  }}
                                  color="danger"
                                >
                                  {currentError && currentError[key]
                                    ? currentError[key].length
                                    : 0}
                                </EuiBadge>
                              }
                              isOpen={isBadgePopoverOpen["error-" + idx]}
                              closePopover={() =>
                                closeBadgePopover("error-" + idx)
                              }
                            >
                              <EuiCodeBlock language="json" isCopyable>
                                {currentError && currentError[key]
                                  ? JSON.stringify(currentError[key], null, 2)
                                  : ""}
                              </EuiCodeBlock>
                            </EuiPopover>
                            <EuiPopover
                              key={"skipped-" + idx}
                              button={
                                <EuiBadge
                                  onClickAriaLabel="skipped"
                                  onClick={() => {
                                    toggleBadgePopover("skipped-" + idx);
                                  }}
                                  color="primary"
                                >
                                  {ingestPipelineSkippedSteps &&
                                  ingestPipelineSkippedSteps[key]
                                    ? ingestPipelineSkippedSteps[key].length
                                    : 0}
                                </EuiBadge>
                              }
                              isOpen={isBadgePopoverOpen["skipped-" + idx]}
                              closePopover={() =>
                                closeBadgePopover("skipped-" + idx)
                              }
                            >
                              <EuiCodeBlock language="json" isCopyable>
                                {ingestPipelineSkippedSteps &&
                                ingestPipelineSkippedSteps[key]
                                  ? JSON.stringify(
                                      ingestPipelineSkippedSteps[key],
                                      null,
                                      2
                                    )
                                  : ""}
                              </EuiCodeBlock>
                            </EuiPopover>
                            <EuiPopover
                              key={"success-" + idx}
                              button={
                                <EuiBadge
                                  onClickAriaLabel="Success"
                                  onClick={() => {
                                    toggleBadgePopover("success-" + idx);
                                  }}
                                  color="success"
                                >
                                  {ingestPipelineSteps &&
                                  ingestPipelineSteps[key]
                                    ? ingestPipelineSteps[key].length
                                    : 0}
                                </EuiBadge>
                              }
                              isOpen={isBadgePopoverOpen["success-" + idx]}
                              closePopover={() =>
                                closeBadgePopover("success-" + idx)
                              }
                            >
                              <EuiCodeBlock language="json" isCopyable>
                                {ingestPipelineSteps && ingestPipelineSteps[key]
                                  ? JSON.stringify(
                                      ingestPipelineSteps[key],
                                      null,
                                      2
                                    )
                                  : ""}
                              </EuiCodeBlock>
                            </EuiPopover>
                            <EuiButtonIcon
                              iconType="cross"
                              aria-label="Remove"
                              onClick={() => remove(idx)}
                            />
                          </EuiFlexGroup>
                        </EuiPanel>
                        <EuiSpacer size="s" />
                        <div style={{ height: "200px", width: "500px" }}>
                          <Editor
                            language="json"
                            theme="vs-dark"
                            value={
                              typeof content === "string"
                                ? content
                                : JSON.stringify(content, null, 2)
                            }
                            options={{
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              hideCursorInOverviewRuler: true,
                              minimap: { enabled: false },
                              scrollbar: {
                                vertical: "hidden",
                                horizontal: "hidden",
                                handleMouseWheel: true,
                              },
                            }}
                            onChange={(newValue) =>
                              handlePipelineEditorChange(
                                ingestPipelineState[idx].key,
                                newValue,
                                ingestPipelineState[idx].newProcessor
                              )
                            }
                          />
                        </div>
                      </EuiPanel>
                      <EuiSpacer size="s" />
                    </div>
                  )}
                </EuiDraggable>
              ))}
            </EuiDroppable>
          </div>
        </EuiDragDropContext>
      </EuiPanel>
    </EuiFlexItem>
  );
};

export default IngestPipeline;
