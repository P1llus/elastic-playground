import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiButton,
  EuiButtonIcon,
  EuiSpacer,
} from "@elastic/eui";
import { useGlobalState } from "../hooks/globalState";
import { calculateTokenCount } from "../helpers/Helpers";
import { useEffect } from "react";

const gptResponse = {
  description: "MySQL Audit Logs Pipeline",
  processors: [
    {
      json: {
        field: "message",
        target_field: "mysql",
      },
    },
    {
      rename: {
        field: "mysql.timestamp",
        target_field: "@timestamp",
      },
    },
    {
      rename: {
        field: "mysql.id",
        target_field: "event.id",
      },
    },
    {
      rename: {
        field: "mysql.class",
        target_field: "event.kind",
      },
    },
    {
      rename: {
        field: "mysql.event",
        target_field: "event.action",
      },
    },
    {
      rename: {
        field: "mysql.account.user",
        target_field: "user.name",
      },
    },
    {
      rename: {
        field: "mysql.account.host",
        target_field: "client.address",
      },
    },
    {
      rename: {
        field: "mysql.login.user",
        target_field: "mysql.login.username",
      },
    },
    {
      rename: {
        field: "mysql.login.ip",
        target_field: "client.ip",
      },
    },
    {
      rename: {
        field: "mysql.general_data.command",
        target_field: "mysql.general.data.command",
      },
    },
    {
      rename: {
        field: "mysql.general_data.sql_command",
        target_field: "mysql.general.data.sql_command",
      },
    },
    {
      rename: {
        field: "mysql.general_data.query",
        target_field: "mysql.general.data.query",
      },
    },
    {
      rename: {
        field: "mysql.general_data.status",
        target_field: "event.outcome",
      },
    },
  ],
};

/**const runGPT = (pipeline) => {
    setIngestPipelineState([]);
    pipeline.processors.forEach((item) => {
      const key = makeId();
      const newProcessor = Object.keys(item)[0];
      const content = JSON.stringify(item, null, 2);
      const newItem = {
        key,
        newProcessor,
        content,
      };
      setIngestPipelineState((prevList) => [...prevList, newItem]);
    });
  };
**/

const Buttons = () => {
  const increaseSample = useGlobalState((state) => state.increaseSample);
  const decreaseSample = useGlobalState((state) => state.decreaseSample);
  const samples = useGlobalState((state) => state.samples);
  const tokenCount = useGlobalState((state) => state.tokenCount);
  const setTokenCount = useGlobalState((state) => state.setTokenCount);
  const handleRemoveLogSample = () => {
    decreaseSample();
  };
  const handleAddLogSample = () => {
    increaseSample();
  };

  useEffect(() => {
    if (samples.length === 0) {
      return;
    }
    const getTokenCount = setTimeout(() => {
      const count = calculateTokenCount(samples);
      setTokenCount(count);
    }, 5000);

    return () => clearTimeout(getTokenCount);
  }, [samples]);

  return (
    <EuiPanel>
      <EuiFlexGroup direction="column" gutterSize="s">
        <EuiFlexGroup
          direction="column"
          alignItems="flexEnd"
          justifyContent="flexEnd"
        >
          <EuiFlexItem>
            <EuiButton fill={true} onClick={() => {}}>
              Analyze with ChatGPT
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            Current Token Count: {tokenCount}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>Price per 1k Token: $0.002</EuiFlexItem>
          <EuiFlexGroup alignItems="flexEnd" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="fill"
                color="primary"
                onClick={() => {
                  handleRemoveLogSample();
                }}
                iconType="minus"
                aria-label="Remove Log Sample"
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="fill"
                color="primary"
                onClick={() => {
                  handleAddLogSample();
                }}
                iconType="plus"
                aria-label="Add Log Sample"
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexGroup>
        <EuiSpacer size="s" />
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default Buttons;
