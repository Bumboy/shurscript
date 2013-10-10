(function ($, SHURSCRIPT, GM, bootbox, location, console, undefined) {
    'use strict';

    // Define el prototipo del helper
    var proto = {
        log: function (message) {
            console.log("[SHURSCRIPT]" + (this.moduleName ? (" [Modulo " + this.moduleName + "] ") : " ") + new Date().toLocaleTimeString() + ": " + message);
        },
        setValue: function(key, value) {
            GM.setValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + SHURSCRIPT.env.user.id, value);
        },
        getValue: function(key, defaultValue) {
            return GM.getValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + SHURSCRIPT.env.user.id, defaultValue);
        },
        deleteValue: function(key) {
            GM.deleteValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + SHURSCRIPT.env.user.id);
        },
        addStyle: function (styleResource) {
            /*
            Mete CSS previamente registrado en archivo principal con @resource
            */
            var css = GM.getResourceText(styleResource);
            GM.addStyle(css);
        },
        GM: GM,
        bootbox: bootbox,
        location: location
    };

    SHURSCRIPT.createHelper = function (moduleName) {
        var helper = Object.create(proto);
        helper.moduleName = moduleName;
        return helper;
    };

    // Ya de paso creamos el helper para el core
    SHURSCRIPT.helper = SHURSCRIPT.createHelper(SHURSCRIPT.id);

})(jQuery, SHURSCRIPT, GREASEMONKEY, bootbox, location, console);
