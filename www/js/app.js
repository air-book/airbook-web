
angular.module("AirBook", ['ui.router', 'restangular', 'infinite-scroll', 'ui.bootstrap-slider', 'ui.bootstrap'])

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
      controller: 'HomeCtrl'
    })
    .state('books', {
      url: "/books",
      templateUrl: "templates/books.html",
      controller: 'BooksCtrl'
    })
    .state('booksdetail', {
      url: "/books/:id",
      templateUrl: "templates/booksdetail.html",
      controller: 'BooksDetailCtrl'
    })
    .state('books.modal', {
      url: "/modal/:id",
      onEnter: function($modal,$stateParams,$state){
        console.log('pippo',$stateParams)
        $modal.open({
            templateUrl: "templates/modal.html",
            backdrop:'static',
            resolve: {
              book: function(Restangular) {
                return Restangular.all('books').get($stateParams.id)
              }

            },
            controller: 'BooksModalCtrl'
        }).result.finally(function() {
          console.log('pippo')
            $state.go('^');
        });
      }

    })


})
.run(function(){
    console.log("run here")
})
