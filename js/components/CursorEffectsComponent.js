/**
 * CursorEffectComponent.js
 * 
 * Componente para efeitos de cursor usando PIXI.js, integrando com o uiGroup existente
 * Inclui partículas geométricas, cursor personalizado por tema, e iluminação no modo escuro
 */

class CursorEffectComponent {
  constructor(game, app, uiGroup, options = {}) {
    // Referências ao sistema
    this.game = game;
    this.app = app;
    this.uiGroup = uiGroup;
    
    // Verificar se temos as dependências necessárias
    if (!this.app || !this.uiGroup) {
      console.error("CursorEffectComponent: app e uiGroup são obrigatórios");
      return;
    }
    
    // Configurações padrão
    this.config = {
      particlesEnabled: true,
      lightEnabled: true,
      cursorSize: 32,  // Tamanho do cursor em pixels
      particlesCount: 3, // Quantidade de partículas
      particlesLifespan: 60, // Duração em frames
      lightSize: 350,   // Tamanho do efeito de luz
      lightIntensity: 0.4, // Intensidade da luz (0-1)
      cursorImageLight: 'assets/cursors/sword-light.png', // Cursor no tema claro
      cursorImageDark: 'assets/cursors/sword-dark.png',   // Cursor no tema escuro
      ...options
    };

    // Estado interno
    this.currentTheme = 'light';
    this.isInitialized = false;
    this.particles = [];
    this.cursorPos = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.particleContainer = null;
    this.lightContainer = null;
    this.cursorSprite = null;
    this.lightSprite = null;
    
    // Textures
    this.cursorLightTexture = null;
    this.cursorDarkTexture = null;
    this.lightTexture = null;
    
    // Formas das partículas
    this.particleShapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
    
    // Cores para as partículas por tema
    this.particleColors = {
      light: [
        0xFF5252, // vermelho
        0xFF7B25, // laranja
        0xFFC107, // amarelo
        0x4CAF50, // verde
        0x2196F3, // azul
        0x9C27B0, // roxo
        0xE91E63  // rosa
      ],
      dark: [
        0xFF9800, // laranja
        0xFFC107, // amarelo
        0xFFEB3B, // amarelo claro
        0x8BC34A, // verde claro
        0x4FC3F7, // azul claro
        0xE040FB, // roxo claro
        0xF48FB1  // rosa claro
      ]
    };
    
    // Inicializar
    this.init();
  }

  /**
   * Inicializa o componente
   */
  init() {
    if (this.isInitialized) return;
    
    // Detectar tema inicial
    this.detectTheme();
    
    // Configurar containers PIXI
    this.setupContainers();
    
    // Carregar texturas
    this.loadTextures().then(() => {
      // Criar cursor sprite
      this.createCursorSprite();
      
      // Criar efeito de luz
      this.createLightEffect();
      
      // Esconder cursor padrão
      document.body.style.cursor = 'none';
      
      console.log("CursorEffectComponent: texturas carregadas e sprites criados");
    });
    
    // Configurar observador para mudanças de tema
    this.observeThemeChanges();
    
    // Adicionar event listeners
    this.bindEvents();
    
    this.isInitialized = true;
    console.log("CursorEffectComponent initialized");
  }

  /**
   * Configura os containers PIXI para partículas e efeitos de luz
   */
  setupContainers() {
    // Container para partículas
    this.particleContainer = new PIXI.Container();
    this.particleContainer.name = "cursorParticles";
    this.particleContainer.sortableChildren = true;
    this.uiGroup.addChild(this.particleContainer);
    
    // Container para efeito de luz
    this.lightContainer = new PIXI.Container();
    this.lightContainer.name = "cursorLight";
    this.lightContainer.visible = this.currentTheme === 'dark';
    this.uiGroup.addChild(this.lightContainer);
    
    // Garantir que o uiGroup esteja à frente
    this.uiGroup.zIndex = 1000;
    
    // Se o container pai tem sortableChildren, forçar ordenação
    if (this.uiGroup.parent && this.uiGroup.parent.sortableChildren) {
      this.uiGroup.parent.sortChildren();
    }
  }

  /**
   * Carrega texturas para o cursor e efeito de luz
   */
  async loadTextures() {
    try {
      // Carregar texturas para cursores
      this.cursorLightTexture = await PIXI.Assets.load(this.config.cursorImageLight);
      this.cursorDarkTexture = await PIXI.Assets.load(this.config.cursorImageDark);
      
      // Criar textura para o efeito de luz
      this.createLightTexture();
      
      return true;
    } catch (error) {
      console.error("CursorEffectComponent: erro ao carregar texturas", error);
      return false;
    }
  }

