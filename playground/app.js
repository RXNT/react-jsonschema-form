import React, { Component } from "react";
import { render } from "react-dom";
import Codemirror from "react-codemirror";
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
const liveValidateSchema = { type: "boolean", title: "Live validation" };
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
const themes = {
  default: {
    stylesheet: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
  },
  cerulean: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cerulean/bootstrap.min.css",
  },
  cosmo: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cosmo/bootstrap.min.css",
  },
  cyborg: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/cyborg/bootstrap.min.css",
    editor: "blackboard",
  },
  darkly: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/darkly/bootstrap.min.css",
    editor: "mbo",
  },
  flatly: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/flatly/bootstrap.min.css",
    editor: "ttcn",
  },
  journal: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/journal/bootstrap.min.css",
  },
  lumen: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/lumen/bootstrap.min.css",
  },
  paper: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/paper/bootstrap.min.css",
  },
  readable: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/readable/bootstrap.min.css",
  },
  sandstone: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/sandstone/bootstrap.min.css",
    editor: "solarized",
  },
  simplex: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/simplex/bootstrap.min.css",
    editor: "ttcn",
  },
  slate: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/slate/bootstrap.min.css",
    editor: "monokai",
  },
  spacelab: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/spacelab/bootstrap.min.css",
  },
  "solarized-dark": {
    stylesheet: "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-dark.css",
    editor: "dracula",
  },
  "solarized-light": {
    stylesheet: "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-light.css",
    editor: "solarized",
  },
  superhero: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/superhero/bootstrap.min.css",
    editor: "dracula",
  },
  united: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/united/bootstrap.min.css",
  },
  yeti: {
    stylesheet: "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/yeti/bootstrap.min.css",
    editor: "eclipse",
  },
};

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="row">
          <div className="col-sm-6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange("lat")}
            />
          </div>
          <div className="col-sm-6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange("lon")}
            />
          </div>
        </div>
      </div>
    );
  }
}

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

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <ul className="nav nav-pills">
        {Object.keys(samples).map((label, i) => {
          return (
            <li
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}>
              <a href="#" onClick={this.onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ThemeSelector({ theme, select }) {
  const themeSchema = {
    type: "string",
    enum: Object.keys(themes),
  };
  return (
    <Form
      schema={themeSchema}
      formData={theme}
      onChange={({ formData }) => select(formData, themes[formData])}>
      <div />
    </Form>
  );
}

//let uiSchemaClosure = null;

class App extends Component {
  constructor(props) {
    super(props);

    let form1 =_.filter(samples.Simple, function(sample){
        return sample.form === 1;
    });

    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate, formLayout, rules, formDataSrc } = form1[0];
    //this.evaluateTemp(schema.properties);
    //uiSchemaClosure = uiSchema;
    let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

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
      noOfForms: samples.Simple.length
    };
  }

  componentDidMount() {
    this.load(samples.Simple, 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = (data, formNoIncrementBy) => {

    let formNo = this.state.formNo + formNoIncrementBy;

    let formInfo =_.filter(data, function(sample){
        return sample.form === formNo;
    });

    if(formInfo[0].formLayout !== null || formInfo[0].formLayout !== undefined) {
      this.setState({ formLayout: null});
    }

    if(formInfo[0].rules !== null || formInfo[0].rules !== undefined) {
      this.setState({ rules: null});
    }

    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate } = formInfo[0];
    // force resetting form component instance
    this.setState({ form: false }, _ =>
    this.setState({ ...formInfo[0], form: true, ArrayFieldTemplate }));

    const { schema, uiSchema, rules, formData } = formInfo[0];

    //uiSchemaClosure = uiSchema;
    //this.evaluateRules(schema.properties, '', rules, formData);
    let uiSchemaWithRules = evaluateRulesWrapperFunction(schema.properties, '', uiSchema, formData);

    this.setState({
      uiSchema: uiSchemaWithRules,
      rules,
      formNo: formNo
    });
  };

  onSchemaEdited = schema => this.setState({ schema });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema });

  onFormDataEdited = formData => this.setState({ formData });

  onFormLayoutEdited = formLayout => this.setState({ formLayout });

  onThemeSelected = (theme, { stylesheet, editor }) => {
    this.setState({ theme, editor: editor ? editor : "default" });
    setImmediate(() => {
      // Side effect!
      document.getElementById("theme").setAttribute("href", stylesheet);
    });
  };

  setLiveValidate = ({ formData }) => {
    this.setState({ liveValidate: formData });
  }

  onFormDataChange = ({ formData }) => {
    this.setState({ formData });
  };

  showNextPage = ({ formData }) => {
    if(this.state.formNo < this.state.noOfForms) {
      let formNoIncrementBy = 1;
      this.load(samples.Simple, formNoIncrementBy);
    }
  }

  showPreviousPage = () => {
    if(this.state.formNo > 1) {
      let formNoIncrementBy = -1;
      this.load(samples.Simple, formNoIncrementBy);
    }
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
      noOfForms,
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-sm-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-sm-2">
              <Form
                schema={liveValidateSchema}
                formData={liveValidate}
                onChange={this.setLiveValidate}>
                <div />
              </Form>
            </div>
            <div className="col-sm-2">
              <ThemeSelector theme={theme} select={this.onThemeSelected} />
            </div>
          </div>
        </div>
        <div className="col-sm-8">
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
        <div className="col-sm-4">
          {this.state.form &&
            <Form
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={liveValidate}
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              formLayout={formLayout}
              onChange={this.onFormDataChange}
              onSubmit= {this.showNextPage}
              onPrevious = {this.showPreviousPage}
              fields={{ geo: GeoPosition }}
              validate={validate}
              onBlur={(id, value) =>
                console.log(`Touched ${id} with value ${value}`)}
              transformErrors={transformErrors}
              onError={log("errors")}
              rules={rules}
              formDataSrc={formDataSrc}
              formNo={formNo}
              noOfForms={noOfForms}
            />}
        </div>

      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
