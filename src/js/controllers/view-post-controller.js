app.controller('ViewPostController', function ($scope, $http, $stateParams, BASE_URL_SERVICE) {
    var defer = $q.defer();
    $scope.fetchingData = false;
    var _id = $stateParams.params('id');
    var fetchPostData = function (id) {
        $http.get(BASE_URL_SERVICE + '/posts/' + id).then(function (response) {
            defer.resolve(response);
        });

        defer.promise.then(function (res) {
            console.log(res);
           $scope.post = res.data;
        });
    }

    fetchPostData(_id);
});