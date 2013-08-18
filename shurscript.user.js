// Shur Scripts SA
// GPLv2 Licensed
// http://www.gnu.org/licenses/gpl-2.0.html
//
// ==UserScript==
// @name			ShurScript
// @description		Script para ForoCoches
// @namespace		http://shurscript.es
// @version			0.08
// @author			TheBronx
// @author			xusoO
// @author			Fritanga
// @include			*forocoches.com/foro/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require			http://netdna.bootstrapcdn.com/bootstrap/3.0.0-wip/js/bootstrap.min.js
// @resource bootstrap-css https://github.com/TheBronx/shurscript/raw/master/css/bootstrap.css
// @require			https://github.com/TheBronx/shurscript/raw/master/modules/Quotes.js
// @require			https://github.com/TheBronx/shurscript/raw/master/modules/NestedQuotes.js
// @require			https://github.com/TheBronx/shurscript/raw/master/modules/BottomNavigation.js
// @require			https://github.com/TheBronx/shurscript/raw/master/modules/FavouriteThreads.js
// @require			https://github.com/TheBronx/shurscript/raw/master/modules/AutoUpdater.js
// @require			https://github.com/TheBronx/shurscript/raw/master/preferences.js
// @require			https://github.com/TheBronx/shurscript/raw/master/settings_window.js
// @grant	GM_log
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_deleteValue
// @grant	GM_xmlhttpRequest
// @grant	GM_registerMenuCommand
// @grant	GM_addStyle
// @grant 	GM_getResourceText
// @history 0.00 first version.
// ==/UserScript==

var helper;
var allModules = []; //Todos los modulos
var activeModules = []; //Los que tiene activados el usuario

/* Variables útiles y comunes a todos los módulos */
var page; //Página actual (sin http://forocoches.com/foro ni parámetros php)
var username;
var userid;


jQuery(document).ready(function(){
	if (window.top != window) { // [xusoO] Evitar que se ejecute dentro de los iframes WYSIWYG
		return;
	}

	initialize();
	loadModules();
});

function initialize() {

	helper = new ScriptHelper();
	
	//inicializamos variables
	page = location.pathname.replace("/foro","");
	
	//Recogemos nombre e ID de usuario
	username = jQuery("a[href*='member.php']").first().text();
	userid = jQuery("a[href*='member.php']").first().attr("href").replace("member.php?u=", "");
	
	GM_addStyle(GM_getResourceText('bootstrap-css'));
	
}

function loadModules() {

	var modules = getAllModules();
			
	var active = getActiveModules();
		
	for (var i = 0; i < modules.length; i++) {
		var moduleName = modules[i].trim();
		try {
			module = eval("new " + moduleName + "()");
			//module = new this[moduleName];
			if (!module) {
				helper.log ("Module '" + moduleName + "' not found.");
			} else {
				
				if (active[moduleName] == true || ((typeof active[moduleName] == 'undefined') && module.enabledByDefault)) { //Activado por el usuario o por defecto
					if (!module.shouldLoad || module.shouldLoad()) {
						helper.log("Loading module '" + moduleName + "'...");
						module.load();
						helper.log ("Module '" + moduleName + "' loaded successfully.");
					}
					activeModules.push(module);
				}
				allModules.push(module);
				
			}
		} catch (e) {
			helper.log ("Failed to load module '" + moduleName + "'\nCaused by: " + e);
		}
	}
	
}

/*
* Obtener los modulos cargados de los @require
*/
function getAllModules() {
	var modules = [];
	if (typeof GM_info != 'undefined' ) {
		var metas = GM_info.scriptMetaStr.split("// @");
		var meta;
		for (var i = 0; i < metas.length; i++) {
			meta = metas[i].trim();
			if (meta.indexOf("require") == 0 && meta.match("/modules/")) {
				var moduleName = meta.match(/modules\/(.*)\.js/)[1];
				modules.push(moduleName);
			}
		}
	} else if (typeof GM_getMetadata != 'undefined') { //Scriptish
		var requires = GM_getMetadata('require');
		for (var i = 0; i < requires.length; i++) {
			if (requires[i].match("/modules/")) {
				var moduleName = requires[i].match(/modules\/(.*)\.js/)[1];
				modules.push(moduleName);
			}
		}
	} else {
		alert('El addon de scripts de tu navegador no está soportado.');
	}
	
	return modules;
}

/*
* Obtienes los modulos que tiene activados el usuario {"modulo1" : true, "modulo2" : false, etc.}
*/
function getActiveModules() {
	var activeModules = helper.getValue("MODULES");
	if (activeModules) {
		try {
			activeModules = JSON.parse(activeModules);
		} catch (e){
			activeModules = {};
			helper.deleteValue("MODULES");
		}
	} else {
		activeModules = {};
	}
	
	return activeModules;
}


/* Metodos de ayuda comunes a todos los módulos. */
function ScriptHelper(moduleName) {
	this.moduleName = moduleName;
}

ScriptHelper.prototype.log = function(message) {
	console.log("[SHURSCRIPT]" + (this.moduleName ? (" [Modulo " + this.moduleName + "] ") : " ") + new Date().toLocaleTimeString() + ": " + message)
}

ScriptHelper.prototype.setValue = function(key, value) {
	GM_setValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + userid, value);
}

ScriptHelper.prototype.getValue = function(key, defaultValue) {
	return GM_getValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + userid, defaultValue);
}

ScriptHelper.prototype.deleteValue = function(key) {
	GM_deleteValue("SHURSCRIPT_" + (this.moduleName ? this.moduleName + "_" : "") + key + "_" + userid);
}

