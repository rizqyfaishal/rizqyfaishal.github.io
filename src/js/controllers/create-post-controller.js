app.controller('CreatePostController', function ($scope, $q, BASE_URL_SERVICE, $http, Helper, $state) {
    $scope.title = 'Tambah Post';
    $scope.tinymceOptions = {
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],
        toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | link image',
        toolbar2: 'bullist numlist outdent indent | print preview media | forecolor backcolor',
    };
    $scope.save = function (post) {
        var defer = $q.defer();
        post.tags = Helper.tagsParser(post.tags);
        post.permalink = post.title;
        $http.post(BASE_URL_SERVICE+ '/posts/new', post).then(function (response) {
            defer.resolve(response);
        });

        defer.promise.then(function (response) {
            if(response.status == 200 && response.data.message == 'ok'){
                $state.go('admin.dashboard');
            }
        });
    };

});