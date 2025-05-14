/**
 * CloudsManager - Versão com Spritesheet JSON e Debugger
 */
class CloudsManager {
    constructor(app, backgroundGroup) {
        this.app = app;
        this.backgroundGroup = backgroundGroup;
        
        this.config = {
            minClouds: 8,
            maxClouds: 15,
            leftToRightDuration: 60,
            rightToLeftDuration: 80,
            diagonalDuration: 90,
            floatDuration: 25
        };
        
        this.cloudTextures = [];
        this.cloudSprites = [];
        this.cloudsContainer = null;
        this.spritesheet = null;
        
        // Debug habilitado por padrão para desenvolvimento
        this.debug = true;
    }
    
    /**
     * Inicializar sistema de nuvens
     */
    async init(theme) {
        // Pular criação de nuvens no tema escuro
        if (theme === 'dark') {
            console.log("Tema escuro, pulando criação de nuvens");
            this.hideAllClouds();
            return;
        }
        
        console.log("Inicializando CloudsManager com spritesheet...");
        
        // Carregar spritesheet
        await this.loadCloudSpritesheet();
        
        // Criar container
        this.createCloudContainer();
        
        // Criar nuvens
        this.createClouds();
        
        // Iniciar animações
        this.setupCloudAnimations();
        
        // Iniciar modo debug se habilitado
        if (this.debug) {
            this.debugClouds();
        }
        
        console.log("CloudsManager inicializado com spritesheet");
    }
    
    /**
     * Carregar spritesheet corretamente
     */
    async loadCloudSpritesheet() {
        this.cloudTextures = [];
        
        // Try to get processed spritesheet frames
        if (window.assetManager?.spritesheets?.['clouds_spritesheet']) {
            const spritesheet = window.assetManager.spritesheets['clouds_spritesheet'];
            
            // Extract individual frames
            if (spritesheet.textures) {
                this.cloudTextures = Object.values(spritesheet.textures);
                console.log(`Loaded ${this.cloudTextures.length} cloud frames from spritesheet`);
                return;
            }
        }
        
        // Try helper method from AssetManager
        if (window.assetManager?.getSpriteFrames) {
            const frames = window.assetManager.getSpriteFrames('clouds_spritesheet');
            if (frames?.length > 0) {
                this.cloudTextures = frames;
                return;
            }
        }
        
        // Fallback to single texture
        if (window.assetManager) {
            const cloudTexture = window.assetManager.getBackgroundTexture('light', 'clouds');
            if (cloudTexture) {
                this.cloudTextures.push(cloudTexture);
                
                // Create additional frames if texture is large enough
                if (cloudTexture.width > 200 && cloudTexture.height > 200) {
                    this.createFramesFromTexture(cloudTexture);
                }
            }
        }
        
        // Create fallback if no textures available
        if (this.cloudTextures.length === 0) {
            this.createFallbackCloudTextures();
        }
    }
    
    /**
     * Criar frames de uma textura grande
     */
    createFramesFromTexture(texture) {
        // Dividir a textura em regiões para criar variedade
        const regions = [
            // Região superior esquerda
            { x: 0, y: 0, width: texture.width / 2, height: texture.height / 2 },
            // Região superior direita
            { x: texture.width / 2, y: 0, width: texture.width / 2, height: texture.height / 2 },
            // Região inferior esquerda
            { x: 0, y: texture.height / 2, width: texture.width / 2, height: texture.height / 2 },
            // Região inferior direita
            { x: texture.width / 2, y: texture.height / 2, width: texture.width / 2, height: texture.height / 2 },
            // Centro
            { x: texture.width / 4, y: texture.height / 4, width: texture.width / 2, height: texture.height / 2 }
        ];
        
        // Criar texturas para cada região
        for (const region of regions) {
            const frame = new PIXI.Rectangle(
                region.x, 
                region.y, 
                region.width, 
                region.height
            );
            
            // Criar textura recortada
            const frameTexture = new PIXI.Texture(
                texture.baseTexture,
                frame
            );
            
            this.cloudTextures.push(frameTexture);
        }
        
        console.log(`${regions.length} frames adicionais criados da textura principal`);
    }
    
