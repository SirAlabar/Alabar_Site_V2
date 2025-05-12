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
        this.cloudsTextures = [];
        this.cloudsSprites = [];
        
        this.initialized = false;
        this.initInProgress = false;
        this.cloudsContainer = null;
        
        // Debug mode - set to false in production
        this.debug = true;
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
        if (this.cloudsContainer) {
            this.cloudsContainer.visible = false;
            if (this.debug) console.log("Clouds hidden for dark theme");
        }
    }
    
    /**
     * Load cloud textures from AssetManager
     */
    async loadCloudTextures() 
    {
        // Skip if already loaded
        if (this.cloudsTextures.length > 0) 
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
                this.cloudsTextures.push(texture);
                
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
            const cloudsGraphic = new PIXI.Graphics();
            cloudsGraphic.beginFill(0xFFFFFF, 0.8);
            
            // Draw a cloud-like shape
            const x = 0, y = 0;
            const radiusX = 50 + i * 10;
            const radiusY = 25 + i * 5;
            
            // Draw multiple overlapping circles for cloud effect
            cloudsGraphic.drawEllipse(x, y, radiusX, radiusY);
            cloudsGraphic.drawEllipse(x + 30, y - 10, radiusX * 0.7, radiusY * 0.7);
            cloudsGraphic.drawEllipse(x - 30, y - 5, radiusX * 0.6, radiusY * 0.6);
            cloudsGraphic.drawEllipse(x + 10, y + 10, radiusX * 0.8, radiusY * 0.5);
            
            cloudsGraphic.endFill();
            
            // Generate texture from graphics
            try {
                const texture = this.app.renderer.generateTexture(cloudsGraphic);
                this.cloudsTextures.push(texture);
            } catch (err) {
                console.error("Failed to generate cloud texture:", err);
            }
        }
        
        if (this.debug) console.log(`Created ${this.cloudsTextures.length} fallback cloud textures`);
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
                    this.cloudsContainer = child;
                    if (this.debug) console.log("Found existing cloudss layer in backgroundGroup");
                    break;
                }
            }
        }
        
        // If not found, create a new container
        if (!this.cloudsContainer) {
            this.cloudsContainer = new PIXI.Container();
            this.cloudsContainer.name = "cloudss";
            this.cloudsContainer.zIndex = -9;
            this.cloudsContainer.sortableChildren = true;
            
            // Add to background group or stage
            if (this.backgroundGroup) {
                this.backgroundGroup.addChild(this.cloudsContainer);
            } else if (this.app && this.app.stage) {
                this.app.stage.addChild(this.cloudsContainer);
            }
            
            if (this.debug) console.log("Created new clouds container");
        }
        
        // Clear any existing cloudss
        this.cloudsContainer.removeChildren();
        this.cloudsSprites = [];
        
        // Ensure visibility
        this.cloudsContainer.visible = true;
        this.cloudsContainer.alpha = 1;

        // At the end of the ensurecloudsContainer method (around line 202-203):
        // Force z-index application and sorting
        this.cloudsContainer.zIndex = 100000; // Temporarily make clouds very visible
        if (this.backgroundGroup && this.backgroundGroup.sortableChildren) {
            this.backgroundGroup.sortChildren(); // Force sort
            console.log("Applied z-index and forced sorting");
        }
    }
    
    /**
     * Refresh all cloud sprites
     */
    refreshClouds() 
    {
        if (!this.cloudsContainer) {
            this.ensureCloudContainer();
        }
        
        // Clear existing clouds
        this.cloudsContainer.removeChildren();
        this.cloudsSprites = [];
        
        const cloudsCount = this.config.minClouds + 
            Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
        
        if (this.debug) console.log(`Creating ${cloudsCount} clouds`);
        
        // Create clouds with different animation types
        const animationTypes = ['leftToRight', 'rightToLeft', 'diagonal', 'float'];
        
        for (let i = 0; i < cloudsCount; i++) {
            // Distribute animation types
            const animType = animationTypes[i % animationTypes.length];
            this.createSingleCloud(i, animType);
        }
        
        // Setup animation loop
        if (!this.animationLoopActive) {
            this.setupCloudAnimations();
            this.animationLoopActive = true;
        }
        
        if (this.debug) console.log(`Created ${this.cloudsSprites.length} cloud sprites`);
        console.log("Cloud container visibility:", {
            container: !!this.cloudContainer,
            visible: this.cloudContainer?.visible,
            alpha: this.cloudContainer?.alpha,
            position: {x: this.cloudContainer?.position.x, y: this.cloudContainer?.position.y},
            numClouds: this.cloudSprites.length,
            zIndex: this.cloudContainer?.zIndex
        });
this.debugCloudPositions();

        
    }
    
