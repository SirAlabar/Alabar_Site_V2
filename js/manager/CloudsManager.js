/**
 * CloudsManager.js
 * Manages the creation and animation of clouds in the scene
 */

class CloudsManager 
{
    constructor() 
    {
        // Cloud settings
        this.config = {
            minClouds: 4,
            maxClouds: 11,
            minDistance: 100,
            containerHeight: '55%',
            spriteSheetSize: '1024px 800px'
        };
        
        // Frame, animation, speed and opacity classes
        this.framePositions = [
            '0px 0px', '-338px 0px', '-676px 0px',
            '0px -200px', '-338px -200px', '-676px -200px',
            '0px -400px', '-338px -400px', '-676px -400px',
            '0px -600px', '-338px -600px', '-676px -600px'
        ];
        
        this.animationClasses = [
            'anim-combo-1',   
            'anim-combo-2',     
            'anim-combo-3',   
            'anim-combo-4'    
        ];
        
        this.formSpeedClasses = [
            'form-speed-1',
            'form-speed-2',
            'form-speed-3',
        ];
        
        this.opacityClasses = [
            'opacity-light',
            'opacity-medium',
            'opacity-full'
        ];
        this.initialized = false;
        this.initInProgress = false;
        this.initTimer = null;
        // Check if current theme allows showing clouds
        this.currentTheme = document.body.getAttribute('data-theme') || 'light';
    }
    
    init() 
    {
        // Prevent multiple simultaneous initialization attempts
        if (this.initInProgress) 
        {
            return;
        }
        // If already initialized, just refresh the clouds
        if (this.initialized) 
        {
            this.refreshClouds();
            return;
        }
        this.initInProgress = true;
        // Check if the CSS variable for cloud image is defined
        const computedStyle = getComputedStyle(document.documentElement);
        const cloudImageValue = computedStyle.getPropertyValue('--clouds-image').trim();
        if (!cloudImageValue || cloudImageValue === 'none') 
        {
            this.initInProgress = false;
            return;
        }
        // Create clouds
        this.refreshClouds();
        // Set up cloud updates on theme changes
        this.setupThemeListeners();
        this.initialized = true;
        this.initInProgress = false;
    }
    
    setupThemeListeners() 
    {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) 
        {
            themeToggle.addEventListener('click', () => {
                // Update current theme
                this.currentTheme = document.body.getAttribute('data-theme') || 'light';
                // Small delay to allow theme change to occur first
                setTimeout(() => this.refreshClouds(), 500);
            });
        }
    }
    
    refreshClouds() 
    {
        const cloudCount = this.config.minClouds + Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
        this.createClouds(cloudCount);
    }
    
    createClouds(count) 
    {
        // Find existing clouds container or create one
        let cloudsContainer = document.getElementById('clouds');
        // If not found, look in the scene
        if (!cloudsContainer) 
        {
            const scene = document.querySelector('.scene');
            if (scene) 
            {
                cloudsContainer = document.getElementById('clouds');
                // If it still doesn't exist, create it
                if (!cloudsContainer) 
                {
                    cloudsContainer = document.createElement('div');
                    cloudsContainer.id = 'clouds';
                    cloudsContainer.className = 'layer';
                    cloudsContainer.dataset.speed = '0.02';
                    scene.appendChild(cloudsContainer);
                }
            } 
            else 
            {
                return;
            }
        }
        // Clear previous clouds
        cloudsContainer.innerHTML = '';
        // Set up container
        cloudsContainer.style.position = 'absolute';
        cloudsContainer.style.width = '100%';
        cloudsContainer.style.height = this.config.containerHeight;
        cloudsContainer.style.overflow = 'hidden';
        cloudsContainer.style.zIndex = '-9';
        // Screen dimensions for distribution
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight * 0.55;
        // Track used positions to avoid excessive overlap
        const usedPositions = [];
        // Create multiple clouds
        for (let i = 0; i < count; i++) 
        {
            this.createSingleCloud(cloudsContainer, i, screenWidth, screenHeight, usedPositions);
        }
    }
    
    createSingleCloud(container, index, screenWidth, screenHeight, usedPositions) 
    {
        // Create cloud element
        const cloud = document.createElement('div');
        cloud.id = `cloud-${index}`;
        cloud.className = 'cloud-item';
        // Basic styles
        cloud.style.position = 'absolute';
        cloud.style.opacity = '0';
        cloud.style.width = '338px';
        cloud.style.height = '200px';
        cloud.style.backgroundImage = 'var(--clouds-image)';
        cloud.style.backgroundRepeat = 'no-repeat';
        cloud.style.backgroundSize = this.config.spriteSheetSize;
        cloud.style.mixBlendMode = 'screen';
        cloud.style.zIndex = '100';
        // Apply a random frame
        const randomFrame = this.framePositions[Math.floor(Math.random() * this.framePositions.length)];
        cloud.style.backgroundPosition = randomFrame;
        let randomAnim;
        if (index % 4 === 0) 
        {
            randomAnim = 'anim-combo-1';
        } 
        else if (index % 4 === 1) 
        {
            randomAnim = 'anim-combo-2';
        } 
        else if (index % 4 === 2) 
        {
            randomAnim = 'anim-combo-3'; 
        } 
        else 
        {
            randomAnim = 'anim-combo-4';
        }
        cloud.classList.add(randomAnim);
        const speedClasses = ['form-speed-1', 'form-speed-2', 'form-speed-3'];
        const randomSpeed = speedClasses[Math.floor(Math.random() * speedClasses.length)];
        cloud.classList.add(randomSpeed);
        // Apply random final opacity
        const randomOpacity = this.opacityClasses[Math.floor(Math.random() * this.opacityClasses.length)];
        cloud.classList.add(randomOpacity);
        // Find a position that's not too close to existing clouds
        let positionFound = false;
        let attempts = 0;
        let randomTop, randomLeft;
        while (!positionFound && attempts < 10) {
            // Random vertical position (more distributed, using full vertical space)
            randomTop = Math.floor(Math.random() * (screenHeight * 0.8));
            // Random horizontal position
            if (index % 2 === 0) 
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
        if (index === 0) randomLeft = -400; // First cloud starts at the left
        if (index === 1) randomLeft = screenWidth - 200; // Second cloud starts at the right
        // Position the cloud
        cloud.style.top = `${randomTop}px`;
        if (randomAnim === 'anim-combo-1' || randomAnim === 'anim-combo-3') 
        {
            cloud.style.left = `${randomLeft}px`;
        } 
        else if (randomAnim === 'anim-combo-2') 
        {
            cloud.style.right = `${randomLeft}px`;
        } 
        else 
        {
            cloud.style.left = `${randomLeft}px`;
        }
        // Apply random delay to start all animations
        const randomBaseDelay = Math.floor(Math.random() * 10); // Reduzido de 20 para 10
        cloud.style.setProperty('--drift-delay', `${randomBaseDelay + 1}s`);
        cloud.style.setProperty('--formation-delay', `${randomBaseDelay}s`);
        // Some clouds appear immediately
        if (index < 3) 
        {
            cloud.style.setProperty('--formation-delay', '0s');
            cloud.style.setProperty('--drift-delay', '0.5s');
        }
        // Apply random size
        const randomScale = 0.5 + Math.random() * 2.5;
        cloud.style.setProperty('--base-scale', randomScale);
        // Add to container
        container.appendChild(cloud);
    }
}

// Export the class
window.CloudsManager = CloudsManager;