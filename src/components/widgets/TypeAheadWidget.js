import React, { PropTypes } from "react";
import DescriptionField from "../fields/DescriptionField.js";
import {Typeahead} from 'react-bootstrap-typeahead';
const _ = require('lodash');

function TypeAheadWidget(props) {
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

  const typeaheadDefinition = uiSchema["ui:options"]["typeaheadDefinition"];

  const handleChange = (selectedRows) => {
    value.map((row, index) => {
      row.isSelected = false;
    });

    if(selectedRows.length > 0) {
      selectedRows.map((selectedRow, index) => {
        let rowIndex =_.findIndex(value, function(row){
            return row[typeaheadDefinition.keyColumn] === selectedRow[typeaheadDefinition.keyColumn];
        });
        value[rowIndex].isSelected = true;
      });
    }

    return onChange(value === "" ? undefined : value);
  };



  return (
    <div>
      <Typeahead
          labelKey={typeaheadDefinition.labelKey}
          options={value}
          placeholder={typeaheadDefinition.placeholder}
          onChange={handleChange}
        />
    </div>
  );
}

TypeAheadWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  TypeAheadWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default TypeAheadWidget;
