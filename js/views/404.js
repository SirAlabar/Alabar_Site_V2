/**
 * 404 page content creator for Pixi.js
 * Creates animated player with themed RPG message
 */
export default function notFound404(container, app, assetManager) 
{
    console.log("404 function called for Pixi content!");
    
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
    title404.position.set(app.screen.width / 2, 60);
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
    mainMessage.position.set(app.screen.width / 2, 140);
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
    subtitleMessage.position.set(app.screen.width / 2, 185);
    subtitleMessage.name = 'subtitleMessage';
    container.addChild(subtitleMessage);
    
    // Create animated player sprite
    createAnimatedPlayer(container, app, assetManager);
    
    // Return to quest button (functional)
    createReturnButton(container, app);
    
    // Add ambient particles
    createAmbientParticles(container, app);
    
    // Handle window resize
    const resizeHandler = () => 
    {
        // Reposition elements on resize
        title404.position.set(app.screen.width / 2, 60);
        mainMessage.position.set(app.screen.width / 2, 140);
        subtitleMessage.position.set(app.screen.width / 2, 185);
        
        // Update button position
        const buttonContainer = container.getChildByName('returnButton');
        if (buttonContainer) 
        {
            buttonContainer.position.set(app.screen.width / 2 - 140, app.screen.height * 0.35);
        }
        
        // Update player position
        const playerContainer = container.getChildByName('playerContainer');
        if (playerContainer) 
        {
            playerContainer.position.set(app.screen.width / 2, app.screen.height * 0.2);
        }
    };
    
    window.addEventListener('resize', resizeHandler);
    
    // Store resize handler for cleanup
    container.resizeHandler = resizeHandler;
    
    return true;
}

/**
 * Create animated player using the loaded spritesheet with cycling animations
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 * @param {Object} assetManager - Asset manager instance
 */
