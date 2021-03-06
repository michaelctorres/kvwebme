$(function() {
	CKEDITOR.plugins.addExternal( 'youtube', '/ww.incs/vendor/ckeditor-plugins/youtube/', 'plugin.js' );
	CKEDITOR.plugins.addExternal( 'wenzgmap', '/ww.incs/vendor/ckeditor-plugins/wenzgmap/', 'plugin.js' );
	CKEDITOR.plugins.addExternal( 'colorbutton', '/ww.incs/vendor/ckeditor-plugins/colorbutton/', 'plugin.js' );
	CKEDITOR.plugins.addExternal( 'panelbutton', '/ww.incs/vendor/ckeditor-plugins/panelbutton/', 'plugin.js' );
	CKEDITOR.plugins.addExternal( 'font', '/ww.incs/vendor/ckeditor-plugins/font/', 'plugin.js' );
	CKEDITOR.editorConfig = function( config ) {
		// Define changes to default configuration here. For example:
		// config.language = 'fr';
		config.uiColor = '#999999';
		config.toolbarGroups = [
			{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
			{ name: 'editing',	 groups: [ 'find', 'selection', 'spellchecker' ] },
			{ name: 'links' },
			{ name: 'insert' },
			{ name: 'forms' },
			{ name: 'tools' },
			{ name: 'document',	groups: [ 'mode', 'document', 'doctools' ] },
			{ name: 'others' },
			{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
			{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
			{ name: 'styles' },
			{ name: 'colors' },
			{ name: 'about' }
		];
		config.extraPlugins='youtube,wenzgmap,colorbutton,font';
		config.allowedContent=true;
	};
});