  /**
   * Cria a textura para o efeito de luz pixelada
   */
  // Modifique a função createLightTexture() para um efeito mais visível
  createLightTexture() {
      // Criar um canvas temporário para gerar a textura
      const size = 256; // Aumentar o tamanho
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = size;
      canvas.height = size;
      
      // Desenhar gradiente radial com cores mais intensas
      const gradient = context.createRadialGradient(
        size/2, size/2, 0,
        size/2, size/2, size/2
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 220, 1.0)');    // Centro mais brilhante
      gradient.addColorStop(0.2, 'rgba(255, 230, 150, 0.8)');  // Meio mais visível
      gradient.addColorStop(0.7, 'rgba(255, 200, 100, 0.3)');
      gradient.addColorStop(1, 'rgba(100, 50, 0, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      
      // Aplicar efeito pixelado
      const pixelSize = 4;
      const pixelatedCanvas = document.createElement('canvas');
      const pixelatedContext = pixelatedCanvas.getContext('2d');
      
      pixelatedCanvas.width = size;
      pixelatedCanvas.height = size;
      
      // Reduzir e ampliar para criar o efeito pixelado
      pixelatedContext.drawImage(canvas, 0, 0, size/pixelSize, size/pixelSize);
      pixelatedContext.imageSmoothingEnabled = false;
      pixelatedContext.drawImage(
        pixelatedCanvas, 
        0, 0, size/pixelSize, size/pixelSize, 
        0, 0, size, size
      );
      
      // Criar textura PIXI a partir do canvas
      this.lightTexture = PIXI.Texture.from(pixelatedCanvas);
  }

  /**
   * Cria o sprite do cursor
   */
  createCursorSprite() {
    // Determinar qual textura usar
    const texture = this.currentTheme === 'dark' 
      ? this.cursorDarkTexture 
      : this.cursorLightTexture;
    
    // Criar sprite se não existir
    if (!this.cursorSprite) {
      this.cursorSprite = new PIXI.Sprite(texture);
      this.cursorSprite.anchor.set(0.5);
      this.cursorSprite.width = this.config.cursorSize;
      this.cursorSprite.height = this.config.cursorSize;
      this.cursorSprite.zIndex = 10;
      this.uiGroup.addChild(this.cursorSprite);
    } else {
      // Atualizar textura existente
      this.cursorSprite.texture = texture;
    }
  }

  /**
   * Cria o sprite para o efeito de luz
   */
  createLightEffect() {
      if (!this.lightTexture) return;
      
      // Criar sprite se não existir
      if (!this.lightSprite) {
        this.lightSprite = new PIXI.Sprite(this.lightTexture);
        this.lightSprite.anchor.set(0.5);
        this.lightSprite.width = this.config.lightSize * 2; // Dobrar o tamanho 
        this.lightSprite.height = this.config.lightSize * 2;
        this.lightSprite.alpha = Math.min(1.0, this.config.lightIntensity * 1.5); // Aumentar intensidade
        this.lightSprite.blendMode = PIXI.BLEND_MODES.ADD; // Mudar para ADD em vez de SCREEN
        this.lightContainer.addChild(this.lightSprite);
        
        // Garantir que o container de luz esteja visível no tema escuro
        this.lightContainer.visible = this.currentTheme === 'dark';
        console.log("Light effect created with visibility:", this.lightContainer.visible);
      }
  }

  /**
   * Detecta o tema atual
   */
  detectTheme() {
    // Verificar atributo data-theme no body
    const bodyTheme = document.body.getAttribute('data-theme');
    if (bodyTheme === 'dark' || bodyTheme === 'light') {
      this.currentTheme = bodyTheme;
      return;
    }
    
    // Verificar localStorage
    const localTheme = localStorage.getItem('theme');
    if (localTheme === 'dark' || localTheme === 'light') {
      this.currentTheme = localTheme;
      return;
    }
    
    // Verificar prefers-color-scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
      return;
    }
    
    // Padrão: tema claro
    this.currentTheme = 'light';
  }

