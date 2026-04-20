/**
 * BuN: Helper: functions
 * 
 * @author Valentin Alisch <hallo@valentinalisch.de>
 * @version 1.0
 */
var Bun = Bun || {};
Bun.Helper = Bun.Helper || {};






/* ---------------------------------------- */
/* ------------------------- */

/**
 * Dispatch custom Event
 * 
 * @since 1.0
 * 
 * @param {string} name
 * @param {object} detail
 * @param {boolean} log
 * 
 * @return {boolean}
 */
HTMLElement.prototype.dispatchCustomEvent = function( name, detail = {}, log = false ) {
	if ( ! name || typeof name !== 'string' || name.trim() === '' ) return false;
	const Event = new CustomEvent( name, { bubbles: true, detail } );

	if ( log ) console.log( Event );
	

	
	/* > */
	return this.dispatchEvent( Event );
}



/* ------------------------- */

/**
 * Parse arguments with defaults
 * 
 * @since 2.0
 * 
 * @param {object} values
 * @param {object} defaults
 * 
 * @return {object}
 */
Bun.Helper.parseArgs = function( values, ...defaults ) {
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
				values[ property ] = parseArgs( value, defaultValue );

			} 
		}
	}



	/* > */
	return values;
}



/* ------------------------- */

/**
 * Get attribute with default value
 * 
 * @since 1.0
 * 
 * @param {string} attribute
 * @param {mixed} defaultValue
 * @param {boolean} validateBoolean
 * 
 * @return {mixed}
 */
