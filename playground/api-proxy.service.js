const promise = require("es6-promise");
import 'whatwg-fetch';

module.exports = {
    post: function (resourceUrl, params) {
        let Promise = promise.Promise;
        //Prepare Headers
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        return new Promise(function (resolve, reject) {
          fetch(resourceUrl, {
            credentials: 'same-origin',
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify(params)
          })
          .then(checkStatus)
          .then(function (response) {
            resolve(response.json());
          })
          .catch(function (err) {
            reject(err);
          });
        });
    }
};

function checkStatus(response) {
  return response;
}
