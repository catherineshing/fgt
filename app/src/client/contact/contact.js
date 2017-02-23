(function() {
    'use strict';

    angular.module('fgt.contact', [
    ])

        .controller('ContactController', [
            '$sce',
            function($sce) {


                this.mapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.4769033171!2d114.38468295055296!3d22.71050898503889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34046f08b9d7f6cb%3A0x89639668a01b53bf!2z56u55Z2R56ys5LiA5bel5Lia5Yy6!5e0!3m2!1sen!2sus!4v1487716326604');
            }
        ]);

})();
