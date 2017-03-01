(function() {
    'use strict';

    angular.module('fgt.fgt-resource', [
        'ngResource'
    ])

        .constant('FgtConstant', {
            Categories: [
                'EVA/PEVA Film',
                'Placemats',
                'Shower Caps',
                'Shower Curtains',
                'Shower Liners',
                'Tablecloths',
                'Umbrellas',
                'Other'
            ]
        })

        .factory('FgtResource', [
            '$resource',
            function($resource) {
                var url = '/api/items/:itemId',
                    params = {
                        itemId: '@itemId'
                    },
                    methods = {
                        login: {
                            method: 'POST',
                            url: '/api/login',
                            params: params
                        }
                    };

                return $resource(url, params, methods);
            }
        ]);

})();
