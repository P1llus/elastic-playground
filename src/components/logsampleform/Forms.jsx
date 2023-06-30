import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiFormRow,
} from "@elastic/eui";
import { useGlobalState } from "../hooks/GlobalState";

const Forms = () => {
  const vendor = useGlobalState((state) => state.vendor);
  const product = useGlobalState((state) => state.product);
  const description = useGlobalState((state) => state.description);
  const setFormState = useGlobalState((state) => state.setFormState);
  const handleFormStateChange = (key, value) => {
    setFormState(key, value);
  };
  return (
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
            value={vendor}
            onChange={(e) => handleFormStateChange("vendor", e.target.value)}
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
            value={product}
            onChange={(e) => handleFormStateChange("product", e.target.value)}
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
            value={description}
            onChange={(e) =>
              handleFormStateChange("description", e.target.value)
            }
          />
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Forms;
