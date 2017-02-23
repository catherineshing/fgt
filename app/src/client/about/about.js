(function() {
    'use strict';

    angular.module('fgt.about', [])

        .controller('AboutController', [
            '$scope',
            function($scope) {
                this.loadTab = $scope.index.loadTab;
            }
        ]);

})();
