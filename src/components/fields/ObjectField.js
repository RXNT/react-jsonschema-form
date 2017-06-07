import React, { Component, PropTypes } from "react";
const ReactGridLayout = require('react-grid-layout');
const _ = require('lodash');
import {
  evaluateRulesWrapperFunction
} from "../../utils";

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
      let schema = {...this.props.schema};
      let uiSchemaWithRules = uiSchema;
      let evaluateRules = false;

      if(options !== null && options !== undefined) {
        if(options.id !== null && options.id !== undefined) {
          const idPaths = options.id.split("_");
          idPaths[0] = "form";
          if(this.props.rules !== null && this.props.rules !== undefined) {
            let tempRules = this.props.rules;

            for (let pathCount = 0; pathCount < idPaths.length - 1; pathCount++) {
              if(tempRules[idPaths[pathCount]] !== null && tempRules[idPaths[pathCount]] !== undefined) {
                tempRules = tempRules[idPaths[pathCount]];
              } else {
                tempRules = null;
                break;
              }
            }

            if(tempRules !== null  && tempRules !== undefined) {
              if(tempRules.publishProperties.indexOf(idPaths[idPaths.length - 1]) >= 0) {
                evaluateRules = true;
                uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, newFormData);
                this.props.onChange(newFormData, options, uiSchemaWithRules);
              }
            }
          }
        }
      }

      if(!evaluateRules) {
        this.props.onChange(newFormData, options, uiSchemaWithRules);
      }
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
      readOnlyForm,
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

    schemaFieldComponents = orderedProperties.map((propertyName, index) => {
      let options = {};

      if(uiSchema !== null && uiSchema !== undefined) {
        let ctrlUiSchema = uiSchema[propertyName];
        if(ctrlUiSchema !== null && ctrlUiSchema !== undefined) {
          options = ctrlUiSchema["ui:options"];
        }
      }

      return <SchemaField
        key={index}
        name={propertyName}
        required={this.isRequired(propertyName)}
        schema={schema.properties[propertyName]}
        uiSchema={uiSchema[propertyName]}
        errorSchema={errorSchema[propertyName]}
        idSchema={idSchema[propertyName]}
        formData={formData[propertyName]}
        rules={rules}
        formDataSrc={formDataSrc}
        onChange={this.onPropertyChange(propertyName)}
        onBlur={onBlur}
        registry={this.props.registry}
        disabled={disabled}
        readonly={readonly}
        options={options}
        parentName={name}
        readOnlyForm={readOnlyForm}
      />;
    });

    if(formLayout !== null && formLayout !== undefined) {
      let propKeys = {};
      let visibleLayouts = [];
      let currentObjectFormLayout = [];
      if(name === undefined) {
        currentObjectFormLayout = formLayout.form.layout;
      } else {
        currentObjectFormLayout = formLayout[name].layout;
      }
      orderedProperties.map((name, index) => {
         propKeys[name] = index;
         let results =_.filter(currentObjectFormLayout, function(frmLayout){
            return frmLayout.i === name;
         });
         visibleLayouts.push(results[0]);
      });

      let renderedElements = visibleLayouts.map((frmLayout, index) => {
        let a = Math.floor(100000 + Math.random() * 900000);
          a = a.toString();
          a = a.substring(-2);
        return (<div key={frmLayout.i}>{schemaFieldComponents[propKeys[frmLayout.i]]}</div>);
      });


      parsedHtml = <ReactGridLayout className='layout' layout={currentObjectFormLayout} cols={12} rowHeight={30} width={1200}>
                          {renderedElements}
                      </ReactGridLayout>;
    } else {
      parsedHtml = schemaFieldComponents;
    }

    //parsedHtml = schemaFieldComponents;

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
    rules: PropTypes.object,
    formDataSrc: PropTypes.object,
  };
}

export default ObjectField;