HTMLElement.prototype.getAttributeDefault = function( attribute, defaultValue = null, validateBoolean = true ) {
	const value = this.getAttribute( attribute );
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
 * Check if element supports fullscreen
 * 
 * @since 1.0
 * 
 * @return {boolean}
 */
HTMLElement.prototype.doesSupportFullscreen = function() {
	/* > */
	return !! ( 
		this.requestFullscreen
	|| 	this.mozRequestFullscreen
	|| 	this.webkitEnterFullscreen
	|| 	this.webkitRequestFullscreen
	);
}






/* ---------------------------------------- */
/* ------------------------- */

/**
 * Sanitize title
 * 
 * @since 1.0
 * 
 * @return {string}
 */
String.prototype.sanitize = function() {
	let string = this.trim();
	string = string.replace( /^\s+|\s+$/g, '' );
	string = string.toLowerCase();

	const from = 'àáäâèéëêìíïîòóöôùúüûñçěščřžýúůďťň·/_,:;';
	const to   = 'aaaaeeeeiiiioooouuuuncescrzyuudtn------';
	for ( let i = 0, l = from.length; i < l; i++ ) string = string.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );

	string = string
		.replace( '.', '-' )
		.replace( /[^a-z0-9 -]/g, '' )
		.replace( /\s+/g, '-' )
		.replace( /-+/g, '-' )
		.replace( /\//g, '' )
		;



	/* > */
	return string;
}



/* ------------------------- */

/**
 * Snake_Case string
 *
 * @since 1.0
 *
 * @param {string} string
 *
 * @return {string}
 */
String.prototype.snakecase = function() {
	let string = this.sanitize().replace( '_', '-' );
	let string__array = string.split( '-' );
	string__array = string__array.map( part => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase() );
	string = string__array.join( '_' );



	/* > */
	return string;
}



/* ------------------------- */

/**
 * Milliseconds to human readable time
 * 
 * @since 1.0
 * 
 * @param {string} format
 * @param {boolean} removeNullValues
 * @param {number} total
 * 
 * @return {string}
 */
Number.prototype.toTimeFormat = function( format = 'H:i:s', removeNullValues = true, total = null ) {
	if ( ! total || typeof total !== 'number' ) total = this;

	let ms = Math.floor( ( this % 1000 ) );
	let s = Math.floor( ( this / 1000 ) % 60 );
	let i = Math.floor( ( this / ( 1000 * 60 ) ) % 60 );
	let G = H = Math.floor( ( this / ( 1000 * 60 * 60 ) ) % 24 );

	let tms = Math.floor( ( total % 1000 ) );
	let ts = Math.floor( ( total / 1000 ) % 60 );
	let ti = Math.floor( ( total / ( 1000 * 60 ) ) % 60 );
	let tG = tH = Math.floor( ( total / ( 1000 * 60 * 60 ) ) % 24 );



	/* ---------- */
	if ( ms < 100 ) ms = ( ms < 10 ? '00' : '0' ) + ms;
	if ( s < 10 ) s = '0' + s;
	if ( i < 10 ) i = '0' + i;
	if ( H < 10 ) H = '0' + H;



	/* ---------- */
	format = format.replace( /ms/g, ms );
	format = format.replace( /s/g, s );
	format = format.replace( /i/g, i );
	format = format.replace( /G/g, G <= 0 && tG <= 0 && removeNullValues ? '' : G );
	format = format.replace( /H/g, G <= 0 && tG <= 0 && removeNullValues ? '' : H );

	format = format.replace( /^\D*/, '' );

	
	
	/* > */
	return format;
}






/* ---------------------------------------- */
/* ------------------------- */

/**
 * Checks if images in element are loaded
 *
 * @since 1.0
 *
 * @return {promise}
 */
HTMLElement.prototype.whenImagesAreLoaded = function() {
	/* ---<3--- */
	const promise = new Promise( ( resolve, reject ) => {
		const images = this.querySelectorAll( 'img' );
		if ( images.length === 0 ) return resolve( images );
		let promises = [];



		/* ---------- */

		/**
		 * Generate promise for each image
		 *
		 * @since 1.0
		 */
		for ( const image of images ) {
			const promise = new Promise( ( resolve, reject ) => {
				if ( image.complete ) {
					return resolve();

				} else {
					image.addEventListener( 'load', event => resolve() );
				}
			} );

			promises.push( promise );
		}



		/* ---------- */

		/**
		 * All images are loaded
		 *
		 * @since 1.0
		 */
		Promise.all( promises )
		.then( () => resolve( images ) );
	} );



	/* > */
	return promise;
}



/* ------------------------- */

/**
 * Checks if audios in element are loaded
 *
 * @since 1.0
 *
 * @return {promise}
 */
HTMLElement.prototype.whenAudiosAreLoaded = function() {
	/* ---<3--- */
	const promise = new Promise( ( resolve, reject ) => {
		const audios = this.querySelectorAll( 'audio' );
		if ( audios.length === 0 ) return resolve( audios );
		let promises = [];



		/* ---------- */

		/**
		 * Generate promise for each audio
		 *
		 * @since 1.0
		 */
		for ( const audio of audios ) {
			const promise = new Promise( ( resolve, reject ) => {
				audio.addEventListener( 'canplay', event => resolve() );
				audio.addEventListener( 'loadedmetadata', event => resolve() );
			} );

			promises.push( promise );
		}



		/* ---------- */

		/**
		 * All audios are loaded
		 *
		 * @since 1.0
		 */
		Promise.all( promises )
		.then( () => resolve( audios ) );
	} )



	/* > */
	return promise;
}



/* ------------------------- */

/**
 * Checks if videos in element are loaded
 *
 * @since 1.0
 *
 * @return {promise}
 */
HTMLElement.prototype.whenVideosAreLoaded = function() {
	/* ---<3--- */
	const promise = new Promise( ( resolve, reject ) => {
		const videos = this.querySelectorAll( 'video' );
		if ( videos.length === 0 ) return resolve( videos );
		let promises = [];



		/* ---------- */

		/**
		 * Generate promise for each video
		 *
		 * @since 1.0
		 */
		for ( const video of videos ) {
			const promise = new Promise( ( resolve, reject ) => {
				video.addEventListener( 'canplay', event => resolve() );
				video.addEventListener( 'loadedmetadata', event => resolve() );
			} );

			promises.push( promise );
		}



		/* ---------- */

		/**
		 * All videos are loaded
		 *
		 * @since 1.0
		 */
		Promise.all( promises )
		.then( () => resolve( videos ) );
	} )



	/* > */
	return promise;
}



/* ------------------------- */

/**
 * Checks if media is loaded
 * 
 * @since 1.0
 * 
 * @return {promise}
 */
HTMLElement.prototype.whenMediaIsLoaded = function() {
	return Promise.all( [
		this.whenImagesAreLoaded(),
		this.whenAudiosAreLoaded(), 
		this.whenVideosAreLoaded()
	] );
}






/* ---------------------------------------- */
/* ------------------------- */

/**
 * Animate
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
HTMLElement.prototype.animate = function( args = {} ) {
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
				const computedStyle = getComputedStyle( element );
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