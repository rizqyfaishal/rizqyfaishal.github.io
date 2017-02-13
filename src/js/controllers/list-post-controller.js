app.controller('ListPostController', function ($scope, $http, BASE_URL_SERVICE, $q) {
    $scope.posts = [];
    var fetchPostsData = function () {
        var defer = $q.defer();
        $http.get(BASE_URL_SERVICE + '/posts').then(function (response) {
           defer.resolve(response.data);
        });

        defer.promise.then(function (data) {
            $scope.posts = data.posts;
        });
    };

    fetchPostsData();
});