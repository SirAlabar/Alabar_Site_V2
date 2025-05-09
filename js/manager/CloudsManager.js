/**
 * CloudsManager.js
 * Manages the creation and animation of clouds in the scene using PIXI
 */

class CloudsManager 
{
    constructor(app, backgroundGroup) 
    {
        // Store PIXI references
        this.app = app;
        this.backgroundGroup = backgroundGroup;
        
        // Cloud settings
        this.config = {
            minClouds: 8,
            maxClouds: 15,
            minDistance: 100,
            speed: 0.5,
            minScale: 0.6,
            maxScale: 2.2
        };
        
        // Cloud textures will be stored here
        this.cloudTextures = [];
        this.cloudSprites = [];
        
        this.initialized = false;
        this.initInProgress = false;
        this.cloudContainer = null;
        
        // Debug mode - set to false in production
        this.debug = false;
    }
    
    /**
     * Initialize cloud system
     * @param {string} theme - Current theme ('light' or 'dark')
     */
    init(theme) 
    {
        // Prevent multiple simultaneous initialization attempts
        if (this.initInProgress) 
        {
            return;
        }
        
        // Skip cloud creation in dark theme
        if (theme === 'dark') 
        {
            console.log("Skipping clouds for dark theme");
            this.hideAllClouds();
            return;
        }
        
        this.initInProgress = true;
        
        if (this.debug) console.log("CloudsManager initializing...");
        
        // Load cloud textures
        this.loadCloudTextures().then(() => {
            // Create cloud container if it doesn't exist
            this.ensureCloudContainer();
            
            // Create clouds
            this.refreshClouds();
            
            this.initialized = true;
            this.initInProgress = false;
            
            if (this.debug) console.log("CloudsManager initialization complete with", this.cloudSprites.length, "clouds");
        });
    }
    
    /**
     * Hide all cloud sprites when switching to dark theme
     */
    hideAllClouds() 
    {
        if (this.cloudContainer) {
            this.cloudContainer.visible = false;
            if (this.debug) console.log("Clouds hidden for dark theme");
        }
    }
    
    /**
     * Load cloud textures from AssetManager
     */
    async loadCloudTextures() 
    {
        // Skip if already loaded
        if (this.cloudTextures.length > 0) 
        {
            return;
        }
        
        if (this.debug) console.log("Loading cloud textures...");
        
        // Wait for AssetManager to be available
        if (!window.assetManager) {
            console.warn("AssetManager not available, creating fallback cloud textures");
            this.createFallbackTextures();
            return;
        }
        
        // Get cloud textures from AssetManager
        try {
            const texture = window.assetManager.getBackgroundTexture('light', 'clouds');
            if (texture) {
                // Use the texture directly
                this.cloudTextures.push(texture);
                
                if (this.debug) {
                    console.log("Cloud texture details:", {
                        width: texture.width,
                        height: texture.height,
                        valid: texture.valid,
                        baseTexture: !!texture.baseTexture
                    });
                }
            } else {
                console.warn("Cloud texture not found, using fallback");
                this.createFallbackTextures();
            }
        } catch (error) {
            console.error("Error loading cloud textures:", error);
            this.createFallbackTextures();
        }
    }
    
    /**
     * Create fallback cloud textures if none are available
     */
    createFallbackTextures() 
    {
        if (this.debug) console.log("Creating fallback cloud textures");
        
        // Create shapes that look like clouds
        for (let i = 0; i < 4; i++) {
            const cloudGraphic = new PIXI.Graphics();
            cloudGraphic.beginFill(0xFFFFFF, 0.8);
            
            // Draw a cloud-like shape
            const x = 0, y = 0;
            const radiusX = 50 + i * 10;
            const radiusY = 25 + i * 5;
            
            // Draw multiple overlapping circles for cloud effect
            cloudGraphic.drawEllipse(x, y, radiusX, radiusY);
            cloudGraphic.drawEllipse(x + 30, y - 10, radiusX * 0.7, radiusY * 0.7);
            cloudGraphic.drawEllipse(x - 30, y - 5, radiusX * 0.6, radiusY * 0.6);
            cloudGraphic.drawEllipse(x + 10, y + 10, radiusX * 0.8, radiusY * 0.5);
            
            cloudGraphic.endFill();
            
            // Generate texture from graphics
            try {
                const texture = this.app.renderer.generateTexture(cloudGraphic);
                this.cloudTextures.push(texture);
            } catch (err) {
                console.error("Failed to generate cloud texture:", err);
            }
        }
        
        if (this.debug) console.log(`Created ${this.cloudTextures.length} fallback cloud textures`);
    }
    
