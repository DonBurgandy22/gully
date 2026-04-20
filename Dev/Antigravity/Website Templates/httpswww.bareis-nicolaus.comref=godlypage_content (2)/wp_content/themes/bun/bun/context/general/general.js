/**
 * BuN: Context: General
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};
Bun.Context = Bun.Context || {};



/**
 * General helper class
 *
 * @since 2.0
 */
Bun.Context.General = class General {
	/**
	 * Constructor
	 *
	 * @since 2.0
	 *
	 * @return {object}
	 */
	constructor() {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		


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