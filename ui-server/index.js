angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('GatewaysCtrl', function ($scope, $http) {

  $scope.address = 'http://127.0.0.1:8081';

  $scope.selectedgateway = '';
  $scope.selectedsensor = '';
  $scope.selectedlogrule = '';

  // 게이트웨이 리스트
  $scope.gateways = function() {
    $scope.sendrequest("GET", $scope.address + '/gateways', {}, function successCallback(response)
    {
      $scope.gatewaysdata = [];
      angular.forEach(response.data, function (value, key) {
        // 위치 정보를 가진 센서만 정보를 가져옴
        // console.log(value);
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

  $scope.addgateway = function() {
    var seconds = Math.floor(new Date().getTime() / 1000);
    console.log("addgateway "+seconds);
    $scope.structgateway.reqId = $scope.structgateway.reqId + seconds.toString();
    $scope.structgateway.params.devices[0].reqId = $scope.structgateway.params.devices[0].reqId + seconds.toString();
    $scope.structgateway.params.sensors[0].reqId = $scope.structgateway.params.sensors[0].reqId + seconds.toString();

    console.log($scope.structgateway.reqId);
    console.log($scope.structgateway.params.devices[0].reqId);
    console.log($scope.structgateway.params.sensors[0].reqId);
    $scope.sendrequest("POST", $scope.address + '/registerGateway', $scope.structgateway, function successCallback(response) {
        console.log(response);
        $scope.logrules();
      },
      function errorCallback(response) { console.log(response);
    });
  };

  // 게이트웨이 삭제
  $scope.deletegateway = function() {
    console.log("deletegateway");
    console.log("deletelogrules "+$scope.selectedlogrule);

    $scope.sendrequest("DELETE", $scope.address + '/gateways/'+$scope.selectedgateway, {}, function successCallback(response) {
          console.log(response);
          $scope.gateways();
      },
      function errorCallback(response) { console.log(response);
    });
  };

  // 위치정보 규칙 리스트
  $scope.logrules = function() {
    $scope.sendrequest("GET", $scope.address + '/logrules', {}, function successCallback(response)
    {
      $scope.logrulesdata = [];
      angular.forEach(response.data, function (value, key) {
        // console.log(value);
        $scope.logrulesdata.push(value);
      });
      return;
    }, function errorCallback(response){ console.log(response); });
  };

  // 위치정보 규칙 추가
  $scope.addlogrules = function() {
    var seconds = Math.floor(new Date().getTime() / 1000);
    $scope.structlogrules.id = $scope.selectedgateway +'-'+ seconds;
    $scope.structlogrules.gatewayid = $scope.selectedgateway;
    $scope.structlogrules.sensorid = $scope.selectedsensor;
    $scope.sendrequest("POST", $scope.address + '/logrules', $scope.structlogrules, function successCallback(response) {
        console.log(response);
        $scope.logrules();
      },
      function errorCallback(response) { console.log(response);
    });
  };

  // 위치정보 규칙 삭제
  $scope.deletelogrules = function() {
    console.log("deletelogrules "+$scope.selectedlogrule);
    $scope.sendrequest("DELETE", $scope.address + '/logrules/'+$scope.selectedlogrule, {}, function successCallback(response) {
          console.log(response);
          $scope.logrules();
      },
      function errorCallback(response) { console.log(response);
    });
  };

  // Request 전송
  $scope.sendrequest = function(method, url, body, successCallback, errorCallback) {
    $http({
      method: method,
      url: url,
      data: body,
      headers: {'Content-Type': 'application/json'}
    }).then(successCallback, errorCallback);
  };

  // Check box 선택용
  $scope.updateSelection = function(position, entities) {
    angular.forEach(entities, function(subscription, index) {
      if (position != index) {
        subscription.checked = false;
      }
      else {
        // 버튼 활성화 비활성화
        if (subscription.checked == true) {
          if (subscription.virtual == undefined) {
            subscription.checked = false;
            $scope.selectedgateway = '';
            $scope.selectedsensor = '';
          }
          else {
            $scope.selectedgateway = subscription.id;
            if (subscription.location != undefined)
              $scope.selectedsensor = subscription.location.hasValue;
          }
        }
        else {
          $scope.selectedgateway = '';
          $scope.selectedsensor = '';
        }
      }
    });
  };

  $scope.updatelogSelection = function(position, entities) {
    angular.forEach(entities, function(subscription, index) {
      if (position != index) {
        subscription.checked = false;
      }
      else {
        // 버튼 활성화 비활성화
        if (subscription.checked == true) {
          $scope.selectedlogrule = subscription.id;
        }
        else {
          $scope.selectedlogrule = '';
        }
      }
    });
  };

  // Init
  $scope.logrules();
  $scope.gateways();


  // TODO TEST 용도 - 파일로 불러올 수 있으면 제거.
  $scope.structgateway =
  {
    "reqId":"5009cd129d0d42138e614", //68a524f", //8a38",
    "params":
    {
      "name":"logistic Gateway Name",
      "model":"42",
      "deviceModels":[
      {
        "id":"f4e3dfa978014203a93cfe5b31", //3e5197s",
        "model":"Logistics"
      }],
      "siteId":"1",
      "virtual":"y",
      "reportInterval":300000,
      "devices":[{
        "name":"Custom Test Device",
        "model":"Logistics",
        "reqId":"f4e3dfa978014203a93cf", //e5b313e", //5197s"
      }],
      "sensors":[
      {
        "reqId":"location-5009cd129d0d42138e614", //68a524f", //8a38-1",
        "network":"daliworks",
        "driverName":"daliworksEmulator",
        "model":"locationEmulator",
        "sequence":"1",
        "type":"location",
        "category":"sensor",
        "name":"location_1",
        "virtual":"y"
      }]
    }
  };

  $scope.structlogrules =
  {
      "id" : "CustomRule",
      "desc" : "Description",
      "name" : "Rule Name",
      "status" : "ok",
      "method" : "outOfRange",
      "gatewayid" : "",
      "sensorid" : "location-",
      "threshold" : [
          {
              "tolat" : 37,
              "fromlat" : 35
          },
          {
              "tolng" : 130,
              "fromlng" : 125
          }
      ]
  };

});
