angular.module("AirBook")
.factory('UserAPI', function ($http, $q, $rootScope, Restangular) {

    var svc = {};

    svc.getWishes = function(){
        return Restangular.all('users/wishes').getList();
    };

    svc.addWish = function(bookId){
        return Restangular.all('users/wishes').post({book:bookId});
    };

    svc.dropWish = function(bookId){
        return Restangular.one('users/wishes', bookId).remove();
    };
    
    return svc;

})
