import React, { Component, PropTypes } from "react";
const ReactGridLayout = require('react-grid-layout');
const _ = require('lodash');

import {
  orderProperties,
  retrieveSchema,
  getDefaultRegistry,
} from "../../utils";

let schemaFieldComponents = null;

class ObjectField extends Component {
  static defaultProps = {
    uiSchema: {},
    formData: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;
  }

  onPropertyChange = name => {
    return (value, options) => {
      const newFormData = { ...this.props.formData, [name]: value };

      let uiSchema = {...this.props.uiSchema};
      this.props.rules.map((rule, index) => {
        if(newFormData[rule.property] === rule.value) {
          if(rule.displayProperty) {
            uiSchema[rule.displayProperty]["ui:options"].displayControls = true;
          } else if(rule.hideProperty) {
            uiSchema[rule.hideProperty]["ui:options"].displayControls = false;
          }
        }
      });

      this.props.onChange(newFormData, options, uiSchema);
    };
  };

  render() {
    const {
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      onBlur,
      formLayout,
      rules,
      formDataSrc,
    } = this.props;

    const { definitions, fields, formContext } = this.props.registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);
    const title = schema.title === undefined ? name : schema.title;
    let orderedProperties;
    try {
      let properties = [];
      const tempProperties = Object.keys(schema.properties);
      tempProperties.map((name, index) => {
        if(uiSchema[name]["ui:options"].displayControls) {
          properties.push(name);
        }
      });
      //const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema["ui:order"]);
    } catch (err) {
      return (
        <div>
          <p className="config-error" style={{ color: "red" }}>
            Invalid {name || "root"} object field configuration:
            <em>{err.message}</em>.
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }


    let parsedHtml = null;

    schemaFieldComponents = orderedProperties.map((name, index) => {
      let options = {};

      if(uiSchema !== null && uiSchema !== undefined) {
        let ctrlUiSchema = uiSchema[name];
        if(ctrlUiSchema !== null && ctrlUiSchema !== undefined) {
          options = ctrlUiSchema["ui:options"];
        }
      }

      return <SchemaField
        key={index}
        name={name}
        required={this.isRequired(name)}
        schema={schema.properties[name]}
        uiSchema={uiSchema[name]}
        errorSchema={errorSchema[name]}
        idSchema={idSchema[name]}
        formData={formData[name]}
        rules={rules}
        formDataSrc={formDataSrc}
        onChange={this.onPropertyChange(name)}
        onBlur={onBlur}
        registry={this.props.registry}
        disabled={disabled}
        readonly={readonly}
        options={options}
      />;
    });

    if(formLayout !== null && formLayout !== undefined) {
      let propKeys = {};
      let visibleLayouts = [];

      orderedProperties.map((name, index) => {
         propKeys[name] = index;
         let results =_.filter(formLayout, function(frmLayout){
            return frmLayout.i === name;
        });
        visibleLayouts.push(results[0]);
      });





      let renderedElements = visibleLayouts.map((frmLayout, index) => {
        return (<div key={frmLayout.i}>{schemaFieldComponents[propKeys[frmLayout.i]]}</div>);
      });

      parsedHtml = <ReactGridLayout className='layout' layout={formLayout} cols={12} rowHeight={30} width={1200}>
                          {renderedElements}
                      </ReactGridLayout>;
    } else {
      parsedHtml = schemaFieldComponents;
    }

    return (
      <fieldset>
          <div>
            {parsedHtml}
          </div>
      </fieldset>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    rules: PropTypes.array,
    formDataSrc: PropTypes.object,
  };
}

export default ObjectField;
