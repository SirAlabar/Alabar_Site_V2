/**
 * CloudsManager.js
 * Manages the creation and animation of clouds using PIXI.js
 */

class CloudsManager 
{
    constructor(pixiApp, backgroundGroup) 
    {
        // Store PIXI references
        this.app = pixiApp;
        this.backgroundGroup = backgroundGroup;
        
        // Get the clouds container from background group
        this.cloudsContainer = null;
        
        // Cloud settings
        this.config = {
            minClouds: 4,
            maxClouds: 11,
            minDistance: 100,
            spriteSheetColumns: 3,
            spriteSheetRows: 4,
            spriteWidth: 338,
            spriteHeight: 200
        };
        
        // Animation speed classes
        this.speedVariations = [
            { duration: 60, ease: 'linear' },   // Slow drift left to right
            { duration: 80, ease: 'linear' },   // Slow drift right to left
            { duration: 90, ease: 'linear' },   // Diagonal drift
            { duration: 25, ease: 'sine.inOut' } // Gentle float in place
        ];
        
        this.opacityVariations = [
            0.3,  // Light
            0.5,  // Medium
            0.7   // Full
        ];
        
        this.initialized = false;
        this.initInProgress = false;
        this.cloudSprites = [];
        this.cloudTextures = [];
        
        // Current theme
        this.currentTheme = 'light';
    }
    
    /**
     * Initialize clouds for PIXI rendering
     * @param {string} theme Current theme ('light' or 'dark')
     */
    init(theme) 
    {
        // Prevent multiple initialization attempts
        if (this.initInProgress) 
        {
            return;
        }
        
        // Update current theme
        this.currentTheme = theme || 'light';
        
        // Check if we have everything we need
        if (!this.app || !this.backgroundGroup) 
        {
            console.error("PIXI App and/or backgroundGroup not defined");
            return;
        }
        
        this.initInProgress = true;
        
        // Find clouds container in background group
        this.findCloudsContainer();
        
        // If already initialized, just refresh
        if (this.initialized) 
        {
            this.refreshClouds();
            this.initInProgress = false;
            return;
        }
        
        // Load cloud textures
        this.loadCloudTextures().then(() => {
            // Create initial clouds
            this.refreshClouds();
            this.startCloudLifecycle();
            
            // Set up window resize listener
            window.addEventListener('resize', this.onResize.bind(this));
            
            this.initialized = true;
            this.initInProgress = false;
        });
    }
    
    /**
     * Find or create clouds container in background group
     */
    findCloudsContainer() 
    {
        // Check if already exists in background group
        for (let i = 0; i < this.backgroundGroup.children.length; i++) 
        {
            const child = this.backgroundGroup.children[i];
            if (child.name === 'clouds') 
            {
                this.cloudsContainer = child;
                return;
            }
        }
        
        // Not found, check if it should be created based on theme
        if (this.currentTheme === 'dark') 
        {
            console.log("Dark theme active, no clouds container needed");
            return;
        }
        
        // Create a new container for clouds
        console.log("Creating new cloud container in background group");
        this.cloudsContainer = new PIXI.Container();
        this.cloudsContainer.name = 'clouds';
        this.cloudsContainer.parallaxSpeed = 0.02; // Same as in SceneManager.js
        this.backgroundGroup.addChild(this.cloudsContainer);
    }
    
    /**
     * Load and prepare cloud textures from sprite sheet
     */
    async loadCloudTextures() 
    {
        // Clear previous textures
        this.cloudTextures = [];
        
        try 
        {
            // Get the base texture
            const baseTexture = await PIXI.Assets.load('./assets/images/background/light/clouds.webp');
            
            // Create frame textures from the sprite sheet
            const sheetWidth = 1024; // Total width of sprite sheet
            const sheetHeight = 800; // Total height of sprite sheet
            
            // Loop through the sprite sheet grid
            for (let row = 0; row < this.config.spriteSheetRows; row++) 
            {
                for (let col = 0; col < this.config.spriteSheetColumns; col++) 
                {
                    // Calculate frame rectangle
                    const frame = new PIXI.Rectangle(
                        col * this.config.spriteWidth,
                        row * this.config.spriteHeight,
                        this.config.spriteWidth,
                        this.config.spriteHeight
                    );
                    
                    // Create new texture from the base texture with this frame
                    const texture = new PIXI.Texture({
                        source: baseTexture,
                        frame: frame
                    });
                    
                    // Add to textures array
                    this.cloudTextures.push(texture);
                }
            }
            
            console.log(`Loaded ${this.cloudTextures.length} cloud textures`);
        } 
        catch (error) 
        {
            console.error("Error loading cloud textures:", error);
        }
    }
    
