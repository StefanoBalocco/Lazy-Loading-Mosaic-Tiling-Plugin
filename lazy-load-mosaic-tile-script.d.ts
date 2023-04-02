declare namespace MosaicTiling {
    type LayoutOptions = {
        container: string;
        masonryColumn: string;
        masonryImgDiv: string;
        masonryImg: string;
        columns: number;
        mobileColumns: number;
        smallCutoff: number;
        imagesArray: string[];
        lazyLoading: boolean;
        lazyLoadingClass: string;
    };
    class Layout {
        private _options;
        private _container;
        private _resizeCheckSM;
        private _resizeCheckLG;
        constructor(options: LayoutOptions);
        private resizeChecker;
        private lazyLoadChecker;
        private isScrolledIntoView;
        loadImages(): void;
        initiate(): void;
    }
    export function Create(options?: LayoutOptions): Layout;
    export {};
}
