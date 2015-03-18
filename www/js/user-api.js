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

    svc.getCart = function(){
        return Restangular.all('users/cart').getList();
    };

    svc.addCart = function(bookId){
        return Restangular.all('users/cart').post({book:bookId});
    };

    svc.dropCart = function(bookId){
        return Restangular.one('users/cart', bookId).remove();
    };
    
    return svc;

})
