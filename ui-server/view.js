angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('AlertDemoCtrl', function ($scope, $http) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];
  $scope.address = 'http://127.0.0.1:8081';

  /*
  $http.get('server_info.json').then(function(data) {
     $scope.address = data.address;
  });
  */

  $scope.gatewaylist = [];
  $scope.auth = function() {
    $http({
      method: 'GET',
      url: $scope.address + '/auth'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.alerts.push({msg: 'success ' + response});

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.alerts.push({msg: 'error ' + response});
      });
  }

  $scope.gateways = function() {
    // request api
  };

  $scope.addAlert = function() {
    //$scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
