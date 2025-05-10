class SceneManager 
{
    constructor() 
    {
        // PIXI references - will be set by setBackgroundGroup
        this.app = null;
        this.backgroundGroup = null;
        
        // Layer containers
        this.layers = {};
        this.parallaxEffect = null;
        
        // Theme state
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        // Layer configuration with parallax speeds
        this.layerConfig = [
            { id: 'background', speed: 0.0, zIndex: -11 },
            { id: 'mountain', speed: 0.0, zIndex: -10 },
            { id: 'clouds', speed: 0.02, zIndex: -9 },
            { id: 'moon', speed: 0.02, zIndex: -9 },
            { id: 'castle', speed: 0.03, zIndex: -1 },
            { id: 'field7', speed: -0.2, zIndex: -8 },
            { id: 'field6', speed: -0.1, zIndex: -7 },
            { id: 'field5', speed: 0.08, zIndex: -6 },
            { id: 'field4', speed: -0.07, zIndex: -5 },
            { id: 'field3', speed: 0.06, zIndex: -4 },
            { id: 'field2', speed: -0.1, zIndex: -3 },
            { id: 'field1', speed: 0.09, zIndex: -2 }
        ];
        
        // Set up theme toggle button
        this.setupThemeToggle();
        // Resize listener to update scaling when window size changes
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Set the PIXI background group and app references
     * This will be called by Game.js to connect SceneManager with PIXI
     * @param {PIXI.Container} backgroundGroup - The PIXI container for background layers
     * @param {PIXI.Application} app - The PIXI application instance
     */
    setBackgroundGroup(backgroundGroup, app) 
    {
        this.backgroundGroup = backgroundGroup;
        this.app = app;
        
        // Now we can initialize the PIXI background
        this.createPixiScene();
        
        // Apply the current theme
        this.applyTheme(this.currentTheme);
        
        return this; // For method chaining
    }
    
    /**
     * Create the PIXI scene with all background layers
     */
    createPixiScene() 
    {
        if (!this.backgroundGroup || !this.app) 
        {
            console.error("PIXI background group or app not set. Call setBackgroundGroup first.");
            return;
        }
        
        // Clear existing layers if any
        this.backgroundGroup.removeChildren();
        this.layers = {};
        
        // Create each layer based on the configuration
        // We're creating empty containers first, textures will be applied later
        this.layerConfig.forEach(config => {
            const container = new PIXI.Container();
            container.name = config.id;
            
            // Store the speed for parallax effect
            container.parallaxSpeed = config.speed;
            
            // Add to background group
            this.backgroundGroup.addChild(container);
            
            // Store reference
            this.layers[config.id] = container;
        });
        
        console.log("PIXI scene created with layers:", Object.keys(this.layers));
    }
    
    // Apply a theme to the scene
    applyTheme(theme) 
    {
        if (!this.backgroundGroup || !this.app) 
        {
            console.warn("PIXI not initialized yet, skipping theme application");
            return;
        }
        
        // Check if AssetManager is available
        if (!window.assetManager) 
        {
            console.error("AssetManager not available");
            return;
        }
        
        console.log(`Applying theme: ${theme}`);
        
        // First, make all layers visible
        for (const [id, container] of Object.entries(this.layers)) 
        {
            container.visible = true;
        }
        
        // Set up the base background (color or image)
        this.setupBackground(theme);
        
        // Apply textures to each layer
        for (const [id, container] of Object.entries(this.layers)) 
        {
            // Skip the background layer, it's handled separately
            if (id === 'background')
            {
                continue;
            }
            
            // Skip clouds in dark theme
            if (id === 'clouds' && theme === 'dark') 
            {
                container.visible = false;
                continue;
            }
            
            // Skip moon in light theme
            if (id === 'moon' && theme === 'light') 
            {
                container.visible = false;
                continue;
            }
            
            // Clear existing sprites
            container.removeChildren();
            
            // Get the texture for this layer
            console.log(`Loading texture for ${id} in theme ${theme}`);
            const texture = window.assetManager.getBackgroundTexture(theme, id);
            console.log(`Texture found for ${id}:`, texture ? 'Yes' : 'No');
            
            if (texture) 
            {
                const sprite = new PIXI.Sprite(texture);
                
                // Add to container without setting dimensions yet
                // We'll apply scaling to all sprites at once later
                container.addChild(sprite);
            } 
            else 
            {
                console.warn(`No texture found for layer ${id} in theme ${theme}`);
            }
        }
        
        // Apply scaling to all layers to maintain 2:1 aspect ratio
        this.applyBackgroundScaling();
        
        // Apply special effects for certain layers
        this.applySpecialEffects(theme);
        
        // Update current theme
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update the toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) 
        {
            themeToggle.textContent = theme === 'light' ? '🌚' : '🌞';
        }
        
        console.log(`Theme applied: ${theme}`);
    }
    
    /**
     * Set up the background layer (color or image)
     * @param {string} theme - 'light' or 'dark'
     */
    setupBackground(theme) {
        const backgroundContainer = this.layers['background'];
        if (!backgroundContainer) return;
        
        // Clear existing content
        backgroundContainer.removeChildren();
        
        // For BOTH themes, create a proper sprite setup
        if (theme === 'dark') {
            // Try to get background texture for dark theme
            const bgTexture = window.assetManager.getBackgroundTexture('dark', 'background');
            
            if (bgTexture) {
                // Create sprite with the texture
                const bgSprite = new PIXI.Sprite(bgTexture);
                this.setupBackgroundSprite(bgSprite);
                backgroundContainer.addChild(bgSprite);
            } else {
                // Create a colored rectangle but with proper sprite-like handling
                this.createColorBackground(backgroundContainer, 0x191970); // Midnight blue
            }
        } else {
            // For light theme, use BOTH approaches:
            // 1. Try to get a day background texture if it exists
            const bgTexture = window.assetManager.getBackgroundTexture('light', 'background');
            
            if (bgTexture) {
                // If we have a texture, use it
                const bgSprite = new PIXI.Sprite(bgTexture);
                this.setupBackgroundSprite(bgSprite);
                backgroundContainer.addChild(bgSprite);
            } else {
                // Otherwise create a colored rectangle but with proper sprite-like handling
                this.createColorBackground(backgroundContainer, 0x87CEEB); // Sky blue
            }
        }
        
        // Apply also to CSS for fallback
        document.documentElement.style.setProperty('--bg-color', theme === 'light' ? '#87CEEB' : '#191970');
        document.documentElement.style.setProperty('--bg-image', theme === 'dark' ? 'url(assets/images/background/dark/background_night.webp)' : 'none');
    }
    // Add these helper methods to your SceneManager class
    setupBackgroundSprite(sprite) {
        // Apply consistent sizing and positioning for ALL sprites
        sprite.width = this.app.screen.width;
        sprite.height = Math.max(this.app.screen.height * 3, this.app.screen.width * 2);
        
        // Important: Set the anchor point for proper positioning
        sprite.anchor.set(0.5, 0);
        sprite.position.set(this.app.screen.width / 2, 0);
    }

    createColorBackground(container, color) {
        // Create a PIXI.Sprite instead of Graphics for consistent handling
        const colorTexture = PIXI.Texture.WHITE;
        const bgSprite = new PIXI.Sprite(colorTexture);
        
        // Set the tint to apply the color
        bgSprite.tint = color;
        
        // Use the same setup method as image sprites
        this.setupBackgroundSprite(bgSprite);
        container.addChild(bgSprite);
    }
     //Apply special visual effects to certain layers
    applySpecialEffects(theme)
    {
        // Moon animation in dark theme
        if (theme === 'dark' && this.layers['moon']) 
        {
            const moonContainer = this.layers['moon'];
            if (moonContainer.children.length > 0) 
            {
                const moonSprite = moonContainer.children[0];
                
                // Add a simple glow effect using core PIXI filters
                try 
                {
                    // Create a simple glow effect without GlowFilter
                    // Since GlowFilter is part of pixi-filters package which we may not have
                    if (PIXI.filters && PIXI.filters.ColorMatrixFilter) 
                    {
                        // Use ColorMatrixFilter for a simple brightness effect
                        const brightFilter = new PIXI.filters.ColorMatrixFilter();
                        brightFilter.brightness(1.3); // Increase brightness for glow effect
                        
                        // Create a blur filter for soft edges
                        const blurFilter = new PIXI.filters.BlurFilter(2);
                        blurFilter.quality = 1; // Lower quality for better performance
                        
                        // Apply filters
                        moonSprite.filters = [brightFilter, blurFilter];
                    } 
                    else 
                    {
                        console.log("ColorMatrixFilter not available, skipping glow effect");
                    }
                } 
                catch (error) 
                {
                    console.warn("Error applying filter to moon:", error);
                    // Continue without filter
                }
                
                // Set up animation
                this.animateMoon(moonSprite);
            }
        }
        
        // Cloud effects will be handled separately by CloudsManager
    }
    
    /**
     * Animate the moon with floating effect
     * @param {PIXI.Sprite} moonSprite - The moon sprite to animate
     */
    animateMoon(moonSprite)
    {
        // Store original position
        const originalY = moonSprite.position.y;
        
        // Create animation function
        const animate = (delta) => {
            // Simple sine wave movement
            const time = performance.now() / 1000;
            moonSprite.position.y = originalY + Math.sin(time * 0.5) * 10;
        };
        
        // Add to ticker
        this.app.ticker.add(animate);
    }
    
    /**
     * Setup the theme toggle button
     */
    setupThemeToggle()
    {
        // Create/check toggle button
        let themeToggle = document.getElementById('theme-toggle');
        
        if (!themeToggle) 
        {
            themeToggle = document.createElement('button');
            themeToggle.id = 'theme-toggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.textContent = this.currentTheme === 'light' ? '🌚' : '🌞';
            
            // Add to header if it exists, or to the body
            const header = document.querySelector('header');
            if (header) 
            {
                header.appendChild(themeToggle);
            } 
            else 
            {
                document.body.appendChild(themeToggle);
            }
        }
        
        // Add click event
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme()
    {
        // Toggle theme
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log(`Toggling theme from ${this.currentTheme} to ${newTheme}`);
        
        // Store the new theme in localStorage
        localStorage.setItem('theme', newTheme);
        
        // Apply the new theme to PIXI scene
        try {
            this.applyTheme(newTheme);
        } catch (error) {
            console.error("Error applying PIXI theme:", error);
        }
        
        // Update the toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) 
        {
            themeToggle.textContent = newTheme === 'light' ? '🌚' : '🌞';
        }
        
        // Apply theme to body for CSS styling
        document.body.setAttribute('data-theme', newTheme);
        console.log(`Body data-theme attribute updated to: ${newTheme}`);
        
        // If CloudsManager exists, refresh it
        if (window.cloudsManager) 
        {
            console.log("Refreshing clouds for theme:", newTheme);
            try {
                // If the clouds manager has init method for the theme, use it
                if (typeof window.cloudsManager.init === 'function') {
                    window.cloudsManager.init(newTheme);
                } 
                // Otherwise use the refresh method
                else if (typeof window.cloudsManager.refreshClouds === 'function') {
                    window.cloudsManager.refreshClouds();
                }
            } catch (error) {
                console.warn("Error refreshing clouds:", error);
            }
        }
    }
    
    /**
     * Initialize parallax effect
     */
    initParallax() 
    {
        // For PIXI-based parallax, we'll implement this directly here
        // rather than using a separate ParallaxEffect class
        
        // Set up the mouse move and scroll event handlers
        this.setupParallaxEvents();
        
        console.log("PIXI parallax effect initialized");
    }
    
     //Set up event handlers for parallax effects
    setupParallaxEvents()
    {
        if (!this.app)
        {
            return;
        }
        
        // Store movement targets
        this.parallaxTargets = {};
        
        // Initialize all layers with zero offset
        for (const [id, container] of Object.entries(this.layers)) 
        {
            this.parallaxTargets[id] = {
                x: 0,
                y: 0,
                scrollY: 0,
                // Store the original position
                originalX: container.position.x,
                originalY: container.position.y
            };
        }
        
        // Mouse movement handler
        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            for (const [id, container] of Object.entries(this.layers)) 
            {
                // Skip background
                if (id === 'background' || !container.visible) 
                {
                    continue;
                }
                
                const speed = container.parallaxSpeed || 0;
                const mouseIntensity = 0.3; // Increased for more noticeable effect
                
                // Calculate offsets
                const targetX = (e.clientX - centerX) * speed * mouseIntensity;
                const targetY = (e.clientY - centerY) * speed * mouseIntensity;
                
                // Store targets
                this.parallaxTargets[id].targetX = this.boundValue(targetX, -80, 80);
                this.parallaxTargets[id].targetY = this.boundValue(targetY, -80, 80);
            }
        });
        
        // Scroll handler with more impactful effect
        const handleScroll = () => {
            // Get scroll position
            const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            
            console.log("Scroll position detected:", scrolled);
            
            for (const [id, container] of Object.entries(this.layers)) 
            {
                // Skip background or invisible layers
                if (id === 'background' || !container.visible) 
                {
                    continue;
                }
                
                // Get parallax speed or default to zero
                const speed = container.parallaxSpeed || 0;
                
                // Skip layers with zero speed
                if (speed === 0) continue;
                
                // Use a stronger effect for scroll - direct mapping
                const yOffset = -scrolled * speed * 1.0;
                
                // Apply scroll effect to target
                this.parallaxTargets[id].targetScrollY = yOffset;
                
                // Debug logging for specific layers
                if (id === 'mountain' || id === 'field1' || id === 'castle') {
                    console.log(`Parallax for ${id}: speed=${speed}, offset=${yOffset}`);
                }
            }
        };
        
        // Add event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('DOMContentLoaded', handleScroll);
        window.addEventListener('resize', handleScroll);
        
        // Force initial update
        setTimeout(handleScroll, 100);
        
        // Increase ticker priority for smoother parallax
        this.app.ticker.add(this.updateParallax.bind(this), null, PIXI.UPDATE_PRIORITY.HIGH);
        
        console.log("Parallax scroll events configured");
    }

    /**
     * Update parallax positions on each frame
     */
    updateParallax() 
    {
        if (!this.parallaxTargets) 
        {
            return;
        }
        
        const smoothFactor = 0.1; // Increased for faster movement
        
        for (const [id, container] of Object.entries(this.layers)) 
        {
            // Skip background
            if (id === 'background') 
            {
                continue;
            }
            
            const target = this.parallaxTargets[id];
            
            // Skip if no target data
            if (!target) continue;
            
            // Initialize values if needed
            if (target.x === undefined) target.x = 0;
            if (target.y === undefined) target.y = 0;
            if (target.targetX === undefined) target.targetX = 0;
            if (target.targetY === undefined) target.targetY = 0;
            if (target.targetScrollY === undefined) target.targetScrollY = 0;
            
            // Smoothly interpolate to target values
            target.x = this.lerp(target.x, target.targetX, smoothFactor);
            target.y = this.lerp(target.y, target.targetScrollY + target.targetY, smoothFactor);
            
            // Apply the transform to the PIXI container
            container.position.x = (target.originalX || 0) + target.x;
            container.position.y = (target.originalY || 0) + target.y;
            
            // Debug logging for first few frames of mountain layer
            if ((id === 'mountain' || id === 'field1') && this.app.ticker.elapsedMS < 1000) {
                console.log(`Parallax update ${id}: x=${container.position.x}, y=${container.position.y}`);
            }
        }
    }

    // Apply scaling to maintain 2:1 ratio (height:width) for all devices