    /**
     * Start the cloud lifecycle management
     */
    startCloudLifecycle() 
    {
        this.cloudLifecycleInterval = setInterval(() => {
            if (this.initialized && this.currentTheme === 'light') 
            {
                this.manageCloudLifecycle();
            }
        }, 5000); // Check every 5 seconds
    }
    
    /**
     * Manage cloud lifecycle - remove offscreen clouds, add new ones
     */
    manageCloudLifecycle() 
    {
        if (!this.cloudsContainer) 
        {
            return;
        }
        
        let visibleCount = 0;
        let offscreenCount = 0;
        const toRemove = [];
        
        // Check each cloud's position and visibility
        for (let i = 0; i < this.cloudSprites.length; i++) 
        {
            const cloud = this.cloudSprites[i];
            // Skip null/undefined values
            if (!cloud) 
            {
                continue;
            }
            
            // Convert to screen coordinates
            const bounds = cloud.getBounds();
            
            // Check if cloud is completely off-screen
            if (bounds.right < -100 || bounds.left > this.app.screen.width + 100) 
            {
                // Mark for removal
                toRemove.push(i);
                offscreenCount++;
            } 
            else 
            {
                visibleCount++;
            }
        }
        
        // Remove marked clouds
        for (let i = toRemove.length - 1; i >= 0; i--) 
        {
            const index = toRemove[i];
            const cloud = this.cloudSprites[index];
            if (cloud) 
            {
                this.cloudsContainer.removeChild(cloud);
                // Remove from animations if using GSAP
                if (window.gsap && cloud.timeline) 
                {
                    cloud.timeline.kill();
                }
                cloud.destroy();
                // Remove from array
                this.cloudSprites.splice(index, 1);
            }
        }
        
        // Add new clouds if needed
        const targetCount = this.config.minClouds + 
            Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
        
        if (visibleCount < targetCount) 
        {
            const newCount = targetCount - visibleCount;
            this.addNewClouds(newCount);
        }
    }
    
    /**
     * Add new clouds to the scene
     * @param {number} count Number of clouds to add
     */
    addNewClouds(count) 
    {
        if (!this.cloudsContainer || this.cloudTextures.length === 0) 
        {
            return;
        }
        
        // Screen dimensions for distribution
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height * 0.55; // Top 55% for clouds
        
        // Track existing cloud positions to avoid overlap
        const usedPositions = [];
        
        // Get positions of existing clouds to avoid overlap
        for (let i = 0; i < this.cloudSprites.length; i++) 
        {
            const cloud = this.cloudSprites[i];
            if (cloud) 
            {
                usedPositions.push({
                    top: cloud.position.y,
                    left: cloud.position.x
                });
            }
        }
        
        // Add new clouds
        for (let i = 0; i < count; i++) 
        {
            this.createSingleCloud(screenWidth, screenHeight, usedPositions);
        }
    }
    
    /**
     * Refresh all clouds (remove all and create new ones)
     */
    refreshClouds() 
    {
        // Validate container exists
        if (!this.cloudsContainer) 
        {
            this.findCloudsContainer();
            // Still no container? Exit.
            if (!this.cloudsContainer) 
            {
                return;
            }
        }
        
        // Clear all existing clouds
        this.cloudsContainer.removeChildren();
        this.cloudSprites = [];
        
        // Only create clouds in light theme
        if (this.currentTheme === 'dark') 
        {
            return;
        }
        
        // Create initial set of clouds
        const cloudCount = this.config.minClouds + 
            Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
            
        // Screen dimensions
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height * 0.55; // Top 55% for clouds
        
        // Track used positions to avoid excessive overlap
        const usedPositions = [];
        
        // Create multiple clouds
        for (let i = 0; i < cloudCount; i++) 
        {
            this.createSingleCloud(screenWidth, screenHeight, usedPositions);
        }
    }
    
