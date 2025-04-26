class Game 
{
    constructor(canvasContainer) 
    {
      this.app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1});
      
      canvasContainer.appendChild(this.app.view);
      
      this.assetManager = new AssetManager(this);
      this.entityManager = new EntityManager(this);
      this.inputManager = new InputManager(this);
      this.sceneManager = new SceneManager(this);
      
      this.renderSystem = new RenderSystem(this);
      this.combatSystem = new CombatSystem(this);
      this.animationSystem = new AnimationSystem(this);
      
      this.assetManager.loadAssets().then(() => {this.initGame();});
    }
    
    initGame() 
    {
      this.createScene();

      this.player = this.createPlayer();
      
      this.createEnemies();
      
      this.app.ticker.add(deltaTime => this.update(deltaTime));
    }
    
    update(deltaTime) 
    {
      this.sceneManager.update(deltaTime);
      this.animationSystem.update(deltaTime);
      this.combatSystem.checkAttacks();
      this.renderSystem.update(deltaTime);
    }
}