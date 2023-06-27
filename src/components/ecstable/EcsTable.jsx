import {
  EuiBasicTable,
  EuiPanel,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiPopover,
  EuiText,
} from "@elastic/eui";
import { useState, useEffect } from "react";
import { extractFields } from "../helpers/Helpers";

import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";

import { icon as EuiReturnKey } from "@elastic/eui/es/components/icon/assets/return_key";
import { icon as EuiDocumentation } from "@elastic/eui/es/components/icon/assets/documentation";

appendIconComponentCache({
  return_key: EuiReturnKey,
  documentation: EuiDocumentation,
});

const EcsTable = ({ runResults }) => {
  const [popoverState, setPopoverState] = useState("");
  const [ecsFields, setEcsFields] = useState([]);
  const handleEcsFields = (response) => {
    let fieldsSet = new Set();
    let newFieldsArray = [];
    if (!response || response.length === 0) return;
    for (let doc of response) {
      if (doc && !doc.error) {
        let newFields = "";
        if (doc._source) {
          newFields = extractFields(doc?._source);
        } else {
          newFields = extractFields(doc);
        }
        newFields.forEach((field) => {
          if (!fieldsSet.has(field.field)) {
            fieldsSet.add(field.field);
            newFieldsArray.push(field);
          }
        });
      }
    }
    // Perform sorting
    newFieldsArray.sort((a, b) => {
      // Sort by 'is_ecs' first, true values first
      if (a.is_ecs !== b.is_ecs) return b.is_ecs - a.is_ecs;

      // If 'is_ecs' is the same, sort alphabetically by 'field'
      return a.field.localeCompare(b.field);
    });

    setEcsFields(newFieldsArray);
  };

  useEffect(() => {
    if (
      typeof runResults !== "undefined" &&
      runResults &&
      runResults.length > 0
    ) {
      handleEcsFields(runResults);
    }
  }, [runResults]);

  const closePopover = (id) => {
    setPopoverState((prevState) => ({ ...prevState, [id]: false }));
  };

  const onButtonClick = (id) => {
    setPopoverState((prevState) => ({ ...prevState, [id]: true }));
  };

  const columns = [
    {
      field: "field",
      name: "Field",
    },
    {
      field: "is_ecs",
      name: "Is ECS?",
      dataType: "boolean",
    },
    {
      field: "description",
      name: "Documentation",
      render: (description, item) => {
        const button = (
          <EuiButtonEmpty
            iconType="documentation"
            iconSide="right"
            onClick={() => onButtonClick(item.id)}
          >
            View Documentation
          </EuiButtonEmpty>
        );
        return (
          <EuiPopover
            button={button}
            isOpen={popoverState[item.id] || false}
            closePopover={() => closePopover(item.id)}
          >
            <EuiText style={{ width: 300 }}>
              {description ? description : "No documentation available"}
            </EuiText>
          </EuiPopover>
        );
      },
    },
  ];
  return (
    <EuiFlexItem grow={1}>
      <EuiPanel>
        <EuiBasicTable
          tableLayout="auto"
          items={ecsFields || []}
          columns={columns}
        />
      </EuiPanel>
    </EuiFlexItem>
  );
};

export default EcsTable;
