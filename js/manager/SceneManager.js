class SceneManager 
{
    constructor() 
    {
        // References for elements
        this.sceneContainer = null;
        this.layers = {};
        this.parallaxEffect = null;
        
        // Theme state
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        // Initialize
        this.createScene();
        this.setupThemeToggle();
        
        // Apply initial background images
        this.applyBackgrounds();
        
        // Initialize parallax after a short delay to ensure all elements are loaded
        setTimeout(() => {
            this.initParallax();
        }, 500);
    }
    
    createScene() 
    {
        // Check if a scene already exists
        let existingScene = document.querySelector('.scene');
        if (existingScene) 
        {
            this.sceneContainer = existingScene;
        } 
        else 
        {
            // Create the main container
            this.sceneContainer = document.createElement('div');
            this.sceneContainer.className = 'scene';
            document.body.prepend(this.sceneContainer); // Place at the beginning of the body
        }
        
        // Define layers with their parallax speeds
        const layerConfig = [
            { id: 'background', speed: 0.0 },
            { id: 'mountain', speed: 0.0 },
            { id: 'clouds', speed: 0.02 },
            { id: 'moon', speed: 0.02 },
            { id: 'castle', speed: 0.03 },
            { id: 'field7', speed: -0.2 },
            { id: 'field6', speed: -0.1 },
            { id: 'field5', speed: 0.08 },
            { id: 'field4', speed: -0.07 },
            { id: 'field3', speed: 0.06 },
            { id: 'field2', speed: -0.1 },
            { id: 'field1', speed: 0.09 }
        ];
        
        // Create/retrieve each layer
        layerConfig.forEach(config => {
            let layer = document.getElementById(config.id);
            if (!layer) 
            {
                layer = document.createElement('div');
                layer.id = config.id;
                layer.className = 'layer';
                layer.dataset.speed = config.speed;
                this.sceneContainer.appendChild(layer);
            }
            else 
            {
                // Update speed attribute for existing layer
                layer.dataset.speed = config.speed;
            }
            this.layers[config.id] = layer;
        });

    }
    
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
        
        // Apply current theme to the body
        document.body.setAttribute('data-theme', this.currentTheme);
        
        // Add click event
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme()
    {
        // Toggle theme
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        // Update theme on body
        document.body.setAttribute('data-theme', this.currentTheme);
        // Save theme in localStorage
        localStorage.setItem('theme', this.currentTheme);
        // Update button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) 
        {
            themeToggle.textContent = this.currentTheme === 'light' ? '🌚' : '🌞';
        }
        // Apply backgrounds for the new theme
        this.applyBackgrounds();
    }
    
    applyBackgrounds() 
    {
        // Check if AssetManager is available
        if (window.assetManager) 
        {
            // Use AssetManager to apply backgrounds to CSS
            window.assetManager.applyBackgroundsToCSS(this.currentTheme);
        } 
        else 
        {
            console.warn('AssetManager is not available!');
        }
    }
    
    initParallax() 
    {
        // Check if ParallaxEffect class is available
        if (window.ParallaxEffect) 
        {
            this.parallaxEffect = new ParallaxEffect();
        } 
        else 
        {
            console.error('ParallaxEffect class not found. Make sure ParallaxEffect.js is loaded before SceneManager.');
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
}

