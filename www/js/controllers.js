angular.module("AirBook")
.controller('AppCtrl', function ($scope) {

    $scope.globalMethod = function(){
        console.log(1);
    };
})


.controller('HomeCtrl', function ($scope) {
    console.log("Home")
})


.controller('BooksCtrl', function ($scope, Restangular) {
    console.log("Books")

    $scope.books = [];
    var updating = false;

    var updateFromServer = function(page){
        updating = true;
        Restangular.all('books').getList({page:page})
        .then(function(data){
            $scope.books = $scope.books.concat(data);
            $scope.metadata = data.metadata;
            updating = false;
        });
    };

    $scope.updateBooks = function(){
        console.log("ss")
        if(updating){return;}
        if($scope.metadata && $scope.metadata.next){
            updateFromServer($scope.metadata.number + 1);
        }
    };

    updateFromServer(1);


})



