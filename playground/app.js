import React, { Component } from "react";
import { render } from "react-dom";
import Codemirror from "react-codemirror";
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
const _ = require('lodash');
import "codemirror/mode/javascript/javascript";

import { shouldRender, evaluateRulesWrapperFunction } from "../src/utils";
//import { samples } from "./samples";
import Form from "../src";
import appConfig from './app.config';
import appConstants from './app.constants';
const apiProxy = require('./api-proxy.service');

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

    this.state = {
    };
  }

  componentWillMount() {
    //Set default form to show on page initial load as "1"
    const currentFormNo = 1;

    let serviceRequest = {
       "formNo": currentFormNo
    };

    let compScope = this;

    apiProxy.post(appConfig.templateApiURL + appConstants.templateApiRoutes.getTemplateApiRoute, serviceRequest)
      .then(function (response) {

        let formDataSrcInfo = null;

        const { schema, uiSchema, formData, validate, formLayout, rules } = response.templateInfo.templateschema.template[0];

        //Evaluate form level rules like to display/hide controls
        let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

        response.templateInfo.templateschema.template[0].uiSchema = uiSchemaWithRules;

        if(response.templateInfo.templatedataSources.length === 1) {
          formDataSrcInfo = response.templateInfo.templatedataSources[0];
        }

        // initialize state with form definition which we need to render
        compScope.setState({
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
          formDataSrc: formDataSrcInfo,
          formNo: currentFormNo,
          response
        });
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = (response, formNo) => {

    if(response.templateInfo.templateschema.template[0].formLayout !== null ||
        response.templateInfo.templateschema.template[0].formLayout !== undefined) {
      this.setState({ formLayout: null});
    }

    if(response.templateInfo.templateschema.template[0].rules !== null ||
          response.templateInfo.templateschema.template[0].rules !== undefined) {
      this.setState({ rules: null});
    }

    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate } = response.templateInfo.templateschema.template[0];
    // force resetting form component instance
    this.setState({ form: false }, _ =>
    this.setState({ ...response.templateInfo.templateschema.template[0], form: true, ArrayFieldTemplate }));

    const { schema, uiSchema, rules, formData, formLayout } = response.templateInfo.templateschema.template[0];

    //Evaluate rules which are exists on form to be rendered
    let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

    response.templateInfo.templateschema.template[0].uiSchema = uiSchemaWithRules;

    let formDataSource = null;

    if(response.templateInfo.templatedataSources.length === 1) {
      formDataSource = response.templateInfo.templatedataSources[0];
    }

    this.setState({
      response,
      schema,
      formData,
      formLayout,
      uiSchema: uiSchemaWithRules,
      rules,
      formNo: formNo,
      formDataSrc: formDataSource,
    });
  };

  onSchemaEdited = schema => this.setState({ schema });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema });

  onFormDataEdited = formData => this.setState({ formData });

  onFormLayoutEdited = formLayout => this.setState({ formLayout });

  onFormDataChange = ({ formData, uiSchema, formDataSrc }) => {
    let compScope = this;

    //Update formData available in state
    let response = {...this.state.response};

    //Update formData and uiSchema
    response.templateInfo.templateschema.template[0].formData = formData;
    response.templateInfo.templateschema.template[0].uiSchema = uiSchema;

    if(response.templateInfo.templatedataSources.length === 1) {
      response.templateInfo.templatedataSources[0] = formDataSrc;
    }

    //Update template level rules monitorProperty value
    if(response.templateInfo.templateschema.rules !== null &&
          response.templateInfo.templateschema.rules !== undefined) {
      if(response.templateInfo.templateschema.rules.length > 0) {
        let rules = _.filter(response.templateInfo.templateschema.rules, function(ruleInfo) {
          return ruleInfo.monitorProperty.form === compScope.state.formNo;
        });

        if(rules.length > 0) {
          for (let ruleCount = 0; ruleCount < rules.length ; ruleCount++) {
            const stackPaths = rules[ruleCount].monitorProperty.propertyName.split(".");

            let propValue = {...formData};
            for (let pathCount = 0; pathCount < stackPaths.length - 1; pathCount++) {
              if(propValue[stackPaths[pathCount]] !== null && propValue[stackPaths[pathCount]] !== undefined) {
                propValue = propValue[stackPaths[pathCount]];
              } else {
                propValue = null;
                break;
              }
            }

            if(propValue !== null) {
              propValue = propValue[stackPaths[stackPaths.length - 1]];
              rules[ruleCount].monitorProperty.propertyValue = propValue;
            }
          }
        }
      }
    }

    this.setState({
      response,
      uiSchema,
      formData
    });
  };

  changeForm = (frmNo) => {
    let compScope = this;

    //Update formData and uiSchema before navigating to other form
    this.state.response.templateInfo.templateschema.template[0].formData = this.state.formData;
    this.state.response.templateInfo.templateschema.template[0].uiSchema = this.state.uiSchema;

    //save current form information to database before navigating to other form
    let saveRequest = {
       templateInfo: this.state.response.templateInfo,
       formNo: this.state.formNo
    };
    console.log(saveRequest);
    apiProxy.post(appConfig.templateApiURL + appConstants.templateApiRoutes.saveTemplateApiRoute, saveRequest)
      .then(function (response) {
        //If saved Success fully
        if(response.ValidationStatus === 'Success') {
          //navigate to new form for which user interested
          let serviceRequest = {
             "formNo": frmNo
          };
          apiProxy.post(appConfig.templateApiURL + appConstants.templateApiRoutes.getTemplateApiRoute, serviceRequest)
            .then(function (data) {
              compScope.load(data, frmNo);
            }
          );
        }
      }
    );
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
      response,
    } = this.state;

    let tabs = [];
    let currentFormReadOnly = false;

    if(response !== null && response !== undefined) {
      let compScope = this;

      //generate menu items based on no.of forms available in template
      tabs = response.formTitles.map(function(item, index) {
        let activeClassName = "";

        //Apply active CSS for selected form
        if(item.form === compScope.state.formNo) {
          activeClassName = "active";
        }

        //Find template level rules exists for current form
        let formRule =_.filter(response.templateInfo.templateschema.rules, function(rule){
            return rule.form === item.form;
        });

        let hideForm = false;
        let readOnlyForm = false;

        //if template level rule exists for this form, processs those rules
        if(formRule.length > 0) {
          //Execute all rules
          for (let actionCount = 0; actionCount < formRule[0].actions.length; actionCount++) {
            if(formRule[0].monitorProperty.propertyValue === formRule[0].actions[actionCount].value) {
              if(formRule[0].actions[actionCount].propertyAction === "hide") { //Hide form rule
                hideForm = true;
              } else if(formRule[0].actions[actionCount].propertyAction === "readonly") { //ReadOnly form rule
                readOnlyForm = true;
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
    }

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
              {this.state.response &&
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
        {response && <div className="row">
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
        </div>}
      </div>

    );
  }
}

render(<App />, document.getElementById("app"));
