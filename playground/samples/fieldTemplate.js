import React from "react";

function CustomFieldTemplate(props) {
  const { id, label, required, children } = props;
  return (
    <div className="form-inline">
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
      {children}
    </div>
  );
}

module.exports = {
  schema: {
    title: "Field template form",
    description: "A field template example",
    type: "object",
    required: ["firstName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        minLength: 3,
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
    },
  },
  uiSchema: {},
  formData: {
    firstName: "Testfirstname",
  },
  CustomFieldTemplate,
};
