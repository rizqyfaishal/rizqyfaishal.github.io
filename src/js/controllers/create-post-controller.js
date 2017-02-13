app.controller('CreatePostController', function ($scope, $q, BASE_URL_SERVICE, $http, Helper) {
    $scope.message = 'Title';
    $scope.title = 'Tambah Post';
    tinymce.init({
        selector: '.tinymce',
        height: 500,
        menubar: false,
        statusbar: false,
        theme: 'modern',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],
        toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | link image',
        toolbar2: 'bullist numlist outdent indent | print preview media | forecolor backcolor',
        image_advtab: true,
//            content_css: [
//                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
//                '//www.tinymce.com/css/codepen.min.css'
//            ],
//			file_browser_callback : elFinderBrowser,
//            relative_urls: true,
    });

    $scope.save = function (post) {
        var defer = $q.defer();
        post.tags = Helper.tagsParser(post.tags);
        post.permalink = post.title;
        $http.post(BASE_URL_SERVICE+ '/posts/new', post).then(function (response) {
            console.log(response);
            defer.resolve(response);
        });

        defer.promise.then(function (response) {
            console.log(response);
        });
    };

});