// In CloudsManager.js, add this debugging method after refreshClouds()
debugCloudPositions() {
    if (!this.cloudSprites || this.cloudSprites.length === 0) {
        console.log("No cloud sprites to debug");
        return;
    }
    
    console.log("==== CLOUD POSITION DEBUGGING ====");
    console.log(`Total clouds: ${this.cloudSprites.length}`);
    console.log(`Cloud container position: x=${this.cloudContainer.position.x}, y=${this.cloudContainer.position.y}`);
    console.log(`Viewport dimensions: ${this.app.screen.width}x${this.app.screen.height}`);
    
    // Debug first 3 clouds in detail
    for (let i = 0; i < Math.min(3, this.cloudSprites.length); i++) {
        const cloud = this.cloudSprites[i];
        const bounds = cloud.getBounds();
        
        console.log(`Cloud #${i} (${cloud.name}):`);
        console.log(`- Position: x=${cloud.position.x}, y=${cloud.position.y}`);
        console.log(`- Scale: x=${cloud.scale.x}, y=${cloud.scale.y}`);
        console.log(`- Size: width=${cloud.width}, height=${cloud.height}`);
        console.log(`- Alpha: ${cloud.alpha}`);
        console.log(`- Bounds: x=${bounds.x}, y=${bounds.y}, width=${bounds.width}, height=${bounds.height}`);
        console.log(`- Animation: type=${cloud.animationType}, vx=${cloud.vx}, vy=${cloud.vy || 0}`);
        console.log(`- Visibility: ${this.isCloudVisible(cloud) ? 'VISIBLE' : 'OFF-SCREEN'}`);
    }
    
    // Add visual debugging elements
    this.addVisualDebugElements();
}

// Check if a cloud is within the visible screen area
isCloudVisible(cloud) {
    const bounds = cloud.getBounds();
    return (
        bounds.x < this.app.screen.width &&
        bounds.x + bounds.width > 0 &&
        bounds.y < this.app.screen.height &&
        bounds.y + bounds.height > 0
    );
}

// Add visual debug elements to make clouds more obvious
addVisualDebugElements() {
    // Add a colored border to each cloud
    this.cloudSprites.forEach((cloud, index) => {
        // Remove any existing debug graphics
        const existingDebug = cloud.children.find(child => child.name === 'debug-border');
        if (existingDebug) {
            cloud.removeChild(existingDebug);
        }
        
        // Create a colored border
        const debugGraphics = new PIXI.Graphics();
        debugGraphics.name = 'debug-border';
        
        // Different colors for different animation types
        let color;
        switch (cloud.animationType) {
            case 'leftToRight': color = 0xFF0000; break; // Red
            case 'rightToLeft': color = 0x00FF00; break; // Green
            case 'diagonal': color = 0x0000FF; break;    // Blue
            case 'float': color = 0xFFFF00; break;       // Yellow
            default: color = 0xFF00FF; break;            // Magenta
        }
        
        // Draw border around the sprite
        debugGraphics.lineStyle(4, color, 1);
        debugGraphics.drawRect(-cloud.width/2, -cloud.height/2, cloud.width, cloud.height);
        
        // Add to cloud sprite
        cloud.addChild(debugGraphics);
    });
    
    console.log("Visual debug elements added to clouds");
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
        
        // Use a textura da nuvem
        const texture = this.cloudTextures[0];
        
        // Criar sprite
        const cloud = new PIXI.Sprite(texture);
        cloud.name = `cloud-${index}`;
        
        // Definir âncora no centro (importante para rotação e escala correta)
        cloud.anchor.set(0.5, 0.5);
        
        // Configurar opacidade baseada nas classes CSS que você tinha
        const opacityOptions = [0.3, 0.5, 0.7]; // opacity-light, opacity-medium, opacity-full
        cloud.alpha = opacityOptions[index % opacityOptions.length];
        
        // Escala - imitar o --base-scale das suas animações CSS
        const baseScale = 0.5 + Math.random() * 0.5;
        cloud.scale.set(baseScale);
        
        // Posicionamento baseado no tipo de animação
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height * 0.4; // Apenas no topo da tela
        
        // Configuração para cada tipo de animação (imitando suas classes CSS)
        switch(animationType) {
            case 'leftToRight': // anim-combo-1
                cloud.x = -100;
                cloud.y = Math.random() * screenHeight * 0.7;
                cloud.vx = 0.3 + Math.random() * 0.3;
                cloud.vy = 0;
                cloud.animDuration = 40 + Math.random() * 20; // cloudDriftLeftToRight duração
                break;
                
            case 'rightToLeft': // anim-combo-2
                cloud.x = screenWidth + 100;
                cloud.y = screenHeight * 0.2 + Math.random() * (screenHeight * 0.5);
                cloud.vx = -0.3 - Math.random() * 0.3;
                cloud.vy = 0;
                cloud.animDuration = 50 + Math.random() * 30; // cloudDriftRightToLeft duração
                break;
                
            case 'diagonal': // anim-combo-3
                cloud.x = -100;
                cloud.y = screenHeight - Math.random() * 100;
                cloud.vx = 0.2 + Math.random() * 0.2;
                cloud.vy = -0.1 - Math.random() * 0.1;
                cloud.animDuration = 60 + Math.random() * 30; // cloudDriftDiagonalUp duração
                break;
                
            case 'float': // anim-combo-4
                cloud.x = screenWidth * Math.random();
                cloud.y = screenHeight * 0.4 * Math.random();
                cloud.vx = 0.05 * (Math.random() * 2 - 1);
                cloud.floatPhase = Math.random() * Math.PI * 2;
                cloud.floatSpeed = 0.01 + Math.random() * 0.02;
                cloud.floatAmplitude = 10 + Math.random() * 10;
                cloud.animDuration = 25; // cloudDriftSlow duração
                break;
        }
        
        // Imitando o formation-delay do CSS
        cloud.formationDelay = Math.floor(Math.random() * 3) * 1000; // 0s, 1s, ou 2s
        cloud.initialAlpha = cloud.alpha;
        cloud.alpha = 0; // Começa invisível
        cloud.formationTime = 0;
        cloud.forming = true;
        
        // Adicionar propriedades de animação
        cloud.animationType = animationType;
        cloud.elapsed = 0;
        
        // Adicionar ao container de nuvens
        this.cloudContainer.addChild(cloud);
        this.cloudSprites.push(cloud);
        
        return cloud;
    }
    
    /**
     * Setup cloud animation ticker
     */
