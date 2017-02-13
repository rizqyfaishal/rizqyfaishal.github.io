var app = angular.module('blog-app', ['ui.router'])
    .constant('BASE_URL_SERVICE', 'http://localhost:3000')
    .constant('ACCESS_LEVEL', {
        nonAuthentication: 1,
        openAuthentication: 2,
        needAuthentication: 3
    })
    .directive('tinymce', function () {
        return {
            restrict: 'C',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                console.log(element);
                element.tinymce({
                    setup: function (e) {
                        e.on('change keydown', function () {
                            modelCtrl.$setViewValue(element.val());
                            scope.$apply();
                        })
                    }
                });
            }
        }
    })
    .factory('Helper', function () {
        return {
            tagsParser: function (string) {
                try {
                    return string.split(", ");
                } catch (e) {
                    return false;
                }
            },
            tagsToString: function (arr) {
                var s = '';
                for (var i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                        s = s + arr[i] + ", "
                    } else {
                        s = s + arr[i];
                    }
                }
                return s;
            }
        }
    })
    .factory('AdminFactory', function ($http, AuthTokenFactory, $q, BASE_URL_SERVICE, ACCESS_LEVEL) {
        return {
            authorize: function (access) {
                if (access == ACCESS_LEVEL.needAuthentication) {
                    return AuthTokenFactory.getToken();
                } else {
                    return true;
                }
            },
            login: function (user) {
                var defer = $q.defer();
                $http.post(BASE_URL_SERVICE + '/user/login', user).then(function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            },
            logout: function () {
                AuthTokenFactory.setToken();
            }
        }
    })
    .factory('AuthTokenFactory', function ($window) {
        return {
            key: 'auth-token',
            storage: $window.localStorage,
            setToken: function (token) {

                if (token) {
                    this.storage.setItem(this.key, token);
                } else {
                    this.storage.removeItem(this.key);
                }
            },
            getToken: function () {
                return this.storage.getItem(this.key);
            }
        }
    })
    .factory('AuthInterceptor', function (AuthTokenFactory) {
        return {
            request: function (config) {
                var token = AuthTokenFactory.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = token;
                }
                return config;
            }
        }
    })
    .run(function ($rootScope, $state, AdminFactory, ACCESS_LEVEL, AuthTokenFactory) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            if (!AdminFactory.authorize(toState.data.access)) {
                e.preventDefault();
                $state.go('static.login');
            } else if (toState.data.access == ACCESS_LEVEL.openAuthentication && AuthTokenFactory.getToken()) {
                e.preventDefault();
                $state.go('admin.dashboard');
            }


        });
        $rootScope.$on('$stateChangeError', function (e) {
            e.preventDefault();
            alert('Error');
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            document.title = $state.current.title;
        });
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, ACCESS_LEVEL) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('static', {
                abstract: true,
                template: '<ui-view></ui-view>',
                data: {
                    access: ACCESS_LEVEL.nonAuthentication
                }
            })
            .state('admin', {
                abstract: true,
                template: '<ui-view></ui-view>',
                data: {
                    access: ACCESS_LEVEL.needAuthentication
                }
            })
            .state('admin.dashboard', {
                templateUrl: 'templates/dashboard.html',
                title: 'Dashboard',
                data: {
                    access: ACCESS_LEVEL.needAuthentication
                },
                controller: 'DashboardController',
                url: '/dashboard'
            })
            .state('admin.create', {
                templateUrl: 'templates/create.html',
                title: 'Create Posts',
                data: {
                    access: ACCESS_LEVEL.needAuthentication
                },
                controller: 'CreatePostController',
                url: '/dashboard/create'
            })
            .state('admin.edit', {
                templateUrl: 'templates/create.html',
                title: 'Edit Post',
                data: {
                    access: ACCESS_LEVEL.needAuthentication
                },
                url: '/dashboard/:id/edit',
                controller: 'EditPostController'
            })
            .state('static.home', {
                templateUrl: '/templates/home.html',
                title: 'Welcome to my Home Page',
                url: '/',
                controller: 'HomeController'
            })
            .state('static.home.blog',{
                templateUrl: 'templates/list.html',
                controller: 'ListPostController',
                data: {
                    access: ACCESS_LEVEL.nonAuthentication
                }
            })
            .state('static.home.view', {
                templateUrl: 'templates/view.html',
                url: '/view/:id',
                controller: 'ViewPostController',
                data: {
                    access: ACCESS_LEVEL.nonAuthentication
                }
            })
            .state('static.login', {
                templateUrl: '/templates/login.html',
                title: 'Login',
                url: '/login',
                controller: 'LoginController',
                data: {
                    access: ACCESS_LEVEL.openAuthentication
                }
            })
    });