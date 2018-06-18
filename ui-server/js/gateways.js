angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('GatewaysCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.gateways = function() {
    $scope.sendrequest("GET", $scope.address + '/gateways', {}, function successCallback(response)
    {
      $scope.gatewaysdata = [];
      angular.forEach(response.data, function (value, key) {
        // 위치 정보를 가진 센서만 정보를 가져옴
        console.log(value);
        if (value.deviceModels[0].model == 'Logistics' && value.location != undefined)
        {
          // Call the api to retrieve current position.
          $scope.sendrequest("GET", $scope.address + '/gateways/'+value.id+'/sensors/'+value.location.hasValue+'/series', {},function successCallback(response) {
            value.position = response.data.latest.value;
          },
          function errorCallback(response) { console.log(response); });
        }
        $scope.gatewaysdata.push(value);
      });
    }, function errorCallback(response){ console.log(response); });
  };

  $scope.sendrequest = function(method, url, body, successCallback, errorCallback) {
    $http({
      method: method,
      url: url,
      body: body,
      json: true,
      headers: {'Content-Type': 'application/json'}
    }).then(successCallback, errorCallback);
  };

  $scope.addgateway = function() {
    console.log("addgateway");
    $http.get('gateway.json').then(function(data) {
      console.log(data);
      $scope.sendrequest("POST", $scope.address + '/registerGateway', data, function successCallback(response) {
        console.log(response);
      },
      function errorCallback(response) { console.log(response); });
    });
  };

  $scope.deletegateway = function() {
    console.log("deletegateway");
  };

  $scope.gateways();
});
