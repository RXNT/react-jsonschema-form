import React, { Component } from "react";
import { render } from "react-dom";
import Codemirror from "react-codemirror";
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
const _ = require('lodash');
import "codemirror/mode/javascript/javascript";

import { shouldRender, evaluateRulesWrapperFunction } from "../src/utils";
import { samples } from "./samples";
import Form from "../src";

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/eclipse.css";

import './app.css';
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

// Patching CodeMirror#componentWillReceiveProps so it's executed synchronously
// Ref https://github.com/mozilla-services/react-jsonschema-form/issues/174
Codemirror.prototype.componentWillReceiveProps = function(nextProps) {
  if (
    this.codeMirror &&
    nextProps.value !== undefined &&
    this.codeMirror.getValue() != nextProps.value
  ) {
    this.codeMirror.setValue(nextProps.value);
  }
  if (typeof nextProps.options === "object") {
    for (var optionName in nextProps.options) {
      if (nextProps.options.hasOwnProperty(optionName)) {
        this.codeMirror.setOption(optionName, nextProps.options[optionName]);
      }
    }
  }
};

const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const cmOptions = {
  theme: "default",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2,
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2,
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = code => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        console.error(err);
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className={`${cls} glyphicon glyphicon-${icon}`} />
          {" " + title}
        </div>
        <Codemirror
          value={this.state.code}
          onChange={this.onCodeChange}
          options={Object.assign({}, cmOptions, { theme })}
        />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    //Load template JSON
    let completeSchema = samples.Simple;

    //Set default form to show on page initial load as "1"
    const currentFormNo = 1;

    //Find form definition which we need to render on page
    let formIndex =_.findIndex(completeSchema.template, function(sample){
        return sample.form === currentFormNo;
    });

    const { schema, uiSchema, formData, validate, formLayout, rules, formDataSrc } = completeSchema.template[formIndex];

    //Evaluate form level rules like to display/hide controls
    let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

    completeSchema.template[formIndex].uiSchema = uiSchemaWithRules;

    // initialize state with form definition which we need to render
    this.state = {
      form: false,
      schema,
      uiSchema: uiSchemaWithRules,
      formData,
      validate,
      editor: "default",
      theme: "default",
      liveValidate: true,
      formLayout,
      rules,
      formDataSrc,
      formNo: 1,
      completeSchema: completeSchema
    };
  }

  componentDidMount() {
    this.load(this.state.completeSchema, this.state.formNo);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = (data, formNo) => {
    //Filter template by formNo which we need to render
    //Find form definition which we need to render on page
    let formIndex =_.findIndex(data.template, function(sample){
        return sample.form === formNo;
    });

    if(data.template[formIndex].formLayout !== null || data.template[formIndex].formLayout !== undefined) {
      this.setState({ formLayout: null});
    }

    if(data.template[formIndex].rules !== null || data.template[formIndex].rules !== undefined) {
      this.setState({ rules: null});
    }

    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate } = data.template[formIndex];
    // force resetting form component instance
    this.setState({ form: false }, _ =>
    this.setState({ ...data.template[formIndex], form: true, ArrayFieldTemplate }));

    const { schema, uiSchema, rules, formData } = data.template[formIndex];

    //Evaluate rules which are exists on form to be rendered
    let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

    data.template[formIndex].uiSchema = uiSchemaWithRules;

    this.setState({
      completeSchema: data,
      uiSchema: uiSchemaWithRules,
      rules,
      formNo: formNo
    });
  };

  onSchemaEdited = schema => this.setState({ schema });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema });

  onFormDataEdited = formData => this.setState({ formData });

  onFormLayoutEdited = formLayout => this.setState({ formLayout });

  onFormDataChange = ({ formData }) => {
    //Update formData available in state
    let completeSchema = {...this.state.completeSchema};
    let compScope = this;

    //Find form to which we need to update formData
    let formIndex =_.findIndex(completeSchema.template, function(formInfo){
        return formInfo.form === compScope.state.formNo;
    });

    completeSchema.template[formIndex].formData = formData;

    this.setState({
      completeSchema,
      formData
    });
  };

  changeForm = (frmNo) => {
    let compScope = this;

    //update current form data before navigating to other form
    let formIndex =_.findIndex(compScope.state.completeSchema.template, function(sample){
        return sample.form === compScope.state.formNo;
    });

    let completeSchema = this.state.completeSchema;

    completeSchema.template[formIndex].formData = this.state.formData;
    completeSchema.template[formIndex].uiSchema = this.state.uiSchema;

    //navigate to new form for which user interested
    this.load(completeSchema, frmNo);
  }

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveValidate,
      validate,
      theme,
      editor,
      ArrayFieldTemplate,
      transformErrors,
      formLayout,
      rules,
      formDataSrc,
      formNo,
      completeSchema,
    } = this.state;

    let currentFormReadOnly = false;

    let compScope = this;

    //generate menu items based on no.of forms available in template
    let tabs = completeSchema.template.map(function(item, index) {
      let activeClassName = "";

      //Apply active CSS for selected form
      if(item.form === compScope.state.formNo) {
        activeClassName = "active";
      }

      //Find template level rules exists for current form
      let formRule =_.filter(completeSchema.rules, function(rule){
          return rule.form === item.form;
      });

      let hideForm = false;
      let readOnlyForm = false;

      //if template level rule exists for this form, processs those rules
      if(formRule.length > 0) {
        //fetch form definition of monitor property exists
        const monitorFormInfo =_.filter(completeSchema.template, function(formInfo){
            return formInfo.form === formRule[0].monitorProperty.form;
        });

        //get formData of monitor property form
        let monitorFormFrmData = monitorFormInfo[0].formData;

        //Evaluate property value
        let stackPaths = (formRule[0].monitorProperty.propertyName).split(".");

        for (let pathCount = 0; pathCount < stackPaths.length; pathCount++) {
          if(monitorFormFrmData[stackPaths[pathCount]] !== null && monitorFormFrmData[stackPaths[pathCount]] !== undefined) {
            monitorFormFrmData = monitorFormFrmData[stackPaths[pathCount]];
          } else {
            monitorFormFrmData = null;
            break;
          }
        }

        //If property value exists
        if(monitorFormFrmData !== null && monitorFormFrmData !== undefined) {
          //Execute all rules
          for (let actionCount = 0; actionCount < formRule[0].actions.length; actionCount++) {
            if(monitorFormFrmData === formRule[0].actions[actionCount].value) {
              if(formRule[0].actions[actionCount].propertyAction === "hide") { //Hide form rule
                hideForm = true;
              } else if(formRule[0].actions[actionCount].propertyAction === "readonly") { //ReadOnly form rule
                readOnlyForm = true;
              }
            }
          }
        }
      }

      //If current rendered form is readonly
      if(item.form === compScope.state.formNo) {
        currentFormReadOnly = readOnlyForm;
      }

      if(hideForm) { //If form to be hidden, don't render menu item
        return null;
      } else { //Render menu item
          return (<button key={index} className={"tablinks " + activeClassName} onClick={compScope.changeForm.bind(this, item.form)}>
          {item.title} {(readOnlyForm && <Glyphicon glyph="lock" />)}
          </button>)
      }
    });

    return (
      <div className="container-fluid">
        <div>
          <h4>Dynamic Form</h4>
        </div>
        <div className="row">
            <div className="col-sm-12">
              <div className="tab">
                {tabs}
              </div>
            </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
              {this.state.form &&
                <Form
                  ArrayFieldTemplate={ArrayFieldTemplate}
                  liveValidate={liveValidate}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={formData}
                  onChange={this.onFormDataChange}
                  validate={validate}
                  onBlur={(id, value) =>
                    console.log(`Touched ${id} with value ${value}`)}
                  transformErrors={transformErrors}
                  onError={log("errors")}
                  formLayout={formLayout}
                  rules={rules}
                  formDataSrc={formDataSrc}
                  readOnlyForm={currentFormReadOnly}
                />}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Editor
              title="JSONSchema"
              theme={editor}
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />

            <div className="row">
              <div className="col-sm-4">
                <Editor
                  title="UISchema"
                  theme={editor}
                  code={toJson(uiSchema)}
                  onChange={this.onUISchemaEdited}
                />
              </div>
              <div className="col-sm-4">
                <Editor
                  title="formData"
                  theme={editor}
                  code={toJson(formData)}
                  onChange={this.onFormDataEdited}
                />
              </div>
              <div className="col-sm-4">
                  {formLayout !== null && formLayout !== undefined && <Editor
                    title="Form Layout"
                    theme={editor}
                    code={toJson(formLayout)}
                    onChange={this.onFormLayoutEdited}
                  />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
