(function ($, createModule, undefined) {
	'use strict';

	var mod = createModule({
		id: 'nightMode',
		name: 'Modo Noche',
		author: 'Juno / ikaros45',
		version: '0.2',
		description: 'Cambia la apariencia del foro a colores más oscuros. ' +
			'Perfecto para leer el foro por la noche sin cansar la' +
			' vista. <b>BETA</b>',
		domain: 'ALL',
		initialPreferences: {
			enabled: true,
			active: false
		}
	});

	var _$styleTag, _$lightImg, _turnOn, _turnOff, _stateIsOn, _toggle, _setState;

	mod.onNormalStart = function () {
		// Crea tag style y guardalo para luego
		var css = mod.helper.getResourceText('nightmodecss');
		_$styleTag = $('<style>' + css + '</style>');

		// $('head').append(_$styleTag);

		// Crea tag imagen y guarda
		_$lightImg = $('<img id="night-mode-icon" width="24px" style="position: fixed; top: 2px; right: 0px; cursor: pointer;">');

		// Registra evento para meter imagen cuando cuando el documento este cargado... antes no se puede
		$(document).ready(function () {
			$('body').append(_$lightImg);
		});

		// Asigna eventos
		_$lightImg.click(_toggle);

		// Enciende si la ultima vez estaba encendido
		if (_stateIsOn()) {
			_turnOn();
		} else {
			_turnOff();
		}

	};

	mod.normalStartCheck = function () {
		return true;
	};

	/**
	 * Invierte estado
	 */
	_toggle = function () {
		if (_stateIsOn()) {
			_turnOff();
		} else {
			_turnOn();
		}
	};

	/**
	 * Lee el ultimo estado guardado en el navegador
	 */
	_stateIsOn = function () {
		return mod.preferences.active;
	};

	/**
	 * Guarda estado (encendido/apagado) en el navegador
	 */
	_setState = function (value) {
		mod.preferences.active = value;
		mod.storePreferences();
	};

	_turnOn = function () {
		$('head').append(_$styleTag);
		_$lightImg.attr('src', mod.helper.getResourceURL('nightmode-on'));
		_setState(true);
	};

	_turnOff = function () {
		_$styleTag.remove();
		_$lightImg.attr('src', mod.helper.getResourceURL('nightmode-off'));
		_setState(false);
	};

})(jQuery, SHURSCRIPT.moduleManager.createModule);
