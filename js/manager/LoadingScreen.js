    /**
     * Loading Screen with Magical Sword Effect
     * Display animation while assets are loaded by AssetsManager
     */


    class LoadingScreen {
        constructor() {
            // Loading state
            this.progress = 0;
            this.completed = false;
    
            // DOM Elements
            this.loadingBar = document.getElementById('loading-bar');
            this.loadingText = document.getElementById('loading-text');
            this.loadingScreen = document.getElementById('loading-screen');
            this.mainContent = document.querySelector('.main-content');
    
            // Initialize
            this.updateProgress(0);
            this.createCSSParticles();
            this.startLoading();
        }
    
        createCSSParticles() 
        {
            const container = document.createElement('div');
            container.className = 'particles-container';
            this.loadingScreen.appendChild(container);
            
            for (let i = 0; i < 500; i++) 
            {
                const particle = document.createElement('div');
                particle.className = 'particle';
                // Random size
                const size = Math.random() * 8 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                // Random animation speed and delay
                const animDuration = Math.random() * 4 + 3;
                const delay = Math.random() * 5;
                // Apply animation
                particle.style.animation = `particleFloat ${animDuration}s ease-in-out ${delay}s infinite`;
                // Add particle to container
                container.appendChild(particle);
            }
        }


        updateProgress(value) 
        {
            this.progress = value;
            this.loadingBar.style.width = `${value}%`;
            this.loadingText.textContent = `Loading Magic... ${value}%`;
        }
        
        // Start loading assets
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
            
            // Add completion class for special effects
            this.loadingScreen.classList.add('loading-complete');
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
                    if (index >= scripts.length) 
                    {
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
        
        // Initialize the game
        initGame() 
        {
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (window.assetManager) {
                window.assetManager.applyBackgroundsToCSS(currentTheme);
            }
            
            const gameContainer = document.getElementById('game-container');
            if (window.Game) {
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