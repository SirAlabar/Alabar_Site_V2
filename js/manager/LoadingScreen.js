/**
 * Loading Scren with Magical Sword Effect
 *  Display animation while assets are loaded by AssetsManager
 */

class LoadingScreen
{
    constructor()
    {
        //Pixi Application
        this.app = null;
        this.particleContainer = null;
        this.particles = [];
        this.swordOutline = null;
        this.maxParticles = 150;

        //Loading state
        this.progress = 0;
        this.completed = false;

        //DOM Elements
        this.loadingBar = document.getElementById('loading-bar');
        this.loaingText = document.getElementById('loagind-text');
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.querySelector('.main-content');

        this.init();
    }

    init()
    {
        // Initialize Pixi Application
        this.initPixiApp();
        // Create sword and particles
        this.creteScene();
        // Start animation loop
        this.app.ticker.add(this.update.bind(this));
        // Ask AssetManager to load assets and report progress
        this.startLoading();
    }

    initPixiApp()
    {
        this.app = new this.initPixiApp.Application({
            view: document.getElementById('loading-canvas'),
            width: windown.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio || 1
        });

        window.addEventListener('resize', () =>{
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            // Reposition sword in center
            if (this.swordOutline) 
            {
                this.swordOutline.x = this.app.screen.width / 2;
                this.swordOutline.y = this.app.screen.height / 2;
            }
        })
    }



    
}