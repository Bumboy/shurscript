/**
 * Inicializa el objeto que contiene la aplicacion,
 * Empaqueta las funciones de GreaseMonkey en un objeto
 * Genera el core.
 */
var SHURSCRIPT = {
    scriptVersion: '10.5-exp',
    GreaseMonkey: {
        log: GM_log,
        getValue: GM_getValue,
        setValue: GM_setValue,
        deleteValue: GM_deleteValue,
        xmlhttpRequest: GM_xmlhttpRequest,
        registerMenuCommand: GM_registerMenuCommand,
        addStyle: GM_addStyle,
        getResourceText: GM_getResourceText,
        getResourceURL: GM_getResourceURL
    }
};

(function ($, SHURSCRIPT, bootbox, console, location, undefined) {
    'use strict';

    var core = {},
        GM = SHURSCRIPT.GreaseMonkey;

    SHURSCRIPT.core = core;
    /**
     * Crea un namespace dentro de SHURSCRIPT pasandole un string de forma 'SHURSCRIPT.nombreNameSpace'
     * o simplemente 'nombreNameSpace'
     */
    core.createNameSpace = function (ns) {
        var segments = ns.split('.'),
            parent = SHURSCRIPT;

        // Si se ha pasado SHURSCRIPT, quitalo del medio
        if (segments[0] === 'SHURSCRIPT') {
            segments = segments.slice(1);
        }

        $.each(segments, function (index, nameNS) {
            // Inicializa si no existe
            parent[nameNS] = parent[nameNS] || {};

            // Referencia para el siguiente ciclo (pseudorecursividad)
            parent = parent[nameNS];
        });

        return parent;
    };

    // Prototipo para los helpers
    var protoHelper = {
        log: function (message) {
            console.log("[SHURSCRIPT]  [Modulo " + this.moduleName + "]" + new Date().toLocaleTimeString() + ": " + message);
        },
        setValue: function(key, value) {
            GM.setValue("SHURSCRIPT_" + this.moduleName + "_" + key + "_" + SHURSCRIPT.env.user.id, value);
        },
        getValue: function(key, defaultValue) {
            return GM.getValue("SHURSCRIPT_" + this.moduleName + "_" + key + "_" + SHURSCRIPT.env.user.id, defaultValue);
        },
        deleteValue: function(key) {
            GM.deleteValue("SHURSCRIPT_" + this.moduleName + "_" + key + "_" + SHURSCRIPT.env.user.id);
        },
        throw: function (message) {
            throw "[SHURSCRIPT]  [Modulo " + this.moduleName + "]" + new Date().toLocaleTimeString() + ": " + message;
        },

        /**
         *  Mete CSS previamente registrado en archivo principal con @resource
         * @param styleResource - nombre del recurso css
         */
        addStyle: function (styleResource) {
            var css = GM.getResourceText(styleResource);
            GM.addStyle(css);
        },
        bootbox: bootbox,
        location: location
    };

    /**
     * Crea un helper
     *
     * @param moduleName - nombre modulo o componente
     */
    core.createHelper =  function (moduleName) {
        var newHelper = Object.create(protoHelper);
        newHelper.moduleName = moduleName;
        return newHelper;
    };

    core.helper = core.createHelper('core');

    /**
     * Crea un componente para la aplicacion
     *
     * @param specs.id - id componente
     * @param specs.name - nombre componente
     * @param specs.description - que hace este componente
     */
    core.createComponent = function (specs) {
        var props = ['id', 'name', 'description'];

        // Comprueba que specs contiene todos los valores
        $.each(props, function (index, prop) {
            if (specs[prop] === undefined) {
                core.helper.throw('Error al crear componente. La propiedad ' + prop + ' no ha sido definida.');
            }
        });

        // Crea namespace y copiale las propiedades
        var comp = core.createNameSpace(specs.id);
        $.extend(comp, specs);

        // Metele un helper
        comp.helper = core.createHelper(comp.id);

        return comp;
    };


})(jQuery, SHURSCRIPT, bootbox, window.console, window.location);


///**
// * Componente core: nucleo aplicacion
// */
//(function ($, SHURSCRIPT, undefined) {
//    'use strict';
//
//    var core = SHURSCRIPT.createNameSpace('core');
//
//    core.id = 'core';
//    core.helper = SHURSCRIPT.helper.createHelper(core.id);
//
//    core.initialize = function () {
//
//        var body_html = $('body').html();
//
//        // Saca por regexps id
//        var id_regex_results = /userid=(\d*)/.exec(body_html);
//
//        // Si el usuario no está logueado, aborta.
//        if ( ! id_regex_results) {
//            return false;
//        }
//
//        // Registra entorno
//        core.environment = {
//            user: {
//                id: id_regex_results[1],
//                name: /Hola, <(?:.*?)>(\w*)<\/(?:.*?)>/.exec(body_html)[1]
//            },
//            page: core.helper.location.pathname.replace("/foro","")
//        };
//
//        // Mete bootstrap
//        core.helper.addStyle('bootstrapcss');
//
//        // Configuracion de las ventanas modales
//        core.helper.bootbox.setDefaults({
//            locale: "es",
//            className: "shurscript",
//            closeButton: false
//        });
//
//        // Carga la ventana de preferencias
//        SHURSCRIPT.settingsWindow.load();
//
//        // Lanza carga modulos
//        SHURSCRIPT.moduleManager.loadModules();
//
//        // Busca actualizaciones
//        // TODO
//    };
//
//    // Devuelve objeto con la configuracion del usuario (activo/inactivo)
//    // {module1: true, module2: false...}
//    core.getModulesConfig = function () {
//        var modulesConfig = {};
//
//        try {
//            var serializedModulesConfig = core.helper.GM.getValue("MODULES");
//            modulesConfig = JSON.parse(serializedModulesConfig);
//
//        } catch (e) {
//            core.helper.GM.deleteValue("MODULES");
//        }
//
//        return modulesConfig;
//     };
//
//})(jQuery, SHURSCRIPT);
