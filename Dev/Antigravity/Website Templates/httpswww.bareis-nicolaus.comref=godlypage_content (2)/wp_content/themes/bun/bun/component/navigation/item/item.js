/**
 * BuN: Component: Navigation: Item
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};
Bun.Component = Bun.Component || {};
Bun.Component.Navigation = Bun.Component.Navigation || {};



/**
 * Component helper class
 *
 * @since 2.0
 */
Bun.Component.Navigation.Item = class Item {
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