app.controller('LoginController', function ($scope, AdminFactory, AuthTokenFactory, $state) {
    $scope.title = 'Login';
    $scope.login = function (user) {
        AdminFactory.login(user).then(function (response) {
            if(response.status == 200){
                AuthTokenFactory.setToken(response.data.token);
                $state.go('admin.dashboard');
            }
        });
    }
});