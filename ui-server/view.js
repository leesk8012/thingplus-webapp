angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('AlertDemoCtrl', function ($scope, $http) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];
  $scope.address = 'http://127.0.0.1:8081';
  $scope.oaddress = 'http://127.0.0.1:8080';

  $scope.gateways = function() {
    $http({
      method: 'GET',
      url: $scope.address + '/gateways',
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response) {
        $scope.data = response;
      }, function errorCallback(response) {
        conosole.log(response);
      });
  };
});
