(function() {
    'use strict';

    angular.module('fgt.item-view', [
        'fgt.fgt-service'
    ])

        .controller('ItemViewController', [
            '$scope',
            '$state',
            '$stateParams',
            '$window',
            'FgtService',
            function($scope, $state, $stateParams, $window, FgtService) {
                var that = this;

                $scope.index.tab = 'products';

                FgtService.getItem($stateParams.id, {category: $stateParams.category})
                    .then(function(item) {
                        that.item = item;
                        that.image = item.images[0];
                    });
            }
        ]);

})();
