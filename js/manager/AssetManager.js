class AssetManager {
    constructor() {
        this.onProgress = null;
        this.onComplete = null;
        
        // Asset lists
        this.textures = {};
        this.backgrounds = {};
        
        // Loading state
        this.isLoading = false;
        
        // Asset paths configuration
        this.assetPaths = {
            player: {
                idle: './assets/images/player/Little_Leo_Idle.webp',
                idle_shadow: './assets/images/player/Little_Leo_Idle_Shadow.webp',
                walking: './assets/images/player/Little_Leo.webp',
                attacking: './assets/images/player/Sword_attack_full.webp',
                attacking_shadow: './assets/images/player/Sword_attack_full_shadow.webp',
                hurt: './assets/images/player/Sword_Hurt_full.webp',
                hurt_shadow: './assets/images/player/Sword_Hurt1_shadow.webp',
                walking_shadow: './assets/images/player/Sword_Walk1_shadow.webp'
            },
            monsters: {
                slime: {
                    idle: './assets/images/monsters/Slime1/Slime1_Idle_full.png',
                    idle_shadow: './assets/images/monsters/Slime1/Slime1_Idle_shadow.png',
                    walking: './assets/images/monsters/Slime1/Slime1_Walk.png',
                    walking_shadow: './assets/images/monsters/Slime1/Slime1_Walk_shadow.png',
                    attacking: './assets/images/monsters/Slime1/Slime1_Attack_full.png',
                    attacking_shadow: './assets/images/monsters/Slime1/Slime1_Attack_shadow.png',
                    hurt: './assets/images/monsters/Slime1/Slime1_Hurt_full.png',
                    hurt_shadow: './assets/images/monsters/Slime1/Slime1_Hurt_shadow.png',
                    dying: './assets/images/monsters/Slime1/Slime1_Death_full.png',
                    dying_shadow: './assets/images/monsters/Slime1/Slime1_Death_shadow.png'
                }
            },
            backgrounds: {
                light: {
                    backgroundColor: '#87CEEB',
                    mountain: './assets/images/background/light/mountain.png',
                    clouds: './assets/images/background/light/clouds.png',
                    castle: './assets/images/background/light/castle.png',
                    field1: './assets/images/background/light/field1.png',
                    field2: './assets/images/background/light/field2.png',
                    field3: './assets/images/background/light/field3.png',
                    field4: './assets/images/background/light/field4.png',
                    field5: './assets/images/background/light/field5.png',
                    field6: './assets/images/background/light/field6.png'
                },
                dark: {
                    backgroundColor: '#191970',
                    mountain: './assets/images/background/dark/mountain_night.png',
                    castle: './assets/images/background/dark/castle_night.png',
                    field1: './assets/images/background/dark/field1_night.png',
                    field2: './assets/images/background/dark/field2_night.png',
                    field3: './assets/images/background/dark/field3_night.png',
                    field4: './assets/images/background/dark/field4_night.png',
                    field5: './assets/images/background/dark/field5_night.png',
                    field6: './assets/images/background/dark/field6_night.png'
                }
            }
        };
    }
    
    loadAllAssets() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.updateProgress(0);
        this.initAssets()
            .then(() => this.loadAssets())
            .catch(error => {
                console.error("Error in asset loading:", error);
                this.isLoading = false;
            });
    }
    
    // Initialize PIXI Assets with manifest
    async initAssets() {
        const manifest = this.createManifest();
        await PIXI.Assets.init({manifest});
    }
    
    // Load all assets in bundles
    async loadAssets() {
        try {
            const manifest = this.createManifest();
            const bundleNames = manifest.bundles.map(bundle => bundle.name);
            let loadedBundles = 0;
            
            // Load each bundle and track progress
            for (const bundleName of bundleNames) {
                try {
                    const resources = await PIXI.Assets.loadBundle(bundleName, (progress) => {
                        const overallProgress = 
                            ((loadedBundles + progress) / bundleNames.length) * 100;
                        this.updateProgress(overallProgress);
                    });
                    
                    this.processLoadedResources(bundleName, resources);
                    loadedBundles++;
                } catch (error) {
                    console.error(`Error loading bundle ${bundleName}:`, error);
                }
            }
            
            this.isLoading = false;
            if (this.onComplete) {
                this.onComplete();
            }
        } catch (error) {
            throw error;
        }
    }
    
    // Create a manifest structure for PIXI.Assets
    createManifest() {
        const manifest = {
            bundles: []
        };
        
        // Player bundle
        const playerBundle = this.createPlayerBundle();
        manifest.bundles.push(playerBundle);
        
        // Monsters bundle
        const monstersBundle = this.createMonstersBundle();
        manifest.bundles.push(monstersBundle);
        
        // Background bundles
        const bgBundles = this.createBackgroundBundles();
        manifest.bundles.push(...bgBundles);
        
        return manifest;
    }
    
    // Create player assets bundle
    createPlayerBundle() {
        const playerBundle = {
            name: 'player',
            assets: []
        };
        
        for (const [key, src] of Object.entries(this.assetPaths.player)) {
            playerBundle.assets.push({
                alias: `player_${key}`,
                src
            });
        }
        
        return playerBundle;
    }
    
    // Create monsters assets bundle
    createMonstersBundle() {
        const monstersBundle = {
            name: 'monsters',
            assets: []
        };
        
        for (const [monsterType, animations] of Object.entries(this.assetPaths.monsters)) {
            for (const [key, src] of Object.entries(animations)) {
                monstersBundle.assets.push({
                    alias: `${monsterType}_${key}`,
                    src
                });
            }
        }
        
        return monstersBundle;
    }
    
    // Create background assets bundles
    createBackgroundBundles() {
        const bgBundles = [];
        
        for (const [theme, layers] of Object.entries(this.assetPaths.backgrounds)) {
            // Store background color
            if (!this.backgrounds[theme]) {
                this.backgrounds[theme] = {};
            }
            this.backgrounds[theme].backgroundColor = layers.backgroundColor;
            
            // Create bundle for this theme
            const themeBundle = {
                name: `bg_${theme}`,
                assets: []
            };
            
            for (const [key, src] of Object.entries(layers)) {
                if (key !== 'backgroundColor') {
                    themeBundle.assets.push({
                        alias: `${theme}_${key}`,
                        src
                    });
                }
            }
            
            bgBundles.push(themeBundle);
        }
        
        return bgBundles;
    }
    
    // Process resources after loading
    processLoadedResources(bundleName, resources) {
        if (bundleName === 'player') {
            this.processPlayerResources(resources);
        }
        else if (bundleName === 'monsters') {
            this.processMonsterResources(resources);
        }
        else if (bundleName.startsWith('bg_')) {
            this.processBackgroundResources(bundleName, resources);
        }
    }
    
    // Process player resources
    processPlayerResources(resources) {
        for (const [alias, texture] of Object.entries(resources)) {
            this.textures[alias] = texture;
        }
    }
    
    // Process monster resources
    processMonsterResources(resources) {
        for (const [alias, texture] of Object.entries(resources)) {
            this.textures[alias] = texture;
        }
    }
    
    // Process background resources
    processBackgroundResources(bundleName, resources) {
        const theme = bundleName.substring(3); // Remove 'bg_' prefix
        
        for (const [alias, texture] of Object.entries(resources)) {
            const parts = alias.split('_');
            if (parts.length >= 2) {
                const layerName = parts[1];
                this.backgrounds[theme][layerName] = texture;
            }
        }
    }
    
    // Update progress and notify
    updateProgress(value) {
        const progress = Math.min(Math.round(value), 100);
        if (this.onProgress) {
            this.onProgress(progress);
        }
    }
    
    // Apply backgrounds to CSS based on theme
    applyBackgroundsToCSS(theme) {
        console.log(`Applying ${theme} theme to CSS`);
        document.documentElement.style.setProperty('--bg-color', this.backgrounds[theme].backgroundColor);
        // Set image paths for all other layers
        document.documentElement.style.setProperty('--mountain-image', `url(${this.assetPaths.backgrounds[theme].mountain})`);
        document.documentElement.style.setProperty('--clouds-image', `url(${this.assetPaths.backgrounds[theme].clouds})`);
        document.documentElement.style.setProperty('--castle-image', `url(${this.assetPaths.backgrounds[theme].castle})`);
        document.documentElement.style.setProperty('--field1-image', `url(${this.assetPaths.backgrounds[theme].field1})`);
        document.documentElement.style.setProperty('--field2-image', `url(${this.assetPaths.backgrounds[theme].field2})`);
        document.documentElement.style.setProperty('--field3-image', `url(${this.assetPaths.backgrounds[theme].field3})`);
        document.documentElement.style.setProperty('--field4-image', `url(${this.assetPaths.backgrounds[theme].field4})`);
        document.documentElement.style.setProperty('--field5-image', `url(${this.assetPaths.backgrounds[theme].field5})`);
        document.documentElement.style.setProperty('--field6-image', `url(${this.assetPaths.backgrounds[theme].field6})`);
    }
}

// Make AssetManager globally available
window.AssetManager = AssetManager;