module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "FN"
      },
      lastName: {
        type: "string",
        title: "LN"
      },
      showAge: {
        type: "boolean",
        title: "Show Age"
      },
      age: {
        type: "integer",
        title: "Age"
      },
      bio: {
        type: "string",
        title: "Bio"
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3
      },
      patients: {
        type: "grid",
        title: "Patients"
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
  },
  formData: {
    firstName: "Rajaram",
    lastName: "G",
    age: 33,
    bio: "coments",
    password: "noneed",
    showAge: true,
    patients: [
     {
       patientId: 40567,
       patientName: 'Test, Grays1',
       chartNumber: 'CHART123'
     },
     {
       patientId: 40599,
       patientName: 'Test, Grays2',
       chartNumber: 'CHART999'
     },
     {
       patientId: 40579,
       patientName: 'Test, Grays3',
       chartNumber: 'CHART888'
     },
   ],
  },
  formLayout: [
      {i: 'firstName', x: 0, y: 0, w: 2, h: 1},
      {i: 'lastName', x: 2, y: 0, w: 2, h: 1},
      {i: 'showAge', x: 0, y: 1, w: 4, h: 1},
      {i: 'age', x: 0, y: 2, w: 4, h: 1},
      {i: 'bio', x: 0, y: 3, w: 4, h: 2},
      {i: 'password', x: 0, y: 4, w: 3, h: 1},
      {i: 'patients', x: 0, y: 5, w: 4, h: 6}
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
    }
  ]
};
