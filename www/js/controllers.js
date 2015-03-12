angular.module("AirBook")
.controller('AppCtrl', function ($scope) {

    $scope.globalMethod = function(){
        console.log(1);
    };
})


.controller('HomeCtrl', function ($scope) {
    console.log("Home")
})

.controller('LoginCtrl', function ($scope) {
    console.log("Login");
    $scope.dismiss = function() {
        $scope.$dismiss();
    };
    $scope.doLogin = function(){}

})


.controller('BooksCtrl', function ($scope, Restangular) {
    console.log("Books")

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

        Restangular.all('books').getList(params)
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

  Restangular.all('books').get($stateParams.id)
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
