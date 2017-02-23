(function() {
    'use strict';

    angular.module('fgt.item-edit', [
        'ngFileUpload',
        'ui.bootstrap',
        'ui.sortable',
        'fgt.fgt-resource',
        'fgt.fgt-service'
    ])

        .controller('ItemEditController', [
            '_',
            '$modalInstance',
            '$scope',
            'FgtConstant',
            'FgtService',
            'Upload',
            function(_, $modalInstance, $scope, FgtConstant, FgtService, Upload) {
                var that = this,
                    deletedImages = [];

                this.item = $scope.item;
                this.categories = FgtConstant.Categories;

                this.options = {
                    accept: 'image/*',
                    maxSize: '20MB',
                    multiple: true
                };

                this.uploadFiles = function(files, invalidFiles) {
                    delete that.uploadError;

                    if (!_.isEmpty(files)) {
                        _.forEach(files, function(file) {
                            file.progress = 0;

                            Upload.upload({
                                url: '/api/items/image',
                                method: 'POST',
                                file: file
                            })
                            .then(
                                function(response) {
                                    that.item.images.push(response.data);
                                },
                                function(error) {
                                    file.error = error;
                                },
                                function(event) {
                                    file.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total, 10));
                                });
                        });
                    } else if (!_.isEmpty(invalidFiles)) {
                        that.uploadError = 'Invalid file(s): ' + _.pluck(invalidFiles, 'name').join(', ');
                    }
                };

                this.deleteImage = function(index, image) {
                    deletedImages.push(image);
                    that.item.images.splice(index, 1);
                };

                this.saveItem = function() {
                    _.forEach(deletedImages, function(deletedImage) {
                        FgtService.deleteImage(deletedImage);
                    });

                    FgtService.saveItem(that.item)
                        .then(function(result) {
                            $modalInstance.close(result);
                        });
                };
            }
        ]);

})();