  /**
   * Configura observador para mudanças de tema
   */
  observeThemeChanges() {
    // Observar mudanças no atributo data-theme do body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.body.getAttribute('data-theme');
          if (newTheme === 'dark' || newTheme === 'light') {
            this.onThemeChange(newTheme);
          }
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // Verificar localStorage periodicamente
    setInterval(() => {
      const localTheme = localStorage.getItem('theme');
      if (localTheme && localTheme !== this.currentTheme) {
        this.onThemeChange(localTheme);
      }
    }, 1000);
  }

  /**
   * Manipula mudanças de tema
   */
  onThemeChange(newTheme) {
    if (newTheme === this.currentTheme) return;
    
    this.currentTheme = newTheme;
    
    // Atualizar visibilidade do efeito de luz
    if (this.lightContainer) {
      this.lightContainer.visible = this.currentTheme === 'dark';
    }
    
    // Atualizar textura do cursor
    if (this.cursorSprite) {
      this.cursorSprite.texture = this.currentTheme === 'dark' 
        ? this.cursorDarkTexture 
        : this.cursorLightTexture;
    }
    
    console.log(`Theme changed to: ${this.currentTheme}`);
  }

  /**
   * Adiciona listeners de eventos
   */
  bindEvents() {
    // Usar o système de eventos do PIXI
    this.app.view.addEventListener('pointermove', this.onPointerMove.bind(this));
    
    // Adicionando ao ticker do PIXI para atualização a cada frame
    this.app.ticker.add(this.update, this);
  }

  /**
   * Manipulador para movimento do mouse/pointer
   */
  onPointerMove(e) {
    // Converter coordenadas do DOM para coordenadas PIXI
    const rect = this.app.view.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.cursorPos.x = x;
    this.cursorPos.y = y;
    
    // Calcular distância movida
    const dx = this.cursorPos.x - this.lastPos.x;
    const dy = this.cursorPos.y - this.lastPos.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Se movimento significativo, adicionar partículas
    if (distance > 1.5 && this.config.particlesEnabled) {
      // Calcular quantidade de partículas com base na velocidade
      const particleCount = Math.min(
        this.config.particlesCount,
        Math.floor(distance / 5) + 1
      );
      
      for (let i = 0; i < particleCount; i++) {
        this.addParticle(
          this.cursorPos.x - dx * (i / particleCount), 
          this.cursorPos.y - dy * (i / particleCount)
        );
      }
    }
    
    // Atualizar posição anterior
    this.lastPos.x = this.cursorPos.x;
    this.lastPos.y = this.cursorPos.y;
  }

  /**
   * Adiciona uma nova partícula
   */
  addParticle(x, y) {
    // Selecionar forma aleatória
    const shape = this.particleShapes[Math.floor(Math.random() * this.particleShapes.length)];
    
    // Selecionar cor aleatória com base no tema
    const colors = this.particleColors[this.currentTheme];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Criar gráfico para a partícula
    const graphics = new PIXI.Graphics();
    
    // Configurar a partícula
    const particle = {
      graphics,
      shape,
      color,
      x,
      y,
      size: 4 + Math.random() * 4,
      velocity: {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
        y: -0.4 + Math.random() * -1,
      },
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      life: this.config.particlesLifespan,
      initialLife: this.config.particlesLifespan,
    };
    
    // Adicionar ao container e à lista
    this.particleContainer.addChild(graphics);
    this.particles.push(particle);
    
    // Desenhar a forma inicial
    this.drawParticleShape(particle, particle.size, 0.8);
  }

  /**
   * Desenha a forma da partícula
   */
  drawParticleShape(particle, size, alpha) {
    const g = particle.graphics;
    g.clear();
    
    // Configurar estilo
    g.alpha = alpha;
    
    // Desenhar a forma
    switch (particle.shape) {
      case 'circle':
        g.beginFill(particle.color, alpha);
        g.drawCircle(0, 0, size);
        g.endFill();
        
        // Adicionar borda
        g.lineStyle(1, 0xFFFFFF, alpha * 0.3);
        g.drawCircle(0, 0, size);
        break;
        
      case 'square':
        g.beginFill(particle.color, alpha);
        g.drawRect(-size, -size, size * 2, size * 2);
        g.endFill();
        break;
        
      case 'triangle':
        g.beginFill(particle.color, alpha);
        g.moveTo(0, -size);
        g.lineTo(-size, size);
        g.lineTo(size, size);
        g.closePath();
        g.endFill();
        break;
        
      case 'diamond':
        g.beginFill(particle.color, alpha);
        g.moveTo(0, -size);
        g.lineTo(size, 0);
        g.lineTo(0, size);
        g.lineTo(-size, 0);
        g.closePath();
        g.endFill();
        break;
        
      case 'star':
        g.beginFill(particle.color, alpha);
        const outerRadius = size;
        const innerRadius = size / 2;
        const spikes = 5;
        
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          if (i === 0) {
            g.moveTo(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius
            );
          } else {
            g.lineTo(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius
            );
          }
        }
        g.closePath();
        g.endFill();
        break;
    }
    
