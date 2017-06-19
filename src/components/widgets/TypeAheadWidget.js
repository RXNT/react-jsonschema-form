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
    readOnlyForm,
  } = props;

  const typeaheadDefinition = uiSchema["ui:options"]["typeaheadDefinition"];

  const handleChange = (selectedRows) => {
    return onChange(selectedRows);
  };

  let dataSourceId = "";
  let typeAheadOptions = [];

  if(formDataSrc !== null) {
    if(parentName !== undefined) {
      dataSourceId = formDataSrc.dataSourceConfig.properties[parentName][name];
    } else {
      dataSourceId = formDataSrc.dataSourceConfig.properties[name];
    }

    typeAheadOptions = formDataSrc.dataSourceConfig.dataSources[dataSourceId].data;
  }

  let classNames = "form-control";
  if(options.controlClassNames !== "" && options.controlClassNames !== null && options.controlClassNames !== undefined) {
    classNames = options.controlClassNames
                        .join(" ")
                        .trim();
  }

  return (
    <div className={classNames}>
      {<Typeahead disabled={readOnlyForm}
          labelKey={typeaheadDefinition.labelKey}
          options={typeAheadOptions}
          placeholder={typeaheadDefinition.placeholder}
          onChange={handleChange}
        />}
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
