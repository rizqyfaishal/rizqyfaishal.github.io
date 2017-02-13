app.controller('EditPostController', function ($http, $scope, BASE_URL_SERVICE, $q, $stateParams) {
    var _id = $stateParams.id;
    console.log(_id);
    $scope.title = 'Edit Post';
    var defer = $q.defer();
    $scope.fetchingData = false;
    var fetchPost = function (id) {
        $scope.fetchingData = true;
        $http.get(BASE_URL_SERVICE + '/posts/' + id).then(function (response) {
            defer.resolve(response.data);
        });
        defer.promise.then(function (data) {
        $scope.post = data.data;
        console.log(data);
    });
    };
    fetchPost(_id);
    
    $scope.save = function(post){
        $http.patch(BASE_URL_SERVICE + '/posts/' + post._id,post).then(function(response){
            console.log(response);
        });
    }
});