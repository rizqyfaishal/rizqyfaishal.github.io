app.controller('ListPostController', function ($scope, $http, BASE_URL_SERVICE, $q, Helper) {
    $scope.posts = [];
    var fetchPostsData = function () {
        var defer = $q.defer();
        $http.get(BASE_URL_SERVICE + '/posts').then(function (response) {
           defer.resolve(response.data);
        });

        $scope.posts = [];

        defer.promise.then(function (data) {
            data.posts.forEach(function(e){
                e.content = Helper.textSubString(e.content);
                $scope.posts.push(e);
            });
        });
    };

    fetchPostsData();
});