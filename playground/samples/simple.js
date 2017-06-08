/*

module.exports = {
  rules: [] ---> Template Level Rules. Currently we implemented two actions("hide" & "readonly")
  template: [ ---> Template is set of Forms
    {
      form: 1,              --> Form Number
      title: "Form #1",     --> Form/Menu/Tab Title
      schema: {},           --> Represents set of controls to be rendered within form
      uiSchema: {},         --> Represents configuration of CSS/Widget for each control. Configuration of grid definition and TypeAhead definition
      formData: {},         --> JSON generated while user changes/enter/select any value in control
      formLayout: {},       --> Represents positioning of each control on form using react-grid-layout syntax (Referebce: https://github.com/STRML/react-grid-layout)
      formDataSrc: {},      --> Represents datasource for controls(Ex: TypeAhead) defined under "schema" if required
      rules: {}             --> Rules at form level
    }
  ]
}

*/

module.exports = {
  rules: [
    {
      form: 3,
      monitorProperty: {
        form: 1,
        propertyName: "hideForm3"
      },
      actions: [
        {
          value: true,
          propertyAction: "hide"
        }
      ]
    }
  ],
  template: [
   {
      form: 1,
      title: "Form #1",
      schema: {
        title: "A registration form",
        description: "A simple form example.",
        type: "object",
        required: ["firstName", "lastName"],
        properties: {
          hideForm3: {
            type: "boolean",
            title: "Hide Form 3",
          },
          firstName: {
            type: "string",
            title: "FN"
          },
          lastName: {
            type: "string",
            title: "LN"
          },
          showRxNTMasterControl: {
            type: "boolean",
            title: "Show Master Control",
          },
          rxntmastercontrol: {
            type: "object",
            rule: {
              monitorProperty: "showRxNTMasterControl",
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
            },
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
                  showZipExtn: {
                    type: "boolean",
                    title: "Show Zip Extn",
                  },
                  zipcode: {
                    type: "string",
                    title: "zip"
                  },
                  zipextension: {
                    type: "string",
                    title: "extension",
                    rule: {
                      monitorProperty: "showZipExtn",
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
                    },
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
        hideForm3: {
          "ui:options": {
            "titleClassNames": ["text-uppercase", "col-md-3"],
            "controlClassNames": ["col-md-8"],
          },
        },
        firstName: {
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
        showRxNTMasterControl: {
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
            showZipExtn: {
              "ui:options": {
                "titleClassNames": ["text-uppercase", "col-md-3"],
                "controlClassNames": ["col-md-8"],
              },
            },
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
        showRxNTMasterControl: true,
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
       rxntmastercontrol: {
         zip: {
           showZipExtn: true
         }
       }
      },
      formLayout: {
        form: {
          layout: [
            {i: 'hideForm3', x: 0, y: 0, w: 8, h: 1},
            {i: 'firstName', x: 0, y: 1, w: 4, h: 1},
            {i: 'lastName', x: 4, y: 1, w: 4, h: 1},
            {i: 'showRxNTMasterControl', x: 0, y: 2, w: 8, h: 1},
            {i: 'rxntmastercontrol', x: 0, y: 3, w: 8, h: 8},
            {i: 'patients', x: 0, y: 4, w: 8, h: 6},
          ]
        },
        rxntmastercontrol: {
          layout: [
            {i: 'showCity', x: 0, y: 0, w: 4, h: 1},
            {i: 'city', x: 0, y: 1, w: 4, h: 1},
            {i: 'state', x: 0, y: 2, w: 4, h: 1},
            {i: 'country', x: 0, y: 3, w: 4, h: 1},
            {i: 'zip', x: 0, y: 5, w: 8, h: 2},
          ]
        },
        zip: {
          layout: [
            {i: 'showZipExtn', x: 0, y: 0, w: 4, h: 1},
            {i: 'zipcode', x: 0, y: 1, w: 4, h: 1},
            {i: 'zipextension', x: 0, y: 2, w: 4, h: 1},
          ]
        }
      },
      formDataSrc: {
        rxntmastercontrol: {
          country: [
            {id: 1, name: 'New Jersey', population: 8791936, capital: 'Trenton', region: 'Northeast'},
            {id: 5, name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
            {id: 6, name: 'Florida', population: 18804623, capital: 'Tallahassee', region: 'South'},
            {id: 7, name: 'Texas', population: 25146105, capital: 'Austin', region: 'South'},
          ]
        }
      },
      rules: {
        form : {
          publishProperties: [
            "showRxNTMasterControl"
          ],
          rxntmastercontrol: {
            publishProperties: [
              "showCity",
            ],
            zip: {
                publishProperties: [
                  "showZipExtn"
                ]
            }
          }
        }
      }
   },
   {
      form: 2,
      title: "Form #2",
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
      rules: {}
   },
   {
      form: 3,
      title: "Form #3",
      schema: {
        title: "form 3",
        description: "form 3",
        type: "object",
        properties: {
          lastName: {
            type: "string",
            title: "form 3 Last Name"
          },
          country: {
            type: "typeahead",
            title: "Country"
          },
          active: {
            type: "boolean",
            title: "Active",
          },
        }
      },
      uiSchema: {
        lastName: {
          "ui:options": {
            "titleClassNames": ["text-uppercase", "col-md-6"],
            "controlClassNames": ["col-md-5"],
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
        active: {
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
            {i: 'lastName', x: 0, y: 0, w: 8, h: 1},
            {i: 'country', x: 0, y: 1, w: 8, h: 1},
            {i: 'active', x: 0, y: 2, w: 8, h: 1},
          ]
        },
      },
      formDataSrc: {
        country: [
          {id: 1, name: 'New Jersey', population: 8791936, capital: 'Trenton', region: 'Northeast'},
          {id: 5, name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
          {id: 6, name: 'Florida', population: 18804623, capital: 'Tallahassee', region: 'South'},
          {id: 7, name: 'Texas', population: 25146105, capital: 'Austin', region: 'South'},
        ]
      },
      rules: {}
   }
  ]
};
