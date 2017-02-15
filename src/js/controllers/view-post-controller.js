app.controller('ViewPostController', function ($scope, $http, $stateParams, BASE_URL_SERVICE, $q, $sce, $window) {
    var defer = $q.defer();
    $scope.fetchingData = false;
    var _id = $stateParams.id;
    console.log($stateParams);
    var fetchPostData = function (id) {
        $http.get(BASE_URL_SERVICE + '/posts/' + id).then(function (response) {
            defer.resolve(response.data);
        });
        defer.promise.then(function (res) {
            console.log(res);
            $scope.post = res.data;
            $window.document.title = res.data.title;
            $scope.post.content = $sce.trustAsHtml($scope.post.content);
        });
    };

    $scope.saveComment = function(comment){
        var defer = $q.defer();
        $http.post(BASE_URL_SERVICE + '/posts/' + $scope.post._id + '/comments', comment).then(function(response){
            defer.resolve(response);
        })

        defer.promise.then(function(data){
            console.log(data);
            if(data.data.message == 'ok'){
                comment.updatedAt = new Date();
                $scope.post.comments.push(comment);
            } else {
                alert(data);
            }
        })
    };

    fetchPostData(_id);
});