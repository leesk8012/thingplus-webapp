angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('SensorsCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.sensors = function() {
    $http({
      method: 'GET',
      url: $scope.address + '/gateways//sensors/',
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response) {
        // TODO
        //$scope.data = response.data;
        $scope.gateways = [];
        angular.forEach(response.data, function (value, key) {
          $scope.gateways.push(value);
        });

        // TODO
      }, function errorCallback(response) {
        conosole.log(response);
      });
  };
});
