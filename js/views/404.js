/**
 * 404 page content creator for Pixi.js
 * Creates animated player with themed RPG message
 */
export default function notFound404(container, app, assetManager) 
{
    console.log("404 function called for Pixi content!");
    
    // ===== CONFIGURAÇÃO CENTRALIZADA - MUDE APENAS AQUI! =====
    const CONFIG = {
        // Posições em % da altura da tela
        title: { y: 0.08 },           // 404 título
        mainMessage: { y: 0.14 },     // "There's nothing to fight here..."
        subtitle: { y: 0.18 },        // "You're off the path..."
        player: { y: 0.23 },          // Player animado
        button: { y: 0.35 }           // Botão "Return to quest"
    };
    // ========================================================
    
    // 404 Title with RPG styling
    const title404 = new PIXI.Text("404", {
        fontFamily: "Honk, serif",
        fontSize: 72,
        fill: 0xff3366,
        fontWeight: "bold",
        stroke: 0x000000,
        strokeThickness: 3
    });
    title404.anchor.set(0.5, 0);
    title404.position.set(app.screen.width / 2, app.screen.height * CONFIG.title.y);
    title404.name = 'title404';
    container.addChild(title404);
    
    // Main RPG message
    const mainMessage = new PIXI.Text("There's nothing to fight here...", {
        fontFamily: "Honk, serif",
        fontSize: 32,
        fill: 0xffcc33,
        fontWeight: "bold",
        align: 'center'
    });
    mainMessage.anchor.set(0.5, 0);
    mainMessage.position.set(app.screen.width / 2, app.screen.height * CONFIG.mainMessage.y);
    mainMessage.name = 'mainMessage';
    container.addChild(mainMessage);
    
    // Subtitle message
    const subtitleMessage = new PIXI.Text("You're off the path. The real battle is the other way!", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        align: 'center',
        fontStyle: 'italic'
    });
    subtitleMessage.anchor.set(0.5, 0);
    subtitleMessage.position.set(app.screen.width / 2, app.screen.height * CONFIG.subtitle.y);
    subtitleMessage.name = 'subtitleMessage';
    container.addChild(subtitleMessage);
    
    // Create animated player sprite
    createAnimatedPlayer(container, app, assetManager, CONFIG);
    
    // Return to quest button (functional)
    createReturnButton(container, app, CONFIG);
    
    // Add ambient particles
    createAmbientParticles(container, app);
    
    // Handle window resize
    const resizeHandler = () => 
    {
        // Reposition elements on resize using CONFIG
        title404.position.set(app.screen.width / 2, app.screen.height * CONFIG.title.y);
        mainMessage.position.set(app.screen.width / 2, app.screen.height * CONFIG.mainMessage.y);
        subtitleMessage.position.set(app.screen.width / 2, app.screen.height * CONFIG.subtitle.y);
        
        // Update button position
        const buttonContainer = container.getChildByName('returnButton');
        if (buttonContainer) 
        {
            buttonContainer.position.set(app.screen.width / 2 - 140, app.screen.height * CONFIG.button.y);
        }
        
        // Update player position
        const playerContainer = container.getChildByName('playerContainer');
        if (playerContainer) 
        {
            playerContainer.position.set(app.screen.width / 2, app.screen.height * CONFIG.player.y);
        }
    };
    
    window.addEventListener('resize', resizeHandler);
    
    // Store resize handler for cleanup
    container.resizeHandler = resizeHandler;
    
    return true;
}

/**
 * Create animated player using attack animations only
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 * @param {Object} assetManager - Asset manager instance
 * @param {Object} config - Configuration object with positions
 */
