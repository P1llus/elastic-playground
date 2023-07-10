import {
  EuiDraggable,
  EuiDroppable,
  EuiPanel,
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
  EuiDragDropContext,
} from '@elastic/eui';

import { useEffect } from 'react';

import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { icon as EuiIconArrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as EuiEmpty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as EuiCross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as EuiError } from '@elastic/eui/es/components/icon/assets/error';
import { icon as EuiClock } from '@elastic/eui/es/components/icon/assets/clock';
import { icon as EuiCheckIn } from '@elastic/eui/es/components/icon/assets/checkInCircleFilled';
import { icon as EuiCopyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard';
import { runPipeline } from '../helpers/Helpers';
import { useGlobalState } from '../hooks/GlobalState';
import IngestPipelineHeader from './IngestPipelineHeader';
import CopyTooltip from './CopyTooltip';
import ComboBox from './ComboBox';
import ProcessorPanel from './ProcessorPanel';
import ProcessorEditor from './ProcessorEditor';

appendIconComponentCache({
  arrowDown: EuiIconArrowDown,
  empty: EuiEmpty,
  cross: EuiCross,
  error: EuiError,
  clock: EuiClock,
  checkInCircleFilled: EuiCheckIn,
  copyClipboard: EuiCopyClipboard,
});

const IngestPipeline = () => {
  const ingestPipeline = useGlobalState((state) => state.ingestPipeline);
  const reorderPipelineItems = useGlobalState((state) => state.reorderPipelineItems);

  /* c8 ignore next 20 */
  const onDragEnd = ({ source, destination }) => {
    if (source && destination) {
      reorderPipelineItems(source.index, destination.index);
    }
  };

  useEffect(() => {
    const logSamples = useGlobalState.getState().samples;
    if (logSamples?.length === 0) {
      return;
    }
    try {
      JSON.parse(JSON.stringify(ingestPipeline));
    } catch (error) {
      return;
    }
    const getData = setTimeout(() => {
      runPipeline(ingestPipeline, logSamples);
    }, 500);
    return () => clearTimeout(getData);
  }, [ingestPipeline]);

  return (
    <EuiFlexItem grow={1}>
      <EuiPanel>
        <EuiDragDropContext onDragEnd={onDragEnd}>
          <EuiPanel>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <IngestPipelineHeader />
              </EuiFlexItem>
              <CopyTooltip />
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <ComboBox />
          </EuiPanel>
          <EuiDroppable droppableId="pipelineArea" spacing="m">
            {ingestPipeline.map(({ key, content, newProcessor }, idx) => (
              <EuiDraggable spacing="s" index={idx} key={key} draggableId={key} hasInteractiveChildren={true}>
                {() => (
                  <EuiPanel>
                    <ProcessorPanel name={newProcessor} tag={key} idx={idx} />
                    <ProcessorEditor data={content} tag={key} processor={newProcessor} />
                  </EuiPanel>
                )}
              </EuiDraggable>
            ))}
          </EuiDroppable>
        </EuiDragDropContext>
      </EuiPanel>
    </EuiFlexItem>
  );
};

export default IngestPipeline;
