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

  return (
    <div>
      <BootstrapTable minHeight="150px" data={value} selectRow={selectRowProp} search={false} cellEdit={ cellEditProp } keyField="patientId">
        <TableHeaderColumn width ="30%" dataField="patientId" headerAlign="center" dataAlign="center" editable={false}>Patient Id</TableHeaderColumn>
        <TableHeaderColumn width ="35%" dataField="patientName" headerAlign="center" editable={true}>Patient Name</TableHeaderColumn>
        <TableHeaderColumn width ="35%"  dataField="chartNumber" headerAlign="center" editable={false} >Chart Number</TableHeaderColumn>
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