function createAnimatedPlayer(container, app, assetManager) 
{
    // Get the player spritesheet from the asset manager
    let playerSpritesheet = null;
    
    if (assetManager) 
    {
        playerSpritesheet = assetManager.getSpritesheet('player_spritesheet');
        console.log("AssetManager found, trying to get spritesheet...");
    }
    
    // If not found, try PIXI Assets cache as fallback
    if (!playerSpritesheet) 
    {
        try 
        {
            playerSpritesheet = PIXI.Assets.cache.get('player_spritesheet');
            console.log("Fallback: trying PIXI Assets cache...");
        } 
        catch (error) 
        {
            console.warn("Could not get spritesheet from PIXI.Assets cache");
        }
    }
    
    if (!playerSpritesheet || !playerSpritesheet.textures) 
    {
        console.error("Player spritesheet not found! Available cache:", Object.keys(PIXI.Assets.cache._cache || {}));
        return; // Just return, no fallback
    }
    
    console.log("Player spritesheet found with textures:", Object.keys(playerSpritesheet.textures));
    
    // Define animation sequences based on the JSON structure (using normal frames, not shadow)
    const animationSequences = {
        idleFront: ['IdleLeft-0', 'IdleLeft-1', 'IdleLeft-2', 'IdleLeft-3', 'IdleLeft-4', 'IdleLeft-5'],
        idleLeft: ['IdleLeft-0', 'IdleLeft-1', 'IdleLeft-2', 'IdleLeft-3', 'IdleLeft-4', 'IdleLeft-5'],
        idleRight: ['IdleRight-0', 'IdleRight-1', 'IdleRight-2', 'IdleRight-3', 'IdleRight-4', 'IdleRight-5'],
        idleBack: ['IdleLeft-0', 'IdleLeft-1', 'IdleLeft-2', 'IdleLeft-3'],
        
        walkFront: ['WalkFront-0', 'WalkFront-1', 'WalkFront-2', 'WalkFront-3', 'WalkFront-4', 'WalkFront-5'],
        walkLeft: ['WalkLeft-0', 'WalkLeft-1', 'WalkLeft-2', 'WalkLeft-3', 'WalkLeft-4', 'WalkLeft-5'],
        walkRight: ['WalkRight-0', 'WalkRight-1', 'WalkRight-2', 'WalkRight-3', 'WalkRight-4', 'WalkRight-5'],
        walkBack: ['WalkBack-0', 'WalkBack-1', 'WalkBack-2', 'WalkBack-3', 'WalkBack-4', 'WalkBack-5'],
        
        attackFront: ['AtkFront-0', 'AtkFront-1', 'AtkFront-2', 'AtkFront-3', 'AtkFront-4', 'AtkFront-5'],
        attackLeft: ['AtkLeft-0', 'AtkLeft-1', 'AtkLeft-2', 'AtkLeft-3', 'AtkLeft-4', 'AtkLeft-5'],
        attackRight: ['AtkRight-0', 'AtkRight-1', 'AtkRight-2', 'AtkRight-3', 'AtkRight-4', 'AtkRight-5'],
        attackBack: ['AtkBack-0', 'AtkBack-1', 'AtkBack-2', 'AtkBack-3', 'AtkBack-4', 'AtkBack-5']
    };
    
    // Create player container for easier management
    const playerContainer = new PIXI.Container();
    playerContainer.name = 'playerContainer';
    playerContainer.position.set(app.screen.width / 2, app.screen.height * 0.25); // 25% da altura da tela (mais alto)
    container.addChild(playerContainer);
    
    // Animation state management
    let currentAnimatedSprite = null;
    let currentDirection = 0; // 0: front, 1: left, 2: right, 3: back
    let currentAnimationType = 0; // 0: idle, 1: walk, 2: attack
    let animationTimer = 0;
    let directionTimer = 0;
    
    const directions = ['Front', 'Left', 'Right', 'Back'];
    const animationTypes = ['idle', 'walk', 'attack'];
    
    // Animation durations (in seconds)
    const animationDurations = {
        idle: 3.0,
        walk: 2.0,
        attack: 1.5
    };
    
    /**
     * Create animated sprite for specific animation sequence
     * @param {string} animationKey - Key for animation sequence
     * @returns {PIXI.AnimatedSprite|null} Created animated sprite
     */
    function createAnimatedSpriteForSequence(animationKey)
    {
        const frameNames = animationSequences[animationKey];
        if (!frameNames)
        {
            console.warn(`Animation sequence ${animationKey} not found`);
            return null;
        }
        
        // Get textures for this sequence
        const textures = [];
        for (const frameName of frameNames)
        {
            if (playerSpritesheet.textures[frameName])
            {
                textures.push(playerSpritesheet.textures[frameName]);
            }
            else
            {
                console.warn(`Frame ${frameName} not found in spritesheet`);
            }
        }
        
        if (textures.length === 0)
        {
            console.warn(`No valid textures found for ${animationKey}`);
            return null;
        }
        
        const animatedSprite = new PIXI.AnimatedSprite(textures);
        animatedSprite.anchor.set(0.5, 0.5);
        animatedSprite.scale.set(3); // Make it bigger for visibility
        animatedSprite.animationSpeed = 0.1;
        animatedSprite.loop = true;
        
        return animatedSprite;
    }
    
    /**
     * Switch to new animation
     * @param {number} dirIndex - Direction index (0-3)
     * @param {number} animIndex - Animation type index (0-2)
     */
    function switchAnimation(dirIndex, animIndex)
    {
        // Remove current sprite
        if (currentAnimatedSprite)
        {
            currentAnimatedSprite.stop();
            playerContainer.removeChild(currentAnimatedSprite);
            currentAnimatedSprite.destroy();
        }
        
        // Build animation key
        const direction = directions[dirIndex].toLowerCase();
        const animType = animationTypes[animIndex];
        const animationKey = animType + directions[dirIndex];
        
        console.log(`Switching to animation: ${animationKey}`);
        
        // Create new animated sprite
        currentAnimatedSprite = createAnimatedSpriteForSequence(animationKey);
        
        if (currentAnimatedSprite)
        {
            playerContainer.addChild(currentAnimatedSprite);
            currentAnimatedSprite.play();
        }
        else
        {
            console.error(`Failed to create animation for ${animationKey}`);
        }
    }
    
    // Start with idle front animation
    switchAnimation(currentDirection, currentAnimationType);
    
    // Animation cycle ticker
    const tickerFunction = (delta) => 
    {
        animationTimer += delta / 60; // Convert to seconds
        directionTimer += delta / 60;
        
        // Change animation type after duration
        if (animationTimer >= animationDurations[animationTypes[currentAnimationType]])
        {
            animationTimer = 0;
            currentAnimationType = (currentAnimationType + 1) % animationTypes.length;
            switchAnimation(currentDirection, currentAnimationType);
        }
        
        // Change direction every 6 seconds
        if (directionTimer >= 6.0)
        {
            directionTimer = 0;
            currentDirection = (currentDirection + 1) % directions.length;
            switchAnimation(currentDirection, currentAnimationType);
        }
        
        // Add subtle floating animation
        if (playerContainer)
        {
            const floatOffset = Math.sin(Date.now() * 0.001) * 5;
            playerContainer.y = (app.screen.height * 0.2) + floatOffset; // 20% da altura + float
        }
    };
    
    app.ticker.add(tickerFunction);
}

