angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('GatewaysCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.gateways = function() {
    $http({
      method: 'GET',
      url: $scope.address + '/gateways',
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response) {
        $scope.gateways = [];
        angular.forEach(response.data, function (value, key) {
          $scope.gateways.push(value);
        });
      }, function errorCallback(response) {
        conosole.log(response);
      });
  };

  // add, delete, update
});