    /**
     * Create a single cloud and add it to the scene
     * @param {number} screenWidth The screen width
     * @param {number} screenHeight The height for cloud placement
     * @param {Array} usedPositions Array of existing positions to avoid
     */
    createSingleCloud(screenWidth, screenHeight, usedPositions) 
    {
        // Exit if no container or textures
        if (!this.cloudsContainer || this.cloudTextures.length === 0) 
        {
            return;
        }
        
        // Get a random cloud texture
        const randomTextureIndex = Math.floor(Math.random() * this.cloudTextures.length);
        const texture = this.cloudTextures[randomTextureIndex];
        
        // Create cloud sprite
        const cloud = new PIXI.Sprite(texture);
        cloud.anchor.set(0.5, 0.5);
        
        // Apply random size (but don't scale yet - we'll do this after positioning)
        const baseScale = 0.5 + Math.random() * 0.5;
        cloud.baseScale = baseScale; // Store for reference
        
        // Apply random final opacity
        const randomOpacity = this.opacityVariations[
            Math.floor(Math.random() * this.opacityVariations.length)
        ];
        cloud.alpha = 0; // Start invisible, will fade in
        
        // Apply blending mode
        cloud.blendMode = 'screen'; 
        
        // Find a position that's not too close to existing clouds
        let positionFound = false;
        let attempts = 0;
        let randomTop, randomLeft;
        
        while (!positionFound && attempts < 10) 
        {
            // Random vertical position (more distributed, using full vertical space)
            randomTop = Math.floor(Math.random() * (screenHeight * 0.8));
            
            // Random horizontal position
            if (this.cloudSprites.length % 2 === 0) 
            {
                // Horizontal position within visible screen area
                randomLeft = Math.floor(Math.random() * screenWidth * 0.8) + (screenWidth * 0.1);
            } 
            else 
            {
                // Random position offscreen
                randomLeft = Math.floor(Math.random() * screenWidth * 1.5) - (screenWidth * 0.25);
            }
            
            // Check if this position is far enough from existing clouds
            positionFound = true;
            for (const pos of usedPositions) 
            {
                const xDist = Math.abs(pos.left - randomLeft);
                const yDist = Math.abs(pos.top - randomTop);
                const distance = Math.sqrt(xDist*xDist + yDist*yDist);
                
                // If too close, try again
                if (distance < this.config.minDistance) 
                {
                    positionFound = false;
                    break;
                }
            }
            attempts++;
        }
        
        // Store the position
        usedPositions.push({ top: randomTop, left: randomLeft });
        
        // Ensure some clouds cover the entire width of the screen
        if (this.cloudSprites.length === 0) randomLeft = -200; // First cloud starts at the left
        if (this.cloudSprites.length === 1) randomLeft = screenWidth - 200; // Second cloud starts at the right
        
        // Position the cloud
        cloud.position.set(randomLeft, randomTop);
        
        // Now apply scale - check if parent container has a scale we should match
        this.applyParentScale(cloud);
        
        // Add to container
        this.cloudsContainer.addChild(cloud);
        this.cloudSprites.push(cloud);
        
        // Animate the cloud
        this.animateCloud(cloud, randomOpacity);
    }
    

