(function( w, $, Files, Analyze ){
	"use strict";
	var c = new AppGlobal({
		modules: [
			{ 'f': Files },
			{ 'a': Analyze }
		]
	}),
	doc = $(document);
	//helper functions
	/*
	 * @func ajaxError: a default, universal error function that is used in ajax calls.
	 */
	function ajaxError( xhr, textStatus, errorThrown ){
		throw(xhr.statusText);
	}

	doc.ready(function(){
		c.f.init();
		c.a.init();
	});

	//listening
	//things that are clicked
	$('.ask-server').on('click', function( e ){
		e.preventDefault();
		$(this).callAction();
	});
	//things that load and request ajax immediately on page load.
	$(window).on('load', function(){
		var onLoadClass = $('.on-load-ask-server');
		if( onLoadClass.length ){
			$( this.document.body ).callAction();
		}
	});

	w.c = c;


}( window, jQuery, Files, Analyze ));