function createAnimatedPlayer(container, app, assetManager, config) 
{
    // Get the player spritesheet from the asset manager
    const playerSpritesheet = assetManager?.getSpritesheet('player_spritesheet');
    
    if (!playerSpritesheet || !playerSpritesheet.textures) 
    {
        console.error("Player spritesheet not found!");
        createSimplePlayerPlaceholder(container, app, config);
        return;
    }
    
    console.log("Player spritesheet found with textures:", Object.keys(playerSpritesheet.textures));
    
    // Focus only on attack animations since those are working
    const attackAnimations = {
        attackFront: ['AtkFront-0', 'AtkFront-1', 'AtkFront-2', 'AtkFront-3', 'AtkFront-4', 'AtkFront-5'],
        attackLeft: ['AtkLeft-0', 'AtkLeft-1', 'AtkLeft-2', 'AtkLeft-3', 'AtkLeft-4', 'AtkLeft-5'],
        attackRight: ['AtkRight-0', 'AtkRight-1', 'AtkRight-2', 'AtkRight-3', 'AtkRight-4', 'AtkRight-5'],
        attackBack: ['AtkBack-0', 'AtkBack-1', 'AtkBack-2', 'AtkBack-3', 'AtkBack-4', 'AtkBack-5']
    };
    
    // Create player container for easier management
    const playerContainer = new PIXI.Container();
    playerContainer.name = 'playerContainer';
    playerContainer.position.set(app.screen.width / 2, app.screen.height * config.player.y);
    container.addChild(playerContainer);
    
    // Animation state management
    let currentAnimatedSprite = null;
    let currentDirection = 0; // 0: front, 1: left, 2: right, 3: back
    let animationTimer = 0;
    
    const directions = ['Front', 'Left', 'Right', 'Back'];
    const animationDuration = 120; // 2 seconds em frames (60fps * 2)
    
    /**
     * Create animated sprite for attack sequence
     * @param {string} animationKey - Key for attack animation
     * @returns {PIXI.AnimatedSprite|null} Created animated sprite
     */
    function createAttackSprite(animationKey)
    {
        const frameNames = attackAnimations[animationKey];
        if (!frameNames) return null;
        
        // Get textures for this sequence
        const textures = [];
        for (const frameName of frameNames)
        {
            if (playerSpritesheet.textures[frameName])
            {
                textures.push(playerSpritesheet.textures[frameName]);
            }
        }
        
        if (textures.length === 0) return null;
        
        const animatedSprite = new PIXI.AnimatedSprite(textures);
        animatedSprite.anchor.set(0.5, 0.5);
        animatedSprite.scale.set(3); // Make it bigger for visibility
        animatedSprite.animationSpeed = 0.15; // Slightly faster for attacks
        animatedSprite.loop = true;
        
        return animatedSprite;
    }
    
    /**
     * Switch to new attack animation
     * @param {number} dirIndex - Direction index (0-3)
     */
    function switchAttackAnimation(dirIndex)
    {
        console.log(`Switching to direction index: ${dirIndex} (${directions[dirIndex]})`);
        
        // Remove current sprite
        if (currentAnimatedSprite)
        {
            currentAnimatedSprite.stop();
            playerContainer.removeChild(currentAnimatedSprite);
            currentAnimatedSprite.destroy();
        }
        
        // Build attack animation key
        const animationKey = 'attack' + directions[dirIndex];
        
        console.log(`Creating attack animation: ${animationKey}`);
        
        // Create new animated sprite
        currentAnimatedSprite = createAttackSprite(animationKey);
        
        if (currentAnimatedSprite)
        {
            playerContainer.addChild(currentAnimatedSprite);
            currentAnimatedSprite.play();
            console.log(`Successfully created and started ${animationKey}`);
        }
        else
        {
            console.error(`Failed to create attack animation for ${animationKey}`);
        }
    }
    
    // Start with attack front animation
    switchAttackAnimation(currentDirection);
    
    // Animation cycle ticker - CORRIGIDO para frames
    const animationTicker = () => 
    {
        animationTimer++;
        
        // Change direction after duration (em frames)
        if (animationTimer >= animationDuration)
        {
            animationTimer = 0;
            currentDirection = (currentDirection + 1) % directions.length;
            console.log(`Changing to direction: ${directions[currentDirection]}`);
            switchAttackAnimation(currentDirection);
        }
        
        // Add subtle floating animation
        if (playerContainer)
        {
            const floatOffset = Math.sin(Date.now() * 0.001) * 5;
            playerContainer.y = (app.screen.height * config.player.y) + floatOffset;
        }
    };
    
    app.ticker.add(animationTicker);
}

