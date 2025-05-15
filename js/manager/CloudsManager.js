/**
 * CloudsManager.js
 * Versão otimizada com correções finais e console.logs para depuração
 */
class CloudsManager 
{
    constructor(app, backgroundGroup) 
    {
        console.log("CloudsManager: Inicializando gerenciador de nuvens");
        this.app = app;
        this.backgroundGroup = backgroundGroup;
        
        // Cloud settings - aumentando duração para movimento ainda mais lento
        this.config = {
            minClouds: 5,                // Aumentado para criar um visual mais completo
            maxClouds: 8,                // Aumentado mas mantido razoável
            leftToRightDuration: 600,    // Duração MUITO maior para movimento muito mais lento (aumentado 2.5x)
            rightToLeftDuration: 750,    // Duração MUITO maior para movimento muito mais lento (aumentado 2.5x)
            diagonalDuration: 900,       // Duração MUITO maior para movimento muito mais lento (aumentado 2.5x)
            floatDuration: 400           // Duração MUITO maior para movimento muito mais lento (aumentado 3x)
        };
        
        console.log("CloudsManager: Configurações de duração:", 
            JSON.stringify(this.config, null, 2));
        
        this.cloudTextures = [];
        this.cloudSprites = [];
        this.cloudsContainer = null;
        
        // Limitar a 60 FPS para animação consistente
        this.app.ticker.maxFPS = 60;
        console.log("CloudsManager: maxFPS configurado para:", this.app.ticker.maxFPS);
        
        // Flag para prevenir resets excessivos
        this.lastResetTime = {};
        
        // Contador de frames para logging espaçado (evitar spam no console)
        this.frameCounter = 0;
    }
    
    /**
     * Initialize clouds system
     */
    async init(theme) 
    {
        console.log("CloudsManager: Inicializando com tema:", theme);
        
        // Skip cloud creation in dark theme
        if (theme === 'dark') 
        {
            console.log("CloudsManager: Tema escuro, pulando criação de nuvens");
            this.hideAllClouds();
            return;
        }
        
        console.log("CloudsManager: Inicializando CloudsManager com spritesheet...");
        
        // Load cloud textures from spritesheet
        await this.loadCloudTextures();
        console.log("CloudsManager: Número de texturas carregadas:", this.cloudTextures.length);
        
        // Get existing cloud container from SceneManager
        this.getCloudsContainer();
        
        // Create clouds
        this.createClouds();
        
        // Initialize animations
        this.setupCloudAnimations();
        
        console.log("CloudsManager: Inicialização completa");
    }
    
    /**
     * Get clouds container from scene
     */
    getCloudsContainer() 
    {
        console.log("CloudsManager: Buscando container de nuvens");
        
        // Look for 'clouds' container in the backgroundGroup
        if (this.backgroundGroup && this.backgroundGroup.children) 
        {
            for (let i = 0; i < this.backgroundGroup.children.length; i++) 
            {
                const child = this.backgroundGroup.children[i];
                if (child.name === 'clouds') 
                {
                    this.cloudsContainer = child;
                    console.log("CloudsManager: Container de nuvens existente encontrado");
                    return;
                }
            }
        }
        
        // If no container exists, check if window.sceneManager exists and has the layer
        if (window.sceneManager && window.sceneManager.layers && window.sceneManager.layers['clouds']) 
        {
            this.cloudsContainer = window.sceneManager.layers['clouds'];
            console.log("CloudsManager: Usando container de nuvens do SceneManager global");
            return;
        }
        
        // If we still don't have a container, create one as a fallback
        if (!this.cloudsContainer) 
        {
            console.warn("CloudsManager: Nenhum container existente encontrado, criando um como fallback");
            this.cloudsContainer = new PIXI.Container();
            this.cloudsContainer.name = "clouds";
            this.cloudsContainer.zIndex = -9; // Match SceneManager's config
            
            if (this.backgroundGroup) 
            {
                this.backgroundGroup.addChild(this.cloudsContainer);
            } 
            else 
            {
                this.app.stage.addChild(this.cloudsContainer);
            }
        }
    }
    
