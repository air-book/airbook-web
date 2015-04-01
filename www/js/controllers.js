angular.module("AirBook")
.controller('AppCtrl', function ($scope, $rootScope, AuthService, $timeout, Restangular, UserAPI) {

    $rootScope.appUser = {};

    $rootScope.logout = function(){
        AuthService.doLogout();
        $timeout(function(){
            $rootScope.appUser = {};
        });
    };

    if(AuthService.token){
        Restangular.oneUrl('users/me').get()
        .then(function(data){
            $timeout(function(){
                $rootScope.appUser = data;
            });
        });
    }


    $scope.addBookToWishes = function(book){
        UserAPI.addWish(book.id)
        .then(function(){
            $timeout(function(){
                book.is_wished = true;
            })
        })
    };

    $scope.removeBookFromWishes = function(book){
        UserAPI.dropWish(book.id)
        .then(function(){
            $timeout(function(){
                book.is_wished = false;
            })
        })
    };

    $scope.addBookToCart= function(book){
        UserAPI.addCart(book.id)
        .then(function(){
            $timeout(function(){
                book.in_cart = true;
            })
        })
    };

    $scope.removeBookFromCart = function(book){
        UserAPI.dropCart(book.id)
        .then(function(){
            $timeout(function(){
                book.in_cart = false;
            })
        })
    };


})


.controller('HomeCtrl', function ($scope) {
    console.log("Home")
})

.controller('LoginCtrl', function ($scope, AuthService, Restangular, $timeout, $rootScope) {
    $scope.credentials ={};
    $scope.dismiss = function() {
        $scope.$dismiss();
    };

    $scope.doLogin = function(){
        return AuthService.doLogin($scope.credentials)
        .then(function(r){
            Restangular.oneUrl('users/me').get()
            .then(function(data){
                $timeout(function(){
                    $rootScope.appUser = data;
                });
                $scope.$close();
            });
        });
    };
})





.controller('BooksCtrl', function ($scope, Restangular, UserAPI, $timeout) {
    console.log("Books")


    $scope.UserAPI = UserAPI;

    $scope.menuopen = true;

    $scope.toggleMenu = function(){
      $scope.menuopen =! $scope.menuopen;
    }


    $scope.books = [];
    $scope.filters = {
        min_price : null,
        max_price : null,
        title_contains :null
    };
    var updating = false;
    $scope.rangeFilter = [0, 100]

    var updateFromServer = function(page){
        updating = true;
        var params = angular.copy($scope.filters);
        params.page = page;

        if(page == 1){
            $scope.books = [];
        }

        Restangular.all('books/books').getList(params)
        .then(function(data){
            console.log("response", data.metadata.count);
            $scope.books = $scope.books.concat(data);
            $scope.metadata = data.metadata;
            updating = false;
        });
    };

    $scope.updateBooks = function(){
        if(updating){return;}
        if($scope.metadata && $scope.metadata.next){
            updateFromServer($scope.metadata.number + 1);
        }
    };



    $scope.search = function(){
        console.log("filters", $scope.filters);
        updateFromServer(1);
    }

    $scope.updatePriceRange = function(){
        $scope.filters.min_price = $scope.rangeFilter[0];
        $scope.filters.max_price = $scope.rangeFilter[1];

    };

    $scope.$watch('filters', function(nv, ov){
        if(angular.equals(nv, ov)){
            return;
        }
        $scope.search();

    }, true)

    updateFromServer(1);

})

.controller('BooksDetailCtrl', function ($scope, Restangular, $stateParams) {
  Restangular.all('books/books').get($stateParams.id)
  .then(function(data){
      $scope.book = data
  });


})

.controller('BooksModalCtrl',function($scope, book) {
  $scope.book=book;
  $scope.dismiss = function() {
    $scope.$dismiss();
  };
})


.controller('BooksCartCtrl',function($scope, UserAPI, $timeout) {
  UserAPI.getCart()
  .then(function(items){
    $scope.inCart = items
    console.log(items)
  })
  $scope.dismiss = function() {
    $scope.$dismiss();
  };

  $scope.removeBookFromCart = function(book, index){
      UserAPI.dropCart(book.id)
      .then(function(){
          $timeout(function(){
            $scope.inCart.splice(index, 1);
            console.log(1,   $scope.inCart)
          })
      })
  };
})


.controller('BooksWishCtrl',function($scope, UserAPI, $timeout) {
  UserAPI.getWishes()
  .then(function(items){
    $scope.inWishes = items
    console.log(items)
  })
  $scope.dismiss = function() {
    $scope.$dismiss();
  };

  $scope.removeBookFromWishes = function(book, index){
      UserAPI.dropWish(book.id)
      .then(function(){
          $timeout(function(){
            $scope.inWishes.splice(index, 1);
            console.log(1,   $scope.inWishes)
          })
      })
  };
})
