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
    formDataSrc,
    name,
    parentName,
    options,
  } = props;

  const typeaheadDefinition = uiSchema["ui:options"]["typeaheadDefinition"];

  const handleChange = (selectedRows) => {
    return onChange(selectedRows);
  };

  let parentCtrlName = parentName;
  if(parentCtrlName === undefined) {
    parentCtrlName = "form";
  }

  let classNames = "form-control"
  if(options.controlClassNames !== "" && options.controlClassNames !== null && options.controlClassNames !== undefined) {
    classNames = options.controlClassNames
                        .join(" ")
                        .trim();
  }

  return (
    <div className={classNames}>
      <Typeahead
          labelKey={typeaheadDefinition.labelKey}
          options={formDataSrc[parentCtrlName][name]}
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
    value: PropTypes.array,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default TypeAheadWidget;
