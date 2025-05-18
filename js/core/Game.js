/**
 * Main game class that handles the game loop, entity management and rendering
 * Central controller for the game simulation
 */
class Game 
{
    constructor() 
    {
        console.log("Game constructor called");
        
        // Set up game properties
        this.entities = [];
        this.player = null;
        this.isRunning = false;
        
        // Game is waiting for groups to be set
        this.initialized = false;
    }
    
    initializeSystems() 
    {
        // Connect to existing managers where possible
        if (window.sceneManager) 
        {
            console.log("Connected to existing SceneManager");
            this.sceneManager = window.sceneManager;
        }
        
        if (this.assetManager) 
        {
            console.log("Connected to existing AssetManager");
            this.assetManager = this.assetManager;
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

    setGameplayGroup(gameplayGroup, app, canvasContainer) 
    {
        this.gameplayGroup = gameplayGroup;
        this.app = app;
        this.canvasContainer = canvasContainer;
        
        // Now we can initialize game systems
        this.initialized = true;
        this.initializeSystems();
        
        // Start the game loop
        this.startGameLoop();
        
        return this; // Para encadeamento de métodos
    }

    addDebugGraphic() 
    {
        // Adicionar um fundo com transparência
        const background = new PIXI.Graphics();
        background.beginFill(0xFF0000, 0.15); // Cor vermelha com 15% de transparência
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.gameplayGroup.addChild(background);
        
        // Adicionar linhas de grade para mostrar os limites da área de jogo
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xFFFFFF, 0.3);
        
        // Linhas verticais
        for (let x = 0; x < this.app.screen.width; x += 100) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.app.screen.height);
        }
        
        // Linhas horizontais
        for (let y = 0; y < this.app.screen.height; y += 100) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.app.screen.width, y);
        }
        
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