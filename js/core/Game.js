/**
 * Main game class that handles the game loop, entity management and rendering
 * Central controller for the game simulation
 */
class Game 
{
    constructor(canvasContainer) 
    {
        console.log("Game constructor called");
        
        // Store reference to container
        this.canvasContainer = canvasContainer;
        
        // Make sure PIXI is defined
        if (typeof PIXI === 'undefined') 
        {
            console.error("PIXI is not defined! Make sure Pixi.js is loaded.");
            this.showErrorMessage("PIXI is not defined");
            return;
        }
        
        this.initialize();
    }
    
    async initialize() 
    {
        try 
        {
            // Initialize PIXI application
            await this.initializePixiApp();
            
            // Set up game properties
            this.entities = [];
            this.player = null;
            this.isRunning = false;
            
            // Initialize systems and managers
            this.initializeSystems();
            
            // Start the game loop
            this.startGameLoop();
        } 
        catch (error) 
        {
            console.error("Error initializing game:", error);
            this.showErrorMessage(error.message);
        }
    }

    // Creates the PIXI application
    async initializePixiApp()
    {
        // Create PIXI application (v8 style)
        this.app = new PIXI.Application();
        
        // Initialize it asynchronously
        await this.app.init({
            width: this.canvasContainer.clientWidth || window.innerWidth,
            height: this.canvasContainer.clientHeight || window.innerHeight,
            backgroundColor: 0x000000,
            backgroundAlpha: 0,
            antialias: true
        });
        
        // Add the canvas to the container
        this.canvasContainer.appendChild(this.app.canvas);
        console.log("PIXI canvas created and appended to container");
        
        // Create render groups for better organization and performance
        this.createRenderGroups();
    }
    
    // Creates render groups to separate background and gameplay elements
    createRenderGroups()
    {
        // Create a background group for parallax layers
        this.backgroundGroup = new PIXI.Container();
        this.backgroundGroup.name = "backgroundGroup";
        
        // Create a gameplay group for game entities (player, monsters, etc.)
        this.gameplayGroup = new PIXI.Container();
        this.gameplayGroup.name = "gameplayGroup";
        
        // Create a UI group for HUD elements
        this.uiGroup = new PIXI.Container();
        this.uiGroup.name = "uiGroup";
        
        // Add all groups to the stage in the correct order
        this.app.stage.addChild(this.backgroundGroup);
        this.app.stage.addChild(this.gameplayGroup);
        this.app.stage.addChild(this.uiGroup);
        
        console.log("Render groups created for background, gameplay, and UI");
    }
    
    // Initializes game systems and managers
    initializeSystems() 
    {
        // Connect to existing managers where possible
        if (window.sceneManager) 
        {
            console.log("Connected to existing SceneManager");
            this.sceneManager = window.sceneManager;
            
            // Update SceneManager with the new render group
            if (typeof this.sceneManager.setBackgroundGroup === 'function') {
                this.sceneManager.setBackgroundGroup(this.backgroundGroup, this.app);
            } else {
                console.warn("SceneManager doesn't support setBackgroundGroup - needs updating");
            }
        }
        
        if (window.assetManager) 
        {
            console.log("Connected to existing AssetManager");
            this.assetManager = window.assetManager;
        }
        
        // Create game area manager to handle boundaries
        if (window.GameAreaManager) {
            this.gameAreaManager = new GameAreaManager(this);
            console.log("GameAreaManager created");
        }
        
        // Create input manager for game controls
        if (window.InputManager) {
            this.inputManager = new InputManager(this);
            console.log("InputManager created");
        }
        
        // Add a simple debug graphic to confirm rendering is working
        this.addDebugGraphic();
    }
    
    // Adds debug graphics to verify rendering
    addDebugGraphic() 
    {
        // Add a transparent background to the gameplay area
        const background = new PIXI.Graphics();
        background.beginFill(0xFF0000, 0.15); // Red color with 15% transparency
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.gameplayGroup.addChild(background);
        
        // Add a grid pattern to show the gameplay boundaries
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xFFFFFF, 0.3);
        
        // Draw vertical lines
        for (let x = 0; x < this.app.screen.width; x += 100) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.app.screen.height);
        }
        
        // Draw horizontal lines
        for (let y = 0; y < this.app.screen.height; y += 100) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.app.screen.width, y);
        }
        
        // Add to gameplay group
        this.gameplayGroup.addChild(graphics);
        console.log("Debug graphics added to confirm rendering");
    }
    
    // Starts the game loop
    startGameLoop() 
    {
        this.isRunning = true;
        this.app.ticker.add((delta) => this.update(delta));
        console.log("Game loop started");
    }
    
    // Called every frame by the ticker
    update(deltaTime) 
    {
        // Update all entities
        for (const entity of this.entities) 
        {
            if (entity.update) 
            {
                entity.update(deltaTime);
            }
        }
        
        // Handle input
        if (this.inputManager) 
        {
            this.inputManager.update(deltaTime);
        }
    }
    
    // Called when window is resized
    onResize(bounds) 
    {
        // Handle any game-specific resize logic
        console.log(`Game area resized to ${bounds.width}x${bounds.height}`);
        
        // Resize the renderer
        if (this.app && this.app.renderer) {
            this.app.renderer.resize(bounds.width, bounds.height);
        }
        
        // Update background group position and scale if needed
        if (this.backgroundGroup) {
            // Scale could be adjusted based on screen size
            // this.backgroundGroup.scale.set(newScale);
        }
        
        // Update gameplay group position
        if (this.gameplayGroup) {
            // Any gameplay-specific adjustments
        }
    }
    
    // Creates player entity
    createPlayer() 
    {
        console.log("Player creation placeholder");
        // Will implement actual player creation later
        // Player sprite will be added to gameplayGroup
    }
    
    // Creates enemy entity
    createEnemy(type, x, y) 
    {
        console.log(`Enemy creation placeholder for ${type}`);
        // Will implement actual enemy creation later
        // Enemy sprites will be added to gameplayGroup
    }
    
    // Shows error message when initialization fails
    showErrorMessage(message) 
    {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.textContent = 'Failed to initialize game: ' + message;
        this.canvasContainer.appendChild(errorDiv);
    }
    
    // Cleans up resources when the game is destroyed
    destroy() 
    {
        this.isRunning = false;
        if (this.app) {
            this.app.ticker.remove(this.update, this);
            this.app.destroy(true);
        }
        console.log("Game destroyed and resources cleaned up");
    }
}

// Make Game globally available
window.Game = Game;