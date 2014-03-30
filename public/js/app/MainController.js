var app = angular.module('MusicChallenge', ["ui.bootstrap", "ui.router"]);
app.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
  $urlRouterProvider.otherwise("/index");
  
  $stateProvider
    .state('index', {
        url: "/index",
        templateUrl: "partials/main.html"
    })
      .state('search', {
          url: "/search",
          templateUrl: "partials/search.html",
          controller: function($scope){
            
          }
      })
      
    .state('route2', {
        url: "/route2",
        templateUrl: "route2.html"
    })
      .state('route2.list', {
          url: "/list",
          templateUrl: "route2.list.html",
          controller: function($scope){
            $scope.things = ["A", "Set", "Of", "Things"];
          }
      });
  
});
app.controller("MainController", function($scope, $state){
  $scope.search = function() {
    $state.go('search')
  };
});