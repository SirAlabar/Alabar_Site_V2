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
        
        // Create a container for all game entities
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);
    }
    
    // Initializes game systems and managers
    initializeSystems() 
    {
        // Connect to existing managers where possible
        if (window.sceneManager) 
        {
            console.log("Connected to existing SceneManager");
            this.sceneManager = window.sceneManager;
        }
        
        if (window.assetManager) 
        {
            console.log("Connected to existing AssetManager");
            this.assetManager = window.assetManager;
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
        // Adicionar um fundo com transparência
        const background = new PIXI.Graphics();
        background.beginFill(0xFF0000, 0.15); // Cor azul céu com 50% de transparência
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.worldContainer.addChild(background);
        
        // O resto do seu código para os gráficos de debug
        const graphics = new PIXI.Graphics();
        
        
        // Add to stage
        this.worldContainer.addChild(graphics);
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
    }
    
    // Creates player entity
    createPlayer() 
    {
        console.log("Player creation placeholder");
        // Will implement actual player creation later
    }
    
    // Creates enemy entity
    createEnemy(type, x, y) 
    {
        console.log(`Enemy creation placeholder for ${type}`);
        // Will implement actual enemy creation later
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