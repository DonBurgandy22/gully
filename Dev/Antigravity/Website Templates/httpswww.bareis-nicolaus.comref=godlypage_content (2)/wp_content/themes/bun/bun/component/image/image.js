/**
 * BuN: Component: Image
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};
Bun.Component = Bun.Component || {};



/**
 * Component helper class
 *
 * @since 2.0
 */
Bun.Component.Image = class Image {
	/**
	 * Constructor
	 *
	 * @since 2.0
	 * 
	 * @param {HTMLElement} element
	 * @param {object} args
	 *
	 * @return {object}
	 */
	constructor( element = document.querySelector( '.image' ), args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.Image ) this.element.Image.destroy();
		this.element.Image = this;

		args = Bun.Helper.parseArgs(
			args,
			{}
		);



		/* ---------- */
		this.build()
		.then( () => {

		} );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Build
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	build() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {

			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Destroy
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	destroy() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}
}