/**
 * Create simple player placeholder when spritesheet fails
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 * @param {Object} config - Configuration object with positions
 */
function createSimplePlayerPlaceholder(container, app, config) 
{
    const playerContainer = new PIXI.Container();
    playerContainer.name = 'playerContainer';
    
    // Body
    const body = new PIXI.Graphics();
    body.beginFill(0x4CAF50);
    body.drawRect(-16, -24, 32, 48);
    body.endFill();
    
    // Head
    const head = new PIXI.Graphics();
    head.beginFill(0xFFDBB5);
    head.drawCircle(0, -32, 12);
    head.endFill();
    
    // Eyes
    const eye1 = new PIXI.Graphics();
    eye1.beginFill(0x000000);
    eye1.drawCircle(-4, -34, 2);
    eye1.endFill();
    
    const eye2 = new PIXI.Graphics();
    eye2.beginFill(0x000000);
    eye2.drawCircle(4, -34, 2);
    eye2.endFill();
    
    playerContainer.addChild(body, head, eye1, eye2);
    playerContainer.position.set(app.screen.width / 2, app.screen.height * config.player.y);
    playerContainer.scale.set(2);
    
    // Add blinking animation
    let blinkTimer = 0;
    const tickerFunction = () => 
    {
        blinkTimer += 0.02;
        if (Math.sin(blinkTimer * 3) > 0.9) 
        {
            eye1.visible = false;
            eye2.visible = false;
        } 
        else 
        {
            eye1.visible = true;
            eye2.visible = true;
        }
        
        // Floating animation
        const floatOffset = Math.sin(blinkTimer) * 3;
        playerContainer.y = (app.screen.height * config.player.y) + floatOffset;
    };
    
    app.ticker.add(tickerFunction);
    
    container.addChild(playerContainer);
}

/**
 * Create functional return button
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 * @param {Object} config - Configuration object with positions
 */
