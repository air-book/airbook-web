
angular.module("AirBook", ['ui.router', 'restangular', 'infinite-scroll', 
  'ui.bootstrap-slider', 'ui.bootstrap', 'ct.ui.router.extras'])

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

    .state('app', {
      abstract : true,
      sticky : true,
      views : {
        'app' : {
          template : '<div ui-view></div>'
        }
      }
    })

    .state('app.home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl'
    })
    .state('app.books', {
      url: "/books",
      templateUrl: "templates/books.html",
      controller: 'BooksCtrl'
    })
    .state('app.booksdetail', {
      url: "/books/:id",
      templateUrl: "templates/booksdetail.html",
      controller: 'BooksDetailCtrl'
    })
    .state('app.books.modal', {
      url: "/modal/:id",
      onEnter: function($modal,$stateParams,$state){
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
            $state.go('^');
        });
      }

    })

    .state('modal', {
      abstract : true
    })

    .state('modal.login', {
      url: "/login",
      onEnter: function($modal, $state, $previousState){
        $modal.open({
            templateUrl: "templates/login_modal.html",
            backdrop:'static',
            resolve: {
            },
            controller: 'LoginCtrl'
        }).result.finally(function() {
          console.log('asked login...')
            var previous = $previousState.get();
            if(previous){
              $previousState.go();
            } else {
              $state.go('app.home');  
            }
        });
      }

    })


})
.run(function(){
    console.log("run here")
})
