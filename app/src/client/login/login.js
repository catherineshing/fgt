(function() {
    'use strict';

    angular.module('fgt.login', [
        'ngCookies',
        'ui.bootstrap',
        'smart-table',
        'fgt.fgt-service',
        'fgt.item-edit'
    ])

        .controller('LoginController', [
            '_',
            '$cookieStore',
            '$modal',
            '$q',
            '$rootScope',
            '$scope',
            '$state',
            '$window',
            'FgtService',
            function(_, $cookieStore, $modal, $q, $rootScope, $scope, $state, $window, FgtService) {
                var that = this,
                    session = 60 * 60 * 1000; // 1 hour session

                this.isAuthenticated = new Date().getTime() - $cookieStore.get('fgt') < session;

                this.login = function() {
                    FgtService.login(that.password)
                        .then(
                            function(result) {
                                that.isAuthenticated = true;

                                $cookieStore.put('fgt', new Date().getTime());                                
                            },
                            function(error) {
                                that.loginError = true;
                                console.error('Authentication failed');
                            }
                        );
                };

                this.addItem = function() {
                    var modalInstance,
                        modalScope = $rootScope.$new();

                    modalScope.title = 'Add Item';
                    modalScope.item = {
                        images: []
                    };
                    modalScope.isNew = true;

                    modalInstance = $modal.open({
                        templateUrl: '/src/client/item/item-edit.tpl.html',
                        controller: 'ItemEditController as itemEdit',
                        size: 'lg',
                        windowClass: 'item edit',
                        animate: false,
                        scope: modalScope
                    });

                    modalInstance.result
                        .then(function(result) {
                            that.items.push(result);
                            that.displayedItems.push(result);
                        });
                };

                this.editItem = function(index, item) {
                    var modalInstance,
                        modalScope = $rootScope.$new();

                    modalScope.title = 'Edit Item';
                    modalScope.item = _.clone(item, true);
                    modalScope.isNew = false;

                    modalInstance = $modal.open({
                        templateUrl: '/src/client/item/item-edit.tpl.html',
                        controller: 'ItemEditController as itemEdit',
                        size: 'lg',
                        windowClass: 'item edit',
                        animate: false,
                        scope: modalScope
                    });

                    modalInstance.result
                        .then(function(result) {
                            _.merge(that.displayedItems[index], result);

                            _.forEach(that.items, function(i, index) {
                                if (item.id === i.id) {
                                    _.merge(that.items[index], result);
                                }
                            });
                        });
                };

                this.deleteItem = function(index, item) {
                    FgtService.deleteItem(item)
                        .then(function() {
                            that.displayedItems.splice(index, 1);

                            _.remove(that.items, function(i) {
                                return item.id === i.id;
                            });
                        });
                };

                $scope.$watch(function() { return that.isAuthenticated; }, function(newValue, oldValue) {
                    if (newValue) {
                        that.items = [];
                        that.displayedItems = [];

                        FgtService.getItems()
                            .then(function(items) {
                                that.items = items;
                                that.displayedItems = [].concat(items);
                            });
                    }
                }, true);
            }
        ]);

})();
