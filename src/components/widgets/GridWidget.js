import React, { PropTypes } from "react";
import DescriptionField from "../fields/DescriptionField.js";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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

  let selectRowProp = {
                          mode: "checkbox"
                        };
  return (
    <div>
      <BootstrapTable minHeight="150px" data={value} selectRow={selectRowProp} search={false} keyField="patientId">
        <TableHeaderColumn width ="30%" dataField="patientId" headerAlign="center" dataAlign="center" editable={false}>Patient Id</TableHeaderColumn>
        <TableHeaderColumn width ="35%" dataField="patientName" headerAlign="center" editable={false}>Patient Name</TableHeaderColumn>
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
