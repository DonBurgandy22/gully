/**
 * BuN: Launch
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};






/* ---------------------------------------- */
/* ------------------------- */

/**
 * Promise: Ready / Loaded
 *
 * @since 2.0
 *
 * @return {promise}
 */
Bun.whenReady = new Promise( ( resolve, reject ) => document.addEventListener( 'DOMContentLoaded', event => resolve() ) );
Bun.whenLoaded = new Promise( ( resolve, reject ) => window.addEventListener( 'load', event => resolve() ) );



/* ------------------------- */
Bun.whenReady
.then( () => {
	const html = document.querySelector( 'html' );
	const body = document.querySelector( 'body' );

	


	/**
	 * Set html classes
	 * 
	 * @since 2.0
	 */
	body.classList.add( 'is-ready' );
	html.classList.remove( 'no-js' );
	if ( matchMedia( '(any-hover: none)' ).matches ) html.classList.add( 'no-hover' );
	if ( matchMedia( '(hover: hover)' ).matches ) html.classList.add( 'has-hover' );



	/**
	 * Initialize
	 *
	 * @since 2.0
	 */
	if ( Bun.Context.General ) new Bun.Context.General();
	if ( Bun.Context.Backend ) new Bun.Context.Backend();
	if ( Bun.Context.Editor ) new Bun.Context.Editor();
	if ( Bun.Context.Frontend ) new Bun.Context.Frontend();
} );



/* ------------------------- */
Bun.whenLoaded
.then( () => {
	const body = document.querySelector( 'body' );
	body.classList.add( 'is-loaded' )
} );