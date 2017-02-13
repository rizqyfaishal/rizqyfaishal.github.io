app.controller('DashboardController', function ($q, $scope, AdminFactory, $state, $http, BASE_URL_SERVICE) {
    $scope.title = 'Message';
    $scope.logout = function () {
        AdminFactory.logout();
        $state.go('static.login');
    };
    $scope.posts = [];
    $scope.fetchingData = false;
    var getPosts = function () {
        var defer = $q.defer();

        $http.get(BASE_URL_SERVICE + '/posts').then(function (response) {
            $scope.fetchingData = true;
            defer.resolve(response);
        });


        defer.promise.then(function (response) {
            $scope.fetchingData = false;
            $scope.posts = response.data.posts;
            $scope.posts_count = response.data.post_count;
        });
    };
    getPosts();
});