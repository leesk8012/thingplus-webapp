angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('RulesCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.logrules = function() {
    $scope.sendrequest("GET", $scope.address + '/logrules', {}, function successCallback(response)
    {
      $scope.logrulesdata = [];
      angular.forEach(response.data, function (value, key) {
        console.log(value);
        $scope.logrulesdata.push(value);
      });
      return;
    }, function errorCallback(response){ console.log(response); });
  };

  $scope.sendrequest = function(method, url, body, successCallback, errorCallback) {
    // var headers;
    // if (method == "GET" || method == "DELETE") {
    // if (method == "POST" || method == "PUT") { headers = {'Content-Type': 'application/x-www-form-urlencoded'}; }
    // if (method == "POST" || method == "PUT") {
    //   // headers = {'Content-Type': 'application/json'};
    //   console.log(body);
    //   console.log(JSON.stringify(body));
    // }

    // var jsonobj = JSON.parse(body);
    $http({
      method: method,
      url: url,
      // json: true,
      data: body, //JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }).then(successCallback, errorCallback);
  };

  $scope.addlogrules = function() {
    // console.log("addlogrules");
    $http.get('logrules.json').then(function(data) {
      console.log(data);
      $scope.sendrequest("POST", $scope.address + '/logrules', data, function successCallback(response) {
        console.log(response);
      },
      function errorCallback(response) { console.log(response); });
    });
  };

  $scope.deletelogrules = function() {
    console.log("deletelogrules");
  };


  $scope.logrules();
});
