/**
 * BuN: Component: Video
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
Bun.Component.Video = class Video {
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
	constructor( element = document.querySelector( '.video' ), args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.Video ) this.element.Video.destroy();
		this.element.Video = this;

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
	 * @since 1.0
	 * 
	 * @return {promise}
	 */
	build() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			super.build()
			.then( () => {

				
				
				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Destroy
	 * 
	 * @since 1.0
	 * 
	 * @return {promise}
	 */
	destroy() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			super.destroy()
			.then( () => {

				
				
				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}
}