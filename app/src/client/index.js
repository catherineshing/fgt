(function() {
    'use strict';

    angular.module('fgt', [
        'ui.bootstrap',
        'ui.router',
        'fgt.about',
        'fgt.contact',
        'fgt.home',
        'fgt.item-view',
        'fgt.login',
        'fgt.products',
        'fgt.fgt-resource',
        'fgt.fgt-service'
    ])

        .config([
            '$locationProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function($locationProvider, $stateProvider, $urlRouterProvider) {
                // States
                $stateProvider
                    .state('about', {
                        url: '/about',
                        templateUrl: '/src/client/about/about.tpl.html'
                    })
                    .state('contact', {
                        url: '/contact',
                        templateUrl: '/src/client/contact/contact.tpl.html'
                    })
                    .state('home', {
                        url: '/home',
                        templateUrl: '/src/client/home/home.tpl.html'
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: '/src/client/login/login.tpl.html'
                    })
                    .state('products', {
                        url: '/products',
                        templateUrl: '/src/client/products/products.tpl.html'
                    })
                    .state('item', {
                        url: '/products/:id?category',
                        templateUrl: '/src/client/item/item-view.tpl.html'
                    });

                // Default to home
                $urlRouterProvider.otherwise(function($injector) {
                    var $state = $injector.get('$state');
                    $state.go('home');
                });

                $locationProvider.html5Mode(true);
            }
        ])

        .constant('_', window._)

        .filter('capitalize', function() {
            return function(input) {
                if (input && input.length) {
                    return input.charAt(0).toUpperCase() + input.substr(1);
                }
                return '';
            };
        })

        .controller('IndexController', [
            '$anchorScroll',
            '$location',
            '$scope',
            function($anchorScroll, $location, $scope) {
                var that = this,
                    path = $location.path().substr(1);

                this.tabs = [
                    {
                        name: 'Home',
                        path: 'home',
                        icon: 'glyphicon glyphicon-home'
                    },
                    {
                        name: 'Products',
                        path: 'products',
                        icon: 'glyphicon glyphicon-th-list'
                    },
                    {
                        name: 'About',
                        path: 'about',
                        icon: 'glyphicon glyphicon-info-sign'
                    },
                    {
                        name: 'Contact',
                        path: 'contact',
                        icon: 'glyphicon glyphicon-earphone'
                    }
                ];

                this.tab = path.length ? path : 'home';

                this.init = function(info) {
                    $scope.info = JSON.parse(info);
                };

                this.loadTab = function(tab) {
                    that.tab = tab.path;
                    $anchorScroll();
                };
            }
        ]);

})();
