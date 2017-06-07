import React, { PropTypes } from "react";
import DescriptionField from "../fields/DescriptionField.js";

function CheckboxWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    label,
    autofocus,
    onChange,
    readOnlyForm,
  } = props;

  const _onChange = (value) => {
    return onChange(value === "" ? undefined : value, {id: props.id});
  };

  return (
    <div className={`checkbox ${disabled ? "disabled" : ""}`}>
      {schema.description &&
        <DescriptionField description={schema.description} />}
      <label>
        <input
          type="checkbox"
          id={id}
          checked={typeof value === "undefined" ? false : value}
          required={required}
          disabled={readOnlyForm? readOnlyForm: disabled}
          autoFocus={autofocus}
          onChange={event => _onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