/**
 * Create simple player placeholder when spritesheet fails
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 */
function createSimplePlayerPlaceholder(container, app) 
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
    
    playerContainer.addChild(body);
    playerContainer.addChild(head);
    playerContainer.addChild(eye1);
    playerContainer.addChild(eye2);
    
    playerContainer.position.set(app.screen.width / 2, app.screen.height * 0.25); // 25% da altura da tela
    playerContainer.scale.set(2);
    
    // Add blinking animation
    let blinkTimer = 0;
    app.ticker.add(() => 
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
        playerContainer.y = (app.screen.height * 0.25) + floatOffset; // 25% da altura + float
    });
    
    container.addChild(playerContainer);
}

/**
 * Create functional return button
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 */
function createReturnButton(container, app) 
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
    buttonContainer.addChild(buttonBg);
    buttonContainer.addChild(buttonText);
    buttonContainer.position.set(app.screen.width / 2 - 140, app.screen.height * 0.35); // 35% da altura da tela (mais alto) (mais alto)
    
    // Make button interactive
    buttonContainer.interactive = true;
    buttonContainer.buttonMode = true;
    buttonContainer.cursor = 'pointer';
    
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
    
    // Click handler - FUNCTIONAL
    buttonContainer.on('pointerdown', () => 
    {
        console.log("Return button clicked!");
        // Navigate to home
        if (window.location) 
        {
            window.location.hash = '#/';
        }
    });
    
    container.addChild(buttonContainer);
}

/**
 * Create ambient particles for atmosphere
 * @param {PIXI.Container} container - Parent container
 * @param {PIXI.Application} app - Pixi application
 */
function createAmbientParticles(container, app) 
{
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) 
    {
        const particle = new PIXI.Graphics();
        
        // Random particle type
        const particleType = Math.random();
        if (particleType < 0.5) 
        {
            // Circular particles
            particle.beginFill(0xffcc33, 0.4);
            particle.drawCircle(0, 0, Math.random() * 2 + 1);
            particle.endFill();
        } 
        else 
        {
            // Square particles
            const size = Math.random() * 3 + 1;
            particle.beginFill(0x33ccff, 0.3);
            particle.drawRect(-size/2, -size/2, size, size);
            particle.endFill();
        }
        
        // Random position
        particle.position.set(
            Math.random() * app.screen.width,
            Math.random() * app.screen.height
        );
        
        // Random movement
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        particle.life = Math.random() * 5 + 2;
        particle.maxLife = particle.life;
        
        container.addChild(particle);
        
        // Animate particle
        app.ticker.add(() => 
        {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.01;
            
            // Fade out as life decreases
            particle.alpha = particle.life / particle.maxLife * 0.6;
            
            // Reset particle when it dies
            if (particle.life <= 0) 
            {
                particle.x = Math.random() * app.screen.width;
                particle.y = Math.random() * app.screen.height;
                particle.life = particle.maxLife;
                particle.vx = (Math.random() - 0.5) * 0.5;
                particle.vy = (Math.random() - 0.5) * 0.5;
            }
            
            // Wrap around screen
            if (particle.x > app.screen.width) particle.x = 0;
            if (particle.x < 0) particle.x = app.screen.width;
            if (particle.y > app.screen.height) particle.y = 0;
            if (particle.y < 0) particle.y = app.screen.height;
        });
    }
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