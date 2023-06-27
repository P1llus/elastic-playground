import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiButtonIcon,
  EuiFieldText,
  EuiFormRow,
  EuiSpacer,
} from "@elastic/eui";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiPlus } from "@elastic/eui/es/components/icon/assets/plus";
import { icon as EuiMinus } from "@elastic/eui/es/components/icon/assets/minus";

appendIconComponentCache({
  plus: EuiPlus,
  minus: EuiMinus,
});
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

const LogSampleForm = ({
  formState,
  setFormState,
  logSamples,
  setLogSamples,
  runGPT,
  tokenCount,
}) => {
  const handleFormStateChange = (key, value) => {
    setFormState((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const handleLogSampleChange = (index, value) => {
    setLogSamples((prevSamples) => {
      const updatedSamples = [...prevSamples];
      updatedSamples[index] = value;
      return updatedSamples;
    });
  };
  const handleRemoveLogSample = () => {
    setLogSamples((prevSamples) => {
      if (prevSamples.length === 1) {
        return prevSamples; // Ensure there's at least one entry
      }
      const updatedSamples = [...prevSamples];
      updatedSamples.pop(); // Remove the last entry
      return updatedSamples;
    });
  };
  const handleAddLogSample = () => {
    setLogSamples((prevSamples) => {
      const updatedSamples = [...prevSamples, ""]; // Add a new empty string
      return updatedSamples;
    });
  };
  return (
    <EuiPanel>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiPanel>
            <EuiFlexGroup direction="column" gutterSize="s">
              <EuiFlexGroup
                direction="column"
                alignItems="flexEnd"
                justifyContent="flexEnd"
              >
                <EuiFlexItem>
                  <EuiButton
                    fill={true}
                    onClick={() => {
                      runGPT(gptResponse);
                    }}
                  >
                    Analyze with ChatGPT
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  Current Token Count: {tokenCount}
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  Price per 1k Token: $0.002
                </EuiFlexItem>
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
        </EuiFlexItem>

        <EuiPanel>
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFormRow
                  fullWidth
                  label="Vendor"
                  helpText="Which vendor is the log sample from? (e.g. Cisco, CheckPoint, etc.)"
                >
                  <EuiFieldText
                    fullWidth
                    placeholder="Cisco"
                    value={formState.vendor}
                    onChange={(e) =>
                      handleFormStateChange("vendor", e.target.value)
                    }
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow
                  fullWidth
                  label="Product"
                  helpText="Which product from the vendor? (e.g. ASA, Firewall, etc.)"
                >
                  <EuiFieldText
                    fullWidth
                    placeholder="ASA"
                    value={formState.product}
                    onChange={(e) =>
                      handleFormStateChange("product", e.target.value)
                    }
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow
                  fullWidth
                  label="Description"
                  helpText="Few word description about the log source (e.g. 'audit log', 'application errors', etc.)"
                >
                  <EuiFieldText
                    fullWidth
                    placeholder="audit log"
                    value={formState.description}
                    onChange={(e) =>
                      handleFormStateChange("description", e.target.value)
                    }
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiFlexGroup direction="column">
              {logSamples.map((sample, index) => (
                <EuiFlexItem key={index}>
                  <EuiFormRow fullWidth label={`Log Sample ${index + 1}`}>
                    <EuiFieldText
                      fullWidth
                      placeholder="May  5 17:51:17 dev01: %FTD-7-609002: Teardown local-host net:192.168.1.1 duration 0:00:00"
                      value={sample}
                      onChange={(e) =>
                        handleLogSampleChange(index, e.target.value)
                      }
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              ))}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiPanel>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default LogSampleForm;
