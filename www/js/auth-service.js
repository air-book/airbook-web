
.factory('AuthService', function ($http, $q) {

    var svc = {};
    svc.token = null;
    svc.installToken = function(token){
        $http.defaults.headers.common.Authorization = "Token " + token;
        svc.token = token;
    };
    svc.removeToken = function(){
        delete $http.defaults.headers.common.Authorization;
    }

    svc.doLogin = function(credentials){
        var deferred = $q.defer();
        $http.post('http://localhost:8000/users/token-auth/', credentials)
        .then(function(response){
            console.log(1, response);
            svc.installToken(response.data.token);
            deferred.resolve(response);
        })
        .catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    };
    svc.doLogout = function(){
        svc.removeToken();
    };
    
    return svc;

})
