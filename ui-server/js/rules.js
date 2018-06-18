angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('RulesCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.rules = function() {
    $http({
      method: 'GET',
      url: $scope.address + '/rules',
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response) {
        console.log(response);
        $scope.rules = [];
        angular.forEach(response.data, function (value, key) {
          $scope.rules.push(value);
        });
      }, function errorCallback(response) {
        conosole.log(response);
      });
  };

  $scope.rules();
});
