/**
 * Manages the game's playable area and canvas positioning
 * Responsible for confining entities to game bounds and handling screen resizing
 */
class GameAreaManager 
{
    constructor(gameInstance) 
    {
        this.gameInstance = gameInstance;
        // Default bounds (will be updated based on screen size)
        this.bounds = {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight * 0.4, // Default to bottom 40% of screen
            bottom: window.innerHeight, // The bottom boundary
            fieldTop: window.innerHeight * 0.6 // Where fields start
        };
        
        // Initialize
        this.initialize();
        // Event listeners
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
    }
    
    initialize() 
    {
        // Update bounds based on current screen size
        this.updateBounds();
        this.updateGameContainer();
        // Configure the Pixi application to fit in the game area
        this.configurePixiApp();
    }
    
    // Updates area bounds to target the bottom half of the scene (1600px of 3200px)
    updateBounds()
    {
        // Find the scene container
        const scene = document.querySelector('.scene');
    
        if (scene) {
            // Get scene dimensions
            const sceneRect = scene.getBoundingClientRect();
            const sceneHeight = scene.clientHeight || sceneRect.height;
        
            // Calculate the middle point - exactly half of the scene height
            const middlePoint = (sceneHeight / 2);
        
            // Get current scroll position
            const scrollY = window.scrollY;
            
            // Debug position information
            console.log("Scene dimensions:", {
                totalHeight: sceneHeight,
                viewportTop: sceneRect.top,
                viewportBottom: sceneRect.bottom,
                scrollY: scrollY,
                middlePoint: middlePoint
            });
            
            // Calculate visibility
            const isTopHalfVisible = sceneRect.top < 0 && sceneRect.top > -middlePoint;
            const isBottomHalfVisible = sceneRect.bottom > 0 && sceneRect.top < window.innerHeight;
            
            // Debug visibility
            console.log("Visibility check:", {
                isTopHalfVisible: isTopHalfVisible,
                isBottomHalfVisible: isBottomHalfVisible
            });
        
            // Set bounds to target only the bottom half
            this.bounds = {
                x: 0,
                y: middlePoint,  // Start at the middle point (1600px from top)
                width: window.innerWidth,
                height: middlePoint,  // Height is also half (1600px)
                visible: isBottomHalfVisible
            };
        
            console.log("Game area set to bottom 1600px of the 3200px scene");
        } else {
            console.warn("Scene not found, using fallback values");
            // Fallback to standard 50% bottom half
            this.bounds = {
                x: 0,
                y: 1600,  // Start at 1600px
                width: window.innerWidth,
                height: 1600,  // Height is 1600px
                visible: true
            };
        }
    }

    // Applies bounds to game container element, syncing with field layers
    updateGameContainer()
    {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
    
        // Position the game container
        gameContainer.style.position = 'absolute';  // Changed from 'relative' to 'absolute'
        gameContainer.style.top = `${this.bounds.y}px`;  // Use the calculated y position
        gameContainer.style.left = '0';
        gameContainer.style.width = '100%';
        gameContainer.style.height = `${this.bounds.height}px`;  // Use calculated height
        gameContainer.style.overflow = 'hidden';
        gameContainer.style.pointerEvents = 'none';
    
        // Show/hide based on visibility of fields
        gameContainer.style.display = 'block';
    
    
        // Add a visible border for debugging
        gameContainer.style.border = '2px dashed rgba(255, 0, 0, 0.5)';
    
        // Set z-index to appear between your parallax layers
        gameContainer.style.zIndex = '25';
    
        // Debug container position
        console.log("Game container positioned:", {
            top: gameContainer.style.top,
            height: gameContainer.style.height,
            display: gameContainer.style.display,
            position: gameContainer.style.position
        });
    }

    // Configure the Pixi application to fit in the game area
    configurePixiApp() 
    {
        if (!this.gameInstance || !this.gameInstance.app)
        { 
            return;
        }
        try 
        {
            // Resize renderer to match container
            this.gameInstance.app.renderer.resize(this.bounds.width, this.bounds.height);
            
            // Position the Pixi canvas within the container
            const canvas = this.gameInstance.app.canvas;
            if (canvas) 
            {
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.pointerEvents = 'none';

                // Ensure the canvas can still receive keyboard focus for keyboard events
                canvas.setAttribute('tabindex', '0');
            }
            
            // Set up a world container in Pixi that will hold all game objects
            if (!this.gameInstance.worldContainer) 
            {
                this.gameInstance.worldContainer = new PIXI.Container();
                this.gameInstance.app.stage.addChild(this.gameInstance.worldContainer);
            }
        }
        catch (error) 
        {
            console.error("Error configuring PIXI app:", error);
        }
    }
    

    // Constrains a position to stay within bounds
    constrainToArea(position, entityWidth, entityHeight) 
    {
        const halfWidth = entityWidth / 2;
        const halfHeight = entityHeight / 2;
        
        return {
            x: Math.max(halfWidth, Math.min(this.bounds.width - halfWidth, position.x)),
            y: Math.max(halfHeight, Math.min(this.bounds.height - halfHeight, position.y))
        };
    }
    
    // Handle window resize events
    onResize() 
    {
        this.updateBounds();
        this.updateGameContainer();
        
        // Update the Pixi renderer
        if (this.gameInstance && this.gameInstance.app) 
        {
            try 
            {
                this.gameInstance.app.renderer.resize(this.bounds.width, this.bounds.height);
            } 
            catch (error) 
            {
                console.error("Error resizing PIXI renderer:", error);
            }
        }
        
        // Notify game of resize
        if (this.gameInstance && this.gameInstance.onResize) 
        {
            this.gameInstance.onResize(this.bounds);
        }
    }

    // Handle scroll events - update position to stay with fields
    onScroll() 
    {
        // this.updateBounds();
        // this.updateGameContainer();
    }
}

// Make GameAreaManager globally available
window.GameAreaManager = GameAreaManager;