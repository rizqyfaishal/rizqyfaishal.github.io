app.controller('DashboardController', function ($q, $scope, AdminFactory, $state, $http, BASE_URL_SERVICE, Helper, $sce) {
    $scope.currentSkip = 0;
    $scope.currentLimit = 3;
    $scope.title = 'Message';
    $scope.needLoadMore = true;
    $scope.logout = function () {
        AdminFactory.logout();
        $state.go('static.login');
    };
    $scope.posts = [];
    $scope.fetchingData = false;
    var getPosts = function (skip, limit) {
        var defer = $q.defer();
        $scope.fetchingData = true;
        $http.get(BASE_URL_SERVICE + '/posts' + '?skip=' + skip + '&limit=' + limit)
            .then(function (response) {
                 defer.resolve(response);
            });


        defer.promise.then(function (response) {
            $scope.fetchingData = false;
            for(var i = 0;i<response.data.posts.length;i++){
                response.data.posts[i].content = Helper.textSubString(response.data.posts[i].content);
            }
            response.data.posts.forEach(function(e){
                $scope.posts.push(e);
            });
            $scope.posts_count = response.data.post_count;

            if(skip + limit >= $scope.posts_count){
                $scope.needLoadMore = false;
            } else {
                $scope.currentSkip = skip + limit;
            }
        });
    };
    getPosts($scope.currentSkip, $scope.currentLimit);
    $scope.deleteConfirm = function (_id) {
        $scope.fetchingData = true;
        var confirm_message = confirm('Are you sure to delete this post?');
        if(confirm_message){
            var defer = $q.defer();
            $http.delete(BASE_URL_SERVICE + 
                '/posts/' + _id)
                .then(function (response) {
                    defer.resolve(response.data);
             });
            
            defer.promise.then(function (data) {
                if(data.ok == 1 && data.n == 1){
                    $scope.posts = [];
                    getPosts(0, $scope.currentLimit);
                } else {
                    alert('An error occured');
                }
                        $scope.fetchingData = false;

            })
        }
    };

    $scope.loadMore = function(){
        getPosts($scope.currentSkip, $scope.currentLimit);
    };
});