var app = angular.module('MusicChallenge', ["ui.bootstrap", "ui.router", "ui.unique"  ]);
app.config(function($stateProvider, $urlRouterProvider){
      
  // For any unmatched url, send to /index
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
    .state('search.details', {
      url: "/:term/{page}",
      templateUrl: "partials/search.details.html",
      controller: 'SearchController'
    })
    .state('artist', {
      url: "/artist",
      templateUrl: "partials/artist.html",
      controller: function($scope){
          
      }
    })
    .state('artist.details', {
      url: "/:name/:id/",
      templateUrl: "partials/artist.details.html",
      controller: 'ArtistController'
    })
    .state('album', {
      url: "/album",
      templateUrl: "partials/album.html",
      controller: function($scope){
          
      }
    })
    .state('album.details', {
      url: "/:name/:id/",
      templateUrl: "partials/album.details.html",
      controller: 'AlbumController'
    });
  
});
app.controller("MainController", function($scope, $state){
  $scope.search = function() {
    $state.go('search.details',{'term': $scope.term });
  };
  $scope.favoriteArtists = {};
  $scope.favoriteAlbums = {};
  $scope.favoriteTracks = {};

  $scope.favoriteArtistsArr = [];
  $scope.favoriteAlbumsArr = [];
  $scope.favoriteTracksArr = [];
});

app.controller("SearchController", function($scope, $http, $stateParams){
  $scope.term = $stateParams.term;
  $scope.page = $stateParams.page;
  
  $scope.getNext = function() {
    return location.hash+(parseInt($scope.current)+1);
  };
  url = 'http://ws.spotify.com/search/1/artist.json?q='+$scope.term;
  if($scope.page)
    url += "&page=" + $scope.page;
  $http({method: 'GET', url: url}).
    success(function(data, status, headers, config) {
      $scope.loaded = true;
      $scope.total = data.info.num_results;
      $scope.current = data.info.page;
      $scope.artists = data.artists;
    }).
    error(function(data, status, headers, config) {
      
    });
});


app.controller("ArtistController", function($scope, $http, $stateParams){
  $scope.id = $stateParams.id;
  $scope.name = $stateParams.name;
  
  
  url = 'http://ws.spotify.com/lookup/1/.json?uri='+$scope.id+'&extras=albumdetail';
  
  $http({method: 'GET', url: url}).
    success(function(data, status, headers, config) {
      $scope.loaded = true;
      $scope.albums = data.artist.albums;
    }).
    error(function(data, status, headers, config) {
      
    });
});


app.controller("AlbumController", function($scope, $http, $stateParams){
  $scope.id = $stateParams.id;
  $scope.name = $stateParams.name;
  
  console.log($scope.favoriteTracksArr);
  url = 'http://ws.spotify.com/lookup/1/.json?uri='+$scope.id+'&extras=trackdetail';
  
  $http({method: 'GET', url: url}).
    success(function(data, status, headers, config) {
      $scope.loaded = true;
      $scope.tracks = data.album.tracks;
      console.log(data.album.tracks);
    }).
    error(function(data, status, headers, config) {
      
    });
  $scope.toggleFavorites = function(track) {
    if(track.href in $scope.favoriteTracks) {
      console.log('del fav')
      $scope.favoriteTracksArr.splice($scope.favoriteTracks[track.href], 1);
      delete $scope.favoriteTracks[track.href];
    }
    else{
      console.log('add fav')
      $scope.favoriteTracksArr.push(track);
      $scope.favoriteTracks[track.href] = $scope.favoriteTracksArr[$scope.favoriteTracksArr.length - 1];
    }
    console.log($scope.favoriteTracks);
    console.log($scope.favoriteTracksArr);
  };
});