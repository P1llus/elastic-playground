import { EuiPopover, EuiBadge, EuiCodeBlock, EuiSpacer } from '@elastic/eui';
import { useGlobalState } from '../hooks/GlobalState';

const badgeTypes = {
  duration: {
    color: 'primary',
    onClickAriaLabel: 'Duration',
    dataKey: 'pipelineStats',
  },
  error: { color: 'danger', onClickAriaLabel: 'Error', dataKey: 'errors' },
  skipped: {
    color: 'primary',
    onClickAriaLabel: 'Skipped',
    dataKey: 'pipelineSkippedSteps',
  },
  success: {
    color: 'success',
    onClickAriaLabel: 'Success',
    dataKey: 'pipelineSteps',
  },
};

const ProcessorBadge = ({ type, tag, idx }) => {
  const isBadgePopoverOpen = useGlobalState((state) => state.isBadgePopoverOpen);
  const toggleBadgePopover = useGlobalState((state) => state.toggleBadgePopover);
  const closeBadgePopover = useGlobalState((state) => state.closeBadgePopover);
  const { color, onClickAriaLabel, dataKey } = badgeTypes[type];
  const data = useGlobalState((state) => state[dataKey]?.[tag]);
  const id = `${type}-${idx}`;

  if (type === 'duration') {
    return (
      <EuiPopover
        key={id}
        button={
          <EuiBadge
            onClickAriaLabel={onClickAriaLabel}
            onClick={() => {
              toggleBadgePopover(id);
            }}
            color={color}
          >
            {'Stats'}
          </EuiBadge>
        }
        isOpen={isBadgePopoverOpen?.[id] || false}
        /* c8 ignore next 1 */
        closePopover={() => closeBadgePopover(id)}
      >
        {data?.map((doc, index) => (
          <div key={'entry-' + id}>
            <p>{`Document: ${index + 1} - Duration: ${doc?.duration} (ns)`}</p>
            <EuiSpacer size="s" />
          </div>
        ))}
      </EuiPopover>
    );
  } else {
    return (
      <EuiPopover
        key={id}
        button={
          <EuiBadge
            onClickAriaLabel={onClickAriaLabel}
            onClick={() => {
              toggleBadgePopover(id);
            }}
            color={color}
          >
            {data?.length ?? 0}
          </EuiBadge>
        }
        isOpen={isBadgePopoverOpen?.[id] || false}
        /* c8 ignore next 1 */
        closePopover={() => closeBadgePopover(id)}
      >
        <EuiCodeBlock language="json" isCopyable>
          {JSON.stringify(data, null, 2) ?? ''}
        </EuiCodeBlock>
      </EuiPopover>
    );
  }
};

export default ProcessorBadge;
