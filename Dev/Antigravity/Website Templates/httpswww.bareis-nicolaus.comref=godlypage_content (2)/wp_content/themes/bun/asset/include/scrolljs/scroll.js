/**
 * @author Valentin Alisch <hallo@valentinalisch.de>
 * @version 2.0
 *
 * Scroll.js
 */



/**
 * ScrollJS class
 * 
 * @since 2.0
 */
class ScrollJS {
	/**
	 * Setup
	 * 
	 * @var {array} scrollAbleElements
	 * @var {object} interaction
	 * @var {object} offset
	 * 
	 * @since 2.0
	 */
	static scrollableElements = [];
	static interaction = null;
	static offset = { top: 0, left: 0 };

	
	
	/* ---------- */
	static _touchstart = event => {
		this.interaction = {
			start: {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			}
		}
	}

	static _touchmove = event => {
		if ( ! this.interaction ) return;

		this.interaction.distance = {
			x: this.interaction.start.x - event.touches[0].clientX,
			y: this.interaction.start.y - event.touches[0].clientY
		}

		this.interaction.delta = {
			x: Math.abs( this.interaction.distance.x ),
			y: Math.abs( this.interaction.distance.y )
		}

		this._preventScroll( event, { x: this.interaction.distance.x, y: this.interaction.distance.y }, event.touches[0].target );
	}

	static _touchend = event => {
		this.interaction = null;
	}

	static _wheel = event => {
		this._preventScroll( event, { x: event.deltaX, y: event.deltaY }, event.target );
	}






	/* ---------------------------------------- */
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
			from = parseFloat( from );
			to = parseFloat( to );
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
					computedStyleFrom = computedStyle[ property ] !== undefined ? computedStyle[ property ] : 0;
					[ , computedFrom, computedUnit ] = typeof computedStyleFrom === 'string' && computedStyleFrom.match( /(?<from>-?\d+\.?\d*)(?<unit>\D*)/ ) || [ 0, 0, '' ];

					unit = unit || computedUnit || null;
					from = from || ( parseFloat( computedFrom ) === parseFloat( computedFrom ) ? parseFloat( computedFrom ) : 0 );
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
	/* -------------------- */

	/**
	 * Private: Prevent scroll
	 * 
	 * @since 2.0
	 * 
	 * @param {event} event
	 * @param {object} distance
	 * @param {element} targetElement 
	 * 
	 * @return {void}
	 */
	static _preventScroll( event, distance, targetElement ) {
		let closestScrollableElement = null;
		const direction = {
			x: distance.x === 0 ? false : ( distance.x < 0 ? 'left' : 'right' ),
			y: distance.y === 0 ? false : ( distance.y < 0 ? 'up' : 'down' )
		};
		


		/* ---------- */
		for ( const scrollableElement of this.scrollableElements ) {
			if ( scrollableElement !== targetElement && ! scrollableElement.contains( targetElement ) ) continue;

			closestScrollableElement = scrollableElement;
			break;
		}

		if ( ! closestScrollableElement ) {
			event.preventDefault();
			return;
		}



		/* ---------- */
		const scrollTop = closestScrollableElement.scrollTop;
		const scrollLeft = closestScrollableElement.scrollLeft;
		const scrollOverflow = {
			x: closestScrollableElement.scrollWidth - closestScrollableElement.clientWidth,
			y: closestScrollableElement.scrollHeight - closestScrollableElement.clientHeight
		};

		if ( scrollOverflow.x <= 0 ) direction.x = null;
		if ( scrollOverflow.y <= 0 ) direction.y = null;

		const scrollProgress = {
			x: scrollLeft / scrollOverflow.x,
			y: scrollTop / scrollOverflow.y
		};

		const hasReachedLeft = scrollLeft <= 0 || scrollProgress.x <= 0;
		const hasReachedRight = scrollOverflow.x <= 0 || scrollProgress.x >= 0;
		const hasReachedTop = scrollTop <= 0 || scrollProgress.y <= 0;
		const hasReachedBottom = scrollOverflow.y <= 0 || scrollProgress.y >= 1;

		if ( 
			( direction.x === 'right' && hasReachedRight )
		|| 	( direction.x === 'left' && hasReachedLeft )
		||	( direction.y === 'down' && hasReachedBottom )
		|| 	( direction.y === 'up' && hasReachedTop )
		||	( direction.x === null && direction.y === null )
		) {
			event.preventDefault();
			return;
		}
	}






	/* ---------------------------------------- */
	/* ------------------------- */

