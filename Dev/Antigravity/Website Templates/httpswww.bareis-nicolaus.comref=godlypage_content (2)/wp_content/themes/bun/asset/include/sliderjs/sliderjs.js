/**
 * @author Valentin Alisch <hallo@valentinalisch.de>
 * @version 2.1.7
 *
 * SliderJS.js
 */



/**
 * SliderJS class
 * 
 * @since 2.0
 */
class SliderJS {
	/**
	 * Constructor
	 * 
	 * @since 2.0
	 * 
	 * @param {object} element
	 * @param {object} args
	 */
	constructor( element = document.querySelector( 'slider-wrap' ), args = {} ) {
		this.element = element;
		if ( ! this.element ) return;
		if ( this.element.SliderJS ) this.element.sliderJS.destroy();
		this.element.SliderJS = this;

		args = this.constructor.parseArgs(
			args,
			{
				doesAutoplay: this.constructor.getAttributeDefault( this.element, 'data-does-autoplay', false ),
				doesAutosize: false,
				doesStartRandom: false,

				doesLoop: this.constructor.getAttributeDefault( this.element, 'data-does-loop', true ),
				loopBufferCount: 2,

				doesAlternate: this.constructor.getAttributeDefault( this.element, 'data-does-alternate', false ),
				doesSnap: true,
				isSkippable: true,
				doesOverflow: false,

				doesPreload: true,
				preloadBufferCount: 2,

				alignTo: 'center',
				transition: this.constructor.getAttributeDefault( this.element, 'data-transition', 'horizontal' ),
				transitionType: 'transform',
				transitionDuration: 250,
				snapTransitionDuration: 250,
				swipeTransitionDuration: 250,
				revertTransitionDuration: 250,
				easingFunction: x => 1 - Math.pow( 1 - x, 4 ),
				snapEasingFunction: x => 1 - Math.pow( 1 - x, 4 ),
				swipeEasingFunction: x => 1 - Math.pow( 1 - x, 4 ),
				revertEasingFunction: x => 1 - Math.pow( 1 - x, 4 ),

				stepSize: 1,
				playDirection: 'ltr',
				pauseDuration: 5000,
				doesPauseOnHover: false,

				doesListenTo: {
					drag: true,
					swipe: true,
					mouse: false, 
					wheel: false,
					keyboard: true
				},

				threshold: {
					dragDistance: 0.025,
					swipeDuration: 200,
					swipeDistance: 0.1,
					swipeTolerance: 0.1,
					wheelDuration: 300,

					hasReachedStart: 0.05,
					hasReachedEnd: 0.05
				},

				doesDispatchEvents: true,
				debug: false
			}
		);



		/* ---------- */
		this.isPlaying = false;
		this.wasPlaying = false;

		this.animation = null;
		this.isTransitioning = false;

		this.interaction = null;
		this.wheelTimeout = null;
		this.playInterval = null;



		/* ---------- */
		this.doesAutoplay = args.doesAutoplay;
		this.doesAutosize = args.doesAutosize;
		this.doesStartRandom = args.doesStartRandom;

		this.doesLoop = args.doesLoop;
		this.loopBufferCount = parseInt( args.loopBufferCount );
		this.loopElementBefore = null;
		this.loopElementAfter = null;
		this.loopObserver = null;
		this.bufferElementBefore = null;
		this.bufferElementAfter = null;

		this.doesAlternate = args.doesAlternate;
		this.doesSnap = args.doesSnap;
		this.isSkippable = args.isSkippable;

		this.doesOverflow = args.doesOverflow;
		this.minScroll;
		this.maxScroll;

		this.doesPreload = args.doesPreload;
		this.preloadBufferCount = parseInt( args.preloadBufferCount );

		this.alignTo = args.alignTo;
		this.transitionDuration = args.transitionDuration;
		this.snapTransitionDuration = args.snapTransitionDuration;
		this.swipeTransitionDuration = args.swipeTransitionDuration;
		this.revertTransitionDuration = args.revertTransitionDuration;
		this.easingFunction = args.easingFunction;
		this.snapEasingFunction = args.snapEasingFunction;
		this.swipeEasingFunction = args.swipeEasingFunction;
		this.revertEasingFunction = args.revertEasingFunction;

		this.stepSize = parseInt( args.stepSize );
		this.playDirection = args.playDirection;
		this.pauseDuration = args.pauseDuration;
		this.doesPauseOnHover = args.doesPauseOnHover;



		/* ---------- */
		this.doesListenTo = args.doesListenTo;
		this.threshold = args.threshold;
		this.property = {};

		this.transitionType = this.doesListenTo.wheel ? 'scroll' : args.transitionType;
		this.setTransition( args.transition );

		this.slidesElement = this.element.querySelector( 'slider-slides, .slider-slides' );
		this.slideElements = this.slidesElement.querySelectorAll( ':scope > *:not( [data-clone] )' );
		this.slideCount = this.slideElements.length;
		this.slidesSize = null;
		this.slide = {
			former: null,
			active: null,
			target: null
		};

		this.controlsElement = this.element.querySelector( 'slider-controls, .slider-controls' );
		this.indicatorsElement = this.element.querySelector( 'slider-indicators, .slider-indicators' );

		this.availableWrapClasses = [ 'has-reached-start', 'has-reached-end' ];
		this.availableSlideClasses = [ 'is-former', 'is-active', 'is-target', 'might-become-visible' ];



		/* ---------- */
		this.doesDispatchEvents = args.doesDispatchEvents;
		this.debug = args.debug;



		/* ---------- */
		this._resizeListener = event => {
			this.calculateDimensions();
			this.setSlide( this.getActiveSlideIndex(), 0 );
		}

		this._loopListener = event => {
			const scrollPosition = this.getScrollPosition();



			/* --- */
			if ( this.loopElementBefore ) {
				let value = this.loopElementBefore[ this.property.offset ] + this.loopElementBefore[ this.property.size ] - scrollPosition;
				if ( value >= this.threshold.loop ) {
					if ( this.transitionType === 'scroll' ) this.setScrollPosition( scrollPosition + this.slidesSize );
					if ( this.animation && this.animation.from && ! this.animation.hasEnded ) this.animation.from += this.slidesSize;
					if ( this.interaction && this.interaction.start && this.interaction.start.scroll ) this.interaction.start.scroll += this.slidesSize;
				}
			}

			if ( this.loopElementAfter ) {
				let value = this.loopElementAfter[ this.property.offset ] - scrollPosition;
				if ( value <= this.threshold.loop ) {
					if ( this.transitionType === 'scroll' ) this.setScrollPosition( scrollPosition - this.slidesSize );
					if ( this.animation && this.animation.from && ! this.animation.hasEnded ) this.animation.from -= this.slidesSize;
					if ( this.interaction && this.interaction.start && this.interaction.start.scroll ) this.interaction.start.scroll -= this.slidesSize;
				}
			}
		}

		/* --- */
		this._playClick = event => {
			event.preventDefault();
			this.play();
		}

		this._pauseClick = event => {
			event.preventDefault();
			this.pause();
		}

		this._togglePlayClick = event => {
			if ( ! this.isPlaying ) {
				this._playClick( event );
			} else {
				this._pauseClick( event );
			}
		}

		/* --- */
		this._touchstartListener = event => {
			this._dragSwipeStart( event.touches[0].clientX, event.touches[0].clientY, event );
		}

		this._touchmoveListener = event => {
			this._dragSwipeMove( event.touches[0].clientX, event.touches[0].clientY, event );
		}

		this._touchendListener = event => {
			this._dragSwipeEnd();
		}

		this._mousedownListener = event => {
			this._dragSwipeStart( event.clientX, event.clientY, event );
		}

		this._mousemoveListener = event => {
			this._dragSwipeMove( event.clientX, event.clientY, event );
		}

		this._mouseupListener = event => {
			this._dragSwipeEnd();
		}

		/* --- */
		this._mouseenterListener = event => {
			this.wasPlaying = this.isPlaying;
			this.pause();
		}

		this._mouseleaveListener = event => {
			if ( ! this.wasPlaying ) return;
			this.play();
		}

		/* --- */
		this._wheelListener = event => {
			clearTimeout( this.wheelTimeout );

			this.endSlide()
			.then( () => {
				if ( ! this.doesSnap ) return;

				this.wheelTimeout = setTimeout( () => {
					const duration = this.getSlideInViewIndex() === this.getActiveSlideIndex() ? this.revertTransitionDuration : this.snapTransitionDuration;
					const easing = this.getSlideInViewIndex() === this.getActiveSlideIndex() ? this.revertEasingFunction : this.snapEasingFunction;
					this.setSlide( this.getSlideInViewIndex(), duration, { easing } );
				}, this.threshold.wheelDuration );
			} );
		}

		/* --- */
		this._firstClick = event => {
			event.preventDefault();
			this.first();
		}

		this._prevClick = event => {
			event.preventDefault();
			this.prev();
		}

		this._nextClick = event => {
			event.preventDefault();
			this.next();
		}

		this._lastClick = event => {
			event.preventDefault();
			this.last();
		}

		this._indexClick = event => {
			event.preventDefault();
			const indexElement = event.target.closest( '[data-trigger]' );
			if ( ! indexElement ) return;

			this.setSlide( indexElement.getAttribute( 'data-trigger' ) );
		}

		/* --- */
		this._keyupListener = event => {
			switch ( event.which ) {
				case 39:
					this.next();
					break;

				case 37:
					this.prev();
					break;
			}
		}



		/* ---------- */
		this.whenReady = new Promise( ( resolve, reject ) => {
			this.build()
			.then( () => {
				if ( this.doesAutoplay ) this.play();

				return resolve( this );
			} );
		} );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */

	/**
	 * Helper: Dispatch custom Event
	 * 
	 * @since 2.0
	 * 
	 * @param {object} element
	 * @param {string} name
	 * @param {object} detail
	 * @param {boolean} log
	 * 
	 * @return {boolean}
	 */
	static dispatchCustomEvent( element, name, detail = {}, log = false ) {
		if ( ! name || typeof name !== 'string' || name.trim() === '' ) return false;
		const Event = new CustomEvent( name, { bubbles: true, detail } );

		if ( log ) console.log( Event );
		

		
		/* > */
		return element.dispatchEvent( Event );
	}


	
	/* ------------------------- */
	
	/**
	 * Helper: Parse arguments with defaults
	 * 
	 * @since 2.0
	 * 
	 * @param {object} values
	 * @param {object} defaults
	 * 
	 * @return {object}
	 */
	static parseArgs( values, ...defaults ) {
		if ( typeof values !== 'object' || Array.isArray( values ) || ! Object.keys( values ).length ) values = {};
		if ( ! defaults.length ) return values;

		defaults.reverse();
		for ( const defaultObject of defaults ) {
			if ( typeof defaultObject !== 'object' || ! Object.keys( defaultObject ).length ) continue;

			for ( const property in defaultObject ) {
				const defaultValue = defaultObject[ property ];
				const value = values[ property ];
				if ( value === null ) continue;



				/* --- */
				if ( value === undefined ) {
					values[ property ] = defaultValue;



				/* --- */
				} else if ( 
					typeof value === 'object' && ! Array.isArray( value ) 
				&&	typeof defaultValue === 'object' && ! Array.isArray( defaultValue ) 
				) {
					values[ property ] = this.parseArgs( value, defaultValue );

				} 
			}
		}



		/* > */
		return values;
	}



	/* ------------------------- */

	/**
	 * Helper: Get attribute with default value
	 * 
	 * @since 2.0
	 * 
	 * @param {object} element
	 * @param {string} attribute
	 * @param {mixed} defaultValue
	 * @param {boolean} validateBoolean
	 * 
	 * @return {mixed}
	 */
	static getAttributeDefault( element, attribute, defaultValue = null, validateBoolean = true ) {
		const value = element.getAttribute( attribute );
		if ( [ undefined, null, 'undefined', 'null', '' ].indexOf( value ) !== -1 )	return defaultValue;

		if ( validateBoolean ) {
			if ( [ false, 0, 'false', '0' ].indexOf( value ) !== -1 ) return false;
			if ( [ true, 1, 'true', '1' ].indexOf( value ) !== -1 ) return true;
		}

		
		
		/* > */
		return value;
	}



	/* ------------------------- */

	/**
	 * Helper: Animate
	 * 
	 * @since 2.0
	 * 
	 * @param {object} args
	 * @param {object} args.element
	 * @param {string} args.property
	 * @param {string} args.unit
	 * @param {number} args.unitsPerSecond
	 * @param {string|number} args.from
	 * @param {string|number} args.to
	 * @param {string|number} args.duration
	 * @param {function} args.easing
	 * @param {object} args.animation
	 * 
	 * @return {object}
	 */
	static animate( args = {} ) {
		let { 
			unit,
			unitsPerSecond,
			from,
			to: to = 0,
			duration: duration = 500,
			animation
		} = args;

		const { 
			element: element = this,
			property,
			easing: easing = x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow( -2 * x + 2, 4 ) / 2
		} = args;



		/* ---------- */
		if ( ! animation ) {
			let distance, fromUnit, toUnit;

			[ , from, fromUnit ] = typeof from === 'string' && from.match( /(?<from>-?\d+\.?\d*)(?<unit>\D*)/ ) || [ 0, from, '' ];
			[ , to, toUnit ] = typeof to === 'string' && to.match( /(?<to>-?\d+\.?\d*)(?<unit>\D*)/ ) || [ 0, to, '' ];
			from = parseFloat( from ) === parseFloat( from ) ? parseFloat( from ) : undefined;
			to = parseFloat( to ) === parseFloat( to ) ? parseFloat( to ) : 0;

			unit = unit || toUnit || fromUnit || null;



			/* --- */
			switch ( property ) {
				case 'scrollLeft':
				case 'scrollTop':
					unit = null;
					from = element[ property ];
					distance = to - from;
					break;

				default:
					let computedStyle, computedStyleFrom, computedFrom, computedUnit;

					computedStyle = getComputedStyle( element );
					computedStyleFrom = computedStyle.getPropertyValue( property ) !== '' ? computedStyle.getPropertyValue( property ) : 0;
					[ , computedFrom, computedUnit ] = typeof computedStyleFrom === 'string' && computedStyleFrom.match( /(?<from>-?\d+\.?\d*)(?<unit>\D*)/ ) || [ 0, 0, '' ];

					unit = unit || computedUnit || null;
					from = from ?? ( parseFloat( computedFrom ) === parseFloat( computedFrom ) ? parseFloat( computedFrom ) : 0 );
					distance = to - from;    
					break;
			}



			/* --- */
			if ( unitsPerSecond ) {
				unitsPerSecond = parseFloat( unitsPerSecond ) === parseFloat( unitsPerSecond ) ? parseFloat( unitsPerSecond ) : 100;
				duration = Math.abs( distance ) / Math.abs( unitsPerSecond ) * 1000; 
			}



			/* --- */
			animation = {
				property,
				unit,
				from,
				to,
				distance,

				duration: duration,
				starttime: Date.now(),
				runtime: 0,
				progress: 0,
				value: 0,

				request: null,

				isCanceled: false,
				whenCanceled: null,
				_resolveCanceled: null,
				_rejectCanceled: null,

				isCompleted: false,
				whenCompleted: null,
				_resolveCompleted: null,
				_rejectCompleted: null,

				hasEnded: false,
				whenEnded: null,
				_resolveEnded: null,
				_rejectEnded: null,

				cancel: () => {
					animation._rejectCompleted();
					animation._resolveCanceled();
					animation._resolveEnded();
				},

				complete: () => {
					animation._rejectCanceled();
					animation._resolveCompleted();
					animation._resolveEnded();
				}
			}



			/* --- */
			animation.whenCanceled = new Promise( ( resolve, reject ) => { animation._resolveCanceled = resolve; animation._rejectCanceled = reject; } );
			animation.whenCompleted = new Promise( ( resolve, reject ) => { animation._resolveCompleted = resolve; animation._rejectCompleted = reject; } );
			animation.whenEnded = new Promise( ( resolve, reject ) => { animation._resolveEnded = resolve; animation._rejectEnded = reject; } );

			animation.whenCanceled.then( () => animation.isCanceled = true ).catch( () => {} );
			animation.whenCompleted.then( () => animation.isCompleted = true ).catch( () => {} );

			animation.whenEnded
			.then( () => {
				animation.hasEnded = true;
				cancelAnimationFrame( animation.request );
			} )

			.catch( () => {} );
		}



		/* ---------- */
		animation.runtime = Date.now() - animation.starttime;
		animation.progress = animation.duration <= 0 || animation.isCompleted ? 1 : Math.min( 1, Math.max( 0, animation.runtime / animation.duration ) );
		animation.value = animation.from + easing( animation.progress ) * animation.distance;

		switch ( animation.property ) {
			case 'scrollLeft':
			case 'scrollTop':
				element[ animation.property ] = animation.value;
				break;

			default:
				element.style.setProperty( animation.property, animation.value + ( animation.unit || '' ) );
				break;
		}



		/* ---------- */
		if ( animation.progress >= 1 ) animation.complete();
		if ( ! animation.hasEnded ) animation.request = requestAnimationFrame( timestamp => this.animate( { element, easing, animation } ) );

		
		
		/* > */
		return animation;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Private: Helper for mouse / touch start
	 * 
	 * @since 2.0
	 * 
	 * @param {number} x
	 * @param {number} y
	 * @param {event} event
	 * 
	 * @return {void}
	 */
	_dragSwipeStart( x, y, event ) {
		x = parseFloat( x );
		y = parseFloat( y );
		if ( 
			! x || x !== x || ! y || y !== y 
		||	( this.isTransitioning && ! this.isSkippable )
		) return;

		this.endSlide();
		this.wasPlaying = this.isPlaying;
		this.pause();



		/* ---------- */
		this.interaction = {
			starttime: Date.now(),
			hasStarted: false,
			isDragging: false,
			start: {
				x,
				y,
				scroll: this.getScrollPosition()
			}
		}
		


		/* ! */
		if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:interactionrun', { 
			SliderJS: this,
			interaction: this.interaction
		}, this.debug );
	}

