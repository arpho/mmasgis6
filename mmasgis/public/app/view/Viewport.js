/**
 * The app Viewport. This is the default view displayed when the app is loaded.
 * It is rendered automatically when `autoCreateViewport` is set to `true` in
 * the configuration object given to `Ext.application`.
 */
Ext.define('MMASGIS.view.Viewport', {
	extend: 'Ext.container.Viewport',

	layout: 'fit',

	items: [{
		title: 'map',
		html:'<div id="vmap" style="width: 1200px; height: 1000px"></div>'
	
	}]
});
