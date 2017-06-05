module.exports = [
  {
    form: 1,
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
          title: "Show Age",
        },
        age: {
          type: "integer",
          title: "Age",
          rule: {
            monitorProperty: "showAge",
            actions: [
              {
                value: true,
                propertyAction: "show"
              },
              {
                value: false,
                propertyAction: "hide"
              }
            ]
          }
        },
        rxntmastercontrol: {
          type: "object",
          properties: {
            showCity: {
              type: "boolean",
              title: "Show City",
            },
            city: {
              type: "string",
              title: "City",
              rule: {
                monitorProperty: "showCity",
                actions: [
                  {
                    value: true,
                    propertyAction: "show"
                  },
                  {
                    value: false,
                    propertyAction: "hide"
                  }
                ]
              }
            },
            state: {
              type: "string",
              title: "State"
            },
            country: {
              type: "typeahead",
              title: "Country"
            },
            zip: {
              type: "object",
              properties: {
                zipcode: {
                  type: "string",
                  title: "zip"
                },
                zipextension: {
                  type: "string",
                  title: "extension"
                },
              }
            }
          }
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
          "controlClassNames": ["col-md-8"],
        },
      },
      lastName: {
        "ui:options": {
          "titleClassNames": ["text-uppercase", "col-md-3"],
          "controlClassNames": ["col-md-8"],
        },
      },
      showAge: {
        "ui:options": {
          "titleClassNames": ["text-uppercase", "col-md-3"],
          "controlClassNames": ["col-md-8"],
        },
      },
      age: {
        "ui:options": {
          "titleClassNames": ["text-uppercase", "col-md-3"],
          "controlClassNames": ["col-md-8"],
        },
      },
      rxntmastercontrol: {
        showCity: {
          "ui:options": {
            "titleClassNames": ["text-uppercase", "col-md-3"],
            "controlClassNames": ["col-md-8"],
          },
        },
        city: {
          "ui:options": {
            "titleClassNames": ["text-uppercase", "col-md-3"],
            "controlClassNames": ["col-md-8"],
          },
        },
        state: {
          "ui:options": {
            "titleClassNames": ["text-uppercase", "col-md-3"],
            "controlClassNames": ["col-md-8"],
          },
        },
        country: {
          "ui:options": {
            "typeaheadDefinition": {
              "labelKey": "name",
              "placeholder": "Choose a country",
              "keyColumn": "id"
            },
            "titleClassNames": ["text-uppercase", "col-md-3"],
            "controlClassNames": ["col-md-8"],
          },
        },
        zip: {
          zipcode: {
            "ui:options": {
              "titleClassNames": ["text-uppercase", "col-md-3"],
              "controlClassNames": ["col-md-8"],
            },
          },
          zipextension: {
            "ui:options": {
              "titleClassNames": ["text-uppercase", "col-md-3"],
              "controlClassNames": ["col-md-8"],
            },
          },
        },
      },
      patients: {
        "ui:options": {
          "gridDefinition": [
            {
              "dataField": "patientId",
              "headerText": "Patient Id",
              "width": "30%",
              "headerAlign": "center",
              "dataAlign": "center",
              "isKey": true,
            },
            {
              "dataField": "patientName",
              "headerText": "Patient Name",
              "width": "35%",
              "headerAlign": "center",
              "dataAlign": "left",
              "editable": true,
            },
            {
              "dataField": "chartNumber",
              "headerText": "Chart Number",
              "width": "35%",
              "headerAlign": "center",
              "dataAlign": "left",
            }
          ]
        },
      },
    },
    formData: {
      firstName: "Rajaram",
      lastName: "G",
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
    formLayout: {
      form: {
        layout: [
          {i: 'firstName', x: 0, y: 0, w: 2, h: 1},
          {i: 'lastName', x: 2, y: 0, w: 2, h: 1},
          {i: 'showAge', x: 0, y: 1, w: 4, h: 1},
          {i: 'age', x: 0, y: 2, w: 4, h: 1},
          {i: 'rxntmastercontrol', x: 0, y: 3, w: 4, h: 7},
          {i: 'patients', x: 0, y: 4, w: 4, h: 6},
        ]
      },
      rxntmastercontrol: {
        layout: [
          {i: 'showCity', x: 0, y: 0, w: 2, h: 1},
          {i: 'city', x: 0, y: 1, w: 2, h: 1},
          {i: 'state', x: 0, y: 2, w: 2, h: 1},
          {i: 'country', x: 0, y: 3, w: 2, h: 1},
          {i: 'zip', x: 0, y: 4, w: 4, h: 1},
        ]
      },
      zip: {
        layout: [
          {i: 'zipcode', x: 0, y: 0, w: 2, h: 1},
          {i: 'zipextension', x: 0, y: 1, w: 2, h: 1},
        ]
      }
    },
    formDataSrc: {
      rxntmastercontrol: {
        country: [
          {id: 1, name: 'New Jersey', population: 8791936, capital: 'Trenton', region: 'Northeast'},
          {id: 2, name: 'New Mexico', population: 2059192, capital: 'Santa Fe', region: 'West'},
          {id: 3, name: 'New York', population: 19378087, capital: 'Albany', region: 'Northeast'},
          {id: 4, name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South'},
          {id: 5, name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
          {id: 6, name: 'Florida', population: 18804623, capital: 'Tallahassee', region: 'South'},
          {id: 7, name: 'Texas', population: 25146105, capital: 'Austin', region: 'South'},
          {id: 8, name: 'Mississippi', population: 2968103, capital: 'Jackson', region: 'South'},
        ]
      }
    },
    rules: {
      form : {
        rules: [
          {
            publishProperty: "showAge"
          }
        ],
        rxntmastercontrol: {
          rules: [
            {
              publishProperty: "showCity"
            }
          ]
        }
      }
    }
 },
 {
    form: 2,
    schema: {
      title: "form 2",
      description: "form 2",
      type: "object",
      properties: {
        middleName : {
          type: "string",
          title: "form 2 Middle Name"
        },
      }
    },
    uiSchema: {
      middleName: {
        "ui:autofocus": true,
        "ui:options": {
          "titleClassNames": ["text-uppercase", "col-md-6"],
          "controlClassNames": ["col-md-5"],
        },
      }
    },
    formData: {
    },
    formLayout: {
      form: {
        layout: [
          {i: 'middleName', x: 0, y: 0, w: 4, h: 1},
        ]
      },
    },
    rules: []
 },
 {
    form: 3,
    schema: {
      title: "form 3",
      description: "form 3",
      type: "object",
      properties: {
        lastName: {
          type: "string",
          title: "form 3 Last Name"
        },
      }
    },
    uiSchema: {
      lastName: {
        "ui:autofocus": true,
        "ui:options": {
          "titleClassNames": ["text-uppercase", "col-md-6"],
          "controlClassNames": ["col-md-5"],
        },
      }
    },
    formData: {
    },
    formLayout: {
      form: {
        layout: [
          {i: 'lastName', x: 0, y: 0, w: 4, h: 1},
        ]
      },
    },
    rules: []
 }
]
