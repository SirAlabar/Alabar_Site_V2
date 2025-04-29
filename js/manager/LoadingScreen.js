    /**
     * Loading Screen with Magical Sword Effect
     * Display animation while assets are loaded by AssetsManager
     */

    class LoadingScreen
    {
        constructor()
        {
            //Pixi Application
            this.app = null;
            this.particleContainer = null;
            this.particles = [];
            this.swordOutline = null;
            this.maxParticles = 150;
            this.pixiInitialized = false;

            //Loading state
            this.progress = 0;
            this.completed = false;

            //DOM Elements
            this.loadingBar = document.getElementById('loading-bar');
            this.loadingText = document.getElementById('loading-text');
            this.loadingScreen = document.getElementById('loading-screen');
            this.mainContent = document.querySelector('.main-content');

            this.updateProgress(0);
            console.log("LoadingScreen: About to call init()");
            this.init();
            // Ask AssetManager to load assets and report progress
            console.log("LoadingScreen: About to call startLoading()");
            this.startLoading();
        }

        init()
        {
            console.log("LoadingScreen: init method called");
            try 
            {
                console.log("LoadingScreen: About to call initPixiApp()");
                // Initialize Pixi Application
                this.initPixiApp();
                console.log("LoadingScreen: After initPixiApp(), this.app=", this.app ? "defined" : "undefined");
                if (this.app && this.app.renderer)
                {
                    console.log("LoadingScreen: Setting up ticker");
                    // Start animation loop
                    this.app.ticker.add(this.update.bind(this));
                    // Create sword and particles
                    console.log("LoadingScreen: About to call createScene()");
                    this.createScene();
                    this.pixiInitialized = true;
                }
            }
            catch
            {
                console.error("Erro initializing PIXI:", error);
            }
        }

        initPixiApp() {
            try {
                const canvas = document.getElementById('loading-canvas');
                if (!canvas) {
                    console.warn('Canvas not found');
                    return;
                }
                
                this.app = new PIXI.Application({
                    view: canvas,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundColor: 0x000000,
                    resolution: window.devicePixelRatio || 1
                });
                
                if (this.app && this.app.renderer) {
                    // Resize event listener
                    window.addEventListener('resize', () => {
                        this.app.renderer.resize(window.innerWidth, window.innerHeight);
                        // Reposition sword in center
                        if (this.swordOutline) {
                            this.swordOutline.x = this.app.renderer.width / 2;
                            this.swordOutline.y = this.app.renderer.height / 2;
                        }
                    });
                }
            } catch (error) {
                console.error("Error initializing PIXI application:", error);
            }
        }

        // createScene()
        // {
        //     this.particleContainer = new PIXI.ParticleContainer(this.maxParticles, {
        //         scale: true,
        //         position: true,
        //         rotation: true,
        //         alpha: true
        //     });
        //     this.app.stage.addChild(this.particleContainer);
        //     this.createSwordOutline();
        //     this.createParticles();
        // }

        createScene() {
            console.log("LoadingScreen: createScene method called");
            try {
                if (!this.app || !this.app.stage) {
                    console.error("Cannot create scene - app or stage not initialized");
                    return;
                }
                
                this.particleContainer = new PIXI.ParticleContainer(this.maxParticles, {
                    scale: true,
                    position: true,
                    rotation: true,
                    alpha: true
                });
                
                this.app.stage.addChild(this.particleContainer);
                this.createSwordOutline();
                this.createParticles();
                
                // Force uma renderização inicial
                this.app.renderer.render(this.app.stage);
            } catch (error) {
                console.error("Error creating scene:", error);
            }
        }

        createSwordOutline()
        {
            console.log("LoadingScreen: createSwordOutline method called");
            this.swordOutline = new PIXI.Graphics();
            this.app.stage.addChild(this.swordOutline);
            this.drawSword();

            this.swordOutline.x = this.app.renderer.width / 2;
            this.swordOutline.y = this.app.renderer.height / 2;
        }

        drawSword()
        {
            console.log("LoadingScreen: drawSword method called");
            const graphics = this.swordOutline;
            graphics.clear();

            // Sword size proportional to screen
            const bladeLength = Math.min(this.app.renderer.height * 0.4, 300);
            const bladeWidth = bladeLength * 0.08;
            const guardWidth = bladeWidth * 3;
            const handleLength = bladeLength * 0.2;
            
            // Sword outline style
            graphics.lineStyle(2, 0x3366ff, 0.6);
            
            // Draw sword path
            graphics.moveTo(0, -bladeLength/2);     
            graphics.lineTo(bladeWidth/2, 0);
            graphics.lineTo(guardWidth/2, 0);       
            graphics.lineTo(guardWidth/2, 10);          
            graphics.lineTo(bladeWidth/2, 10);
            graphics.lineTo(bladeWidth/2, handleLength); 
            graphics.lineTo(0, handleLength + 10);
            graphics.lineTo(-bladeWidth/2, handleLength);
            graphics.lineTo(-bladeWidth/2, 10);
            graphics.lineTo(-guardWidth/2, 10);
            graphics.lineTo(-guardWidth/2, 0);
            graphics.lineTo(-bladeWidth/2, 0);
            graphics.lineTo(0, -bladeLength/2);
        }

        createParticles()
        {
            console.log("LoadingScreen: createParticles method called");
            for (let i = 0; i < this.maxParticles; i++)
            {
                this.createParticle();
            }
        }
        
        createParticle()
        {
            const particle = new PIXI.Sprite(PIXI.Texture.WHITE);

            const size = Math.random() * 5 + 1;
            particle.width = particle.height = size;
            particle.tint = this.getRandomColor();
            this.placeParticleAtEdge(particle);
            this.particleContainer.addChild(particle);
            this.particles.push({
                sprite: particle,
                speed: Math.random() * 2 + 0.5,
                angle: 0,
                rotation: (Math.random() - 0.5) * 0.1,
                alpha: Math.random() * 0.5 + 0.5,
                targetX: 0,
                targetY: 0,
                captured: false
            });
        }

        placeParticleAtEdge(particle) {
            const edge = Math.floor(Math.random() * 4); 
            
            switch (edge) {
                case 0: // Top
                    particle.x = Math.random() * this.app.renderer.width;
                    particle.y = -10;
                    break;
                case 1: // Right
                    particle.x = this.app.renderer.width + 10;
                    particle.y = Math.random() * this.app.renderer.height;
                    break;
                case 2: // Bottom
                    particle.x = Math.random() * this.app.renderer.width;
                    particle.y = this.app.renderer.height + 10;
                    break;
                case 3: // Left
                    particle.x = -10;
                    particle.y = Math.random() * this.app.renderer.height;
                    break;
            }
        }

        getRandomColor() {
            const colors = [
                0x3366ff, // Blue
                0x6633ff, // Purple
                0x33ccff, // Light blue
                0xff33cc, // Pink
                0xff3366  // Red
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(delta) {
            const centerX = this.app.renderer.width / 2;
            const centerY = this.app.renderer.height / 2;
            
            for (let i = 0; i < this.particles.length; i++) 
            {
                const p = this.particles[i];
                
                if (!p.captured) 
                {
                    const dx = centerX - p.sprite.x;
                    const dy = centerY - p.sprite.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 50 || this.completed) 
                    {

                        p.captured = true;
                        p.targetX = centerX + (Math.random() - 0.5) * 40;
                        p.targetY = centerY + (Math.random() - 0.5) * 180;
                    } 
                    else 
                    {
                        p.sprite.x += (dx / distance) * p.speed * delta;
                        p.sprite.y += (dy / distance) * p.speed * delta;
                        p.sprite.x += Math.sin(p.angle) * 0.8;
                        p.sprite.y += Math.cos(p.angle) * 0.8;
                        p.angle += 0.05;
                    }
                } 
                else 
                {

                    p.sprite.x += (p.targetX - p.sprite.x) * 0.05;
                    p.sprite.y += (p.targetY - p.sprite.y) * 0.05;
                    p.sprite.alpha = Math.min(this.progress / 100, 1) * 0.8 + 0.2;
                    p.sprite.rotation += p.rotation;
                }
                if (this.completed) 
                {
                    p.sprite.alpha = Math.min(p.sprite.alpha + 0.01, 1);
                    p.sprite.scale.x = p.sprite.scale.y = Math.min(p.sprite.scale.x + 0.01, 2);
                }
            }
            this.swordOutline.alpha = this.progress / 100;
        }
        
        updateProgress(value) 
        {
            this.progress = value;
            this.loadingBar.style.width = `${value}%`;
            this.loadingText.textContent = `Loading Magic... ${value}%`;
        }
        
        startLoading() 
        {
            if (!window.assetManager) 
            {
                window.assetManager = new AssetManager();
            }
            
            window.assetManager.onProgress = (progress) => {
                this.updateProgress(progress);
            };
            
            window.assetManager.onComplete = () => {
                this.onLoadingComplete();
            };
            window.assetManager.loadAllAssets();
        }
        
        onLoadingComplete() 
        {
            this.completed = true;
            setTimeout(() => {
                this.loadScripts().then(() => {
                    // Fade transitions
                    this.loadingScreen.classList.add('fade-out');
                    this.mainContent.style.opacity = '1';
                    // Remove loading screen and initialize
                    setTimeout(() => {
                        this.loadingScreen.style.display = 'none';
                        this.initGame();
                    }, 1000);
                });
            }, 1000);
        }
        
        loadScripts() 
        {
            const scripts = window.coreScripts || [];
            let loaded = 0;
            const total = scripts.length;
            
            return new Promise((resolve) => {
                if (scripts.length === 0) 
                {
                    resolve();
                    return;
                }
                const loadNextScript = (index) => {
                    if (index >= scripts.length) {
                        resolve();
                        return;
                    }
                    
                    const script = document.createElement('script');
                    script.src = scripts[index];
                    script.onload = () => {
                        loaded++;
                        this.loadingText.textContent = `Initializing... ${Math.floor((loaded / total) * 100)}%`;
                        loadNextScript(index + 1);
                    };
                    script.onerror = () => {
                        console.error(`Failed to load script: ${scripts[index]}`);
                        loaded++;
                        loadNextScript(index + 1);
                    };
                    
                    document.body.appendChild(script);
                };
                loadNextScript(0);
            });
        }
        
        initGame() 
        {
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (window.assetManager) {
                window.assetManager.applyBackgroundsToCSS(currentTheme);
            }
            
            const gameContainer = document.getElementById('game-container');
            if (window.Game) 
            {
                window.game = new Game(gameContainer);
            }
        }
    }

    // Initialize loading screen and expose scripts to load
    window.coreScripts = [
        // // Core Scripts
        // './js/core/Component.js',
        // './js/core/GameObjects.js',
        './js/core/Game.js',
        
        // // Component Scripts
        // './js/components/SpriteComponent.js',
        // './js/components/InputComponent.js',
        './js/components/MovementComponent.js',
        // './js/components/ColliderComponent.js',
        './js/components/HealthComponent.js',
        // './js/components/AIComponent.js',
        // './js/components/StateMachineComponent.js',
        
        // // System Scripts
        // './js/systems/RenderSystem.js',
        './js/systems/AnimationSystem.js',
        './js/systems/CombatSystem.js',
        
        // // Manager Scripts
        // './js/manager/EntityManager.js',
        './js/manager/InputManager.js',
        // './js/manager/SceneManager.js',
        // './js/manager/SpriteManager.js',
        
        // // Entity Scripts
        // './js/entities/Player.js',
        // './js/entities/monsters/Monster.js',
        
        // // Utility Scripts
        // './js/utils/MathUtils.js',
        // './js/utils/PixelCollision.js',
        
        // // Configurations
        // './js/config/monsters/slimeConfig.js',
        
    ];

    // Start loading screen when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        window.loadingScreen = new LoadingScreen();
    });