	/**
	 * Private: Helper for mouse / touch move
	 * 
	 * @since 2.0
	 * 
	 * @param {number} x
	 * @param {number} y
	 * @param {event} event
	 * 
	 * @return {void}
	 */
	_dragSwipeMove( x, y, event ) {
		x = parseFloat( x );
		y = parseFloat( y );
		if ( 
			! x || x !== x || ! y || y !== y 
		||	! this.interaction
		) return;



		/* ---------- */
		this.interaction.distance = {
			x: x - this.interaction.start.x,
			y: y - this.interaction.start.y
		}

		this.interaction.delta = {
			x: Math.abs( this.interaction.distance.x ),
			y: Math.abs( this.interaction.distance.y )
		}

		this.interaction.progress = this.interaction.delta[ this.property.axis.scroll ] / this.element[ this.property.size ];
		this.interaction.target = this.interaction.distance[ this.property.axis.scroll ] > 0 ? 'previous' : 'next';

		/* ! */
		if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:interactionprogress', { 
			SliderJS: this,
			interaction: this.interaction,
			progress: this.interaction.progress,
			distance: this.interaction.distance,
			delta: this.interaction.delta
		}, this.debug );



		/* ---------- */
		const dragDistanceAbsolute = this.element[ this.property.size ] * this.threshold.dragDistance;
		const swipeToleranceAbsolute = this.element[ this.property.size ] * this.threshold.swipeTolerance;
		const swipeDistanceAbsolute = this.element[ this.property.size ] * this.threshold.swipeDistance;

		/**
		 * Tolerance overflow
		 * 
		 * If interaction has not yet started
		 * and swipeToleranceAbsolute is exceeded (moved to far to wrong direction)
		 * –> Cancel interaction
		 * 
		 * @since 2.0
		 */
		if ( 
			! this.interaction.hasStarted 
		&& 	this.interaction.delta[ this.property.axis.fixed ] > swipeToleranceAbsolute 
		) {
			this.interaction = null;

			/* ! */
			if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:interactioncancel', { 
				SliderJS: this,
				interaction: this.interaction
			}, this.debug );

			
			
			/* > */
			return;
		}



		/* ---------- */

		/**
		 * Interaction start
		 * 
		 * Interaction progress is greater than drag or swipeDistance (in right direction)
		 * –> Start interaction and stop default behaviour
		 * 
		 * @since 2.0
		 */
		if ( 
			this.interaction.delta[ this.property.axis.scroll ] >= dragDistanceAbsolute
		|| 	this.interaction.delta[ this.property.axis.scroll ] >= swipeDistanceAbsolute
		) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			const wasStarted = this.interaction.hasStarted;
			this.interaction.hasStarted = true;

			/* ! */
			if ( this.doesDispatchEvents && ! wasStarted ) {
				this.constructor.dispatchCustomEvent( this.element, 'sjs:interactionstart', { 
					SliderJS: this,
					interaction: this.interaction
				}, this.debug );
			}
		}



		/* ---------- */

		/**
		 * Drag trigger
		 * 
		 * If listens to drag
		 * and interaction is greater than dragDistance
		 * –> Animate
		 * 
		 * @since 2.0
		 */
		if ( 
			( this.doesListenTo.drag && this.interaction.isDragging )
		||	( this.doesListenTo.drag && this.interaction.progress >= this.threshold.dragDistance )
		) {
			const interactionValue = this.interaction.start.scroll - this.interaction.distance[ this.property.axis.scroll ];

			this.interaction.isDragging = true;
			this.setScrollPosition( interactionValue );

			/* ! */
			if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:drag', { SliderJS: this }, this.debug );
		}
	}

	/**
	 * Private: Helper for mouse / touch end
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	_dragSwipeEnd() {
		let targetIndex = this.getActiveSlideIndex();
		const swipeDistanceAbsolute = this.element[ this.property.size ] * this.threshold.swipeDistance;
		if ( this.wasPlaying ) this.play();



		/* ---------- */
		
		/**
		 * Target index based on transition type
		 * 
		 * @since 2.0
		 */
		switch ( this.transition ) {
			case 'horizontal':
			case 'vertical':
				targetIndex = this.getSlideInViewIndex();
				break;
		}



		/* ---------- */
		
		/**
		 * Swipe trigger
		 * 
		 * If listens to swipe
		 * and interaction has started
		 * and interaction was shorter than maximum swipeDuration
		 * and interaction delta was greater than swipeDistance
		 * –> Trigger swipe
		 * 
		 * @since 2.0
		 */
		if ( 
			this.doesListenTo.swipe 
		&& 	this.interaction && this.interaction.hasStarted 
		&& 	Date.now() - this.interaction.starttime < this.threshold.swipeDuration 
		&& 	this.interaction.delta[ this.property.axis.scroll ] >= swipeDistanceAbsolute 
		) {
			if ( targetIndex === this.getActiveSlideIndex() ) {
				if ( this.interaction.target === 'previous' ) targetIndex -= 1;
				if ( this.interaction.target === 'next' ) targetIndex += 1;
			}

			this.interaction = null;
			if ( ! this.doesLoop ) targetIndex = Math.max( 0, Math.min( this.slideCount - 1, targetIndex ) );
			this.setSlide( targetIndex, this.swipeTransitionDuration, { easing: this.swipeEasingFunction } );



			/* ! */
			if ( this.doesDispatchEvents ) {
				this.constructor.dispatchCustomEvent( this.element, 'sjs:swipe', { SliderJS: this }, this.debug );
				this.constructor.dispatchCustomEvent( this.element, 'sjs:interactionend', { SliderJS: this }, this.debug );
			}

			return;
		}



		/* ---------- */
		
		/**
		 * Snap trigger
		 * 
		 * If does snap
		 * and interaction has started
		 * -> Revert | Snap
		 * 
		 * @since 2.0
		 */
		if ( 
			this.doesSnap
		&&	this.interaction && this.interaction.hasStarted
		) {
			const duration = targetIndex === this.getActiveSlideIndex() ? this.revertTransitionDuration : this.snapTransitionDuration;
			const easing = targetIndex === this.getActiveSlideIndex() ? this.revertEasingFunction : this.snapEasingFunction;
			this.setSlide( targetIndex, duration, { easing } );

			/* ! */
			if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:snap', { SliderJS: this }, this.debug );
		}

		this.interaction = null;

		
		
		/* ! */
		if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:interactionend', { SliderJS: this }, this.debug );
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
			this.element.setAttribute( 'data-slide-count', this.slideCount );
			this.element.style.setProperty( '--slide-count', this.slideCount );

			this.element.setAttribute( 'data-does-loop', this.doesLoop );
			this.element.setAttribute( 'data-does-alternate', this.doesAlternate );
			this.element.setAttribute( 'data-does-autoplay', this.doesAutoplay );
			if ( this.doesAutosize ) this.element.setAttribute( 'data-does-autosize', true );

			let doesListenToString = '';
			for ( const [ doesListenTo, value ] of Object.entries( this.doesListenTo ) ) {
				if ( value === true ) doesListenToString += doesListenTo + ' ';
			}

			this.element.setAttribute( 'data-does-listen-to', doesListenToString.trim() );



			/* ---------- */
			Promise.all( [
				this.buildSlides(),
				this.buildBuffer(),
				this.buildPreload(),
				this.buildLoop(),
				this.buildIndicators()
			] )

			.then( () => {
				this.buildResizeEvents();
				this.buildTouchEvents();
				this.buildMouseEvents();
				this.buildWheelEvents();
				this.buildClickEvents();
				this.buildKeyboardEvents();

				
				
				/* > */
				return resolve();
			} );
		} )

		.then( () => {
			this.calculateDimensions();
			this.setSlide( this.getActiveSlideIndex(), 0 );
			if ( this.doesAutoplay ) this.play();

			/* ! */
			if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:buildend', { SliderJS: this }, this.debug );
		} )

		.catch( error => this.debug && console.log( error ) );
		
		
		
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
			clearTimeout( this.wheelTimeout );
			clearInterval( this.playInterval );
			this.stop();



			/* ---------- */
			Promise.all( [
				this.destroySlides(),
				this.destroyBuffer(),
				this.destroyPreload(),
				this.destroyLoop(),
				this.destroyIndicators()
			] )

			.then( () => {
				this.element.removeAttribute( 'data-slide-count' );
				this.element.style.removeProperty( '--slide-count' );
				this.element.removeAttribute( 'data-does-listen-to' );
				this.element.removeAttribute( 'data-does-autosize' );

				this.destroyResizeEvents();
				this.destroyTouchEvents();
				this.destroyMouseEvents();
				this.destroyWheelEvents();
				this.destroyClickEvents();
				this.destroyKeyboardEvents();

				
				
				/* > */
				return resolve();
			} );
		} )

		.then( () => {
			/* ! */
			if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:destroyend', { SliderJS: this }, this.debug );
		} )

		.catch( error => this.debug && console.log( error ) );
	
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Build slides
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	buildSlides() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.destroySlides()
			.then( () => {
				let activeSlide = this.slidesElement.querySelector( '.is-active' ) || this.slidesElement.querySelector( ':scope > :first-child' );
				if ( this.doesStartRandom ) activeSlide = this.slideElements[ Math.floor( Math.random() * this.slideCount ) ];

				activeSlide.classList.add( 'is-active' );
				this.slide = {
					former: null,
					active: activeSlide,
					target: null
				}

				const activeSlideIndex = this.getActiveSlideIndex();
				this.element.setAttribute( 'data-active-slide-index', activeSlideIndex );
				this.element.style.setProperty( '--active-slide-index', activeSlideIndex );

				
				
				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Destroy slides
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	destroySlides() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.cleanSlideClasses();

			this.slidesElement.style.webkitTransform = '';
			this.slidesElement.style.mozTransform = '';
			this.slidesElement.style.transform = '';
			this.slidesElement[ this.property.scroll ] = '';

			this.element.removeAttribute( 'data-active-slide-index' );
			this.element.style.removeProperty( '--active-slide-index' );

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Clean slide classes
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	cleanSlideClasses() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			for ( const slideElement of this.slidesElement.children ) slideElement.classList.remove( ...this.availableSlideClasses );
			if ( this.indicatorElements ) for ( const indicatorElement of this.indicatorElements ) indicatorElement.classList.remove( ...this.availableSlideClasses );

			this.element.classList.remove( ...this.availableWrapClasses );

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
		
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build buffer
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	buildBuffer() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.destroyBuffer()
			.then( () => {
				if ( this.doesLoop ) return resolve();



				/* --- */
				let bufferElement = this.slideElements[ 0 ].cloneNode( true );
				bufferElement.classList.remove( ...this.availableSlideClasses );
				bufferElement.setAttribute( 'data-clone', 'buffer' );
				bufferElement.innerHTML = '';

				this.bufferElementBefore = bufferElement;
				this.bufferElementAfter = bufferElement.cloneNode( true );

				this.slidesElement.prepend( this.bufferElementBefore );
				this.slidesElement.append( this.bufferElementAfter );



				/* > */
				return resolve();
			} )
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Destroy buffer
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	destroyBuffer() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			const cloneElements = this.slidesElement.querySelectorAll( ':scope > [data-clone]' );
			for ( const cloneElement of cloneElements ) cloneElement.remove();

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build preload
	 * 
	 * @since 2.1
	 * 
	 * @return {promise}
	 */
	buildPreload() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.destroyPreload()
			.then( () => {
				if ( ! this.doesPreload ) return resolve();



				/* --- */
				const imageElements = this.element.querySelectorAll( 'img' );
				for ( const imageElement of imageElements ) {
					imageElement.setAttribute( 'decoding', 'async' );
					imageElement.setAttribute( 'loading', 'lazy' );
				}



				/* --- */
				const mediaElements = this.element.querySelectorAll( 'video, audio' );
				for ( const mediaElement of mediaElements ) {
					mediaElement.setAttribute( 'preload', 'none' );
					mediaElement.setAttribute( 'data-does-autoplay', mediaElement.autoplay );
					mediaElement.autoplay = false;
				}

				
				
				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Destroy preload
	 * 
	 * @since 2.1
	 * 
	 * @return {promise}
	 */
	destroyPreload() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}




	/* ------------------------- */
	
	/**
	 * Build Loop
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	buildLoop() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.destroyLoop()
			.then( () => {
				if ( ! this.doesLoop ) return resolve();
				
				switch ( this.transitionType ) {
					case 'transform':
						this.loopObserver = new MutationObserver( this._loopListener );
						this.loopObserver.observe( this.slidesElement, {
							attributes: true,
							attributeFilter: ['style']
						} );
						break;

					case 'scroll':
					default:
						this.slidesElement.addEventListener( 'scroll', this._loopListener );
						break;
				}



				/* --- */
				for ( let s = this.slideCount - 1; s >= Math.max( 0, this.slideCount - this.loopBufferCount ); s-- ) {
					let slideElement = this.slideElements[ s ].cloneNode( true );
					if ( s === this.slideCount - 1 ) this.loopElementBefore = slideElement;

					slideElement.classList.remove( ...this.availableSlideClasses );
					slideElement.setAttribute( 'data-clone', 'before' );
					this.slidesElement.prepend( slideElement );
				}

				for ( let s = 0; s < Math.min( this.slideCount, this.loopBufferCount ); s++ ) {
					let slideElement = this.slideElements[ s ].cloneNode( true );
					if ( s === 0 ) this.loopElementAfter = slideElement;

					slideElement.classList.remove( ...this.availableSlideClasses );
					slideElement.setAttribute( 'data-clone', 'after' );
					this.slidesElement.append( slideElement );
				}



				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Destroy Loop
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	destroyLoop() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			switch ( this.transitionType ) {
				case 'transform':
					if ( this.loopObserver ) this.loopObserver.disconnect();
					this.loopObserver = null;
					break;

				case 'scroll':
				default:
					this.slidesElement.removeEventListener( 'scroll', this._loopListener );
					break;
			}

			const cloneElements = this.slidesElement.querySelectorAll( ':scope > [data-clone]' );
			for ( const cloneElement of cloneElements ) cloneElement.remove();

			
			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build indicators
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	buildIndicators() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.destroyIndicators()
			.then( () => {
				if ( ! this.indicatorsElement || this.indicatorsElement.children.length !== 1 ) return resolve();

				const indicatorElement = this.indicatorsElement.children[0];
				indicatorElement.setAttribute( 'data-trigger', 0 );

				for ( let i = 1; i < this.slideCount; i++ ) {
					const newIndicatorElement = indicatorElement.cloneNode( true );
					newIndicatorElement.setAttribute( 'data-trigger', i );

					this.indicatorsElement.appendChild( newIndicatorElement );
				}

				this.indicatorElements = this.indicatorsElement.querySelectorAll( ':scope > *' );

				
				
				/* > */
				return resolve();
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	/**
	 * Destroy indicators
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	destroyIndicators() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			this.indicatorElements = null;
			

			
			/* > */
			return resolve();
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Build resize events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildResizeEvents() {
		this.destroyResizeEvents();

		window.addEventListener( 'resize', this._resizeListener );
	}

	/**
	 * Destroy resize events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyResizeEvents() {
		window.removeEventListener( 'resize', this._resizeListener );
	}



	/* ------------------------- */

	/**
	 * Build touch events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildTouchEvents() {
		this.destroyTouchEvents();
		if ( ! this.doesListenTo.drag && ! this.doesListenTo.swipe ) return;

		this.element.addEventListener( 'touchstart', this._touchstartListener, { passive: false } );
		window.addEventListener( 'touchmove', this._touchmoveListener, { passive: false } );
		window.addEventListener( 'touchend', this._touchendListener, { passive: false } );
	}

	/**
	 * Destroy touch events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyTouchEvents() {
		this.element.removeEventListener( 'touchstart', this._touchstartListener );
		window.removeEventListener( 'touchmove', this._touchmoveListener );
		window.removeEventListener( 'touchend', this._touchendListener );
	}



	/* ------------------------- */
	
	/**
	 * Build mouse events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildMouseEvents() {
		this.destroyMouseEvents();



		/* ---------- */
		if ( this.doesListenTo.mouse ) {
			this.element.addEventListener( 'mousedown', this._mousedownListener, { passive: false } );
			window.addEventListener( 'mousemove', this._mousemoveListener, { passive: false } );
			window.addEventListener( 'mouseup', this._mouseupListener, { passive: false } );
		}



		/* ---------- */
		if ( this.doesPauseOnHover ) {
			this.element.addEventListener( 'mouseenter', this._mouseenterListener );
			this.element.addEventListener( 'mouseleave', this._mouseleaveListener );
		}
	}

	/**
	 * Destroy mouse events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyMouseEvents() {
		this.element.removeEventListener( 'mousedown', this._mousedownListener );
		window.removeEventListener( 'mousemove', this._mousemoveListener );
		window.removeEventListener( 'mouseup', this._mouseupListener );

		this.element.removeEventListener( 'mouseenter', this._mouseenterListener );
		this.element.removeEventListener( 'mouseleave', this._mouseleaveListener );
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build wheel events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildWheelEvents() {
		this.destroyWheelEvents();
		if ( ! this.doesListenTo.wheel ) return;

		this.element.addEventListener( 'wheel', this._wheelListener );
	}
	
	/**
	 * Destroy wheel events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyWheelEvents() {
		this.element.removeEventListener( 'wheel', this._wheelListener );
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build click events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildClickEvents() {
		this.destroyClickEvents();



		/* ---------- */
		const triggerElements = this.element.querySelectorAll( '[data-trigger]' );
		for ( const triggerElement of triggerElements ) {
			const action = triggerElement.getAttribute( 'data-trigger' );

			switch ( action ) {
				case 'play':
				case 'start':
					triggerElement.addEventListener( 'click', this._playClick );
					break;

				case 'pause':
				case 'stop':
					triggerElement.addEventListener( 'click', this._pauseClick );
					break;

				case 'first':
					triggerElement.addEventListener( 'click', this._firstClick );
					break;

				case 'prev':
				case 'previous':
				case 'back':
				case 'backward':
				case 'backwards':
					triggerElement.addEventListener( 'click', this._prevClick );
					break;

				case 'next':
				case 'forward':
				case 'forwards':
					triggerElement.addEventListener( 'click', this._nextClick );
					break;

				case 'last':
					triggerElement.addEventListener( 'click', this._lastClick );
					break;

				default:
					triggerElement.addEventListener( 'click', this._indexClick );
					break;
			}
		}



		/* ---------- */
		const toggleElements = this.element.querySelectorAll( '[data-toggle]' );
		for ( const toggleElement of toggleElements ) {
			const action = toggleElement.getAttribute( 'data-toggle' );

			switch ( action ) {
				case 'play':
				case 'start':
				case 'pause':
				case 'stop':
					toggleElement.addEventListener( 'click', this._togglePlayClick );
					break;
			}
		}
	}

	/**
	 * Destroy click events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyClickEvents() {
		const triggerElements = this.element.querySelectorAll( '[data-trigger]' );
		for ( const triggerElement of triggerElements ) {
			const action = triggerElement.getAttribute( 'data-trigger' );

			switch ( action ) {
				case 'play':
				case 'start':
					triggerElement.removeEventListener( 'click', this._playClick );
					break;

				case 'pause':
				case 'stop':
					triggerElement.removeEventListener( 'click', this._pauseClick );
					break;

				case 'first':
					triggerElement.removeEventListener( 'click', this._firstClick );
					break;

				case 'prev':
				case 'previous':
				case 'back':
				case 'backward':
				case 'backwards':
					triggerElement.removeEventListener( 'click', this._prevClick );
					break;

				case 'next':
				case 'forward':
				case 'forwards':
					triggerElement.removeEventListener( 'click', this._nextClick );
					break;

				case 'last':
					triggerElement.removeEventListener( 'click', this._lastClick );
					break;

				default:
					triggerElement.removeEventListener( 'click', this._indexClick );
					break;
			}
		}



		/* ---------- */
		const toggleElements = this.element.querySelectorAll( '[data-toggle]' );
		for ( const toggleElement of toggleElements ) {
			const action = toggleElement.getAttribute( 'data-toggle' );

			switch ( action ) {
				case 'play':
				case 'start':
				case 'pause':
				case 'stop':
					toggleElement.removeEventListener( 'click', this._togglePlayClick );
					break;
			}
		}
	}

	
	
	/* ------------------------- */
	
	/**
	 * Build keyboard events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	buildKeyboardEvents() {
		this.destroyKeyboardEvents();
		if ( ! this.doesListenTo.keyboard ) return;

		document.addEventListener( 'keyup', this._keyupListener );
	}

	/**
	 * Destroy keyboard events
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	destroyKeyboardEvents() {
		document.removeEventListener( 'keyup', this._keyupListener );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Set transition
	 * 
	 * @since 2.0
	 * 
	 * @param {string} transition
	 * 
	 * @return {void}
	 */
	setTransition( transition = 'horizontal' ) {
		switch ( transition ) {
			case 'fade':
				this.transition = 'fade';
				this.property = {
					scroll: 'scrollLeft',
					offset: 'offsetLeft',
					size: 'clientWidth',
					axis: {
						scroll: 'x',
						fixed: 'y'
					}
				}
				break;

			case 'vertical':
				this.transition = 'vertical';
				this.property = {
					scroll: 'scrollTop',
					offset: 'offsetTop',
					size: 'clientHeight',
					axis: {
						scroll: 'y',
						fixed: 'x'
					}
				}
				break;

			case 'horizontal':
			default:
				this.transition = 'horizontal';
				this.property = {
					scroll: 'scrollLeft',
					offset: 'offsetLeft',
					size: 'clientWidth',
					axis: {
						scroll: 'x',
						fixed: 'y'
					}
				}
				break;
		}



		/* ---------- */
		
		/**
		 * Transition type
		 * 
		 * @since 2.1
		 */
		switch ( this.transitionType ) {
			case 'transform':
				this.property.scroll = '--transform';
				break;

			case 'scroll':
			default:
				this.transitionType = 'scroll';
				break;
		}



		/* ---------- */
		this.calculateDimensions();

		this.element.setAttribute( 'data-transition', this.transition );
		this.element.setAttribute( 'data-transition-type', this.transitionType );
	}

	
	
	/* ------------------------- */

	/**
	 * Set scrollPosition (based on transitionType)
	 * 
	 * @since 2.1
	 * 
	 * @param {number} offset
	 * 
	 * @return {number}
	 */
	setScrollPosition( offset = 0 ) {
		offset = parseFloat( offset );
		if ( ! offset ) return;

		switch ( this.transitionType ) {
			case 'transform':
				this.slidesElement.style.setProperty( this.property.scroll, offset );
				break;

			case 'scroll':
			default:
				this.slidesElement[ this.property.scroll ] = offset;
				break;
		}

		
		
		/* > */
		return this.getScrollPosition();
	}
	
	/**
	 * Get scrollPosition (based on transitionType)
	 * 
	 * @since 2.1
	 * 
	 * @return {number}
	 */
	getScrollPosition() {
		let scrollPosition;
		switch ( this.transitionType ) {
			case 'transform':
				scrollPosition = parseFloat( this.slidesElement.style.getPropertyValue( this.property.scroll ) );
				break;

			case 'scroll':
			default:
				scrollPosition = this.slidesElement[ this.property.scroll ];
				break;
		}

		
		
		/* > */
		return scrollPosition;
	}



	/* ------------------------- */
	
	/**
	 * Calculate some dimensions
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	calculateDimensions() {
		if ( ! this.slideElements ) return;

		this.slidesSize = 0;
		for ( const slideElement of [ ...this.slideElements ] ) {
			this.slidesSize += slideElement[ this.property.size ];

			const slideStyles = getComputedStyle( slideElement );
			switch ( this.transition ) {
				case 'horizontal':
					this.slidesSize += parseFloat( slideStyles.getPropertyValue( 'margin-left' ) );
					this.slidesSize += parseFloat( slideStyles.getPropertyValue( 'margin-right' ) );
					break;

				case 'vertical':
					this.slidesSize += parseFloat( slideStyles.getPropertyValue( 'margin-top' ) );
					this.slidesSize += parseFloat( slideStyles.getPropertyValue( 'margin-bottom' ) );
					break;
			}
		}



		/* ---------- */
		const scrollOverflow = this.slidesSize - this.element[ this.property.size ];

		switch ( this.alignTo ) {
			case 'end':
			case 'right':
			case 'bottom':
				this.threshold.loop = this.slidesElement[ this.property.size ] * 0.9;
				this.minScroll = ( this.bufferElementBefore ? this.bufferElementBefore[ this.property.size ] : 0 ) + ( scrollOverflow < 0 ? scrollOverflow : 0 );
				break;

			case 'center':
			case 'middle':
				this.threshold.loop = this.slidesElement[ this.property.size ] * 0.5;
				this.minScroll = ( this.bufferElementBefore ? this.bufferElementBefore[ this.property.size ] : 0 ) + ( scrollOverflow < 0 ? scrollOverflow * 0.5 : 0 );
				break;

			case 'start':
			case 'left':
			case 'top':
			default:
				this.threshold.loop = this.slidesElement[ this.property.size ] * 0.1;
				this.minScroll = this.bufferElementBefore ? this.bufferElementBefore[ this.property.size ] : 0;
				break;
		}

		this.maxScroll = Math.max( this.minScroll, this.minScroll + scrollOverflow );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Get slide index
	 * 
	 * @since 2.1
	 * 
	 * @param {object} slideElement
	 * 
	 * @return {number}
	 */
	getSlideIndex( slideElement ) {
		const tempSlideElements = this.slidesElement.children;
		let index = [ ...tempSlideElements ].indexOf( slideElement );

		if ( index !== -1 ) {
			index -= ( this.doesLoop ? this.loopBufferCount : 0 );
		} else {
			index = this.getActiveSlideIndex();
		}

		
		
		/* > */
		return index;
	}



	/* ------------------------- */
	
	/**
	 * Get former slide
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	getFormerSlide() {
		return this.slide.former || null;
	}

	/**
	 * Get fomer slide index
	 * 
	 * @since 2.0
	 * 
	 * @return {number}
	 */
	getFormerSlideIndex() {
		const slide = this.getFormerSlide();
		const index = slide ? parseInt( [ ...this.slideElements ].indexOf( slide ) ) : null;



		/* > */
		return index;
	}



	/* ------------------------- */
	
	/**
	 * Get active slide
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	getActiveSlide() {
		return this.slide.active || null;
	}

	/**
	 * Get active slide index
	 * 
	 * @since 2.0
	 * 
	 * @return {number}
	 */
	getActiveSlideIndex() {
		const slide = this.getActiveSlide() || this.getTargetSlide();
		const index = slide ? parseInt( [ ...this.slideElements ].indexOf( slide ) ) : 0;



		/* > */
		return index;
	}



	/* ------------------------- */
	
	/**
	 * Get target slide
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	getTargetSlide() {
		return this.slide.target || null;
	}

	/**
	 * Get target slide index
	 * 
	 * @since 2.0
	 * 
	 * @return {number}
	 */
	getTargetSlideIndex() {
		const slide = this.getTargetSlide();
		const index = slide ? parseInt( [ ...this.slideElements ].indexOf( slide ) ) : null;



		/* > */
		return index;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Get slide in view
	 * 
	 * @since 2.1 	Consider transitionType
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	getSlideInView() {
		let minOffset = null;
		let slideInView = null;
		const scrollPosition = this.getScrollPosition();

		switch ( this.alignTo ) {
			case 'end':
			case 'right':
			case 'bottom':
				for ( const slideElement of this.slideElements ) {
					let currentOffset = Math.abs( slideElement[ this.property.offset ] + slideElement[ this.property.size ] - this.slidesElement[ this.property.size ] - scrollPosition );
					if ( minOffset !== null && currentOffset >= minOffset ) continue;

					minOffset = currentOffset;
					slideInView = slideElement;
				}
				break;

			case 'center':
			case 'middle':
				for ( const slideElement of this.slideElements ) {
					let currentOffset = Math.abs( slideElement[ this.property.offset ] + slideElement[ this.property.size ] * 0.5 - this.slidesElement[ this.property.size ] * 0.5 - scrollPosition );
					if ( minOffset !== null && currentOffset >= minOffset ) continue;

					minOffset = currentOffset;
					slideInView = slideElement;
				}
				break;

			case 'start':
			case 'left':
			case 'top':
			default:
				for ( const slideElement of this.slideElements ) {
					const currentOffset = Math.abs( slideElement[ this.property.offset ] - scrollPosition );
					if ( minOffset !== null && currentOffset >= minOffset ) continue;

					minOffset = currentOffset;
					slideInView = slideElement;
				}
				break;
		}

		
		
		/* > */
		return slideInView;
	}

	/**
	 * Get slide in view index
	 * 
	 * @since 2.0
	 * 
	 * @return {number}
	 */
	getSlideInViewIndex() {
		const slide = this.getSlideInView();
		const index = slide ? parseInt( [ ...this.slideElements ].indexOf( slide ) ) : 0;



		/* > */
		return index;
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Set slide
	 * 
	 * @since 2.1 	index can also be an HTMLElement (slide)
	 * @since 2.0
	 * 
	 * @param {number|object} index
	 * @param {number} duration
	 * @param {object} args
	 * @param {function} args.easing
	 * 
	 * @return {promise}
	 */
	setSlide( index = this.getActiveSlideIndex(), duration = this.transitionDuration, args = {} ) {
		let tempIndex, targetIndex;
		const activeIndex = this.getActiveSlideIndex();
		const {
			easing: easing = this.easingFunction
		} = args;

		switch ( typeof index ) {
			case 'object':
				index = this.getSlideIndex( index );
				break;

			case 'number':
			case 'string':
			default:
				
				break;
		}

		index = parseInt( index );
		targetIndex = parseInt( index );



		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			if ( this.isTransitioning && ! this.isSkippable ) return reject( 'setSlide: isTransitioning && ! isSkippable' );
			this.isTransitioning = true;



			/* ---------- */
			if ( this.doesAlternate || this.doesLoop ) {
				targetIndex = index % this.slideCount;
				if ( targetIndex < 0 ) targetIndex = this.slideCount + targetIndex;
			}


			targetIndex = Math.max( 0, Math.min( this.slideCount - 1, targetIndex ) );

			

			/* ---------- */
			this.endSlide()
			.then( () => this.cleanSlideClasses() )
			.then( () => {
				this.slide = {
					former: this.slideElements[ activeIndex ],
					active: null,
					target: this.slideElements[ targetIndex ]
				}
				if ( ! this.slide.target ) return reject( 'setSlide: undefined target slide' );



				/* --- */
				this.slide.former.classList.add( 'is-former' );
				this.slide.target.classList.add( 'is-target' );

				if ( this.indicatorElements ) for ( const indicatorElement of this.indicatorElements ) {
					if ( indicatorElement.matches( '[data-trigger="' + activeIndex + '"]' ) ) indicatorElement.classList.add( 'is-former' );
					if ( indicatorElement.matches( '[data-trigger="' + targetIndex + '"]' ) ) indicatorElement.classList.add( 'is-target' );
				}

				/* ! */
				if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:transitionstart', { SliderJS: this }, this.debug );



				/* ---------- */
				let scrollTo, widthTo, heightTo;
				let animationTarget = this.slide.target;
				if ( this.doesLoop ) {
					const tempSlideElements = this.slidesElement.children;
					const animationTargetIndex = Math.max( 0, Math.min( tempSlideElements.length, this.loopBufferCount + index ) );

					animationTarget = tempSlideElements[ animationTargetIndex ];
				}

				switch ( this.alignTo ) {
					case 'end':
					case 'right':
					case 'bottom':
						scrollTo = animationTarget[ this.property.offset ] + animationTarget[ this.property.size ] - this.slidesElement[ this.property.size ];
						break;

					case 'center':
					case 'middle':
						scrollTo = animationTarget[ this.property.offset ] + animationTarget[ this.property.size ] * 0.5 - this.slidesElement[ this.property.size ] * 0.5;
						break;

					case 'start':
					case 'left':
					case 'top':
					default:
						scrollTo = animationTarget[ this.property.offset ];
						break;
				}
				
				/**
				 * Limit scrollTo / don't show overflow
				 * 
				 * @since 2.1.6
				 */
				if ( ! this.doesLoop && ! this.doesOverflow ) {
					scrollTo = Math.max( this.minScroll, scrollTo );
					scrollTo = Math.min( this.maxScroll, scrollTo );
				}



				/* ---------- */
				
				/**
				 * Preloading
				 * 
				 * @since 2.1
				 */
				if ( this.doesPreload ) {
					const tempSlideElements = this.slidesElement.children;
					const animationTargetIndex = [ ...tempSlideElements ].indexOf( animationTarget );

					let p = 1;
					let preloadElements = [ animationTarget ];

					for ( p; p <= this.preloadBufferCount; p++ ) {
						const preloadElementBefore = tempSlideElements[ animationTargetIndex - p ];
						const preloadElementAfter = tempSlideElements[ animationTargetIndex + p ];

						if ( preloadElementBefore ) preloadElements.push( preloadElementBefore );
						if ( preloadElementAfter ) preloadElements.push( preloadElementAfter );
					}

					for ( const preloadElement of preloadElements ) this.preloadSlide( preloadElement );
				}



				/* ---------- */
				let animationsEnded = [];
				switch ( this.transition ) {
					case 'horizontal':
					case 'vertical':
						this.animation = this.constructor.animate( {
							element: this.slidesElement,
							property: this.property.scroll,
							to: scrollTo,
							duration,
							easing
						} );

						animationsEnded.push( this.animation.whenEnded );
						break;

					case 'fade':
						const targetAnimation = this.animation = this.constructor.animate( {
							element: this.slide.target,
							property: 'opacity',
							from: this.slide.target === this.slide.former ? 1 : 0,
							to: 1,
							duration: this.slide.target === this.slide.former ? 0 : duration,
							easing
						} );

						animationsEnded.push( targetAnimation.whenEnded );
						break;
				}

				if ( this.doesAutosize ) {
					const sizeAnimation = this.constructor.animate( {
						element: this.slidesElement,
						property: 'height',
						to: this.slide.target.clientHeight,
						duration,
						easing
					} );

					animationsEnded.push( sizeAnimation );
				}



				/* ---------- */
				Promise.all( animationsEnded )
				.then( () => this.endSlide() )
				.then( () => {
					/* ! */
					if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:transitionend', { SliderJS: this }, this.debug );

					return resolve();
				} )

				.catch( error => {
					/* ! */
					if ( this.doesDispatchEvents ) this.constructor.dispatchCustomEvent( this.element, 'sjs:transitioncancel', { SliderJS: this }, this.debug );
					if ( this.debug ) console.log( error );

					return reject( error );
				} );
			} );
		} );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * End slide
	 * 
	 * @since 2.0
	 * 
	 * @return {promise}
	 */
	endSlide() {
		/* ---<3--- */
		const promise = new Promise( ( resolve, reject ) => {
			if ( ! this.animation || ! this.animation.cancel || this.animation.isCanceled ) {
				return resolve();



			/* ---------- */
			} else {
				this.animation.cancel();
				
				Promise.all( [
					this.cleanSlideClasses(),
					this.animation.whenEnded
				] )

				.then( () => {
					const targetSlideIndex = this.getTargetSlideIndex();
					this.animation = null;

					this.slide = {
						former: this.slideElements[ this.getFormerSlideIndex() ],
						active: this.slideElements[ targetSlideIndex ],
						target: null
					}

					if ( ! this.slide.active ) return reject( 'endSlide: undefined active slide' );



					/* ---------- */
					const previousSlideElement = this.slide.active.previousElementSibling || this.slidesElement.lastElementChild;
					const nextSlideElement = this.slide.active.nextElementSibling || this.slidesElement.firstElementChild;

					this.slide.active.classList.add( 'is-active' );
					if ( this.slide.former ) this.slide.former.classList.add( 'is-former' );
					if ( previousSlideElement ) previousSlideElement.classList.add( 'might-become-visible' );
					if ( nextSlideElement ) nextSlideElement.classList.add( 'might-become-visible' );

					if ( this.indicatorElements ) for ( const indicatorElement of this.indicatorElements ) {
						if ( indicatorElement.matches( '[data-trigger="' + targetSlideIndex + '"]' ) ) indicatorElement.classList.add( 'is-active' );
						if ( indicatorElement.matches( '[data-trigger="' + this.getFormerSlideIndex() + '"]' ) ) indicatorElement.classList.add( 'is-former' );
					}

					for ( const slideElement of this.slideElements ) slideElement.style.removeProperty( 'opacity' );
					


					/* ---------- */
					
					/**
					 * Add has-reached-start / -end classes
					 * 
					 * @since 2.1.6
					 */
					const scrollPosition = this.getScrollPosition();
					const firstSlideElement = this.slideElements[0];
					const lastSlideElement = this.slideElements[ this.slideElements.length - 1 ];

					if ( firstSlideElement[ this.property.offset ] - scrollPosition >= this.element[ this.property.size ] * this.threshold.hasReachedStart * -1 ) this.element.classList.add( 'has-reached-start' );
					if ( lastSlideElement[ this.property.offset ] + lastSlideElement[ this.property.size ] - scrollPosition <= this.element[ this.property.size ] + this.element[ this.property.size ] * this.threshold.hasReachedEnd ) this.element.classList.add( 'has-reached-end' );
					

					
					/* > */
					return resolve();
				} );
			}
		} )

		.catch( error => this.debug && console.log( error ) )
		.finally( () => this.isTransitioning = false );
		
		
		
		/* > */
		return promise;
	}

	
	
	/* ------------------------- */
	
	/**
	 * Preload slide
	 * 
	 * @since 2.1
	 * 
	 * @param {object} element
	 * 
	 * @return {void}
	 */
	preloadSlide( element ) {
		if ( this.constructor.getAttributeDefault( element, 'data-is-preloaded', false ) === true ) return;



		/* --- */
		const imageElements = element.querySelectorAll( 'img' );
		for ( const imageElement of imageElements ) {
			imageElement.setAttribute( 'decoding', 'auto' );
			imageElement.setAttribute( 'loading', 'eager' );
		}



		/* --- */
		const mediaElements = element.querySelectorAll( 'video, audio' );
		for ( const mediaElement of mediaElements ) {
			mediaElement.setAttribute( 'preload', 'auto' );
			mediaElement.autoplay = this.constructor.getAttributeDefault( mediaElement, 'data-does-autoplay', false );
			if ( mediaElement.autoplay ) mediaElement.play().catch( error => this.debug && console.log( error ) );
		}



		/* --- */
		element.setAttribute( 'data-is-preloaded', true );
	}

	
	
	/* ------------------------- */

	/**
	 * Previous slide
	 * 
	 * @since 2.0
	 *
	 * @param {number} duration
	 *
	 * @return {promise}
	 */
	prev( duration = this.transitionDuration ) {
		return this.setSlide( this.getActiveSlideIndex() - this.stepSize, duration );
	}

	previous( duration ) {
		return this.prev( duration );
	}

	back( duration ) {
		return this.prev( duration );
	}

	backward( duration ) {
		return this.prev( duration );
	}

	backwards( duration ) {
		return this.prev( duration );
	}

	first( duration = this.transitionDuration ) {
		return this.setSlide( 0, duration );
	}



	/* ------------------------- */

	/**
	 * Next slide
	 * 
	 * @since 2.0
	 *
	 * @param {number} duration
	 *
	 * @return {promise}
	 */
	next( duration = this.transitionDuration ) {
		return this.setSlide( this.getActiveSlideIndex() + this.stepSize, duration );
	}

	forward( duration ) {
		return this.next( duration );
	}

	forwards( duration ) {
		return this.next( duration );
	}

	last( duration = this.transitionDuration ) {
		return this.setSlide( this.slideCount - 1, duration );
	}

	
	
	
	
	
	/* ---------------------------------------- */
	/* ------------------------- */
	
	/**
	 * Play slider
	 *
	 * @since 2.1.5
	 *
	 * @return {void}
	 */
	play() {
		if ( this.isPlaying ) return;

		this.playInterval = setInterval( () => {
			switch ( this.playDirection ) {
				case 'rtl':
					this.prev();
					break;

				case 'ltr':
				default:
					this.next();
					break;
			}
		}, this.pauseDuration + this.transitionDuration );
		this.isPlaying = true;
	}

	start() {
		return this.play();
	}

	
	
	/* ------------------------- */
	
	/**
	 * Pause slider
	 * 
	 * @since 2.1.5
	 * 
	 * @return {void}
	 */
	pause() {
		if ( ! this.isPlaying ) return;

		clearInterval( this.playInterval );
		this.isPlaying = false;
	}

	stop() {
		return this.pause();
	}
}