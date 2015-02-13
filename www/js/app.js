
angular.module("AirBook", ['ui.router', 'restangular', 'infinite-scroll'])

.config(function($stateProvider, $urlRouterProvider, RestangularProvider){

    var baseServerUrl = '/books/';
    RestangularProvider.setBaseUrl(baseServerUrl);

    RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
        var newResponse;
        if (operation === "getList") {
            newResponse = response.results != undefined ? response.results : response;
            newResponse.metadata = {
              count : response.count,
              next : response.next,
              previous : response.previous,
              number : response.number,
            }
        } else {
            newResponse = response;
        }
        return newResponse;
    });
  
    RestangularProvider.setRequestSuffix('/?');
    
    $urlRouterProvider.otherwise("/home");
    //
    // Now set up the states
    $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller  :'HomeCtrl'
    })
    .state('books', {
      url: "/books",
      templateUrl: "templates/books.html",
      controller  :'BooksCtrl'
      
    })



})
.run(function(){
    console.log("run here")
})