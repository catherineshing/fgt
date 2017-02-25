(function() {
    'use strict';

    angular.module('fgt.products', [
        'fgt.fgt-resource',
        'fgt.fgt-service'
    ])

        .controller('ProductsController', [
            '_',
            '$anchorScroll',
            'FgtConstant',
            'FgtService',
            function(_, $anchorScroll, FgtConstant, FgtService) {
                var that = this,
                    count = 24,
                    args = {
                        start: 0,
                        count: count + 1
                    };

                this.categories = FgtConstant.Categories;

                // Get all items for category counts
                FgtService.getItems()
                    .then(function(items) {
                        that.allItems = items;
                    });

                function getItems() {
                    FgtService.getItems(args)
                        .then(function(items) {
                            that.hasPrev = args.start > 0;
                            that.hasNext = items.length > count;

                            if (that.hasNext) {
                                items.pop();
                            }

                            that.items = items;

                            $anchorScroll();
                        });
                }

                getItems();

                this.getCategory = function(category) {
                    that.category = category;

                    args.category = category;
                    args.start = 0;

                    getItems();
                };

                this.getCategoryCount = function(category) {
                    return _.filter(that.allItems, function(item) {
                        return item.category === category;
                    }).length;
                };

                this.getPrevPage = function() {
                    args.start -= count;
                    getItems();
                };

                this.getNextPage = function() {
                    args.start += count;
                    getItems();
                };
            }
        ]);

})();
