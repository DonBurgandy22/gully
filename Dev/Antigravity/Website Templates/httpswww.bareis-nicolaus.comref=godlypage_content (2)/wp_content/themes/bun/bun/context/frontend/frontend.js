/**
 * BuN: Context: Frontend
 * 
 * @author alisch berlec hönow <info@abh.eu>
 * @version 2.1.1
 */
var Bun = Bun || {};
Bun.Context = Bun.Context || {};



/**
 * Frontend helper class
 *
 * @since 2.0
 */
Bun.Context.Frontend = class Frontend {
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
		this.setState( 'initialized' );
		Marquee3k.init();



		/* ---------- */
		window.addEventListener( 'popstate', event => {
			this.loadPage( window.location.href, false );
		} );

		this._linkClickListener = event => {
			const aElement = event.target.closest( 'a' );
			const href = aElement.getAttribute( 'href' );
			if ( 
				! href || href.indexOf( Bun.HOME_URL ) === -1 
			|| 	aElement.getAttribute( 'rel' ) === 'reload' 
			||	document.querySelector( 'body' ).classList.contains( 'view-archive' )
			) return;

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			this.loadPage( href );
		}

		this._accordionClickListener = event => {
			const accordionPart = event.target.closest( '.accordion-part' );
			if ( ! accordionPart ) return;

			event.preventDefault();
			this.setAccordion( accordionPart );
		}

		this._resizeListener = event => {
			this.publishHeights();
		}

		this._scrollListener = event => {
			if ( this.headlineElements.length <= 1 || ! this.asideButtonElements ) return;

			let activeButtonElement = null;
			for ( const buttonElement of this.asideButtonElements ) buttonElement.classList.remove( 'is-active' );
			for ( const headlineElement of this.headlineElements ) {
				const offsetTop = headlineElement.offsetTop - this.main.scrollTop;
				if ( offsetTop > window.innerHeight * 0.33333 ) continue;

				const mightBeLink = document.querySelector( '.accordion-part__content-aside .button a[href="#' + headlineElement.getAttribute( 'data-slug' ) + '"]' );
				if ( ! mightBeLink ) continue;

				const mightBeButton = mightBeLink.closest( '.button' );
				if ( ! mightBeButton ) continue;

				activeButtonElement = mightBeButton;
			}

			if ( activeButtonElement ) activeButtonElement.classList.add( 'is-active' );
		}

		this._sectionClickListener = event => {
			const aElement = event.target.closest( 'a' );
			const href = aElement.getAttribute( 'href' );
			if ( href.indexOf( '#' ) !== 0 ) return;

			const sectionElement = this.main.querySelector( '.page-section[data-type="headline_1"][data-slug="' + href.substring( 1 ) + '"]' );
			if ( ! sectionElement ) return;

			event.preventDefault();
			this.main.animateScrollTo( sectionElement.offsetTop + 2, { duration: 350 } );
		}

		this._marqueeClickListener = event => {
			const dataReverse = Bun.Marquee.element.getAttribute( 'data-reverse' );
			if ( dataReverse.trim() === '' ) {
				Bun.Marquee.element.setAttribute( 'data-reverse', 1 );

			} else {
				Bun.Marquee.element.setAttribute( 'data-reverse', '' );
			}

			Marquee3k.init();
			Marquee3k.refreshAll();
		}

		this._projectEnterListener = event => {
			const projectElement = event.target.closest( '.project' );
			const projectTagIDs = projectElement.getAttribute( 'data-tag-ids' ).split( ':' );

			for ( const buttonElement of this.buttonElements ) {
				const buttonTagID = buttonElement.getAttribute( 'data-id' );
				if ( ! buttonTagID || projectTagIDs.indexOf( buttonTagID ) === -1 ) continue;

				buttonElement.classList.add( 'is-hovered' );
			}
		}

		this._projectLeaveListener = event => {
			for ( const buttonElement of this.buttonElements ) buttonElement.classList.remove( 'is-hovered' );
		}
		


		/* ---------- */
		this.build()
		.then( () => {
			Bun.whenReady.then( () => this.publishHeights() );
			Bun.whenLoaded.then( () => this.publishHeights() );

			this.setState( 'ready' );
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
			this.setExternalLinks();

			for ( const linkElement of document.querySelectorAll( 'a' ) ) {
				linkElement.addEventListener( 'click', this._linkClickListener );
				linkElement.addEventListener( 'click', this._sectionClickListener );
			}

			for ( const accordionElement of document.querySelectorAll( '.accordion-part__header' ) ) accordionElement.addEventListener( 'click', this._accordionClickListener );
			if ( Bun.Component && Bun.Component.Header ) Bun.Header = new Bun.Component.Header();
			if ( Bun.Component && Bun.Component.Marquee ) {
				Bun.Marquee = new Bun.Component.Marquee();
				if ( Bun.Marquee.element ) Bun.Marquee.element.addEventListener( 'click', this._marqueeClickListener );
			}
			// if ( SliderJS ) Bun.Frontpage_Slider = new SliderJS( document.querySelector( '#frontpage slider-wrap' ), { doesAutoplay: true, transition: 'fade', pauseDuration: 3000, transitionDuration: 400, easingFunction: x => x } );

			this.main = document.querySelector( 'main' );
			this.headerAccordion = document.querySelector( '#header__accordion' );

			this.headlineElements = this.main.querySelectorAll( '.page-section[data-type="headline_1"]' );
			this.asideButtonElements = document.querySelectorAll( '.accordion-part__content-aside .button' );
			this._scrollListener();

			this.buttonElements = document.querySelectorAll( '.button' );
			this.projectDescriptionElement = document.querySelector( '#header__project-description' );
			this.projectCollaboratorsElement = document.querySelector( '#header__project-collaborators .button-group-inner' );
			this.projectTagsElement = document.querySelector( '#header__project-tags .button-group-inner' );
			this.activeFilterElement = document.querySelector( '#header__active-filter' );

			this.projectElements = document.querySelectorAll( '.project' );
			for ( const projectElement of this.projectElements ) {
				projectElement.addEventListener( 'mouseenter', this._projectEnterListener );
				projectElement.addEventListener( 'mouseleave', this._projectLeaveListener );
			}

			if ( Bun?.View?.Project ) Bun.Project_View = new Bun.View.Project();

			jQuery( this.main ).fitVids();
			window.addEventListener( 'resize', this._resizeListener );
			this.main.addEventListener( 'scroll', this._scrollListener );
			
			
			
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
			for ( const linkElement of document.querySelectorAll( 'a' ) ) {
				linkElement.removeEventListener( 'click', this._linkClickListener );
				linkElement.removeEventListener( 'click', this._sectionClickListener );
			}

			for ( const accordionElement of document.querySelectorAll( '.accordion-part__header' ) ) accordionElement.removeEventListener( 'click', this._accordionClickListener );
			if ( Bun.Header ) Bun.Header.destroy();
			if ( Bun.Marquee ) Bun.Marquee.destroy();
			if ( Bun.Frontpage_Slider ) Bun.Frontpage_Slider.destroy();

			if ( this.projectElements ) for ( const projectElement of this.projectElements ) {
				projectElement.removeEventListener( 'mouseenter', this._projectEnterListener );
				projectElement.removeEventListener( 'mouseleave', this._projectLeaveListener );
			}

			if ( Bun.Project_View ) Bun.Project_View.destroy();

			window.removeEventListener( 'resize', this._resizeListener );
			this.main.removeEventListener( 'scroll', this._scrollListener );
			
			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Get state
	 * 
	 * @since 2.0
	 * 
	 * @return {string}
	 */
	getState() {
		return this.state;
	}

	/**
	 * Set state
	 * 
	 * @since 2.0
	 * 
	 * @return {string}
	 */
	setState( state ) {
		switch ( state ) {
			case 'initialized':
				this.state = 'initialized';
				break;

			case 'ready':
				this.state = 'ready';
				break;

			case 'loading':
				this.state = 'loading';
				break;
		}

		state = this.getState();
		document.querySelector( 'body' ).setAttribute( 'data-state', state );

		
		
		/* > */
		return state;
	}




	/* ------------------------- */
	
	/**
	 * Add target="_blank" to external links
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	setExternalLinks() {
		for ( const externalLinkElement of document.querySelectorAll( 'a:not( [href=""] ):not( [href^="' + Bun.HOME_URL + '"] )' ) ) {
			externalLinkElement.setAttribute( 'target', '_blank' );
		}
	}



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
		body.style.setProperty( '--window-height', window.innerHeight + 'px' );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Set accordion
	 * 
	 * @since 2.0
	 * 
	 * @param {element} targetAccordionPart
	 * @param {boolean} forceOpen
	 * 
	 * @return {promise}
	 */
	setAccordion( targetAccordionPart = document.querySelector( '.accordion-part' ), forceOpen = false ) {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			const accordionElement = targetAccordionPart.closest( '.accordion' );
			if ( accordionElement ) {
				const accordionParts = accordionElement.querySelectorAll( '.accordion-part' );

				for ( const accordionPart of accordionParts ) {
					if ( accordionPart === targetAccordionPart ) continue;
					accordionPart.classList.remove( 'is-active', 'current-page-ancestor' );
				}
			}

			if ( targetAccordionPart ) {
				if ( forceOpen ) {
					targetAccordionPart.classList.add( 'is-active' );

				} else {
					targetAccordionPart.classList.toggle( 'is-active' );
				}
			}

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}
	


	/* ------------------------- */
	
	/**
	 * Load page
	 * 
	 * @since 2.0
	 * 
	 * @param {string} link
	 * @param {boolean} doesPush
	 * 
	 * @return {promise}
	 */
	loadPage( link, doesPush = true ) {
		let waitFor = [];
		const fetchLink = ( link.slice( -1 ) !== '/' ) ? link + '/' : link;
		const body = document.querySelector( 'body' );

		const mainTransitionDuration = parseFloat( getComputedStyle( this.main ).getPropertyValue( 'transition-duration' ) );
		if ( mainTransitionDuration && mainTransitionDuration > 0 ) {
			waitFor.push( new Promise( ( resolve, reject ) => this.main.addEventListener( 'transitionend', resolve, { once: true } ) ) );
		}

		this.main.classList.add( 'is-out' );
		body.classList.remove( 'does-display-filter' );



		/* ---------- */
		let targetAccordionPart = null;
		if ( this.headerAccordion ) {
			if ( 
				link === Bun.HOME_URL
			||	link.indexOf( '/project/' ) !== -1
			) {
				targetAccordionPart = this.headerAccordion.querySelector( '#header__work' );

			} else {
				const accordionLink = this.headerAccordion.querySelector( 'a[href="' + link + '"]' );
				if ( accordionLink ) targetAccordionPart = accordionLink.closest( '.accordion-part' );
			}
		}

		if ( targetAccordionPart ) this.setAccordion( targetAccordionPart, true );

		if ( this.buttonElements ) {
			for ( const buttonElement of this.buttonElements ) {
				buttonElement.classList.remove( 'is-active' );
				if ( ! buttonElement.querySelector( 'a[href="' + link + '"]' ) ) continue;

				buttonElement.classList.add( 'is-active' );
			}
		}





		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			if ( this.getState() === 'loading' ) return reject();
			this.setState('loading' );

			fetch( fetchLink + 'json/', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Cache-Control': 'no-cache',
				}
			} )

			.then( response => response.json() )
			.then( data => {
				const title = document.querySelector( 'title' );
				const ButtonTemplate = new Bun.Helper.Template( 'Component/Button/' );



				/* ---------- */
				switch ( data.View._template_name ) {
					case 'View/Project/Default':
						if ( this.projectDescriptionElement ) {
							this.projectDescriptionElement.closest( '#header__work-project' ).scrollTo( 0, 0 );
							this.projectDescriptionElement.innerHTML = data.View.description;
						}

						if ( this.projectCollaboratorsElement ) {
							this.projectCollaboratorsElement.innerHTML = '';
							if ( data.View.collaborators ) {
								for ( const collaboratorData of data.View.collaborators ) this.projectCollaboratorsElement.append( ButtonTemplate.get( collaboratorData.Button ) );
							}
						}

						if ( this.projectTagsElement ) {
							this.projectTagsElement.innerHTML = '';
							if ( data.View.tags ) {
								for ( const tagData of data.View.tags ) this.projectTagsElement.append( ButtonTemplate.get( tagData ) );
							}
						}
						break;

					case 'View/Work/Default':
						if ( this.activeFilterElement ) {
							this.activeFilterElement.innerHTML = '';
							if ( data.View.Active_Tag ) {
								this.activeFilterElement.append( ButtonTemplate.get( data.View.Active_Tag ) );
							}
						}
						break;

					default:

						break;
				}



				/* ---------- */
				const Template = new Bun.Helper.Template( data.View._template_name );
				const fragment = Template.get( data.View );

				Promise.all( waitFor )
				.then( () => {
					const mainElement = fragment.querySelector( 'main' );
					mainElement.classList.add( 'is-out' );

					this.main.replaceWith( mainElement );
					body.setAttribute( 'class', data.class );
					body.classList.add( 'is-ready', 'is-loaded' );
					title.innerHTML = data.title;
					window.scrollTo( 0, 0 );

					setTimeout( () => mainElement.classList.remove( 'is-out' ), 100 );
					if ( mainTransitionDuration && mainTransitionDuration > 0 ) {
						mainElement.addEventListener( 'transitionend', resolve, { once: true } );

					} else {
						return resolve();
					}
				} );



				/* ---------- */
				if ( doesPush ) history.pushState( {}, '', fetchLink );
			} )

			.catch( error => {
				window.location.href = fetchLink;
			} )
		} )

		.then( () => {
			this.destroy()
			.then( () => this.build() )
			.then( () => this.setState( 'ready' ) );
		} )

		.catch( error => {
			console.log( error );
		} );
		
		
		
		/* > */
		return promise;
	}
}