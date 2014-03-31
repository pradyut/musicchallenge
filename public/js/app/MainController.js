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
  $scope.Math = window.Math;
  $scope.favoriteArtists = {};
  $scope.favoriteAlbums = {};
  $scope.favoriteTracks = {};

  $scope.favoriteArtistsArr = [];
  $scope.favoriteAlbumsArr = [];
  $scope.favoriteTracksArr = [];


  $scope.toggleFavoriteArtist = function(artist) {
    if(artist.href in $scope.favoriteArtists) {
      var index = 0;
      for(var i = 0; i < $scope.favoriteArtistsArr.length; i++){
        if($scope.favoriteArtistsArr[i].href == artist.href)
          index = i;
      }
      $scope.favoriteArtistsArr.splice(index, 1);
      //$scope.favoriteArtistsArr.splice($scope.favoriteArtists[artist.href], 1);
      delete $scope.favoriteArtists[artist.href];
    }
    else{
      $scope.favoriteArtistsArr.push(artist);
      $scope.favoriteArtists[artist.href] = $scope.favoriteArtistsArr[$scope.favoriteArtistsArr.length - 1];
    }
    
  };

  $scope.toggleFavoriteAlbum = function(album) {
    if(album.album.href in $scope.favoriteAlbums) {
      var index = 0;
      for(var i = 0; i < $scope.favoriteAlbumsArr.length; i++){
        if($scope.favoriteAlbumsArr[i].album.href == album.album.href)
          index = i;
      }
      $scope.favoriteAlbumsArr.splice(index, 1);
      //$scope.favoriteAlbumsArr.splice($scope.favoriteAlbums[album.album.href], 1);
      delete $scope.favoriteAlbums[album.album.href];
    }
    else{ 
      $scope.favoriteAlbumsArr.push(album);
      $scope.favoriteAlbums[album.album.href] = $scope.favoriteAlbumsArr[$scope.favoriteAlbumsArr.length - 1];
    }
  };

  $scope.toggleFavoriteTrack = function(track) {
    if(track.href in $scope.favoriteTracks) {
      var index = 0;
      for(var i = 0; i < $scope.favoriteTracksArr.length; i++){
        if($scope.favoriteTracksArr[i].href == track.href)
          index = i;
      }
      $scope.favoriteTracksArr.splice(index, 1);
      //$scope.favoriteTracksArr.splice($scope.favoriteTracks[track.href], 1);
      delete $scope.favoriteTracks[track.href];
    }
    else{
      $scope.favoriteTracksArr.push(track);
      $scope.favoriteTracks[track.href] = $scope.favoriteTracksArr[$scope.favoriteTracksArr.length - 1];
    }
  };
});

app.controller("SearchController", function($scope, $http, $stateParams){
  $scope.term = $stateParams.term;
  $scope.page = $stateParams.page;
  
  $scope.getPrev = function() {
    return location.hash.slice(0,-1)+(parseInt($scope.current)-1);
  };
  $scope.getNext = function() {
    return location.hash.slice(0,-1)+(parseInt($scope.current)+1);
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
    });
});


app.controller("AlbumController", function($scope, $http, $stateParams){
  $scope.id = $stateParams.id;
  $scope.name = $stateParams.name;
  
  url = 'http://ws.spotify.com/lookup/1/.json?uri='+$scope.id+'&extras=trackdetail';
  
  $http({method: 'GET', url: url}).
    success(function(data, status, headers, config) {
      $scope.loaded = true;
      $scope.tracks = data.album.tracks;
    });
});