(function() {
    'use strict';

    angular.module('fgt.fgt-service', [
        'fgt.fgt-resource'
    ])

        .factory('FgtService', [
            '$http',
            'FgtResource',
            function($http, FgtResource) {
                function login(password) {
                    var params = {
                        password: password
                    };

                    return FgtResource.login(params).$promise;
                }

                function getItems(args) {
                    var params = {
                            args: args
                        };

                    return FgtResource.query(params).$promise;
                }

                function getItem(itemId, args) {
                    var params = {
                        itemId: itemId,
                        args: args
                    };

                    return FgtResource.get(params).$promise;
                }

                function saveItem(item) {
                    var params = {
                        id: item.id,
                        category: item.category,
                        material: item.material,
                        features: item.features,
                        images: item.images
                    };

                    return FgtResource.save(params).$promise;
                }

                function deleteItem(item) {
                    return $http({
                        method: 'DELETE',
                        url: '/api/items',
                        data: {
                            id: item.id,
                            images: item.images
                        },
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    });
                }

                function deleteImage(image) {
                    return $http({
                        method: 'DELETE',
                        url: '/api/items/image',
                        data: {
                            file: image
                        },
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    });
                }

                return {
                    login: login,
                    getItems: getItems,
                    getItem: getItem,
                    saveItem: saveItem,
                    deleteItem: deleteItem,
                    deleteImage: deleteImage
                };
            }
        ]);

})();