    /**
     * Ensure the cloud container exists
     */
    ensureCloudContainer() 
    {
        // Find existing clouds layer in backgroundGroup
        if (this.backgroundGroup) {
            for (let i = 0; i < this.backgroundGroup.children.length; i++) {
                const child = this.backgroundGroup.children[i];
                if (child.name === 'clouds') {
                    this.cloudContainer = child;
                    if (this.debug) console.log("Found existing clouds layer in backgroundGroup");
                    break;
                }
            }
        }
        
        // If not found, create a new container
        if (!this.cloudContainer) {
            this.cloudContainer = new PIXI.Container();
            this.cloudContainer.name = "clouds";
            this.cloudContainer.zIndex = 25;
            
            // Add to background group or stage
            if (this.backgroundGroup) {
                this.backgroundGroup.addChild(this.cloudContainer);
            } else if (this.app && this.app.stage) {
                this.app.stage.addChild(this.cloudContainer);
            }
            
            if (this.debug) console.log("Created new cloud container");
        }
        
        // Clear any existing clouds
        this.cloudContainer.removeChildren();
        this.cloudSprites = [];
        
        // Ensure visibility
        this.cloudContainer.visible = true;
        this.cloudContainer.alpha = 1;
    }
    
    /**
     * Refresh all cloud sprites
     */
    refreshClouds() 
    {
        if (!this.cloudContainer) {
            this.ensureCloudContainer();
        }
        
        // Clear existing clouds
        this.cloudContainer.removeChildren();
        this.cloudSprites = [];
        
        const cloudCount = this.config.minClouds + 
            Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
        
        if (this.debug) console.log(`Creating ${cloudCount} clouds`);
        
        // Create clouds with different animation types
        const animationTypes = ['leftToRight', 'rightToLeft', 'diagonal', 'float'];
        
        for (let i = 0; i < cloudCount; i++) {
            // Distribute animation types
            const animType = animationTypes[i % animationTypes.length];
            this.createSingleCloud(i, animType);
        }
        
        // Setup animation loop
        if (!this.animationLoopActive) {
            this.setupCloudAnimations();
            this.animationLoopActive = true;
        }
        
        if (this.debug) console.log(`Created ${this.cloudSprites.length} cloud sprites`);
    }
    
    /**
     * Create a single cloud sprite
     * @param {number} index - The cloud index
     * @param {string} animationType - Type of animation for this cloud
     */
    createSingleCloud(index, animationType = 'leftToRight') 
    {
        if (this.cloudTextures.length === 0) {
            console.warn("No cloud textures available");
            return;
        }
        
        // Use the first texture for all clouds to avoid issues
        const texture = this.cloudTextures[0];
        
        // Create cloud sprite
        const cloud = new PIXI.Sprite(texture);
        cloud.name = `cloud-${index}`;
        
        // Set anchor to center
        cloud.anchor.set(0.5, 0.5);
        
        // Random scale - slightly larger
        const scale = 1.0 + Math.random() * 1.0; // Scale between 1.0 and 2.0
        cloud.scale.set(scale);
        
        // Set full opacity 
        cloud.alpha = 1.0; // Use full opacity for all clouds
        
        // Screen dimensions
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height * 0.55; // Top 55% for clouds
        
        // Position based on animation type or index
        let x, y;
        let vx = 0, vy = 0;
        
        // First 3 clouds positioned at visible spots
        if (index < 3) {
            // Place these clouds at visible locations
            const columnPosition = (index + 1) / 4; // 0.25, 0.5, 0.75
            x = screenWidth * columnPosition;
            y = screenHeight * 0.25; // 25% down from top
            vx = this.config.speed * 0.5; // Slow, steady movement
            animationType = 'leftToRight'; // Override with predictable animation
        } else {
            // Rest use normal positioning logic
            switch (animationType) {
                case 'leftToRight':
                    x = -100 - Math.random() * 200; // Start left off-screen
                    y = Math.random() * screenHeight * 0.8;
                    vx = this.config.speed * (0.5 + Math.random() * 0.5);
                    break;
                    
                case 'rightToLeft':
                    x = screenWidth + 100 + Math.random() * 200; // Start right off-screen
                    y = Math.random() * screenHeight * 0.8;
                    vx = -this.config.speed * (0.5 + Math.random() * 0.5);
                    break;
                    
                case 'diagonal':
                    x = -100 - Math.random() * 200; // Start left off-screen
                    y = screenHeight - Math.random() * 100;
                    vx = this.config.speed * (0.3 + Math.random() * 0.3);
                    vy = -this.config.speed * (0.1 + Math.random() * 0.2);
                    break;
                    
                case 'float':
                    x = Math.random() * screenWidth;
                    y = Math.random() * screenHeight * 0.7;
                    vx = this.config.speed * 0.1 * (Math.random() * 2 - 1); // Small random x movement
                    cloud.floatPhase = Math.random() * Math.PI * 2; // Random starting phase
                    cloud.floatSpeed = 0.02 + Math.random() * 0.03; // Random float speed
                    cloud.floatAmplitude = 2 + Math.random() * 3; // Random float amplitude
                    break;
                    
                default:
                    x = Math.random() * screenWidth;
                    y = Math.random() * screenHeight * 0.7;
                    vx = this.config.speed * (Math.random() * 0.4 - 0.2);
            }
        }
        
        // Set position
        cloud.position.set(x, y);
        
        // Add animation data
        cloud.vx = vx;
        cloud.vy = vy || 0;
        cloud.animationType = animationType;
        
        // Add to container and track in array
        this.cloudContainer.addChild(cloud);
        this.cloudSprites.push(cloud);
        
        return cloud;
    }
    