    /**
     * Load cloud textures from the spritesheet - CORRECTLY
     */
    async loadCloudTextures() 
    {
        this.cloudTextures = [];
        
        console.log("CloudsManager: Carregando texturas de nuvens do spritesheet...");
        
        // CORRECTED METHOD: Check if we have spritesheet with proper textures
        if (window.assetManager?.spritesheets?.['clouds_spritesheet']) 
        {
            const spritesheet = window.assetManager.spritesheets['clouds_spritesheet'];
            console.log("CloudsManager: Spritesheet de nuvens encontrado");
            
            // Try to get frame textures directly - this is the correct approach
            if (spritesheet.textures) 
            {
                console.log("CloudsManager: Texturas disponíveis no spritesheet");
                
                // Get all the cloud textures by their frame names
                for (let i = 0; i <= 11; i++) 
                {
                    const frameKey = `cloud-${i}.png`;
                    if (spritesheet.textures[frameKey]) 
                    {
                        this.cloudTextures.push(spritesheet.textures[frameKey]);
                    }
                }
                
                if (this.cloudTextures.length > 0) 
                {
                    console.log(`CloudsManager: Carregados com sucesso ${this.cloudTextures.length} frames individuais de nuvens`);
                    return;
                }
                
                // Fallback to grabbing all textures if we couldn't find by frame name
                this.cloudTextures = Object.values(spritesheet.textures);
                if (this.cloudTextures.length > 0) 
                {
                    console.log(`CloudsManager: Carregadas ${this.cloudTextures.length} texturas de nuvens do spritesheet`);
                    return;
                }
            }
            
            // Try to get from animations collection
            if (spritesheet.animations && spritesheet.animations.cloud) 
            {
                console.log("CloudsManager: Tentando carregar frames da coleção de animações");
                const cloudFrames = spritesheet.animations.cloud
                    .map(frameName => {
                        const texture = spritesheet.textures[frameName];
                        if (!texture) {
                            console.warn(`CloudsManager: Não foi possível encontrar textura para o frame: ${frameName}`);
                        }
                        return texture;
                    })
                    .filter(texture => texture);
                
                if (cloudFrames.length > 0) 
                {
                    this.cloudTextures = cloudFrames;
                    console.log(`CloudsManager: Carregados ${cloudFrames.length} frames de nuvem da coleção de animação`);
                    return;
                }
            }
        }
        
        // Fallback to single texture if no frames found
        console.log("CloudsManager: Usando método fallback para textura de nuvem");
        if (window.assetManager) 
        {
            const cloudTexture = window.assetManager.getBackgroundTexture('light', 'clouds');
            if (cloudTexture) 
            {
                this.cloudTextures.push(cloudTexture);
                console.log("CloudsManager: Usando textura única de nuvem");
                return;
            }
        }
        
        console.warn("CloudsManager: Nenhuma textura de nuvem encontrada no AssetManager");
    }
    