    // Posicionar e rotacionar
    g.x = particle.x;
    g.y = particle.y;
    g.rotation = particle.rotation;
  }

  /**
   * Atualiza o componente a cada frame
   * @param {number} deltaTime - Tempo do frame
   */
  update(deltaTime) {
    // Atualizar posição do cursor
    if (this.cursorSprite) {
      this.cursorSprite.x = this.cursorPos.x;
      this.cursorSprite.y = this.cursorPos.y;
    }
    
    // Atualizar posição do efeito de luz
    if (this.lightSprite && this.currentTheme === 'dark' && this.config.lightEnabled) {
      this.lightSprite.x = this.cursorPos.x;
      this.lightSprite.y = this.cursorPos.y;
    }
    
    // Atualizar todas as partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Atualizar posição
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      
      // Adicionar aleatoriedade ao movimento
      p.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
      p.velocity.y -= Math.random() / 600;
      
      // Atualizar rotação
      p.rotation += p.rotationSpeed;
      
      // Reduzir vida
      p.life--;
      
      // Calcular escala e opacidade baseado na vida
      const lifeProgress = 1 - (p.life / p.initialLife);
      const scale = 0.2 + lifeProgress * 0.8;
      const size = p.size * scale;
      const opacity = p.life <= 0 ? 0 : Math.min(0.8, lifeProgress < 0.2 
        ? lifeProgress * 4 // Fade in
        : p.life < p.initialLife * 0.3 
          ? p.life / (p.initialLife * 0.3) // Fade out
          : 0.8); // Normal
      
      // Redesenhar partícula
      this.drawParticleShape(p, size, opacity);
      
      // Remover partícula morta
      if (p.life <= 0) {
        this.particleContainer.removeChild(p.graphics);
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Atualiza configurações do componente
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Atualizar tamanho do cursor
    if (this.cursorSprite) {
      this.cursorSprite.width = this.config.cursorSize;
      this.cursorSprite.height = this.config.cursorSize;
    }
    
    // Atualizar efeito de luz
    if (this.lightSprite) {
      this.lightSprite.width = this.config.lightSize;
      this.lightSprite.height = this.config.lightSize;
      this.lightSprite.alpha = this.config.lightIntensity;
    }
    
    // Recarregar texturas se os caminhos mudaram
    if (newConfig.cursorImageLight || newConfig.cursorImageDark) {
      this.loadTextures().then(() => {
        this.createCursorSprite();
      });
    }
    
    console.log("CursorEffectComponent config updated", this.config);
    return this;
  }

  /**
   * Define o tema manualmente
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.onThemeChange(theme);
    }
    return this;
  }

  /**
   * Retorna o tema atual
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Limpa recursos
   */
  destroy() {
    if (!this.isInitialized) return;
    
    // Remover do ticker
    this.app.ticker.remove(this.update, this);
    
    // Remover event listeners
    this.app.view.removeEventListener('pointermove', this.onPointerMove);
    
    // Limpar partículas
    for (const p of this.particles) {
      if (p.graphics && p.graphics.parent) {
        p.graphics.parent.removeChild(p.graphics);
      }
    }
    this.particles = [];
    
    // Remover sprites e containers
    if (this.particleContainer && this.particleContainer.parent) {
      this.particleContainer.parent.removeChild(this.particleContainer);
    }
    
    if (this.lightContainer && this.lightContainer.parent) {
      this.lightContainer.parent.removeChild(this.lightContainer);
    }
    
    if (this.cursorSprite && this.cursorSprite.parent) {
      this.cursorSprite.parent.removeChild(this.cursorSprite);
    }
    
    // Restaurar cursor padrão
    document.body.style.cursor = 'default';
    
    this.isInitialized = false;
    console.log("CursorEffectComponent destroyed");
  }
}

// Exportar para uso global ou como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CursorEffectComponent;
} else {
  window.CursorEffectComponent = CursorEffectComponent;
}