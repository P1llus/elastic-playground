import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiButtonIcon,
  EuiSpacer,
} from "@elastic/eui";

import ProcessorBadge from "./ProcessorBadge";
import { useGlobalState } from "../hooks/GlobalState";

const ProcessorPanel = ({ name, tag, idx }) => {
  const pipelineStats = useGlobalState((state) => state.pipelineStats);
  const removePipelineItem = useGlobalState(
    (state) => state.removePipelineItem
  );

  const remove = (index) => {
    removePipelineItem(index);
  };

  return (
    <EuiPanel
      color={
        pipelineStats?.[tag]?.every((obj) => obj.status !== "error")
          ? "success"
          : pipelineStats?.[tag]?.some((obj) => obj.status === "error")
          ? "danger"
          : "primary"
      }
    >
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem>
          <EuiText>{name}</EuiText>
        </EuiFlexItem>
        <ProcessorBadge tag={tag} type="duration" idx={idx} />
        <EuiSpacer size="m" />
        <ProcessorBadge tag={tag} type="error" idx={idx} />
        <ProcessorBadge tag={tag} type="skipped" idx={idx} />
        <ProcessorBadge tag={tag} type="success" idx={idx} />
        <EuiButtonIcon
          iconType="cross"
          aria-label="Remove"
          onClick={() => remove(idx)}
        />
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default ProcessorPanel;
