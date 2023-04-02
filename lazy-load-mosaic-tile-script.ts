'use strict';

namespace MosaicTiling {
	type LayoutOptions = {
		container: string,
		masonryColumn: string,
		masonryImgDiv: string,
		masonryImg: string,
		columns: number,
		mobileColumns: number,
		smallCutoff: number,
		imagesArray: string[],
		lazyLoading: boolean
		lazyLoadingClass: string
	};

	class Layout {
		private _options: LayoutOptions;
		private _container: ( HTMLElement | null ) = null;
		private _resizeCheckSM: boolean = false;
		private _resizeCheckLG: boolean = true;

		constructor( options: LayoutOptions ) {
			this._options = options;
			this._container = document.getElementById( options.container );
		}

		private resizeChecker() {
			if( !this._resizeCheckSM && ( window.innerWidth < this._options.smallCutoff ) ) {
				this.loadImages();
				scrollTo( 0, 1 );
				this._resizeCheckSM = true;
				this._resizeCheckLG = false;
			} else if( !this._resizeCheckLG && ( window.innerWidth > this._options.smallCutoff ) ) {
				this.loadImages();
				scrollTo( 0, 1 );
				this._resizeCheckSM = false;
				this._resizeCheckLG = true;
			}
		}

		private lazyLoadChecker() {
			let images: HTMLCollectionOf<HTMLImageElement> = <HTMLCollectionOf<HTMLImageElement>>document.getElementsByClassName( this._options.masonryImg + ' ' + this._options.lazyLoadingClass );

			for( let i = 0; i < images.length; i++ ) {
				if( this.isScrolledIntoView( images[i] ) ) {
					const dataSrc = images[i].getAttribute( 'data-src' );
					images[i].src = dataSrc ?? '';
					// images[i].src = images[i].getAttribute('data-src');
					// images[i].classList.remove('lazy');
				}
			}
		}

		private isScrolledIntoView( element: HTMLElement ) {
			const rect = element.getBoundingClientRect();
			return (
				( rect.top >= 0 && rect.top <= ( window.innerHeight || document.documentElement.clientHeight ) ) ||
				( rect.bottom >= 0 && rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) )
			);
		}

		public loadImages() {
			if( null !== this._container ) {
				//  clear masonry container out, in case we're resizing...
				this._container.innerHTML = '';
				let columnCount = this._options.columns;

				//  change column count if the screen is too small
				if( window.innerWidth < this._options.smallCutoff ) {
					this._resizeCheckSM = true;
					this._resizeCheckLG = false;
					columnCount = this._options.mobileColumns;
				}

				// creates divs for the amount of columns specified, and adds them into an array.
				for( let i = 0; i < columnCount; i++ ) {
					//  creates a div
					const columnDiv = document.createElement( 'div' );
					//  sets the width for the div
					columnDiv.style.width = ( 100 / columnCount ) + '%';
					//  sets the class for the div
					columnDiv.setAttribute( 'class', this._options.masonryColumn );
					//  adds the div into the container
					this._container.appendChild( columnDiv );
				}

				//  places the images into each column
				for( let i = 0; i < this._options.imagesArray.length; i++ ) {
					//  grabs the column number for the image
					const colNum = i % columnCount;

					//  creates an img element
					const img = document.createElement( 'img' );
					img.src = this._options.lazyLoading == true ? "client-loader.gif" : this._options.imagesArray[i];
					img.setAttribute( 'data-src', this._options.imagesArray[i] );
					img.setAttribute( 'class', this._options.masonryImg + ' ' + this._options.lazyLoadingClass );

					if( colNum == 5 ) {
						img.classList.add( 'sixth' );
					}

					//  creates a div for the img element and places it inside
					const imgDiv = document.createElement( 'div' );
					imgDiv.setAttribute( 'class', this._options.masonryImgDiv );
					imgDiv.appendChild( img );

					//  appends the img div element to the column it belongs in
					document.getElementsByClassName( this._options.masonryColumn )[colNum].appendChild( imgDiv )
				}
				window.addEventListener( 'resize', () => { this.resizeChecker(); } );
				window.addEventListener( 'scroll', () => { this.lazyLoadChecker(); } );
				this.lazyLoadChecker();
			}
		}

		public initiate() {
			window.addEventListener( 'load', () => { this.loadImages(); } );
		}
	}

	export function Create( options?: LayoutOptions ): Layout {
		const defaultOptions: LayoutOptions = {
			container: "masonryContainer",
			masonryColumn: "masonryColumn",
			masonryImgDiv: "masonryImgDiv",
			masonryImg: "masonryImg",
			columns: 6,
			mobileColumns: 3,
			smallCutoff: 800,
			imagesArray: [],
			lazyLoading: false,
			lazyLoadingClass: 'lazy'
		};
		return new Layout( { ...defaultOptions, ...options } );
	}
}