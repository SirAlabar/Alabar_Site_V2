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
    
    /**
     * Apply a theme to the scene
     * @param {string} theme - 'light' or 'dark'
     */
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
            container.visible = true;
            
            // Get the texture for this layer
            const texture = window.assetManager.getBackgroundTexture(theme, id);
            if (texture) 
            {
                const sprite = new PIXI.Sprite(texture);
                
                const originalRatio = sprite.texture.baseTexture.width / sprite.texture.baseTexture.height;
                const screenRatio = this.app.screen.width / this.app.screen.height;
                
                // Add to container
                container.addChild(sprite);
            } 
            else 
            {
                console.warn(`No texture found for layer ${id} in theme ${theme}`);
            }
        }
        
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
    setupBackground(theme) 
    {
        const backgroundContainer = this.layers['background'];
        if (!backgroundContainer) 
        {
            return;
        }
        
        // Clear existing content
        backgroundContainer.removeChildren();
        
        // Get background information from AssetManager
        const bgInfo = window.assetManager.getBackgroundInfo(theme);
        
        // Create a full-screen graphics object for the color
        const bgGraphics = new PIXI.Graphics();
        bgGraphics.beginFill(bgInfo.color);
        bgGraphics.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bgGraphics.endFill();
        backgroundContainer.addChild(bgGraphics);
        
        // If dark theme, add the background image
        if (bgInfo.useTexture && bgInfo.texture)
        {
            const bgSprite = new PIXI.Sprite(bgInfo.texture);
            
            // Size to cover the screen
            bgSprite.width = this.app.screen.width;
            bgSprite.height = this.app.screen.height;
            
            // Add to container
            backgroundContainer.addChild(bgSprite);
        }
    }
    
    /**
     * Apply special effects to certain layers
     * @param {string} theme - 'light' or 'dark'
     */
    applySpecialEffects(theme)
    {
        // Moon animation in dark theme
        if (theme === 'dark' && this.layers['moon']) 
        {
            const moonContainer = this.layers['moon'];
            if (moonContainer.children.length > 0) 
            {
                const moonSprite = moonContainer.children[0];
                
                // Create a glow filter
                const glowFilter = new PIXI.filters.GlowFilter({
                    distance: 15,
                    outerStrength: 2,
                    innerStrength: 1,
                    color: 0xFFFFFF,
                    quality: 0.5
                });
                
                // Apply filter
                moonSprite.filters = [glowFilter];
                
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
        
        // Apply the new theme to PIXI scene
        this.applyTheme(newTheme);
        
        // Note: We'll still need to update the toggle button here
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) 
        {
            themeToggle.textContent = newTheme === 'light' ? '🌚' : '🌞';
        }
        
        // If CloudsManager exists, refresh it
        if (window.cloudsManager) 
        {
            window.cloudsManager.refreshClouds();
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
    
    /**
     * Set up parallax event handlers
     */
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
                scrollY: 0
            };
        }
        
        // Mouse movement handler
        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            for (const [id, container] of Object.entries(this.layers)) 
            {
                // Skip background
                if (id === 'background') 
                {
                    continue;
                }
                const speed = container.parallaxSpeed;
                const mouseIntensity = 0.2;
                // Calculate offsets
                const targetX = (e.clientX - centerX) * speed * mouseIntensity;
                const targetY = (e.clientY - centerY) * speed * mouseIntensity;
                // Store targets
                this.parallaxTargets[id].targetX = this.boundValue(targetX, -50, 50);
                this.parallaxTargets[id].targetY = this.boundValue(targetY, -50, 50);
            }
        });
        
        // Scroll handler
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            for (const [id, container] of Object.entries(this.layers)) 
            {
                // Skip background
                if (id === 'background') 
                {
                    continue;
                }
                const speed = container.parallaxSpeed;
                const scrollIntensity = 0.1;
                // Calculate offset
                const targetScrollY = -(scrolled * speed * scrollIntensity);
                // Store target
                this.parallaxTargets[id].targetScrollY = this.boundValue(targetScrollY, -150, 150);
            }
        });
        
        // Set up animation ticker
        this.app.ticker.add(() => this.updateParallax());
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
        
        const smoothFactor = 0.05;
        
        for (const [id, container] of Object.entries(this.layers)) 
            {
            // Skip background
            if (id === 'background') 
            {
                continue;
            }
            
            const target = this.parallaxTargets[id];
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
            container.position.x = target.x;
            container.position.y = target.y;
        }
    }
    
    /**
     * Linear interpolation helper
     */
    lerp(start, end, factor) 
    {
        return start + (end - start) * factor;
    }
    
    /**
     * Bound a value between min and max
     */
    boundValue(value, min, max) 
    {
        return Math.min(Math.max(value, min), max);
    }
    
    /**
     * Handle window resize
     */
    onResize(width, height) 
    {
        if (!this.app || !this.backgroundGroup)
        { 
            return;
        }
    
        // Resize each layer's content
        for (const [id, container] of Object.entries(this.layers)) 
        {
            // Skip empty containers
            if (container.children.length === 0) 
            {
                continue;
            }
            
            // Resize all sprites in the container
            container.children.forEach(sprite => {
                if (sprite instanceof PIXI.Sprite) 
                {
                    // Resize to fit the screen
                    sprite.width = width;
                    sprite.height = height;
                    
                    // Center position if using anchor
                    if (sprite.anchor.x === 0.5) 
                    {
                        sprite.position.x = width / 2;
                    }
                    if (sprite.anchor.y === 0.5) 
                    {
                        sprite.position.y = height / 2;
                    }
                } 
                else if (sprite instanceof PIXI.Graphics) 
                {
                    // For background color graphics
                    sprite.clear();
                    sprite.beginFill(sprite.tint);
                    sprite.drawRect(0, 0, width, height);
                    sprite.endFill();
                }
            });
        }
        
        console.log(`Scene resized to ${width}x${height}`);
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