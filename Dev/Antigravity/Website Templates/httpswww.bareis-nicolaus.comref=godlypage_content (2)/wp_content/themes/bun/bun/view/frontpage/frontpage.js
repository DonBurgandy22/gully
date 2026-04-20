/**
 * Bun View: Frontpage
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};
Bun.View = Bun.View || {};



/**
 * View helper class
 *
 * @since 2.0
 */
Bun.View.Frontpage = class Frontpage {
	/**
	 * Constructor
	 *
	 * @since 2.0
	 * 
	 * @param {object} args
	 *
	 * @return {object}
	 */
	constructor( args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
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