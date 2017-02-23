(function() {
    'use strict';

    angular.module('fgt.home', [
        'fgt.fgt-service'
    ])

        .controller('HomeController', [
            '$scope',
            'FgtService',
            function($scope, FgtService) {
                var that = this;

                FgtService.getItems({start: 0, count: 10})
                    .then(
                        function(items) {
                            that.items = items;
                        }
                    );
            }
        ]);

})();
