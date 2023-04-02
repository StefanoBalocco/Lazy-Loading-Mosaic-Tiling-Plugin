'use strict';
var MosaicTiling;
(function (MosaicTiling) {
    class Layout {
        constructor(options) {
            this._container = null;
            this._resizeCheckSM = false;
            this._resizeCheckLG = true;
            this._options = options;
            this._container = document.getElementById(options.container);
        }
        resizeChecker() {
            if (!this._resizeCheckSM && (window.innerWidth < this._options.smallCutoff)) {
                this.loadImages();
                scrollTo(0, 1);
                this._resizeCheckSM = true;
                this._resizeCheckLG = false;
            }
            else if (!this._resizeCheckLG && (window.innerWidth > this._options.smallCutoff)) {
                this.loadImages();
                scrollTo(0, 1);
                this._resizeCheckSM = false;
                this._resizeCheckLG = true;
            }
        }
        lazyLoadChecker() {
            let images = document.getElementsByClassName(this._options.masonryImg + ' ' + this._options.lazyLoadingClass);
            for (let i = 0; i < images.length; i++) {
                if (this.isScrolledIntoView(images[i])) {
                    const dataSrc = images[i].getAttribute('data-src');
                    images[i].src = dataSrc !== null && dataSrc !== void 0 ? dataSrc : '';
                }
            }
        }
        isScrolledIntoView(element) {
            const rect = element.getBoundingClientRect();
            return ((rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
                (rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)));
        }
        loadImages() {
            if (null !== this._container) {
                this._container.innerHTML = '';
                let columnCount = this._options.columns;
                if (window.innerWidth < this._options.smallCutoff) {
                    this._resizeCheckSM = true;
                    this._resizeCheckLG = false;
                    columnCount = this._options.mobileColumns;
                }
                for (let i = 0; i < columnCount; i++) {
                    const columnDiv = document.createElement('div');
                    columnDiv.style.width = (100 / columnCount) + '%';
                    columnDiv.setAttribute('class', this._options.masonryColumn);
                    this._container.appendChild(columnDiv);
                }
                for (let i = 0; i < this._options.imagesArray.length; i++) {
                    const colNum = i % columnCount;
                    const img = document.createElement('img');
                    img.src = this._options.lazyLoading == true ? "client-loader.gif" : this._options.imagesArray[i];
                    img.setAttribute('data-src', this._options.imagesArray[i]);
                    img.setAttribute('class', this._options.masonryImg + ' ' + this._options.lazyLoadingClass);
                    if (colNum == 5) {
                        img.classList.add('sixth');
                    }
                    const imgDiv = document.createElement('div');
                    imgDiv.setAttribute('class', this._options.masonryImgDiv);
                    imgDiv.appendChild(img);
                    document.getElementsByClassName(this._options.masonryColumn)[colNum].appendChild(imgDiv);
                }
                window.addEventListener('resize', () => { this.resizeChecker(); });
                window.addEventListener('scroll', () => { this.lazyLoadChecker(); });
                this.lazyLoadChecker();
            }
        }
        initiate() {
            window.addEventListener('load', () => { this.loadImages(); });
        }
    }
    function Create(options) {
        const defaultOptions = {
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
        return new Layout(Object.assign(Object.assign({}, defaultOptions), options));
    }
    MosaicTiling.Create = Create;
})(MosaicTiling || (MosaicTiling = {}));
