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
            '$timeout',
            'FgtConstant',
            'FgtService',
            'Upload',
            function(_, $modalInstance, $scope, $timeout, FgtConstant, FgtService, Upload) {
                var that = this,
                    uploadedImages = [],
                    deletedImages = [];

                this.item = $scope.item;
                this.categories = FgtConstant.Categories;

                this.options = {
                    accept: 'image/*',
                    maxFiles: 10,
                    maxSize: '8MB',
                    multiple: true,
                    allowDir: true,
                    resize: {
                        width: 500,
                        height: 500
                    }
                };
                this.uploader = {
                    $invalid: false
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
                                    uploadedImages.push(response.data);
                                    that.item.images.push(response.data);

                                    that.uploader.$invalid = false;
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

                    that.uploader.$invalid = _.isEmpty(that.item.images);
                };

                this.cancel = function() {
                    _.forEach(uploadedImages, function(uploadedImage) {
                        FgtService.deleteImage(uploadedImage);
                    });

                    $modalInstance.dismiss();
                };

                this.saveItem = function() {
                    if ($scope.form.$invalid || _.isEmpty(that.item.images)) {
                        _.forEach($scope.form.$error, function(controls) {
                            _.forEach(controls, function(control) {
                                control.$pristine = false;
                            });
                        });
                        that.uploader.$invalid = _.isEmpty(that.item.images);

                        $timeout(function() {
                            $scope.$apply();
                        });
                    } else {
                        _.forEach(deletedImages, function(deletedImage) {
                            FgtService.deleteImage(deletedImage);
                        });

                        FgtService.saveItem(that.item)
                            .then(function(result) {
                                $modalInstance.close(result);
                            });
                    }
                };
            }
        ]);

})();