    /**
     * Criar texturas de fallback
     */
    createFallbackCloudTextures() {
        // Criar nuvens com Graphics
        for (let i = 0; i < 4; i++) {
            // Tamanhos diferentes para cada nuvem
            const sizes = [
                { width: 100, height: 60 },
                { width: 150, height: 80 },
                { width: 80, height: 50 },
                { width: 120, height: 70 }
            ];
            
            const size = sizes[i % sizes.length];
            
            // Criar gráfico de nuvem
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF, 0.8);
            
            // Diferentes formas de nuvem
            if (i % 3 === 0) {
                // Nuvem com círculos
                const radius = size.height / 2;
                graphics.drawCircle(0, 0, radius);
                graphics.drawCircle(radius * 0.8, -radius * 0.3, radius * 0.7);
                graphics.drawCircle(-radius * 0.8, -radius * 0.2, radius * 0.6);
                graphics.drawCircle(radius * 0.3, radius * 0.4, radius * 0.6);
                graphics.drawCircle(-radius * 0.4, radius * 0.3, radius * 0.5);
            } else if (i % 3 === 1) {
                // Nuvem com retângulo arredondado
                graphics.drawRoundedRect(
                    -size.width / 2, 
                    -size.height / 2, 
                    size.width, 
                    size.height, 
                    size.height / 2
                );
                
                // Adicionar alguns detalhes
                graphics.drawCircle(
                    -size.width / 4, 
                    -size.height / 3, 
                    size.height / 3
                );
                graphics.drawCircle(
                    size.width / 4, 
                    -size.height / 4, 
                    size.height / 3
                );
            } else {
                // Nuvem com elipses
                graphics.drawEllipse(0, 0, size.width / 2, size.height / 2);
                graphics.drawEllipse(
                    size.width / 3, 
                    -size.height / 4, 
                    size.width / 4, 
                    size.height / 3
                );
                graphics.drawEllipse(
                    -size.width / 3, 
                    -size.height / 5, 
                    size.width / 4, 
                    size.height / 3
                );
            }
            
            graphics.endFill();
            
            // Gerar textura
            try {
                const texture = this.app.renderer.generateTexture(graphics);
                this.cloudTextures.push(texture);
            } catch (error) {
                console.error("Erro ao gerar textura de nuvem:", error);
            }
        }
        