	/**
	 * Get offset
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	static getOffset() {
		return this.offset;
	} 

	/**
	 * Set offset
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	static setOffset( offset ) {
		switch ( typeof offset ) {
			case 'number':
			case 'string':
				this.offset.top = this.offset.left = parseFloat( offset ) === parseFloat( offset ) ? parseFloat( offset ) : 0;
				break;

			case 'object':
				if ( offset.left ) this.offset.left = offset.left;
				if ( offset.top ) this.offset.top = offset.top;
				break;
		}

		offset = this.getOffset();



		/* > */
		return offset;
	}

	/**
	 * Reset offset
	 * 
	 * @since 2.0
	 * 
	 * @return {object}
	 */
	static resetOffset() {
		return this.setOffset( 0 );
	}
	


	/* ------------------------- */

	/**
	 * Enable scroll
	 * 
	 * @since 2.0
	 * 
	 * @return {void}
	 */
	static enable( scrollableElements = [] ) {
		this.scrollableElements = [];
		document.querySelector( 'body' ).classList.remove( 'do-prevent-scroll' );

		document.documentElement.removeEventListener( 'touchstart', this._touchstart );
		document.documentElement.removeEventListener( 'touchmove', this._touchmove, { passive: false } );
		document.documentElement.removeEventListener( 'touchend', this._touchend );

		document.documentElement.removeEventListener( 'wheel', this._wheel, { passive: false } );
	}



	/* ------------------------- */

	/**
	 * Disable scroll
	 * 
	 * @since 2.0
	 * 
	 * @param {array} scrollableElements
	 * 
	 * @return {void}
	 */
	static disable( scrollableElements = [] ) {
		this.enable();
		this.scrollableElements = ! scrollableElements || ! scrollableElements.length ? [] : scrollableElements;
		document.querySelector( 'body' ).classList.add( 'do-prevent-scroll' );

		document.documentElement.addEventListener( 'touchstart', this._touchstart );
		document.documentElement.addEventListener( 'touchmove', this._touchmove, { passive: false } );
		document.documentElement.addEventListener( 'touchend', this._touchend );

		document.documentElement.addEventListener( 'wheel', this._wheel, { passive: false } );
	}
}



/* ------------------------- */

/**
 * Scroll to
 * 
 * @since 2.0
 * 
 * @param {mixed} input
 * @param {object} args
 * 
 * @return {promise}
 */
HTMLElement.prototype.animateScrollTo = function( input, args = {} ) {
	const {
		duration: duration = 500,
		unitsPerSecond,
		isCancelable: isCancelable = true
	} = args;

	let { offset } = args;



	/* ---------- */
	const current = { left: this.scrollLeft, top: this.scrollTop };
	let to = { left: this.scrollLeft, top: this.scrollTop };

	switch ( typeof input ) {
		case 'number':
		case 'string':
			to.top = parseFloat( input ) === parseFloat( input ) ? parseFloat( input ) : 0;
			break;

		case 'object':
			if ( typeof input.getBoundingClientRect === 'function' ) {
				const bounds = input.getBoundingClientRect();
				to.left = current.left + bounds.left;
				to.top = current.top + bounds.top;

			} else {
				if ( input.left ) to.left = input.left;
				if ( input.top ) to.top = input.top;
			}
			break;

		default:
			return;
			break;
	}

	switch ( typeof offset ) {
		case 'number':
		case 'string':
			offset = {
				left: parseFloat( offset ) === parseFloat( offset ) ? parseFloat( offset ) : 0,
				top: parseFloat( offset ) === parseFloat( offset ) ? parseFloat( offset ) : 0
			}
			break;

		case 'object':
			offset.left = offset.left ?? ScrollJS.offset.left ?? 0;
			offset.top = offset.top ?? ScrollJS.offset.top ?? 0;
			break;

		default:
			offset = {
				left: ScrollJS.offset.left ?? 0,
				top: ScrollJS.offset.top ?? 0
			}
			break;
	}

	to.left -= offset.left;
	to.top -= offset.top;



	/* ---------- */
	const scrollOverflow = {
		left: this.scrollWidth - this.clientWidth,
		top: this.scrollHeight - this.clientHeight
	}

	for ( const t in to ) {
		let value = to[ t ];
		switch ( typeof value ) {
			case 'number':
				break;

			case 'string':
				const operator = value.charAt( 0 );
				value = parseFloat( value );
				
				switch ( operator ) {
					case '+':
					case '-':
						to[ t ] = current[ t ] + value;
						break;

					default: 
						to[ t ] = value;
						break;
				}
				break;

			default:
				to[ t ] = current[ t ];
				break;
		}

		to[ t ] = Math.max( 0, Math.min( scrollOverflow[ t ], to[ t ] ) );
	}



	/* ---<3--- */
	const promise = new Promise( ( resolve, reject ) => {
		const leftAnimation = ScrollJS.animate( { element: this, property: 'scrollLeft', to: to.left, duration, unitsPerSecond } );
		const topAnimation = ScrollJS.animate( { element: this, property: 'scrollTop', to: to.top, duration, unitsPerSecond } );
		
		if ( isCancelable ) {
			const cancelAnimations = () => {
				leftAnimation.cancel();
				topAnimation.cancel();

				this.removeEventListener( 'wheel', cancelAnimations, { once: true } );
				this.removeEventListener( 'mousedown', cancelAnimations, { once: true } );
				this.removeEventListener( 'touchstart', cancelAnimations, { once: true } );
			}

			this.addEventListener( 'wheel', cancelAnimations, { once: true } );
			this.addEventListener( 'mousedown', cancelAnimations, { once: true } );
			this.addEventListener( 'touchstart', cancelAnimations, { once: true } );
		}	



		Promise.all( [ leftAnimation.whenEnded, topAnimation.whenEnded ] )
		.then( () => resolve() );
	} );
	
	
	
	/* > */
	return promise;
}