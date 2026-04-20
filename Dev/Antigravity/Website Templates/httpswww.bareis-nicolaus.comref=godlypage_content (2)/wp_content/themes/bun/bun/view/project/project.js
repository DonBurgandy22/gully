/**
 * Bun View: Project
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
Bun.View.Project = class Project {
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
	constructor( element = document.querySelector( '#project' ), args = {} ) {
		/**
		 * Setup
		 *
		 * @since 2.0
		 */
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.Project ) this.element.Project.destroy();
		this.element.Project = this;

		args = Bun.Helper.parseArgs( 
			args,
			{}
		);



		/* ---------- */
		this._mediaClickListener = event => {
			const mediaElement = event.target.closest( '.project-media' );
			const index = mediaElement ? mediaElement.getAttribute( 'data-index' ) : 0;

			this.openMediaOverlay( index );
		}

		this._mediaCloserClickListener = event => {
			event.preventDefault();
			this.closeMediaOverlay();
		}

		this._keyUpListener = event => {
			switch ( event.keyCode ) {
				case 27:
					this.closeMediaOverlay();
					break;
			}
		}
		


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
			this.mediaElements = this.element.querySelectorAll( '.project-media' );
			for ( const mediaElement of this.mediaElements ) mediaElement.addEventListener( 'click', this._mediaClickListener );

			this.mediaOverlayElement = this.element.querySelector( '#project__media-overlay' );
			if ( this.mediaOverlayElement ) {
				this.mediaOverlayElement.SliderJS = new SliderJS(  this.mediaOverlayElement.querySelector( 'slider-wrap' ) );
				this.mediaOverlayCloserElement = this.mediaOverlayElement.querySelector( '.button[data-id="project__media-overlay__closer"]' );
				if ( this.mediaOverlayCloserElement ) this.mediaOverlayCloserElement.addEventListener( 'click', this._mediaCloserClickListener );
				window.addEventListener( 'keyup', this._keyUpListener );
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
			if ( this.mediaElements ) for ( const mediaElement of this.mediaElements ) mediaElement.addEventListener( 'click', this._mediaClickListener );
			if ( this.mediaOverlayElement ) this.mediaOverlayElement.SliderJS.destroy();
			if ( this.mediaOverlayCloserElement ) this.mediaOverlayCloserElement.removeEventListener( 'click', this._mediaCloserClickListener );
			window.removeEventListener( 'keyup', this._keyUpListener );

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Open media overlay
	 * 
	 * @since 2.0.3
	 * 
	 * @param {integer} index
	 * 
	 * @return {void}
	 */
	openMediaOverlay( index = 0 ) {
		if ( ! this.mediaOverlayElement ) return;
		const body = document.querySelector( 'body' );
		
		index = parseInt( index );
		this.mediaOverlayElement.SliderJS.setSlide( index, 0 );

		body.classList.remove( 'media-overlay-is-active' );
		this.mediaOverlayElement.classList.add( 'is-active' );
	}

	
	
	/* ------------------------- */
	
	/**
	 * Close media overlay
	 * 
	 * @since 2.0.3
	 * 
	 * @return {void}
	 */
	closeMediaOverlay() {
		if ( ! this.mediaOverlayElement ) return;
		const body = document.querySelector( 'body' );

		this.mediaOverlayElement.classList.remove( 'is-active' );
		body.classList.remove( 'media-overlay-is-active' );
	}
}