applyBackgroundScaling() {
    // Calculate required height based on current screen width (2:1 ratio)
    const screenWidth = this.app.screen.width;
    const requiredHeight = screenWidth * 2; // 2:1 ratio (height:width)
    
    // Adjust all sprites consistently
    for (const [id, container] of Object.entries(this.layers)) {
        for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            
            if (child instanceof PIXI.Sprite) {
                // Always set width to screen width
                child.width = screenWidth;
                
                // For background layer, always enforce the 2:1 ratio
                if (id === 'background') {
                    child.height = requiredHeight;
                } else {
                    // For other layers, check the original aspect ratio
                    let originalRatio = 2; // Default
                    if (child.texture && child.texture.width && child.texture.height) {
                        originalRatio = child.texture.width / child.texture.height;
                    }
                    
                    // Set height based on original ratio first
                    child.height = screenWidth / originalRatio;
                    
                    // If height is less than required, scale up to cover
                    if (child.height < requiredHeight) {
                        const scale = requiredHeight / child.height;
                        child.width *= scale;
                        child.height = requiredHeight;
                    }
                }
                
                // Center align all sprites horizontally
                if (child.anchor.x === 0.5) {
                    child.position.x = screenWidth / 2;
                }
            }
        }
    }
    

}   

    // Handle window resize events
    onResize(width, height) 
    {
        if (!this.app || !this.backgroundGroup) 
        { 
            return;
        }
        
        console.log(`Handling resize event: ${width}x${height}`);
        
        // Update the renderer dimensions
        if (this.app.renderer) 
        {
            this.app.renderer.resize(width, height);
        }
        
        // Resize layers with true "cover" behavior
        for (const [id, container] of Object.entries(this.layers)) 
        {
            // Skip empty containers
            if (container.children.length === 0) 
            {
                continue;
            }
            
            // Resize all sprites and graphics
            container.children.forEach(child => {
                if (child instanceof PIXI.Sprite) 
                {
                    // Get original image aspect ratio if available
                    let originalRatio = 2; // Default to 2:1 ratio
                    if (child.texture && child.texture.width && child.texture.height) {
                        originalRatio = child.texture.width / child.texture.height;
                    }
                    
                    // Apply true "cover" behavior based on original aspect ratio
                    // This ensures image fills the entire screen width and adjusts height
                    // to maintain proper proportions
                    const requiredHeight = width * 2; // 2:1 scene ratio
                    
                    child.width = width;
                    child.height = width / originalRatio;
                    
                    // If sprite height is less than required scene height, 
                    // scale up to cover entire height
                    if (child.height < requiredHeight) {
                        const scale = requiredHeight / child.height;
                        child.width *= scale;
                        child.height = requiredHeight;
                    }
                    
                    // Center position horizontally
                    if (child.anchor.x === 0.5) 
                    {
                        child.position.x = width / 2;
                    }
                } 
                else if (child instanceof PIXI.Graphics) 
                {
                    // For background color graphics
                    child.clear();
                    child.beginFill(child.tint);
                    child.drawRect(0, 0, width, Math.max(height * 3, width * 2));
                    child.endFill();
                }
            });
        }
        
        // Apply scaling to update document height based on new dimensions
        this.applyBackgroundScaling();
        
        console.log(`Scene resized to ${width}x${height}`);
    }

    /**
     * Handle window resize events to update scaling
     */
    handleResize() {
        // Skip if not initialized yet
        if (!this.app || !this.backgroundGroup) {
            return;
        }
        
        console.log("Window resize detected, updating scene scaling");
        
        // Update PIXI renderer size
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        
        // Update scene scaling
        this.applyBackgroundScaling();
        
        
        // Update parallax targets if they exist
        if (this.parallaxTargets) {
            // Reset targets to avoid jumps
            for (const [id, target] of Object.entries(this.parallaxTargets)) {
                if (target) {
                    target.targetX = 0;
                    target.targetY = 0;
                    target.targetScrollY = 0;
                }
            }
        }
    }
}

// Function to initialize the SceneManager
function initSceneManager() 
{
    if (!window.sceneManager) 
    {
        window.sceneManager = new SceneManager();
    }
    return window.sceneManager;
}

// Make SceneManager globally available
window.SceneManager = SceneManager;
window.initSceneManager = initSceneManager;