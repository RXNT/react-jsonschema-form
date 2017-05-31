import React, { Component, PropTypes } from "react";
const ReactGridLayout = require('react-grid-layout');
const _ = require('lodash');

import {
  orderProperties,
  retrieveSchema,
  getDefaultRegistry,
} from "../../utils";

let schemaFieldComponents = null;
let uiSchemaGlobal = null;

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
      uiSchemaGlobal = uiSchema;
      // this.props.rules.map((rule, index) => {
      //   if(newFormData[rule.property] === rule.value) {
      //     if(rule.displayProperty) {
      //       uiSchema[rule.displayProperty]["ui:options"].displayControls = true;
      //     } else if(rule.hideProperty) {
      //       uiSchema[rule.hideProperty]["ui:options"].displayControls = false;
      //     }
      //   }
      // });
      this.evaluateRules(schema.properties, '', this.props.rules, newFormData);
      this.props.onChange(newFormData, options, uiSchemaGlobal);
    };
  };

  evaluateRules(obj, stack, rules, formData) {
    let compScope = this;

    for (var property in obj) {
        if(obj[property]["type"] === 'object') {
          let stackPaths = (stack + '.' + property).split(".");

          let tempUiSchema = uiSchemaGlobal;
          for (let pathCount = 1; pathCount < stackPaths.length; pathCount++) {
            if(tempUiSchema[stackPaths[pathCount]] !== null && tempUiSchema[stackPaths[pathCount]] !== undefined) {
              tempUiSchema = tempUiSchema[stackPaths[pathCount]];
            }
          }

          if(tempUiSchema["ui:options"] === null || tempUiSchema["ui:options"] === undefined) {
            tempUiSchema["ui:options"] = {};
          }

          tempUiSchema["ui:options"].displayControls = true;

          compScope.evaluateRules(obj[property].properties, stack + '.' + property, rules, formData);
        } else {
          let stackPaths = (stack + '.' + property).split(".");
          stackPaths[0] = "form";

          let rulesObj = rules;

          for (let pathCount = 0; pathCount < stackPaths.length - 1; pathCount++) {
            if(rulesObj[stackPaths[pathCount]] !== null && rulesObj[stackPaths[pathCount]] !== undefined) {
              rulesObj = rulesObj[stackPaths[pathCount]];
            } else {
              rulesObj = [];
              break;
            }
          }

          let results =_.filter(rulesObj.rules, function(rule){
              return rule.displayProperty === stackPaths[stackPaths.length-1];
          });

          if(results.length === 1) {
            let propValue = formData;
            for (let pathCount = 1; pathCount < stackPaths.length - 1; pathCount++) {
              if(propValue[stackPaths[pathCount]] !== null && propValue[stackPaths[pathCount]] !== undefined) {
                propValue = propValue[stackPaths[pathCount]];
              } else {
                propValue = null;
                break;
              }
            }

            if(propValue !== null) {
              if(propValue[results[0].property] !== undefined && propValue[results[0].property] !== null){
                propValue = propValue[results[0].property];
              } else {
                propValue = null;
              }
            }

            let tempUiSchema = uiSchemaGlobal;

            for (let pathCount = 1; pathCount < stackPaths.length; pathCount++) {
              if(tempUiSchema[stackPaths[pathCount]] !== null && tempUiSchema[stackPaths[pathCount]] !== undefined) {
                tempUiSchema = tempUiSchema[stackPaths[pathCount]];
              }
            }

            if(propValue === results[0].value) {
              tempUiSchema["ui:options"].displayControls = true;
            } else {
              tempUiSchema["ui:options"].displayControls = false;
            }

          } else {
            let tempUiSchema = uiSchemaGlobal;
            for (let pathCount = 1; pathCount < stackPaths.length; pathCount++) {
              if(tempUiSchema[stackPaths[pathCount]] !== null && tempUiSchema[stackPaths[pathCount]] !== undefined) {
                tempUiSchema = tempUiSchema[stackPaths[pathCount]];
              }
            }

            tempUiSchema["ui:options"].displayControls = true;
          }
        }
    }
  }

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
