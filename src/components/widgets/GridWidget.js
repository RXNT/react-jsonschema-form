import React, { PropTypes } from "react";
import DescriptionField from "../fields/DescriptionField.js";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const _ = require('lodash');

function GridWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    label,
    autofocus,
    onChange,
    uiSchema,
  } = props;


  const onAfterSaveCell = (row, cellName, cellValue) => {
    let rowIndex =_.findIndex(value, function(gridRow){
        return gridRow.patientId === row.patientId;
    });
    value[rowIndex] = row;
    return onChange(value === "" ? undefined : value);
  };

  let selectRowProp = {
    mode: "checkbox"
  };

  const cellEditProp = {
    mode: 'click',
    afterSaveCell: onAfterSaveCell
  };

  const gridColDefinitions = uiSchema["ui:options"]["gridDefinition"];

  const keyColIndex =_.findIndex(gridColDefinitions, function(gridCol){
      return gridCol.isKey === true;
  });

  const keyColumn = gridColDefinitions[keyColIndex].dataField;

  let gridColumns = gridColDefinitions.map((gridColDefinition, index) => {
    return <TableHeaderColumn width ={gridColDefinition.width}
                              dataField={gridColDefinition.dataField}
                              headerAlign={gridColDefinition.headerAlign}
                              dataAlign={gridColDefinition.dataAlign}
                              editable={gridColDefinition.editable}>{gridColDefinition.headerText}</TableHeaderColumn>
  });

  return (
    <div>
      <BootstrapTable minHeight="150px" data={value} selectRow={selectRowProp} search={false} cellEdit={ cellEditProp } keyField={keyColumn}>
        {gridColumns}
      </BootstrapTable>
    </div>
  );
}

GridWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  GridWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default GridWidget;
