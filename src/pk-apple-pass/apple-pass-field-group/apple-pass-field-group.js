(function (angular) {
    angular.module('pk-pass-display').component('pkApplePassFieldGroup', {
        controller: [PKApplePassFieldGroupController],
        templateUrl:"apple-pass-field-group.html",
        bindings: {
            fields: '<',
            lang: '<',
            type: '@'
        }
    });

    function PKApplePassFieldGroupController() {
        var ctrl = this;
    
        ctrl.$onChanges = onChanges;

        //Scope vars
        ctrl.width = "100%";

        function onChanges(changesObj) {
            if (changesObj.hasOwnProperty("fields") && ctrl.fields != undefined) {
                if(ctrl.fields != null) {
                    ctrl.width = Math.floor(100/ctrl.fields.length) + "%";
                }
            }
        }
    }
})(window.angular);