    /**
     * Setup cloud animation ticker
     */
    setupCloudAnimations() 
    {
        // Define the ticker function
        const tickerFunction = (delta) => {
            // Skip if container was removed
            if (!this.cloudContainer || !this.cloudContainer.parent) {
                return;
            }
            
            // Reference values
            const screenWidth = this.app.screen.width;
            const screenHeight = this.app.screen.height;
            
            // Animate each cloud
            for (let i = 0; i < this.cloudSprites.length; i++) {
                const cloud = this.cloudSprites[i];
                
                if (!cloud || !cloud.parent) continue;
                
                // Move cloud based on animation type
                switch (cloud.animationType) {
                    case 'leftToRight':
                    case 'rightToLeft':
                    case 'diagonal':
                        // Standard movement with velocity
                        cloud.x += cloud.vx * delta;
                        cloud.y += cloud.vy * delta;
                        break;
                        
                    case 'float':
                        // Floating effect with sine wave
                        cloud.floatPhase += cloud.floatSpeed * delta;
                        cloud.y += Math.sin(cloud.floatPhase) * cloud.floatAmplitude * 0.1 * delta;
                        cloud.x += cloud.vx * delta;
                        break;
                }
                
                // Check if cloud is far off-screen
                const cloudBounds = cloud.getBounds();
                const isOffLeft = cloudBounds.right < -200;
                const isOffRight = cloudBounds.left > screenWidth + 200;
                const isOffTop = cloudBounds.bottom < -200;
                const isOffBottom = cloudBounds.top > screenHeight + 200;
                
                if (isOffLeft || isOffRight || isOffTop || isOffBottom) {
                    // Special handling for clouds moving out of view
                    if (cloud.animationType === 'leftToRight' && isOffRight) {
                        // Reset to left side
                        cloud.x = -100 - Math.random() * 200;
                        cloud.y = Math.random() * screenHeight * 0.7;
                    } 
                    else if (cloud.animationType === 'rightToLeft' && isOffLeft) {
                        // Reset to right side
                        cloud.x = screenWidth + 100 + Math.random() * 200;
                        cloud.y = Math.random() * screenHeight * 0.7;
                    }
                    else if (cloud.animationType === 'diagonal' && (isOffRight || isOffTop)) {
                        // Reset diagonal
                        cloud.x = -100 - Math.random() * 200;
                        cloud.y = screenHeight - Math.random() * 100;
                    }
                    else if (cloud.animationType === 'float' && (isOffLeft || isOffRight)) {
                        // Keep in bounds
                        if (isOffLeft) cloud.x = screenWidth + 50;
                        if (isOffRight) cloud.x = -50;
                    }
                    else {
                        // Remove and replace any other clouds that go off-screen
                        this.cloudContainer.removeChild(cloud);
                        this.cloudSprites.splice(i, 1);
                        i--;
                        
                        // Create a new cloud to replace it
                        const animTypes = ['leftToRight', 'rightToLeft', 'diagonal', 'float'];
                        const animType = animTypes[Math.floor(Math.random() * animTypes.length)];
                        this.createSingleCloud(Date.now(), animType);
                    }
                }
            }
        };
        
        // Add the ticker function
        if (this.app && this.app.ticker) {
            this.app.ticker.add(tickerFunction);
            if (this.debug) console.log("Cloud animation ticker started");
        } else {
            console.warn("No PIXI ticker available for cloud animations");
        }
    }
}

// Make CloudsManager globally available
window.CloudsManager = CloudsManager;