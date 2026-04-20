/**
 * BuN: Helper: Template
 * 
 * @author Valentin Alisch <hallo@valentinalisch.de>
 * @version 1.0
 */
var Bun = Bun || {};
Bun.Helper = Bun.Helper || {};



/**
 * Template engine
 * 
 * @since 1.0		Clean-Up & Documentation
 * @since 0.9.4		replace_output_function
 * @since 0.9.3		get_unified_name; set_file_default; get_file_default
 * @since 0.9
 */
Bun.Helper.Template = class Template {
	/**
	 * Constructor
	 *
	 * @since 0.9
	 *
	 * @param {string} name
	 *
	 * @return {object}
	 */
	constructor( name ) {
		if ( typeof name !== 'string' ) return;

		this._templateName = this.constructor.getUnifiedName( name, true );
		this.ASSET_URL = Bun.ASSET_URL;
		this.AJAX_URL = Bun.AJAX_URL;
	}



	/**
	 * Get unified template name
	 * 
	 * @since 0.9.3
	 * 
	 * @param {string} name
	 * @param {boolean} doPrependNamespace
	 * 
	 * @return {string}
	 */
	static getUnifiedName( name, doPrependNamespace = false ) {
		if ( name.substr( 0, ( this.NAMESPACE + '/' ).length ) === this.NAMESPACE + '/' ) name = name.substr( ( this.NAMESPACE + '/' ).length );
		if ( name.substr( -1 ) === '/' ) name += this.getFileDefault();
		
		if ( doPrependNamespace ) name = this.NAMESPACE + '/' + name;

		return name;
	}

	/**
	 * Set / Get file default
	 *
	 * @since 0.9.3
	 *
	 * @param {string} fileDefault
	 *
	 * @return {void}
	 */
	static setFileDefaut( fileDefault ) {
		if ( ! fileDefault || typeof fileDefault !== 'string' ) return;
		this._templateFileDefault = fileDefault;
	}

	static getFileDefault() {
		return this._templateFileDefault;
	}



	/**
	 * Get available partials
	 *
	 * @since 0.6
	 *
	 * @return {object}
	 */
	static getPartials() {
		let partials = {};
		const templates = document.querySelectorAll( 'template[id]:not( template[id=""] )' );
		
		for ( const template of templates ) {
			let templateID = template.getAttribute( 'id' );

			/* Replace namespace */
			templateID = this.getUnifiedName( templateID );

			/* Markup */
			const markup = template.innerHTML.replace( /&gt;/g, '>' );
			partials[ templateID ] = markup;
			partials[ templateID.replace( /\/Default$/, '/' ) ] = markup;
		}

		return partials;
	}

	/**
	 * Replace '>' (output) function
	 * 
	 * @since 0.9.4
	 * 
	 * @param {object} data
	 * 
	 * @return {object}
	 */
	static replaceOutputFunction( data ) {
		for ( const key in data ) {

			if ( key === '>' && data._templateName ) {
				const markup = '{{> ' + data._templateName + ' }}';
				const partials = this.getPartials();
				data[ key ] = Mustache.render( markup, data, partials );

				continue;
			}

			const value = data[ key ];
			if ( ! value || ! [ 'array', 'object' ].includes( typeof value ) ) continue;
			data[ key ] = this.replaceOutputFunction( value );
		}



		/* > */
		return data;
	}



	/**
	 * Get uncompiled raw template as {string}
	 *
	 * @since 0.9
	 *
	 * @return {string}
	 */
	getStringRaw() {
		if ( ! this._templateName || typeof this._templateName !== 'string' ) return '';
		const template = document.querySelector( 'template[id="' + this._templateName + '"]' );
		const markup = template ? template.innerHTML.replace( /&gt;/g, '>' ) : ''

		return markup;
	}

	/**
	 * Get raw template
	 *
	 * @since 0.9.3		Returns DocumentFragment instead of DOMNode
	 * @since 0.9		Returns DOMNode instead of {string}
	 * @since 0.6
	 *
	 * @return {object}
	 */
	getRaw() {
		const markup = this.getStringRaw();
		const tmp = document.createElement( 'template' );

		tmp.innerHTML = markup;
		const fragment = tmp.content;



		/* > */
		return fragment;
	}

	/**
	 * Get compiled template as {string}
	 *
	 * @since 0.9	Renamed to "get_string"; Always include object itself (for default values)
	 * @since 0.6
	 *
	 * @param {object} data
	 *
	 * @return {string}
	 */
	getString( data ) {
		data = { ...this, ...data };
		data = this.constructor.replaceOutputFunction( data );

		const markup = this.getStringRaw();
		const partials = this.constructor.getPartials();



		/* > */
		return Mustache.render( markup, data, partials );
	}

	/**
	 * Get compiled template
	 *
	 * @since 0.9.3		Returns DocumentFragment instead of DOMNode
	 * @since 0.9		Returns DOMNode instead of {string}
	 * @since 0.6
	 *
	 * @param {object} data
	 *
	 * @return {object}
	 */
	get( data ) {
		let markup = this.getString( data );
		let tmp = document.createElement( 'template' );

		tmp.innerHTML = markup;
		let fragment = tmp.content;



		/* > */
		return fragment;
	}
}



Bun.Helper.Template._templateFileDefault = 'Default';
Bun.Helper.Template.NAME_SC = Bun.NAME_SC;
Bun.Helper.Template.NAMESPACE = Bun.NAMESPACE;