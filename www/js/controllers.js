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

    Restangular.all('books').getList()
    .then(function(data){
        $scope.books = data;
    })


})



