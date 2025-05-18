/**
* LoadingManager - Manages the asset loading process and initialization
* Coordinates between LoadingUI, AssetManager and GameInitializer
*/
import { LoadingUI } from './LoadingUI.js';
import { GameInitializer } from './GameInitializer.js';
import { createAssetManager } from '../manager/AssetManager.js';
import { initSceneManager, getSceneManager } from '../manager/SceneManager.js';
import { CloudsManager } from '../manager/CloudsManager.js';
import { CursorEffectComponent } from '../components/CursorEffectsComponent.js';

export class LoadingManager 
{
   constructor() 
   {
	   // Create visual UI component
	   this.ui = new LoadingUI();
	   
	   // Flag to track completion
	   this.isComplete = false;
	   
	   // Create AssetManager
	   this.assetManager = createAssetManager();
	   
	   // Set up callbacks
	   this.assetManager.onProgress = (progress) => {
		   this.ui.updateProgress(progress);
	   };
	   
	   this.assetManager.onComplete = () => {
		   this.onLoadingComplete();
	   };
   }
   
// Start loading assets
   start() 
   {
		this.assetManager.loadAllAssets();
   }
   
   // Handle loading completion
   onLoadingComplete() 
   {
	   // Mark as complete
	   this.isComplete = true;
	   
	   // Show completion visual effects
	   this.ui.showComplete().then(async () => {
		   // Initialize the site
		   await this.initSite();
		   
		   // Hide loading screen
		   this.ui.hide();
	   });
   }

   /**
	* Initialize the site after assets are loaded
	* @returns {Promise} Resolves when site is initialized
	*/
   async initSite() 
   {
	   const currentTheme = localStorage.getItem('theme') || 'light';
	   const sceneElement = document.getElementById('main-scene');
	   const gameContainer = document.getElementById('game-container');
	   
	   // Initialize PIXI application
	   const app = new PIXI.Application();
	   await app.init({
			background: 0x000000,
			backgroundAlpha: 0,
			resizeTo: sceneElement,  
			antialias: true,
			useBackBuffer: true,
			clearBeforeRender: true
	   });
	   
	   sceneElement.appendChild(app.canvas);
	   sceneElement.style.height = '200vh';
	   
	   // Create render groups
	   const { backgroundGroup, gameplayGroup, uiGroup } = this.createRenderGroups(app);
	   
	   // Initialize SceneManager
		const sceneManager = initSceneManager(this.assetManager);
		if (sceneManager) 
		{
			sceneManager.setBackgroundGroup(backgroundGroup, app);
			sceneManager.applyTheme(currentTheme);
		}
	   
	   // Initialize Game
	   const gameInitializer = new GameInitializer();
	   await gameInitializer.initialize(app, gameplayGroup, gameContainer, this.assetManager);
	   
	   // Initialize CloudsManager
		if (this.assetManager.getSpritesheet('clouds_spritesheet')) 
		{
			const cloudsManager = new CloudsManager(
				app, 
				backgroundGroup, 
				this.assetManager,
				sceneManager
			);
			cloudsManager.init(currentTheme);
		}
		else 
		{
			// Set up a retry mechanism
			const checkForSpritesheet = setInterval(() => {
				if (this.assetManager.getSpritesheet('clouds_spritesheet')) 
				{
					clearInterval(checkForSpritesheet);
					const cloudsManager = new CloudsManager(app, backgroundGroup, this.assetManager);
					sceneManager.setCloudsManager(cloudsManager);
					cloudsManager.init(currentTheme);
				}
			}, 500);
		}
			
	   // Initialize CursorEffectComponent
		const cursorEffect = new CursorEffectComponent(null, app, uiGroup, {
			particlesCount: 3,
		}, this.assetManager);
	   
	   // Handle responsive UI
	   if (window.innerWidth > 768) 
	   {
		   const navbarCollapse = document.getElementById('navbarSupportedContent');
		   const navbarToggler = document.querySelector('.navbar-toggler');
		   if (navbarCollapse && !navbarCollapse.classList.contains('show')) 
		   {
			   navbarCollapse.classList.add('show');
			   if (navbarToggler) 
			   {
				   navbarToggler.setAttribute('aria-expanded', 'true');
			   }
			   setTimeout(() => {
				   window.dispatchEvent(new Event('resize'));
			   }, 100);
		   }
	   }
   }
   
	// Creates render groups to separate background and gameplay elements
   createRenderGroups(app)
   {
	   // Create a background group for parallax layers
	   const backgroundGroup = new PIXI.Container();
	   backgroundGroup.name = "backgroundGroup";
	   backgroundGroup.zIndex = 0;
	   
	   // Create a gameplay group for game entities (player, monsters, etc.)
	   const gameplayGroup = new PIXI.Container();
	   gameplayGroup.name = "gameplayGroup";
	   gameplayGroup.zIndex = 15;

	   // Create a UI group for HUD elements
	   const uiGroup = new PIXI.Container();
	   uiGroup.name = "uiGroup";
	   uiGroup.zIndex = 999;

	   uiGroup.interactive = true;
	   uiGroup.interactiveChildren = true;
	   uiGroup.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
	   
	   // Add all groups to the stage in the correct order
	   app.stage.addChild(backgroundGroup);
	   app.stage.addChild(gameplayGroup);
	   app.stage.addChild(uiGroup);
	   
	   app.stage.sortableChildren = true;
	   app.stage.sortChildren();
	   
	   // Return the created groups for use by initSite
	   return {
		   backgroundGroup,
		   gameplayGroup,
		   uiGroup
	   };
   }
}