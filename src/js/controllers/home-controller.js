app.controller('HomeController', function ($scope) {
    $scope.title = 'Hello world';
    $scope.navigation = {
        showMenu: true
    };

    $scope.contents = {
        about: false,
        contact: false,
        blog: false
    };

    $scope.toggleContent = function (key) {
        for(var key_var in $scope.contents){
            if(key_var == key){
                $scope.contents[key] = !$scope.contents[key];
            } else {
                $scope.contents[key_var] = false;
            }
        }
    }
});