        console.log(`${this.cloudTextures.length} texturas de nuvem fallback criadas`);
    }
    
    /**
     * Criar container para as nuvens
     */
    createCloudContainer() {
        // Criar container
        this.cloudsContainer = new PIXI.Container();
        this.cloudsContainer.name = "clouds";
        this.cloudsContainer.zIndex = 9999; // Z-index muito alto para debug
        
        // Adicionar diretamente ao stage para garantir visibilidade
        this.app.stage.addChild(this.cloudsContainer);
        
        // Adicionar fundo colorido em modo debug
        if (this.debug) {
            const debugBackground = new PIXI.Graphics();
            debugBackground.beginFill(0xFF00FF, 0.1); // Rosa transparente
            debugBackground.drawRect(0, 0, this.app.screen.width, this.app.screen.height * 0.4);
            debugBackground.endFill();
            debugBackground.name = "debug-background";
            
            this.cloudsContainer.addChild(debugBackground);
            
            // Adicionar texto de debug
            const debugText = new PIXI.Text("CLOUDS CONTAINER DEBUG", {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFF0000,
                stroke: 0x000000,
                strokeThickness: 4
            });
            debugText.x = this.app.screen.width / 2 - 180;
            debugText.y = 20;
            debugText.name = "debug-text";
            
            this.cloudsContainer.addChild(debugText);
        }
        
        console.log("Container de nuvens criado no stage");
    }
    
    /**
     * Criar nuvens
     */
    createClouds() {
        // Limpar nuvens existentes
        this.cloudsContainer.removeChildren();
        this.cloudSprites = [];
        
        // Se estiver em modo debug, adicionar fundo novamente
        if (this.debug) {
            const debugBackground = new PIXI.Graphics();
            debugBackground.beginFill(0xFF00FF, 0.1); // Rosa transparente
            debugBackground.drawRect(0, 0, this.app.screen.width, this.app.screen.height * 0.4);
            debugBackground.endFill();
            debugBackground.name = "debug-background";
            
            this.cloudsContainer.addChild(debugBackground);
            
            // Adicionar texto de debug
            const debugText = new PIXI.Text("CLOUDS CONTAINER DEBUG", {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFF0000,
                stroke: 0x000000,
                strokeThickness: 4
            });
            debugText.x = this.app.screen.width / 2 - 180;
            debugText.y = 20;
            debugText.name = "debug-text";
            
            this.cloudsContainer.addChild(debugText);
        }
        
        if (this.cloudTextures.length === 0) {
            console.error("Nenhuma textura disponível para criar nuvens");
            return;
        }
        
        // Número de nuvens
        const cloudsCount = this.config.minClouds + 
            Math.floor(Math.random() * (this.config.maxClouds - this.config.minClouds + 1));
        
        console.log(`Criando ${cloudsCount} nuvens animadas`);
        
        // Tipos de animação
        const animationTypes = ['leftToRight', 'rightToLeft', 'diagonal', 'float'];
        
        for (let i = 0; i < cloudsCount; i++) {
            // Escolher tipo de animação
            const animType = animationTypes[i % animationTypes.length];
            
            // Criar sprite
            const cloud = this.createCloudSprite(i, animType);
            
            // Adicionar ao container
            this.cloudsContainer.addChild(cloud);
            this.cloudSprites.push(cloud);
            
            // Adicionar debug visual se necessário
            if (this.debug) {
                this.addDebugVisuals(cloud, i);
            }
        }
        
        console.log(`${this.cloudSprites.length} nuvens criadas com animações`);
    }
    
    /**
     * Criar sprite de nuvem com animação específica
     */
    createCloudSprite(index, animationType) {
        // Escolher textura aleatória
        const textureIndex = Math.floor(Math.random() * this.cloudTextures.length);
        const texture = this.cloudTextures[textureIndex];
        
        // Criar sprite
        const cloud = new PIXI.Sprite(texture);
        cloud.name = `cloud-${index}`;
        
        // Configurar âncora
        cloud.anchor.set(0.5, 0.5);
        
        // Opacidade - mais opaca para melhor visibilidade
        const opacityOptions = [0.7, 0.8, 0.9];
        cloud.alpha = opacityOptions[index % opacityOptions.length];
        cloud.originalAlpha = cloud.alpha; // Guardar para animações
        
        // Aplicar escala
        const baseScale = 0.6 + Math.random() * 0.5;
        cloud.scale.set(baseScale);
        
        // Dimensões seguras da tela
        const screenWidth = this.app.screen.width || 800;
        const screenHeight = (this.app.screen.height * 0.4) || 300;
        
        // Em modo debug, distribuir nuvens uniformemente pela tela
        if (this.debug) {
            // Distribuir em grade 4x2
            const cols = 4;
            const rows = 2;
            const col = index % cols;
            const row = Math.floor(index / cols) % rows;
            
            // Posicionar em grid
            cloud.x = (col + 0.5) * (screenWidth / cols);
            cloud.y = (row + 0.5) * (screenHeight / rows);
        } else {
            // Configurar animação
            cloud.animationType = animationType;
            cloud.elapsedTime = 0;
            
            // Configurar velocidades e posições baseadas no tipo
            switch(animationType) {
                case 'leftToRight':
                    cloud.x = -100;
                    cloud.y = Math.random() * screenHeight * 0.7;
                    cloud.vx = 0.3 + Math.random() * 0.3;
                    cloud.vy = 0;
                    cloud.duration = this.config.leftToRightDuration * 60;
                    break;
                    
                case 'rightToLeft':
                    cloud.x = screenWidth + 100;
                    cloud.y = screenHeight * 0.2 + Math.random() * (screenHeight * 0.5);
                    cloud.vx = -0.3 - Math.random() * 0.3;
                    cloud.vy = 0;
                    cloud.duration = this.config.rightToLeftDuration * 60;
                    break;
                    
                case 'diagonal':
                    cloud.x = -100;
                    cloud.y = screenHeight - Math.random() * 100;
                    cloud.vx = 0.2 + Math.random() * 0.2;
                    cloud.vy = -0.1 - Math.random() * 0.1;
                    cloud.duration = this.config.diagonalDuration * 60;
                    break;
                    
                case 'float':
                    cloud.x = screenWidth * Math.random();
                    cloud.y = screenHeight * 0.4 * Math.random();
                    cloud.vx = 0.05 * (Math.random() * 2 - 1);
                    cloud.floatPhase = Math.random() * Math.PI * 2;
                    cloud.floatSpeed = 0.01 + Math.random() * 0.02;
                    cloud.floatAmplitude = 10 + Math.random() * 10;
                    cloud.duration = this.config.floatDuration * 60;
                    // Inicializar lastXOffset para float
                    cloud.lastXOffset = 0;
                    break;
            }
        }
        
        return cloud;
    }
    
    /**
     * Adicionar visuais de debug a uma nuvem
     */
    addDebugVisuals(cloud, index) {
        // Adicionar borda de debug
        const border = new PIXI.Graphics();
        border.name = "debug-border";
        
        // Cor baseada no tipo de animação
        let color;
        switch (cloud.animationType) {
            case 'leftToRight': color = 0xFF0000; break; // Vermelho
            case 'rightToLeft': color = 0x00FF00; break; // Verde
            case 'diagonal': color = 0x0000FF; break;    // Azul
            case 'float': color = 0xFFFF00; break;       // Amarelo
            default: color = 0xFF00FF; break;            // Magenta
        }
        
        // Desenhar borda
        border.lineStyle(4, color, 0.8);
        border.drawRect(-cloud.width/2, -cloud.height/2, cloud.width, cloud.height);
        
        // Adicionar texto com índice
        const text = new PIXI.Text(`Cloud ${index}`, {
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0x000000,
            stroke: 0xFFFFFF,
            strokeThickness: 3
        });
        text.name = "debug-text";
        text.anchor.set(0.5);
        text.y = -cloud.height/2 - 20;
        
        // Adicionar elementos visuais à nuvem
        cloud.addChild(border);
        cloud.addChild(text);
    }
    
    /**
     * Ativar/desativar modo debug - chamado externamente com debugClouds()
     */
    debugClouds() {
        console.log("======= CLOUDS DEBUG START =======");
        
        // Diagnóstico do container de nuvens
        console.log("CLOUDS CONTAINER:", {
            exists: !!this.cloudsContainer,
            name: this.cloudsContainer?.name,
            visible: this.cloudsContainer?.visible,
            alpha: this.cloudsContainer?.alpha,
            position: { 
                x: this.cloudsContainer?.position.x, 
                y: this.cloudsContainer?.position.y 
            },
            zIndex: this.cloudsContainer?.zIndex,
            childrenCount: this.cloudsContainer?.children.length || 0
        });
        
        // Diagnóstico das nuvens
        console.log("CLOUD SPRITES:", {
            count: this.cloudSprites.length,
            sprites: this.cloudSprites.map((cloud, index) => {
                return {
                    index,
                    type: cloud.animationType,
                    position: { x: cloud.x, y: cloud.y },
                    alpha: cloud.alpha,
                    visible: cloud.visible,
                    scale: { x: cloud.scale.x, y: cloud.scale.y },
                    texture: cloud.texture ? {
                        width: cloud.texture.width,
                        height: cloud.texture.height,
                        valid: cloud.texture.valid
                    } : "No texture"
                };
            }).slice(0, 3) // Mostrar apenas as 3 primeiras para não lotar o console
        });
        
        // Toggle debug mode visual
        this._debugMode = !this._debugMode;
        
        if (this._debugMode) {
            console.log("DEBUG MODE ENABLED - Adding visual markers");
            
            // Forçar visibilidade do container
            this.cloudsContainer.alpha = 1;
            this.cloudsContainer.zIndex = 9999;
            
            // Adicionar um fundo de debug se não existir
            let debugBackground = this.cloudsContainer.getChildByName("debug-background");
            if (!debugBackground) {
                debugBackground = new PIXI.Graphics();
                debugBackground.name = "debug-background";
                this.cloudsContainer.addChildAt(debugBackground, 0);
            }
            
            // Desenhar um fundo mais visível
            debugBackground.clear();
            debugBackground.beginFill(0xFF00FF, 0.2);
            debugBackground.drawRect(0, 0, this.app.screen.width, this.app.screen.height * 0.4);
            debugBackground.endFill();
            
            // Adicionar texto de debug
            let debugText = this.cloudsContainer.getChildByName("debug-text");
            if (!debugText) {
                debugText = new PIXI.Text("CLOUDS CONTAINER DEBUG", {
                    fontFamily: "Arial",
                    fontSize: 24,
                    fill: 0xFF0000,
                    stroke: 0x000000,
                    strokeThickness: 4
                });
                debugText.name = "debug-text";
                this.cloudsContainer.addChild(debugText);
            }
            
            debugText.x = this.app.screen.width / 2 - 180;
            debugText.y = 20;
            
            // Forçar todas as nuvens a serem visíveis
            this.cloudSprites.forEach((cloud, index) => {
                // Tornar completamente visível
                cloud.alpha = 1;
                
                // Posicionar em grid para melhor visualização
                const cols = 4;
                const rows = 2;
                const col = index % cols;
                const row = Math.floor(index / cols) % rows;
                
                // Salvar posição original se ainda não foi salva
                if (!cloud._originalDebugValues) {
                    cloud._originalDebugValues = {
                        x: cloud.x,
                        y: cloud.y,
                        alpha: cloud.alpha
                    };
                }
                
                // Posicionar em grid
                cloud.x = (col + 0.5) * (this.app.screen.width / cols);
                cloud.y = (row + 0.5) * ((this.app.screen.height * 0.4) / rows);
                
                // Adicionar borda se não existir
                if (!cloud.getChildByName("debug-border")) {
                    this.addDebugVisuals(cloud, index);
                }
            });
            
            // Auto-desativar após 10 segundos
            setTimeout(() => {
                if (this._debugMode) {
                    this.debugClouds();
                }
            }, 10000);
        } else {
            console.log("DEBUG MODE DISABLED - Removing visual markers");
            
            // Restaurar z-index normal
            this.cloudsContainer.zIndex = 500;
            
            // Remover elementos de debug
            const debugBackground = this.cloudsContainer.getChildByName("debug-background");
            const debugText = this.cloudsContainer.getChildByName("debug-text");
            
            if (debugBackground) this.cloudsContainer.removeChild(debugBackground);
            if (debugText) this.cloudsContainer.removeChild(debugText);
            
            // Restaurar nuvens para posições normais
            this.cloudSprites.forEach(cloud => {
                // Restaurar valores originais
                if (cloud._originalDebugValues) {
                    cloud.x = cloud._originalDebugValues.x;
                    cloud.y = cloud._originalDebugValues.y;
                    cloud.alpha = cloud._originalDebugValues.alpha;
                    delete cloud._originalDebugValues;
                }
                
                // Remover bordas de debug
                const border = cloud.getChildByName("debug-border");
                const text = cloud.getChildByName("debug-text");
                
                if (border) cloud.removeChild(border);
                if (text) cloud.removeChild(text);
            });
            
            // Recriar as nuvens para posições normais
            this.createClouds();
        }
        
        console.log("======= CLOUDS DEBUG END =======");
        
        return "Debug mode " + (this._debugMode ? "enabled" : "disabled");
    }
    
    /**
     * Configurar animações das nuvens
     */
    setupCloudAnimations() {
        // Ticker para animar as nuvens
        this.tickerFunction = (delta) => {
            // Skip animation in debug mode with fixed positions
            if (this._debugMode) return;
            
            if (!this.cloudsContainer || !this.cloudsContainer.parent) return;
            
            const screenWidth = this.app.screen.width || 800;
            const screenHeight = (this.app.screen.height * 0.4) || 300;
            
            for (let i = 0; i < this.cloudSprites.length; i++) {
                const cloud = this.cloudSprites[i];
                if (!cloud || !cloud.parent) continue;
                
                cloud.elapsedTime += delta;
                
                // Animação baseada no tipo
                switch (cloud.animationType) {
                    case 'leftToRight':
                    case 'rightToLeft':
                    case 'diagonal':
                        // Movimento linear
                        cloud.x += cloud.vx * delta;
                        cloud.y += (cloud.vy || 0) * delta;
                        
                        // Ajuste de alpha para fade in/out
                        const progress = (cloud.elapsedTime % cloud.duration) / cloud.duration;
                        if (progress < 0.1) {
                            // Fade in
                            cloud.alpha = cloud.originalAlpha * (progress * 10);
                        } else if (progress > 0.8) {
                            // Fade out
                            cloud.alpha = cloud.originalAlpha * ((1 - progress) * 5);
                        } else {
                            // Visibilidade normal
                            cloud.alpha = cloud.originalAlpha;
                        }
                        break;
                        
                    case 'float':
                        // Movimento sinusoidal
                        cloud.floatPhase += cloud.floatSpeed * delta;
                        const xOffset = Math.sin(cloud.floatPhase) * cloud.floatAmplitude;
                        
                        // Calcular diferença do último offset
                        const offsetDiff = xOffset - (cloud.lastXOffset || 0);
                        
                        // Aplicar movimento
                        cloud.x += (cloud.vx || 0) + offsetDiff;
                        cloud.lastXOffset = xOffset;
                        break;
                }
                
                // Reposicionar nuvens que saem da tela
                const cloudWidth = cloud.width || 100;
                const cloudHeight = cloud.height || 100;
                
                if (cloud.x < -cloudWidth || 
                    cloud.x > screenWidth + cloudWidth ||
                    cloud.y < -cloudHeight || 
                    cloud.y > screenHeight + cloudHeight) {
                    
                    this.resetCloudPosition(cloud);
                }
            }
        };
        
        // Adicionar ticker
        if (this.app && this.app.ticker) {
            this.app.ticker.add(this.tickerFunction);
            console.log("Animações de nuvens iniciadas");
        }
    }
    
    /**
     * Reposicionar nuvem
     */
    resetCloudPosition(cloud) {
        const screenWidth = this.app.screen.width || 800;
        const screenHeight = (this.app.screen.height * 0.4) || 300;
        
        // Reposicionar baseado no tipo de animação
        switch(cloud.animationType) {
            case 'leftToRight':
                // Reiniciar da esquerda
                cloud.x = -cloud.width;
                cloud.y = Math.random() * screenHeight * 0.7;
                break;
                
            case 'rightToLeft':
                // Reiniciar da direita
                cloud.x = screenWidth + cloud.width;
                cloud.y = Math.random() * screenHeight * 0.7;
                break;
                
            case 'diagonal':
                // Reiniciar da esquerda/baixo
                cloud.x = -cloud.width;
                cloud.y = screenHeight - Math.random() * 100;
                break;
                
            case 'float':
                // Para float, apenas mover para o lado oposto
                if (cloud.x < 0) {
                    cloud.x = screenWidth + cloud.width/2;
                } else if (cloud.x > screenWidth) {
                    cloud.x = -cloud.width/2;
                } else {
                    // Se não saiu pelos lados, pode ter saído vertical
                    if (cloud.y < 0) {
                        cloud.y = screenHeight * 0.4 * Math.random();
                    } else {
                        cloud.y = screenHeight * 0.4 * Math.random();
                    }
                }
                
                // Resetar fase de float
                cloud.lastXOffset = 0;
                break;
        }
        
        // Resetar alpha para animação
        cloud.alpha = 0; // Começar invisível para fade in
    }
    
    /**
     * Ocultar todas as nuvens
     */
    hideAllClouds() {
        if (this.cloudsContainer) {
            this.cloudsContainer.visible = false;
            console.log("Nuvens ocultadas para tema escuro");
        }
    }
    
    /**
     * Atualizar para tema
     */
    updateTheme(theme) {
        if (theme === 'dark') {
            this.hideAllClouds();
        } else if (this.cloudsContainer) {
            this.cloudsContainer.visible = true;
        } else {
            this.init(theme);
        }
    }
    
    /**
     * Lidar com redimensionamento
     */
    onResize() {
        // Atualizar nuvens se o container existe
        if (this.cloudsContainer && this.cloudsContainer.parent) {
            this.createClouds();
            console.log("Nuvens recriadas após redimensionamento");
        }
    }
    
    /**
     * Limpar recursos
     */
    destroy() {
        // Remover ticker
        if (this.app && this.app.ticker && this.tickerFunction) {
            this.app.ticker.remove(this.tickerFunction);
        }
        
        // Remover container
        if (this.cloudsContainer && this.cloudsContainer.parent) {
            this.cloudsContainer.parent.removeChild(this.cloudsContainer);
        }
        
        // Limpar referências
        this.cloudSprites = [];
        this.cloudTextures = [];
        this.spritesheet = null;
    }
}

// Disponibilizar globalmente
window.CloudsManager = CloudsManager;
console.log("CloudsManager.js carregado com spritesheet support e debugger");