/**
 * Bun: Component: Marquee
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
Bun.Component.Marquee = class Marquee {
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
	constructor( element = document.querySelector( 'footer' ), args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.Marquee ) this.element.Marquee.destroy();
		this.element.Marquee = this;

		args = Bun.Helper.parseArgs(
			args,
			{}
		);



		/* ---------- */
		this._resizeListener = event => {
			this.publishHeight();
		}



		/* ---------- */
		this.build()
		.then( () => {
			Bun.whenReady.then( () => this.publishHeight() );
			Bun.whenLoaded.then( () => this.publishHeight() );
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
			window.addEventListener( 'resize', this._resizeListener );

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
			window.removeEventListener( 'resize', this._resizeListener );

			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Publish height
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	publishHeight() {
		const body = document.querySelector( 'body' );

		if ( this.element ) body.style.setProperty( '--marquee-height', this.element.clientHeight + 'px' );
	}
}