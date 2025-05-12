/**
 * Loading Screen with Magical Sword Effect
 * Display animation while assets are loaded by AssetsManager
 */


class LoadingScreen 
{
    constructor() 
    {
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
        // Step 1: Add completion visual effects while keeping loading screen visible
        this.loadingScreen.classList.add('loading-complete');
        setTimeout(async () => {
            // Step 2: Load scripts and initialize site behind the loading screen
            await this.loadScripts();
            await this.initSite();
            // Step 3: Begin the fade-out transition of the loading screen
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                // Step 4: Completely remove loading screen and reveal the main content
                this.loadingScreen.style.display = 'none';
                this.mainContent.style.opacity = '1';
            }, 150);
        }, 100);
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

    // Creates render groups to separate background and gameplay elements
    createRenderGroups(app)
    {
        // Create a background group for parallax layers
        const backgroundGroup = new PIXI.Container();
        backgroundGroup.name = "backgroundGroup";
        
        // Create a gameplay group for game entities (player, monsters, etc.)
        const gameplayGroup = new PIXI.Container();
        gameplayGroup.name = "gameplayGroup";
        
        // Create a UI group for HUD elements
        const uiGroup = new PIXI.Container();
        uiGroup.name = "uiGroup";
        
        // Add all groups to the stage in the correct order
        app.stage.addChild(backgroundGroup);
        app.stage.addChild(gameplayGroup);
        app.stage.addChild(uiGroup);
        
        console.log("Render groups created for background, gameplay, and UI");
        
        // Return the created groups for use by initSite
        return {
            backgroundGroup,
            gameplayGroup,
            uiGroup
        };
    }

    async initSite() 
    {
        console.log("===== INÍCIO DE initSite() =====");

        const currentTheme = localStorage.getItem('theme') || 'light';
        console.log(`Tema atual: ${currentTheme}`);

        const sceneElement = document.getElementById('main-scene');
        const gameContainer = document.getElementById('game-container');
        //////////////////////
        if (!sceneElement) {
            console.error("ERROR: Elemento 'main-scene' não encontrado!");
            return;
        }
        if (!gameContainer) {
            console.error("ERROR: Elemento 'game-container' não encontrado!");
            return;
        }

        console.log("Elementos DOM encontrados:", {
            scene: {
                id: sceneElement.id,
                clientWidth: sceneElement.clientWidth,
                clientHeight: sceneElement.clientHeight
            },
            gameContainer: {
                id: gameContainer.id,
                clientWidth: gameContainer.clientWidth,
                clientHeight: gameContainer.clientHeight
            }
        });
        //////////////////////////
        console.log("Inicializando PIXI Application...");
        const app = new PIXI.Application();
        await app.init({
            background: 0x000000,
            backgroundAlpha: 0,
            resizeTo: sceneElement,  
            antialias: true
        });
        sceneElement.appendChild(app.canvas);
        sceneElement.style.height = '200vh';
        console.log("Canvas anexado ao elemento:", app.canvas.parentElement.id);
        console.log("Dimensões do canvas:", { 
            width: app.canvas.width, 
            height: app.canvas.height 
        });
        
        // Create render groups using the dedicated method
        const { backgroundGroup, gameplayGroup, uiGroup } = this.createRenderGroups(app);
        
        if (window.initSceneManager) 
        {
            window.initSceneManager();
            if (window.sceneManager) 
            {
                window.sceneManager.setBackgroundGroup(backgroundGroup, app);
                window.sceneManager.applyTheme(currentTheme);
            }
        }
        
        if (window.Game) 
        {
            window.game = new Game();
            window.game.setGameplayGroup(gameplayGroup, app, gameContainer);
        }
        
        if (window.CloudsManager && !window.cloudsManager) {
            console.log("Creating CloudsManager instance");
            window.cloudsManager = new CloudsManager(app, backgroundGroup);
            console.log("Initializing CloudsManager with theme:", currentTheme);
            window.cloudsManager.init(currentTheme);
            console.log("CloudsManager initialization completed");
        } else {
            console.error("CloudsManager not available:", { 
                classExists: !!window.CloudsManager, 
                instanceExists: !!window.cloudsManager 
            });
        }

console.log("Verificando layout inicial...");

// Verificar se estamos em uma tela grande com layout incorreto
if (window.innerWidth > 768) {
    console.log("Tela grande detectada, verificando layout");
    
    // Verificar se o layout está incorreto (navbar expandida mas não visível)
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && !navbarCollapse.classList.contains('show')) {
        console.log("Layout incorreto detectado em tela grande, forçando correção");
        
        // Forçar a classe show no navbar-collapse
        navbarCollapse.classList.add('show');
        
        // Atualizar o estado do botão toggle, se existir
        if (navbarToggler) {
            navbarToggler.setAttribute('aria-expanded', 'true');
        }
        
        // Disparar um resize para garantir que outros componentes se ajustem
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            console.log("Evento de resize disparado para corrigir layout");
        }, 100);
    }
}

        console.log('Site initialization complete');
    }
}

// Initialize loading screen and expose scripts to load
window.coreScripts = [
    // // Core Scripts
    // './js/core/Component.js',
    // './js/core/GameObjects.js',
    // './js/core/Game.js',
    
    // // Component Scripts
    // './js/components/SpriteComponent.js',
    // './js/components/InputComponent.js',
    './js/components/MovementComponent.js',
    './js/components/SwordButtonComponent.js',
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
    './js/manager/SceneManager.js',
    './js/manager/CloudsManager.js',
    // './js/manager/GameAreaManager.js',
    './js/manager/ParallaxEffect.js',
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