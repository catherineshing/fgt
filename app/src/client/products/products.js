(function() {
    'use strict';

    angular.module('fgt.products', [
        'fgt.fgt-resource',
        'fgt.fgt-service'
    ])

        .controller('ProductsController', [
            '_',
            'FgtConstant',
            'FgtService',
            function(_, FgtConstant, FgtService) {
                var that = this;

                this.categories = FgtConstant.Categories;

                FgtService.getItems()
                    .then(
                        function(items) {
                            that.items = items;
                            that.allItems = items;
                        }
                    );

                this.getCategory = function(category) {
                    that.category = category;

                    FgtService.getItems({category: category})
                        .then(
                            function(items) {
                                that.items = items;
                            }
                        );
                };

                this.getCategoryCount = function(category) {
                    return _.filter(that.allItems, function(item) {
                        return item.category === category;
                    }).length;
                };
            }
        ]);

})();
