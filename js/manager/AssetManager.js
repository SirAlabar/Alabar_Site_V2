class AssetManager 
{
    constructor() 
    {
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
                    mountain: './assets/images/background/light/mountain.webp',
                    clouds: './assets/images/background/light/clouds.webp',
                    castle: './assets/images/background/light/castle.webp',
                    field1: './assets/images/background/light/field1.webp',
                    field2: './assets/images/background/light/field2.webp',
                    field3: './assets/images/background/light/field3.webp',
                    field4: './assets/images/background/light/field4.webp',
                    field5: './assets/images/background/light/field5.webp',
                    field6: './assets/images/background/light/field6.webp',
                    field7: './assets/images/background/light/field7.webp'
                },
                dark: {
                    backgroundColor: '#191970',
                    mountain: './assets/images/background/dark/mountain_night.webp',
                    moon: './assets/images/background/dark/moon_night.webp',
                    castle: './assets/images/background/dark/castle_night.webp',
                    field1: './assets/images/background/dark/field1_night.webp',
                    field2: './assets/images/background/dark/field2_night.webp',
                    field3: './assets/images/background/dark/field3_night.webp',
                    field4: './assets/images/background/dark/field4_night.webp',
                    field5: './assets/images/background/dark/field5_night.webp',
                    field6: './assets/images/background/dark/field6_night.webp'
                }
            }
        };
    }
    
    loadAllAssets() 
    {
        if (this.isLoading) return;
        this.isLoading = true;
        this.updateProgress(0);
        this.initAssets()
            .then(() => this.loadAssets())
            .catch(error => {
                this.isLoading = false;
            });
    }
    
    // Initialize PIXI Assets with manifest
    async initAssets() 
    {
        const manifest = this.createManifest();
        await PIXI.Assets.init({manifest});
    }
    
    // Load all assets in bundles
    async loadAssets() 
    {
        try {
            const manifest = this.createManifest();
            const bundleNames = manifest.bundles.map(bundle => bundle.name);
            let loadedBundles = 0;
            
            // Load each bundle and track progress
            for (const bundleName of bundleNames) 
            {
                try 
                {
                    const resources = await PIXI.Assets.loadBundle(bundleName, (progress) => {
                        const overallProgress = 
                            ((loadedBundles + progress) / bundleNames.length) * 100;
                        this.updateProgress(overallProgress);
                    });
                    
                    this.processLoadedResources(bundleName, resources);
                    loadedBundles++;
                } 
                catch (error) 
                {
                    console.error(`Error loading bundle ${bundleName}:`, error);
                }
            }
            this.isLoading = false;
            if (this.onComplete) 
            {
                this.onComplete();
            }
        } 
        catch (error)
        {
            throw error;
        }
    }
    
    // Create a manifest structure for PIXI.Assets
    createManifest() 
    {
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
    createPlayerBundle() 
    {
        const playerBundle = {
            name: 'player',
            assets: []
        };
        
        for (const [key, src] of Object.entries(this.assetPaths.player)) 
        {
            playerBundle.assets.push({
                alias: `player_${key}`,
                src
            });
        }
        
        return playerBundle;
    }
    
    // Create monsters assets bundle
    createMonstersBundle() 
    {
        const monstersBundle = {
            name: 'monsters',
            assets: []
        };
        
        for (const [monsterType, animations] of Object.entries(this.assetPaths.monsters))
        {
            for (const [key, src] of Object.entries(animations)) 
            {
                monstersBundle.assets.push({
                    alias: `${monsterType}_${key}`,
                    src
                });
            }
        }
        
        return monstersBundle;
    }
    
    // Create background assets bundles
    createBackgroundBundles() 
    {
        const bgBundles = [];
        
        for (const [theme, layers] of Object.entries(this.assetPaths.backgrounds)) 
        {
            // Store background color
            if (!this.backgrounds[theme]) 
            {
                this.backgrounds[theme] = {};
            }
            this.backgrounds[theme].backgroundColor = layers.backgroundColor;
            // Create bundle for this theme
            const themeBundle = {
                name: `bg_${theme}`,
                assets: []
            };
            for (const [key, src] of Object.entries(layers)) 
            {
                if (key !== 'backgroundColor') 
                {
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
    processLoadedResources(bundleName, resources) 
    {
        if (bundleName === 'player') 
        {
            this.processPlayerResources(resources);
        }
        else if (bundleName === 'monsters') 
        {
            this.processMonsterResources(resources);
        }
        else if (bundleName.startsWith('bg_')) 
        {
            this.processBackgroundResources(bundleName, resources);
        }
    }
    
    // Process player resources
    processPlayerResources(resources) 
    {
        for (const [alias, texture] of Object.entries(resources)) 
        {
            this.textures[alias] = texture;
        }
    }
    
    // Process monster resources
    processMonsterResources(resources) 
    {
        for (const [alias, texture] of Object.entries(resources)) 
        {
            this.textures[alias] = texture;
        }
    }
    
    // Process background resources
    processBackgroundResources(bundleName, resources) 
    {
        const theme = bundleName.substring(3); // Remove 'bg_' prefix
        
        for (const [alias, texture] of Object.entries(resources)) 
        {
            const parts = alias.split('_');
            if (parts.length >= 2) 
            {
                const layerName = parts[1];
                this.backgrounds[theme][layerName] = texture;
            }
        }
    }
    
    // Update progress and notify
    updateProgress(value) 
    {
        const progress = Math.min(Math.round(value), 100);
        if (this.onProgress) 
        {
            this.onProgress(progress);
        }
    }
    

    // Get a background texture for a specific theme and layer
    getBackgroundTexture(theme, layer) 
    {
        if (this.backgrounds[theme] && this.backgrounds[theme][layer]) 
        {
            return this.backgrounds[theme][layer];
        }
        console.warn(`Texture not found for ${theme}_${layer}`);
        return null;
    }
    
    // Get all background textures for a specific theme
    getBackgroundTextures(theme) 
    {
        if (this.backgrounds[theme]) 
        {
            return this.backgrounds[theme];
        }
        console.warn(`No textures found for theme: ${theme}`);
        return {};
    }
    
     //Get background color or texture for a theme
    getBackgroundInfo(theme) 
    {
        const result = {
            color: 0x000000,
            useTexture: false,
            texture: null
        };
        
        if (this.backgrounds[theme]) 
        {
            if (theme === 'light') 
            {
                // Light theme uses a solid color
                result.color = this.hexToNumber(this.backgrounds[theme].backgroundColor);
                result.useTexture = false;
            } 
            else if (theme === 'dark') 
            {
                // Dark theme uses a background image
                result.color = 0x000000; // Black base
                result.useTexture = true;
                // Try to load the background texture
                try 
                {
                    // The night background image path (adjust if your structure differs)
                    const backgroundPath = './assets/images/background/dark/background_night.webp';
                    result.texture = PIXI.Texture.from(backgroundPath);
                } 
                catch (error) 
                {
                    console.error("Error loading night background texture:", error);
                    result.useTexture = false;
                    result.color = this.hexToNumber(this.backgrounds[theme].backgroundColor);
                }
            }
        }
        
        return result;
    }
    
     //Convert hex color string to number for PIXI
    hexToNumber(hex) 
    {
        // Remove # if present
        hex = hex.replace('#', '');
        // Convert to number
        return parseInt(hex, 16);
    }
}

// Make AssetManager globally available
window.AssetManager = AssetManager;