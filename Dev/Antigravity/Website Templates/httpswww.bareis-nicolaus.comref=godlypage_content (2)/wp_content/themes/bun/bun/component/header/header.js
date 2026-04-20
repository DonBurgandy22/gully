/**
 * Bun: Component: Header
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
Bun.Component.Header = class Header {
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
	constructor( element = document.querySelector( 'header' ), args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.Header ) this.element.Header.destroy();
		this.element.Header = this;

		args = Bun.Helper.parseArgs(
			args,
			{}
		);



		/* ---------- */
		this._filterClickListener = event => {
			event.preventDefault();
			const body = document.querySelector( 'body' );
			const buttonElement = event.target.closest( '.button' );

			buttonElement.classList.toggle( 'is-active' );
			body.classList.toggle( 'does-display-filter' );

			if ( body.classList.contains( 'does-display-filter' ) && window.innerWidth < 1000 ) {
				ScrollJS.disable( [ this.workTagsElement ] );

			} else {
				ScrollJS.enable();
			}
		}

		this._resizeListener = event => {
			this.publishHeights();
		}



		/* ---------- */
		this.build()
		.then( () => {
			Bun.whenReady.then( () => this.publishHeights() );
			Bun.whenLoaded.then( () => this.publishHeights() );
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
			this.mobileHeaderElement = this.element.querySelector( '#header__mobile' );
			this.accordionPartElements = this.element.querySelectorAll( '.accordion-part' );

			this.workTagsElement = this.element.querySelector( '#header__work-tags' );
			this.filterButtonLink = this.element.querySelector( '#header__filter-button a' );



			/* --- */
			if ( this.filterButtonLink ) this.filterButtonLink.addEventListener( 'click', this._filterClickListener );
			window.addEventListener( 'resize', this._resizeListener );



			/* --- */
			if ( document.querySelector( 'body' ).classList.contains( 'does-display-filter' ) && window.innerWidth < 1000 ) {
				ScrollJS.disable( [ this.workTagsElement ] );
			} else {
				ScrollJS.enable();
			}



			/* > */
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
			if ( this.filterButtonLink ) this.filterButtonLink.removeEventListener( 'click', this._filterClickListener );
			window.removeEventListener( 'resize', this._resizeListener );
			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Publish heights
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	publishHeights() {
		const body = document.querySelector( 'body' );

		if ( this.mobileHeaderElement ) body.style.setProperty( '--mobile-header-height', this.mobileHeaderElement.clientHeight + 'px' );
		if ( this.accordionPartElements ) {
			for ( const accordionPartElement of this.accordionPartElements ) {
				const accordionContentElements = accordionPartElement.querySelectorAll( '.accordion-part__content' );

				const accordionPartHeader = accordionPartElement.querySelector( '.accordion-part__header' );
				if ( accordionPartHeader ) accordionPartElement.style.setProperty( '--header-height', accordionPartHeader.clientHeight + 'px' );

				for ( const accordionContentElement of accordionContentElements ) {
					const accordionPartAside = accordionContentElement.querySelector( '.accordion-part__content-aside' );
					if ( accordionPartAside ) accordionContentElement.style.setProperty( '--aside-height', accordionPartAside.clientHeight + 'px' );
				}
			}
		}
	}
}