setupCloudAnimations() 
{
    const tickerFunction = (delta) => {
        if (!this.cloudContainer || !this.cloudContainer.parent) return;
        
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height * 0.4;
        
        for (let i = 0; i < this.cloudSprites.length; i++) {
            const cloud = this.cloudSprites[i];
            if (!cloud || !cloud.parent) continue;
            
            // Incrementar tempo decorrido
            cloud.elapsed += delta;
            
            // Animar a formação da nuvem (cloudForm no CSS)
            if (cloud.forming) {
                clouds.formationTime += delta;
                if (clouds.formationTime > clouds.formationDelay / 16.67) { // Converter ms para frames
                    const formProgress = Math.min(1, (clouds.formationTime - clouds.formationDelay / 16.67) / (240)); // 4s = 240 frames aprox.
                    
                    // Fade in
                    clouds.alpha = clouds.initialAlpha * formProgress;
                    
                    // Escala gradual
                    const scaleProgress = 0.8 + (0.2 * formProgress);
                    clouds.scale.set(clouds.scale._x * scaleProgress);
                    
                    if (formProgress >= 1) {
                        clouds.forming = false;
                    }
                }
            } else {
                // Animações baseadas no tipo (imitando os keyframes CSS)
                switch (clouds.animationType) {
                    case 'leftToRight':
                    case 'rightToLeft':
                    case 'diagonal':
                        // Movimento linear
                        clouds.x += clouds.vx * delta;
                        clouds.y += (clouds.vy || 0) * delta;
                        
                        // Ajustar opacidade durante a animação (imitando os keyframes de opacidade)
                        const progress = (clouds.elapsed % (clouds.animDuration * 60)) / (clouds.animDuration * 60);
                        if (progress < 0.1) {
                            clouds.alpha = clouds.initialAlpha * (progress * 10); // Fade in
                        } else if (progress > 0.8) {
                            clouds.alpha = clouds.initialAlpha * ((1 - progress) * 5); // Fade out
                        } else {
                            clouds.alpha = clouds.initialAlpha;
                        }
                        break;
                        
                    case 'float':
                        // Movimento sinusoidal (cloudsDriftSlow)
                        clouds.floatPhase += clouds.floatSpeed * delta;
                        const xOffset = Math.sin(clouds.floatPhase) * 50;
                        clouds.x = clouds.x + clouds.vx + (xOffset - clouds.lastXOffset || 0);
                        clouds.lastXOffset = xOffset;
                        break;
                }
            }
            
            // Reposicionar nuvens que saem da tela
            if (clouds.x < -clouds.width || 
                clouds.x > screenWidth + clouds.width ||
                clouds.y < -clouds.height || 
                clouds.y > screenHeight + clouds.height) {
                
                // Recriar a nuvem em uma nova posição inicial
                this.resetcloudsPosition(clouds);
            }
        }
    };
    
    if (this.app && this.app.ticker) {
        this.app.ticker.add(tickerFunction);
        if (this.debug) console.log("clouds animation ticker started");
    }
}

// Método auxiliar para reposicionar nuvens
resetcloudsPosition(clouds) {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * 0.4;
    
    // Resetar formação
    clouds.forming = true;
    clouds.formationTime = 0;
    clouds.alpha = 0;
    
    // Reposicionar baseado no tipo de animação
    switch(clouds.animationType) {
        case 'leftToRight':
            clouds.x = -clouds.width;
            clouds.y = Math.random() * screenHeight * 0.7;
            break;
            
        case 'rightToLeft':
            clouds.x = screenWidth + clouds.width;
            clouds.y = Math.random() * screenHeight * 0.7;
            break;
            
        case 'diagonal':
            clouds.x = -clouds.width;
            clouds.y = screenHeight - Math.random() * 100;
            break;
            
        case 'float':
            // Para float, apenas mova para o lado oposto
            if (clouds.x < 0) clouds.x = screenWidth + clouds.width/2;
            else if (clouds.x > screenWidth) clouds.x = -clouds.width/2;
            break;
    }
}
}

// Make cloudssManager globally available
window.cloudsManager = cloudsManager;
console.log("cloudssManager.js loaded successfully and class is available globally");