module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "FN",
        displayControls: true,
      },
      lastName: {
        type: "string",
        title: "LN",
        displayControls: true,
      },
      showAge: {
        type: "boolean",
        title: "Show Age",
        displayControls: true,
      },
      age: {
        type: "integer",
        title: "Age",
        displayControls: false,
      },
      bio: {
        type: "string",
        title: "Bio",
        displayControls: true,
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
        displayControls: true,
      },
      listOfStrings: {
        type: "array",
        title: "A list of strings",
        displayControls: true,
        items: {
          type: "string",
          default: "bazinga",
        },
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:autofocus": true,
      "ui:options": {
        "titleClassNames": ["text-uppercase", "col-md-3"],
        "controlClassNames": ["col-md-6"],
      },
    },
    lastName: {
      "ui:options": {
        "titleClassNames": ["text-uppercase", "col-md-3"],
        "controlClassNames": ["col-md-6"],
      },
    },
    showAge: {
      "ui:options": {
        "controlClassNames": ["text-uppercase"],
      },
    },
    age: {
      "ui:widget": "updown",
      "ui:options": {
        "titleClassNames": ["text-uppercase", "col-md-3"],
        "controlClassNames": ["col-md-6"],
      },
    },
    bio: {
      "ui:widget": "textarea",
      "ui:options": {
        "titleClassNames": ["text-uppercase", "col-md-3"],
        "controlClassNames": ["col-md-6"],
        rows: 3,
      },
    },
    password: {
      "ui:widget": "password",
      "ui:options": {
        "titleClassNames": ["text-uppercase", "col-md-4"],
        "controlClassNames": ["col-md-6"],
      },
    },
    date: {
      "ui:widget": "alt-datetime",
    },
  },
  formData: {
    firstName: "Rajaram",
    lastName: "G",
    age: 33,
    bio: "coments",
    password: "noneed",
  },
  formLayout: [
      {i: 'firstName', x: 0, y: 0, w: 2, h: 1},
      {i: 'lastName', x: 2, y: 0, w: 2, h: 1},
      {i: 'showAge', x: 0, y: 1, w: 4, h: 1},
      {i: 'age', x: 0, y: 2, w: 4, h: 1},
      {i: 'bio', x: 0, y: 3, w: 4, h: 2},
      {i: 'password', x: 0, y: 4, w: 3, h: 1},
      {i: 'listOfStrings', x: 0, y: 5, w: 4, h: 6}
  ],
  rules: [
    {
      property: "showAge",
      value: true,
      displayProperty: "age"
    },
    {
      property: "showAge",
      value: false,
      hideProperty: "age"
    },
    {
      property: "age",
      condition: ">=",
      value: "100",
      confirmDlg: {
        message: ""
      }
    }
  ]
};