function createReturnButton(container, app, config) 
{
    const buttonContainer = new PIXI.Container();
    buttonContainer.name = 'returnButton';
    
    // Button background
    const buttonBg = new PIXI.Graphics();
    buttonBg.beginFill(0x2196F3, 0.9);
    buttonBg.lineStyle(3, 0x1976D2, 1);
    buttonBg.drawRoundedRect(0, 0, 280, 55, 25);
    buttonBg.endFill();
    
    // Button text
    const buttonText = new PIXI.Text("Return to the main quest", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    buttonText.anchor.set(0.5, 0.5);
    buttonText.position.set(140, 27.5);
    
    // Add components to button container
    buttonContainer.addChild(buttonBg, buttonText);
    buttonContainer.position.set(app.screen.width / 2 - 140, app.screen.height * config.button.y);
    
    // Make button interactive
    buttonContainer.interactive = true;
    buttonContainer.cursor = 'pointer';
    
    // Set hit area to ensure clicks work
    buttonContainer.hitArea = new PIXI.Rectangle(0, 0, 280, 55);
    
    // Hover effects
    buttonContainer.on('pointerover', () => 
    {
        buttonBg.tint = 0xdddddd;
        buttonContainer.scale.set(1.05);
    });
    
    buttonContainer.on('pointerout', () => 
    {
        buttonBg.tint = 0xffffff;
        buttonContainer.scale.set(1.0);
    });
    
    // Click handler - CORRIGIDO
    buttonContainer.on('pointerdown', () => 
    {
        console.log("Return button clicked!");
        window.location.hash = '#/';
    });
    
    buttonContainer.on('pointertap', () => 
    {
        console.log("Return button tapped!");
        window.location.hash = '#/';
    });
    
    container.addChild(buttonContainer);
}

/**
 * Create ambient particles for atmosphere - FIXED VERSION
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 */
function createAmbientParticles(container, app) 
{
    const particleContainer = new PIXI.Container();
    particleContainer.name = 'particleContainer';
    container.addChild(particleContainer);
    
    const particles = [];
    const particleCount = 30; // Aumentado de 15 para 30
    
    // Create particles
    for (let i = 0; i < particleCount; i++) 
    {
        const particle = new PIXI.Graphics();
        
        // More variety in particle types
        const particleType = Math.random();
        if (particleType < 0.3) 
        {
            // Circular particles - magical orbs
            particle.beginFill(0xffcc33, 0.7);
            particle.drawCircle(0, 0, Math.random() * 4 + 2);
            particle.endFill();
        } 
        else if (particleType < 0.6) 
        {
            // Square particles - runes
            const size = Math.random() * 5 + 2;
            particle.beginFill(0x33ccff, 0.6);
            particle.drawRect(-size/2, -size/2, size, size);
            particle.endFill();
        }
        else 
        {
            // Diamond particles - crystals
            const size = Math.random() * 4 + 2;
            particle.beginFill(0xff3366, 0.5);
            particle.moveTo(0, -size);
            particle.lineTo(size, 0);
            particle.lineTo(0, size);
            particle.lineTo(-size, 0);
            particle.closePath();
            particle.endFill();
        }
        
        // Initialize particle data
        const particleData = {
            graphic: particle,
            x: Math.random() * app.screen.width,
            y: Math.random() * app.screen.height,
            vx: (Math.random() - 0.5) * 1.5, // Velocidade maior
            vy: (Math.random() - 0.5) * 1.5,
            life: Math.random() * 400 + 300, // Vida mais longa
            maxLife: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.08
        };
        
        particleData.maxLife = particleData.life;
        
        // Set initial position
        particle.position.set(particleData.x, particleData.y);
        
        particleContainer.addChild(particle);
        particles.push(particleData);
    }
    
    // Animation ticker for particles - MELHORADO
    const particleTicker = () => 
    {
        particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Update rotation
            p.graphic.rotation += p.rotationSpeed;
            
            // Apply movement
            p.graphic.position.set(p.x, p.y);
            
            // Decrease life
            p.life--;
            
            // Fade out as life decreases
            const lifeRatio = p.life / p.maxLife;
            p.graphic.alpha = Math.max(0.1, lifeRatio * 0.9);
            
            // Add scale pulsing for more visual interest
            const pulse = Math.sin(Date.now() * 0.005 + p.x * 0.01) * 0.2 + 1;
            p.graphic.scale.set(pulse);
            
            // Reset particle when it dies
            if (p.life <= 0) 
            {
                p.x = Math.random() * app.screen.width;
                p.y = Math.random() * app.screen.height;
                p.vx = (Math.random() - 0.5) * 1.5;
                p.vy = (Math.random() - 0.5) * 1.5;
                p.life = p.maxLife;
                p.graphic.alpha = 0.9;
            }
            
            // Wrap around screen edges
            if (p.x > app.screen.width + 20) p.x = -20;
            if (p.x < -20) p.x = app.screen.width + 20;
            if (p.y > app.screen.height + 20) p.y = -20;
            if (p.y < -20) p.y = app.screen.height + 20;
        });
    };
    
    app.ticker.add(particleTicker);
}

// Legacy function for backwards compatibility
export function handleDirectAccess() 
{
    if (!window.location.hash && window.location.pathname !== "/") 
    {
        const path = window.location.pathname;
        let redirectTo = window.location.origin;
        
        if (path !== '/' && path !== '/index.html') 
        {
            redirectTo += '/#' + path;
        } 
        else 
        {
            redirectTo += '/#/';
        }
        
        console.log("Redirecting to hash version:", redirectTo);
        window.location.replace(redirectTo);
        return true;
    }
    return false;
}