    /**
     * Create clouds
     */
    createClouds() 
    {
        console.log("CloudsManager: Iniciando criação de nuvens");
        
        if (!this.cloudsContainer) 
        {
            console.error("CloudsManager: Nenhum container de nuvens disponível");
            return;
        }
        
        // Clear existing clouds
        this.cloudsContainer.removeChildren();
        this.cloudSprites = [];
        
        if (this.cloudTextures.length === 0) 
        {
            console.error("CloudsManager: Nenhuma textura disponível para criar nuvens");
            return;
        }
        
        // Get safe screen dimensions
        const safeScreenWidth = Math.max(this.app.screen.width || 800, 800);
        const safeScreenHeight = Math.max((this.app.screen.height * 0.4) || 300, 300);
        
        console.log(`CloudsManager: Dimensões da tela para nuvens: ${safeScreenWidth}x${safeScreenHeight}`);
        
        // Number of clouds to create - keep it reasonable
        const cloudsCount = Math.min(
            this.config.minClouds + Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1)),
            15  // Hard maximum to prevent excessive cloud creation
        );
        
        console.log(`CloudsManager: Criando ${cloudsCount} nuvens animadas`);
        
        // Animation types
        const animationTypes = ['leftToRight', 'rightToLeft', 'diagonal', 'float'];
        
        for (let i = 0; i < cloudsCount; i++) 
        {
            // Choose animation type
            const animType = animationTypes[i % animationTypes.length];
            
            // Create sprite
            const cloud = this.createCloudSprite(i, animType, safeScreenWidth, safeScreenHeight);
            console.log(`CloudsManager: Nuvem ${i} criada com tipo de animação: ${animType}`);
            
            // Add initial random elapsedTime to avoid all clouds fading in/out together
            cloud.elapsedTime = Math.random() * cloud.duration * 0.5;
            
            // Add to container
            this.cloudsContainer.addChild(cloud);
            this.cloudSprites.push(cloud);
        }
        
        console.log(`CloudsManager: ${this.cloudSprites.length} nuvens criadas com animações`);
    }
    
    /**
     * Create cloud sprite with specific animation type
     */
    createCloudSprite(index, animationType, screenWidth, screenHeight) 
    {
        // Choose random texture
        const textureIndex = Math.floor(Math.random() * this.cloudTextures.length);
        const texture = this.cloudTextures[textureIndex];
        
        // Create sprite
        const cloud = new PIXI.Sprite(texture);
        cloud.name = `cloud-${index}`;
        
        // Set anchor to center
        cloud.anchor.set(0.5, 0.5);
        
        // Set opacity - more opaque for better visibility
        // Expanded opacity options
        const opacityOptions = [0.2, 0.3, 0.5, 0.8, 0.9];
        const opacityIndex = Math.floor(Math.random() * opacityOptions.length);
        cloud.alpha = opacityOptions[opacityIndex];
        cloud.originalAlpha = cloud.alpha; // Store for animations
        
        // Scale randomly - with safe limits - adicionar mais variabilidade
        const baseScale = Math.max(0.5 + Math.random() * 0.8, 0.2);
        cloud.scale.set(baseScale);
        
        // Initialize reset tracking to prevent loops
        this.lastResetTime[cloud.name] = 0;
        
        // Configure animation properties
        cloud.animationType = animationType;
        cloud.elapsedTime = 0;
        
        // Place cloud based on animation type
        this.positionCloudByType(cloud, animationType, screenWidth, screenHeight);
        
        return cloud;
    }
    
    /**
     * Position cloud by animation type - separate function for clarity
     */
    // Reduza extremamente a velocidade das nuvens
    positionCloudByType(cloud, animationType, screenWidth, screenHeight) 
    {
        // Default width and height in case texture is not loaded yet
        const defaultWidth = 100;
        const defaultHeight = 50;
        
        // Calculate sprite dimensions - with fallbacks
        const cloudWidth = (cloud.texture && cloud.texture.valid) ? 
            cloud.width : defaultWidth;
        const cloudHeight = (cloud.texture && cloud.texture.valid) ? 
            cloud.height : defaultHeight;
            
        // Set starting position and velocity based on animation type
        try {
            switch(animationType) 
            {
                case 'leftToRight':
                    cloud.x = -cloudWidth;
                    cloud.y = Math.random() * screenHeight * 0.7;
                    cloud.vx = 0.005 + Math.random() * 0.005;  // REDUZIDO 10x
                    cloud.vy = 0;
                    cloud.duration = this.config.leftToRightDuration * 60;
                    console.log(`CloudsManager: Nuvem ${cloud.name} L->R, vx=${cloud.vx}, duração=${cloud.duration}`);
                    break;
                    
                case 'rightToLeft':
                    cloud.x = screenWidth + cloudWidth;
                    cloud.y = Math.random() * screenHeight * 0.7;
                    cloud.vx = -0.005 - Math.random() * 0.005;  // REDUZIDO 10x
                    cloud.vy = 0;
                    cloud.duration = this.config.rightToLeftDuration * 60;
                    console.log(`CloudsManager: Nuvem ${cloud.name} R->L, vx=${cloud.vx}, duração=${cloud.duration}`);
                    break;
                    
                case 'diagonal':
                    cloud.x = -cloudWidth;
                    cloud.y = screenHeight - Math.random() * 100;
                    cloud.vx = 0.003 + Math.random() * 0.003;  // REDUZIDO 10x
                    cloud.vy = -0.001 - Math.random() * 0.001;  // REDUZIDO 10x
                    cloud.duration = this.config.diagonalDuration * 60;
                    console.log(`CloudsManager: Nuvem ${cloud.name} diagonal, vx=${cloud.vx}, vy=${cloud.vy}, duração=${cloud.duration}`);
                    break;
                    
                case 'float':
                    cloud.x = screenWidth * Math.random();
                    cloud.y = screenHeight * 0.4 * Math.random();
                    cloud.vx = 0.001 * (Math.random() * 2 - 1);  // REDUZIDO 10x
                    if (Math.abs(cloud.vx) < 0.0005) cloud.vx = 0.0005; // REDUZIDO 10x
                    cloud.floatPhase = Math.random() * Math.PI * 2;
                    cloud.floatSpeed = 0.0001 + Math.random() * 0.0002;  // REDUZIDO 10x
                    cloud.floatAmplitude = 0.3 + Math.random() * 0.3;  // REDUZIDO 10x
                    cloud.duration = this.config.floatDuration * 60;
                    cloud.lastXOffset = 0;
                    console.log(`CloudsManager: Nuvem ${cloud.name} flutuante, vx=${cloud.vx}, amp=${cloud.floatAmplitude}, velocidade=${cloud.floatSpeed}, duração=${cloud.duration}`);
                    break;
                    
                default:
                    // Fallback - just place randomly on screen
                    cloud.x = Math.random() * screenWidth;
                    cloud.y = Math.random() * screenHeight;
                    cloud.vx = 0;
                    cloud.vy = 0;
                    break;
            }
        } catch(e) {
            console.error("CloudsManager: Erro ao posicionar nuvem:", e);
            // Safe fallback
            cloud.x = Math.random() * screenWidth;
            cloud.y = Math.random() * screenHeight;
        }
        
        // Validate positions to catch NaN early
        if (isNaN(cloud.x) || isNaN(cloud.y)) {
            console.warn(`CloudsManager: Posição da nuvem inválida durante a criação, usando posição segura`);
            cloud.x = screenWidth / 2;
            cloud.y = screenHeight / 2;
        }
    }
    
    /**
     * Set up cloud animations
     */
    setupCloudAnimations() 
    {
        console.log("CloudsManager: Configurando animações de nuvens");
        
        // Ticker function to animate clouds
        this.tickerFunction = (delta) => {
            if (!this.cloudsContainer || !this.cloudsContainer.parent) return;
            
            // Define safe screen dimensions
            const screenWidth = Math.max(this.app.screen.width || 800, 800);
            const screenHeight = Math.max((this.app.screen.height * 0.4) || 300, 300);
            
            // Garantir que o delta seja um número
            let deltaValue = 1;
            if (typeof delta === 'number') {
                deltaValue = delta;
            } else if (delta && typeof delta.deltaTime === 'number') {
                // Algumas versões do PIXI enviam um objeto com propriedade deltaTime
                deltaValue = delta.deltaTime;
            } else if (delta && typeof delta === 'object') {
                console.warn("CloudsManager: Delta é um objeto:", JSON.stringify(delta));
                // Tentar extrair um número de alguma propriedade
                for (const key in delta) {
                    if (typeof delta[key] === 'number') {
                        deltaValue = delta[key];
                        console.log(`CloudsManager: Usando delta[${key}] = ${deltaValue}`);
                        break;
                    }
                }
            }
            
            // Normalizar o delta para 60fps para animação consistente
            const targetFps = 60;
            const currentFps = typeof this.app.ticker.FPS === 'number' ? this.app.ticker.FPS : 60;
            
            // Usar valor constante muito pequeno para desacelerar animação
            const normalizedDelta = 0.05; // Valor fixo pequeno para movimentação muito lenta
            
            // Limitar o delta a um valor seguro
            const safeDelta = normalizedDelta;
            
            // Log animation metrics a cada 100 frames para não sobrecarregar o console
            this.frameCounter++;
            if (this.frameCounter % 100 === 0) {
                console.log(`CloudsManager: Metrics - deltaOriginal: ${typeof delta === 'object' ? 'objeto' : delta}, deltaValue: ${deltaValue}, safeDelta: ${safeDelta}, FPS: ${currentFps}`);
            }
            
            for (let i = 0; i < this.cloudSprites.length; i++) 
            {
                const cloud = this.cloudSprites[i];
                if (!cloud || !cloud.parent) continue;
                
                cloud.elapsedTime += safeDelta;
                
                // Log para a primeira nuvem apenas a cada 100 frames (para evitar spam no console)
                const shouldLogThisCloud = i === 0 && this.frameCounter % 100 === 0;
                
                // Animation based on type with validation
                try {
                    switch (cloud.animationType) 
                    {
                        case 'leftToRight':
                        case 'rightToLeft':
                        case 'diagonal':
                            // Ensure vx is not NaN
                            if (isNaN(cloud.vx)) {
                                cloud.vx = cloud.animationType === 'rightToLeft' ? -0.04 : 0.04;
                            }
                            if (isNaN(cloud.vy)) cloud.vy = 0;
                            
                            // Posição anterior para logging
                            const prevX = cloud.x;
                            const prevY = cloud.y;
                            
                            // Linear movement - verificar se o valor é NaN antes de aplicar
                            if (!isNaN(cloud.vx) && !isNaN(safeDelta)) {
                                cloud.x += cloud.vx * safeDelta;
                            } else {
                                console.warn(`CloudsManager: Detectado NaN - cloud.vx: ${cloud.vx}, safeDelta: ${safeDelta}`);
                            }
                            
                            if (!isNaN(cloud.vy) && !isNaN(safeDelta)) {
                                cloud.y += (cloud.vy || 0) * safeDelta;
                            }
                            
                            if (shouldLogThisCloud) {
                                console.log(`CloudsManager: Nuvem ${i} (${cloud.animationType}) - movimento: (${prevX.toFixed(2)},${prevY.toFixed(2)}) -> (${cloud.x.toFixed(2)},${cloud.y.toFixed(2)}), delta: ${safeDelta.toFixed(3)}, velocidade: ${cloud.vx.toFixed(4)}`);
                            }
                            
                            // Alpha fade in/out with safety checks
                            const duration = cloud.duration || (this.config.leftToRightDuration * 60);
                            const progress = (cloud.elapsedTime % duration) / duration;
                            
                            if (progress < 0.1) 
                            {
                                // Fade in
                                cloud.alpha = (cloud.originalAlpha || 0.7) * (progress * 10);
                            } 
                            else if (progress > 0.8) 
                            {
                                // Fade out
                                cloud.alpha = (cloud.originalAlpha || 0.7) * ((1 - progress) * 5);
                            } 
                            else 
                            {
                                // Normal visibility
                                cloud.alpha = cloud.originalAlpha || 0.7;
                            }
                            break;
                            
                        case 'float':
                            // Ensure all values are valid - usar os mesmos valores que no positionCloudByType
                            if (isNaN(cloud.floatPhase)) cloud.floatPhase = 0;
                            if (isNaN(cloud.floatSpeed)) cloud.floatSpeed = 0.001;  // Corresponde ao valor em positionCloudByType
                            if (isNaN(cloud.floatAmplitude)) cloud.floatAmplitude = 3;  // Corresponde ao valor em positionCloudByType
                            if (isNaN(cloud.lastXOffset)) cloud.lastXOffset = 0;
                            if (isNaN(cloud.vx)) cloud.vx = 0.01;  // Corresponde ao valor em positionCloudByType
                            
                            // Posição anterior para logging
                            const prevFloatX = cloud.x;
                            
                            // Verificações de segurança antes de aplicar movimentos
                            if (isNaN(cloud.x)) {
                                console.warn(`CloudsManager: Nuvem ${i} com posição X NaN, restaurando`);
                                cloud.x = screenWidth / 2;
                            }
                            
                            // Sinusoidal movement with safety
                            const oldPhase = cloud.floatPhase;
                            
                            // Verificar se os valores são números válidos antes de calcular
                            if (!isNaN(cloud.floatSpeed) && !isNaN(safeDelta)) {
                                cloud.floatPhase += cloud.floatSpeed * safeDelta;
                            } else {
                                console.warn(`CloudsManager: Detectado NaN - cloud.floatSpeed: ${cloud.floatSpeed}, safeDelta: ${safeDelta}`);
                            }
                            
                            // Verificar se temos valores válidos para cálculo de seno
                            let xOffset = 0;
                            if (!isNaN(cloud.floatPhase) && !isNaN(cloud.floatAmplitude)) {
                                xOffset = Math.sin(cloud.floatPhase) * cloud.floatAmplitude;
                            } else {
                                console.warn(`CloudsManager: Detectado NaN em fase ou amplitude - phase: ${cloud.floatPhase}, amplitude: ${cloud.floatAmplitude}`);
                            }
                            
                            // Calculate difference from last offset
                            let offsetDiff = 0;
                            if (!isNaN(cloud.lastXOffset)) {
                                offsetDiff = xOffset - cloud.lastXOffset;
                            } else {
                                cloud.lastXOffset = 0;
                            }
                            
                            // Apply movement com verificação de segurança 
                            if (!isNaN(cloud.vx) && !isNaN(safeDelta) && !isNaN(offsetDiff)) {
                                cloud.x += (cloud.vx * safeDelta) + offsetDiff;
                            } else {
                                console.warn(`CloudsManager: Movimento float inválido - vx: ${cloud.vx}, delta: ${safeDelta}, offsetDiff: ${offsetDiff}`);
                            }
                            
                            cloud.lastXOffset = xOffset;
                            
                            if (shouldLogThisCloud) {
                                console.log(`CloudsManager: Nuvem ${i} (float) - x: ${prevFloatX.toFixed(2)} -> ${cloud.x.toFixed(2)}, fase: ${oldPhase.toFixed(3)} -> ${cloud.floatPhase.toFixed(3)}, velocidade: ${cloud.vx.toFixed(4)}, offsetDiff: ${offsetDiff.toFixed(4)}`);
                            }
                            break;
                    }
                } catch(e) {
                    console.error("CloudsManager: Erro ao animar nuvem:", e);
                }
                
                // Validate position after animation
                if (isNaN(cloud.x) || isNaN(cloud.y))
                {
                    console.warn(`CloudsManager: Posição da nuvem ${i} se tornou NaN após animação`);
                    cloud.x = Math.random() * screenWidth;
                    cloud.y = Math.random() * screenHeight;
                }
                
                // Reposition clouds that go off-screen
                this.checkCloudBounds(cloud, screenWidth, screenHeight);
            }
        };
        
        // Add ticker
        if (this.app && this.app.ticker) 
        {
            this.app.ticker.add(this.tickerFunction);
            console.log("CloudsManager: Animações de nuvens iniciadas com timing delta normalizado");
        }
    }
    
    /**
     * Check if cloud is out of bounds and reset position if needed
     * FIXED to prevent infinite loops
     */
    checkCloudBounds(cloud, screenWidth, screenHeight) 
    {
        if (!cloud) return;
        
        // Default dimensions if not available
        const defaultWidth = 100;
        const defaultHeight = 50;
        
        // Calculate dimensions with fallbacks
        const width = cloud.width ? cloud.width * cloud.scale.x : defaultWidth;
        const height = cloud.height ? cloud.height * cloud.scale.y : defaultHeight;
        
        // Handle NaN positions
        if (isNaN(cloud.x) || isNaN(cloud.y)) {
            cloud.x = Math.random() * screenWidth;
            cloud.y = Math.random() * screenHeight;
            return;
        }
        
        // Check if cloud is out of bounds
        const isOutOfBounds = 
            cloud.x < -width || 
            cloud.x > screenWidth + width ||
            cloud.y < -height || 
            cloud.y > screenHeight + height;
        
        if (isOutOfBounds) {
            // IMPORTANT: Prevent reset loops by limiting how often a cloud can be reset
            const now = Date.now();
            const lastReset = this.lastResetTime[cloud.name] || 0;
            
            // Only reset if it's been at least 3 seconds since last reset
            if (now - lastReset > 3000) {
                console.log(`CloudsManager: Nuvem ${cloud.name} fora dos limites (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)}), reposicionando`);
                this.resetCloudPosition(cloud, screenWidth, screenHeight);
                this.lastResetTime[cloud.name] = now;
            }
        }
    }
    
    /**
     * Reset cloud position when it goes off-screen
     */
    resetCloudPosition(cloud, screenWidth, screenHeight) 
    {
        console.log(`CloudsManager: Reposicionando nuvem ${cloud.name} - tipo: ${cloud.animationType}, posição atual: (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)})`);
        
        // Reset position based on animation type
        try {
            switch(cloud.animationType) 
            {
                case 'leftToRight':
                    if (cloud.x > screenWidth) {
                        // Only reset if it moved off the right side
                        cloud.x = -cloud.width;
                        cloud.y = Math.random() * screenHeight * 0.7;
                        console.log(`CloudsManager: Nuvem ${cloud.name} L->R reposicionada para (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)})`);
                    }
                    break;
                    
                case 'rightToLeft':
                    if (cloud.x < -cloud.width) {
                        // Only reset if it moved off the left side
                        cloud.x = screenWidth + cloud.width;
                        cloud.y = Math.random() * screenHeight * 0.7;
                        console.log(`CloudsManager: Nuvem ${cloud.name} R->L reposicionada para (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)})`);
                    }
                    break;
                    
                case 'diagonal':
                    if (cloud.x > screenWidth || cloud.y < -cloud.height) {
                        // Only reset if it moved off the top-right
                        cloud.x = -cloud.width;
                        cloud.y = screenHeight - Math.random() * 100;
                        console.log(`CloudsManager: Nuvem ${cloud.name} diagonal reposicionada para (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)})`);
                    }
                    break;
                    
                case 'float':
                    // For float, just move to the opposite side
                    if (cloud.x < -cloud.width) {
                        cloud.x = screenWidth + cloud.width/2;
                    } else if (cloud.x > screenWidth + cloud.width) {
                        cloud.x = -cloud.width/2;
                    }
                    
                    // If it went out vertically, just reset Y
                    if (cloud.y < -cloud.height || cloud.y > screenHeight + cloud.height) {
                        cloud.y = Math.random() * screenHeight * 0.7;
                    }
                    
                    console.log(`CloudsManager: Nuvem ${cloud.name} flutuante reposicionada para (${cloud.x.toFixed(0)},${cloud.y.toFixed(0)})`);
                    
                    // Reset float phase
                    cloud.lastXOffset = 0;
                    break;
                    
                default:
                    // Fallback to random position if animation type unknown
                    cloud.x = Math.random() * screenWidth;
                    cloud.y = Math.random() * screenHeight;
                    break;
            }
        } catch(e) {
            console.error("CloudsManager: Erro ao reposicionar nuvem:", e);
            // Safe fallback
            cloud.x = Math.random() * screenWidth;
            cloud.y = Math.random() * screenHeight;
        }
        
        // Reset alpha for fade-in
        cloud.alpha = 0;
        
        // Validate position after reset
        if (isNaN(cloud.x) || isNaN(cloud.y)) {
            console.warn(`CloudsManager: Posição inválida após reset, usando valores seguros`);
            cloud.x = Math.random() * screenWidth;
            cloud.y = Math.random() * screenHeight;
        }
    }
    
    /**
     * Hide all clouds (used for dark theme)
     */
    hideAllClouds() 
    {
        console.log("CloudsManager: Ocultando todas as nuvens");
        
        // Get clouds container if not already set
        if (!this.cloudsContainer) {
            this.getCloudsContainer();
        }
        
        if (this.cloudsContainer) 
        {
            this.cloudsContainer.visible = false;
            console.log("CloudsManager: Nuvens ocultadas para tema escuro");
        }
    }
    
    /**
     * Update for theme change
     */
    updateTheme(theme) 
    {
        console.log(`CloudsManager: Atualizando para tema: ${theme}`);
        
        if (theme === 'dark') 
        {
            this.hideAllClouds();
        } 
        else 
        {
            if (this.cloudsContainer) 
            {
                this.cloudsContainer.visible = true;
                // Refresh clouds
                this.createClouds();
            } 
            else 
            {
                this.init(theme);
            }
        }
    }
    
    /**
     * Handle resize events
     */
    onResize() 
    {
        console.log("CloudsManager: Evento de redimensionamento detectado");
        
        // Recreate clouds on resize
        if (this.cloudsContainer && this.cloudsContainer.parent) 
        {
            this.createClouds();
            console.log("CloudsManager: Nuvens recriadas após redimensionamento");
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() 
    {
        console.log("CloudsManager: Destruindo e limpando recursos");
        
        // Remove ticker
        if (this.app && this.app.ticker && this.tickerFunction) 
        {
            this.app.ticker.remove(this.tickerFunction);
        }
        
        // Clear sprites but don't remove the container since it's managed by SceneManager
        if (this.cloudsContainer) {
            this.cloudsContainer.removeChildren();
        }
        
        // Clear references
        this.cloudSprites = [];
        this.cloudTextures = [];
        this.lastResetTime = {};
        
        console.log("CloudsManager: Recursos limpos com sucesso");
    }
}

// Make CloudsManager globally available
window.CloudsManager = CloudsManager;