     //Animate a cloud with formation and movement
    animateCloud(cloud, finalOpacity) 
    {
        // Choose a random animation type (0-3)
        const animType = Math.floor(Math.random() * 4);
        const speed = this.speedVariations[animType];
        
        // Random delay
        const formationDelay = Math.random() * 2;
        const driftDelay = formationDelay + 0.5;
        
        if (window.gsap) 
        {
            // Create a timeline for this cloud
            cloud.timeline = gsap.timeline();
            
            // Formation animation (fade in and scale)
            cloud.timeline.to(cloud, {
                alpha: finalOpacity,
                duration: 2,
                delay: formationDelay,
                ease: "power1.inOut"
            });
            
            // Movement animation based on type
            switch (animType) 
            {
                case 0: // Left to right
                    cloud.timeline.to(cloud, {
                        x: this.app.screen.width + 200,
                        duration: speed.duration,
                        delay: driftDelay - formationDelay,
                        ease: speed.ease,
                        onComplete: () => {
                            // Add to removal queue on next lifecycle check
                            cloud.markForRemoval = true;
                        }
                    }, "<");
                    break;
                    
                case 1: // Right to left
                    cloud.timeline.to(cloud, {
                        x: -200,
                        duration: speed.duration,
                        delay: driftDelay - formationDelay,
                        ease: speed.ease,
                        onComplete: () => {
                            cloud.markForRemoval = true;
                        }
                    }, "<");
                    break;
                    
                case 2: // Diagonal drift
                    cloud.timeline.to(cloud, {
                        x: this.app.screen.width + 200,
                        y: cloud.position.y - 100,
                        duration: speed.duration,
                        delay: driftDelay - formationDelay,
                        ease: speed.ease,
                        onComplete: () => {
                            cloud.markForRemoval = true;
                        }
                    }, "<");
                    break;
                    
                case 3: // Float in place
                    cloud.timeline.to(cloud, {
                        x: cloud.position.x + 50,
                        duration: speed.duration / 2,
                        delay: driftDelay - formationDelay,
                        ease: speed.ease,
                        yoyo: true,
                        repeat: -1
                    }, "<");
                    break;
            }
        } 
        else 
        {
            // Fallback if GSAP is not available - simple fade in
            const fadeIn = () => {
                cloud.alpha += 0.02;
                if (cloud.alpha < finalOpacity) 
                {
                    requestAnimationFrame(fadeIn);
                }
            };
            
            // Start after delay
            setTimeout(fadeIn, formationDelay * 1000);
            
            // Setup movement with PIXI ticker if GSAP isn't available
            let direction = 1;
            if (animType === 1) direction = -1;
            
            const moveCloud = (delta) => {
                cloud.position.x += delta * direction * (0.5 / speed.duration * 60);
                
                // Remove when offscreen
                if (cloud.position.x > this.app.screen.width + 200 || 
                    cloud.position.x < -200) 
                {
                    this.app.ticker.remove(moveCloud);
                    cloud.markForRemoval = true;
                }
            };
            
            // Add to ticker after delay
            setTimeout(() => {
                this.app.ticker.add(moveCloud);
            }, driftDelay * 1000);
        }
    }
    
    /**
     * Update cloud system when theme changes
     * @param {string} theme New theme ('light' or 'dark')
     */
    updateTheme(theme) 
    {
        this.currentTheme = theme;
        
        // Handle visibility based on theme
        if (this.cloudsContainer) 
        {
            if (theme === 'dark') 
            {
                // Remove all clouds in dark theme
                this.cloudsContainer.removeChildren();
                this.cloudSprites = [];
                this.cloudsContainer.visible = false;
            } 
            else 
            {
                // Show and populate clouds in light theme
                this.cloudsContainer.visible = true;
                this.refreshClouds();
            }
        }
    }
    
    /**
     * Clean up resources and event listeners
     */
    destroy() 
    {
        if (this.cloudLifecycleInterval) 
        {
            clearInterval(this.cloudLifecycleInterval);
        }
        
        // Remove resize listener
        window.removeEventListener('resize', this.onResize.bind(this));
        
        // Clean up cloud animations
        if (window.gsap) 
        {
            for (const cloud of this.cloudSprites) 
            {
                if (cloud && cloud.timeline) 
                {
                    cloud.timeline.kill();
                }
            }
        }
        
        // Clear clouds container
        if (this.cloudsContainer) 
        {
            this.cloudsContainer.removeChildren();
        }
        
        this.cloudSprites = [];
        this.cloudTextures = [];
        this.initialized = false;
    }
}

// Export the class
window.CloudsManager = CloudsManager;