/**
 * ContentManager.js
 * Manages PIXI content for different pages
 * Works with view files (about.js, contact.js, etc.) to create and display Pixi content
 */
export class ContentManager 
{
    constructor(app, contentGroup, pageGroups) 
    {
        // Store references
        this.app = app;
        this.contentGroup = contentGroup;
        this.pageGroups = pageGroups;
        this.currentPage = 'home';
        
        // Store initialization state
        this.initialized = {
            home: false,
            about: false,
            contact: false,
            projects: false
        };
        
        // Store view module references
        this.views = {};
    }
    
    /**
     * Initialize the ContentManager
     */
    init() 
    {
        console.log("ContentManager initialized");
        
        // Pre-load view modules
        this.loadViewModules();
        
        return this;
    }
    
    /**
     * Load all view modules
     */
    async loadViewModules() 
    {
        try 
        {
            // Dynamic imports for view modules
            const homeModule = await import('../views/home.js');
            const aboutModule = await import('../views/about.js');
            const contactModule = await import('../views/contact.js');
            
            // Store module references
            this.views = {
                home: homeModule.default,
                about: aboutModule.default,
                contact: contactModule.default
            };
            
            console.log("View modules loaded");
        } 
        catch (error) 
        {
            console.error("Error loading view modules:", error);
        }
    }
    
    /**
     * Navigate to specific page
     * @param {string} page - Page name (home, about, contact, projects)
     */
    navigateTo(page) 
    {
        // Ensure page name is valid
        const pageContentName = page + 'Content';
        if (!this.pageGroups[pageContentName]) 
        {
            console.warn(`Page ${page} not found`);
            page = 'home';
        }
        
        // Hide all page contents
        for (const [name, group] of Object.entries(this.pageGroups)) 
        {
            group.visible = false;
        }
        
        // Initialize the page if needed
        if (!this.initialized[page]) 
        {
            this.initPage(page);
        }
        
        // Show the requested page
        this.pageGroups[page + 'Content'].visible = true;
        this.currentPage = page;
        
        // Force sorting and rendering
        this.contentGroup.sortChildren();
        this.app.renderer.render(this.app.stage);
        
        console.log(`Navigated to ${page} page`);
        return this;
    }
    
    /**
     * Initialize page content if not already initialized
     * @param {string} page - Page name to initialize
     */
    initPage(page) 
    {
        if (this.initialized[page]) 
        {
            return;
        }
        
        console.log(`Initializing ${page} page content`);
        
        // Call the appropriate init function
        switch (page) 
        {
            case 'home':
                // Home content is already handled by GameInitializer
                break;
            case 'about':
                this.initAbout();
                break;
            case 'contact':
                this.initContact();
                break;
            case 'projects':
                this.initProjects();
                break;
            default:
                console.warn(`No initialization method for ${page}`);
                return;
        }
        
        // Mark as initialized
        this.initialized[page] = true;
    }
    
    /**
     * Initialize About page content in Pixi using about.js
     */
    initAbout() 
    {
        const container = this.pageGroups.aboutContent;
        
        // Check if the about module is loaded
        if (!this.views.about) 
        {
            console.error("About view module not loaded");
            return;
        }
        
        // Call the about.js function with Pixi container instead of returning HTML
        // This requires modifying about.js to accept a Pixi container
        try 
        {
            // For now, we'll handle this internally until about.js is updated
            this.createAboutPixiContent(container);
        } 
        catch (error) 
        {
            console.error("Error initializing About content:", error);
        }
    }
    
    /**
     * Temporary method to create About content in Pixi
     * Will be replaced when about.js is updated to create Pixi content directly
     * @param {PIXI.Container} container - Container to add content to
     */
    createAboutPixiContent(container) 
    {
        // Character Stats section
        const statsTitle = new PIXI.Text("Character Stats", {
            fontFamily: "Honk, serif",
            fontSize: 36,
            fill: 0xffcc33
        });
        statsTitle.anchor.set(0.5, 0);
        statsTitle.position.set(this.app.screen.width / 2, 150);
        container.addChild(statsTitle);
        
        // Stats data (matching about.js)
        const stats = [
            { label: "Class:", value: "Software Developer" },
            { label: "Former Class:", value: "Accountant" },
            { label: "Level:", value: "34" },
            { label: "Guild:", value: "42 Porto" },
            { label: "Base:", value: "Porto, Portugal" },
            { label: "Language:", value: "English B2" }
        ];
        
        // Create two columns for stats
        const leftColumn = stats.slice(0, 3);
        const rightColumn = stats.slice(3);
        
        // Render left column stats
        leftColumn.forEach((stat, index) => {
            // Label
            const label = new PIXI.Text(stat.label, {
                fontFamily: "Arial",
                fontSize: 18,
                fontWeight: "bold",
                fill: 0x33ccff
            });
            label.position.set(100, 200 + index * 30);
            
            // Value
            const value = new PIXI.Text(stat.value, {
                fontFamily: "Arial",
                fontSize: 16,
                fill: 0xffffff
            });
            value.position.set(100 + label.width + 10, 200 + index * 30);
            
            container.addChild(label);
            container.addChild(value);
        });
        
        // Render right column stats
        rightColumn.forEach((stat, index) => {
            // Label
            const label = new PIXI.Text(stat.label, {
                fontFamily: "Arial",
                fontSize: 18,
                fontWeight: "bold",
                fill: 0x33ccff
            });
            label.position.set(this.app.screen.width / 2 + 50, 200 + index * 30);
            
            // Value
            const value = new PIXI.Text(stat.value, {
                fontFamily: "Arial",
                fontSize: 16,
                fill: 0xffffff
            });
            value.position.set(this.app.screen.width / 2 + 50 + label.width + 10, 200 + index * 30);
            
            container.addChild(label);
            container.addChild(value);
        });
        
        // Current Quest section
        const questTitle = new PIXI.Text("Current Quest", {
            fontFamily: "Honk, serif",
            fontSize: 36,
            fill: 0xffcc33
        });
        questTitle.anchor.set(0.5, 0);
        questTitle.position.set(this.app.screen.width / 2, 320);
        container.addChild(questTitle);
        
        // Quest background
        const questBg = new PIXI.Graphics();
        questBg.beginFill(0x212529, 0.2);
        questBg.drawRoundedRect(50, 370, this.app.screen.width - 100, 150, 10);
        questBg.endFill();
        container.addChild(questBg);
        
        // Quest description text
        const questText = new PIXI.Text(
            "As a career changer diving into the world of game development, I am excited to explore and create innovative solutions using technology. Currently focusing on mastering C and developing small games in C#, I am passionate about discovering new technologies and leveraging them to craft high-quality projects.\n\nI am a student at 42 School, where I am honing my skills and expanding my horizons in this dynamic field.",
            {
                fontFamily: "Arial",
                fontSize: 16,
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: this.app.screen.width - 120,
                lineHeight: 20
            }
        );
        questText.position.set(70, 390);
        container.addChild(questText);
    }
    
    /**
     * Initialize Contact page content in Pixi using contact.js
     */
    initContact() 
    {
        const container = this.pageGroups.contactContent;
        
        // Check if the contact module is loaded
        if (!this.views.contact) 
        {
            console.error("Contact view module not loaded");
            return;
        }
        
        // Call the contact.js function with Pixi container instead of returning HTML
        // This requires modifying contact.js to accept a Pixi container
        try 
        {
            // For now, we'll handle this internally until contact.js is updated
            this.createContactPixiContent(container);
        } 
        catch (error) 
        {
            console.error("Error initializing Contact content:", error);
        }
    }
    
    /**
     * Temporary method to create Contact content in Pixi
     * Will be replaced when contact.js is updated to create Pixi content directly
     * @param {PIXI.Container} container - Container to add content to
     */
    createContactPixiContent(container) 
    {
        // Title
        const title = new PIXI.Text("Contact Me", {
            fontFamily: "Honk, serif",
            fontSize: 40,
            fill: 0xffcc33
        });
        title.anchor.set(0.5, 0);
        title.position.set(this.app.screen.width / 2, 150);
        container.addChild(title);
        
        // Get In Touch section
        const infoTitle = new PIXI.Text("Get In Touch", {
            fontFamily: "Honk, serif",
            fontSize: 36,
            fill: 0xffcc33
        });
        infoTitle.anchor.set(0.5, 0);
        infoTitle.position.set(this.app.screen.width / 2, 220);
        container.addChild(infoTitle);
        
        // Contact info background
        const infoBg = new PIXI.Graphics();
        infoBg.beginFill(0x212529, 0.2);
        infoBg.drawRoundedRect(50, 270, this.app.screen.width - 100, 150, 10);
        infoBg.endFill();
        container.addChild(infoBg);
        
        // Contact items
        const contacts = [
            { type: "GitHub", value: "github.com/SirAlabar" },
            { type: "LinkedIn", value: "linkedin.com/in/hugollmarta" }
        ];
        
        // Create left contact item
        this.createContactItem(container, contacts[0].type, contacts[0].value, 100, 300);
        
        // Create right contact item
        this.createContactItem(container, contacts[1].type, contacts[1].value, this.app.screen.width / 2 + 50, 300);
    }
    
    /**
     * Create a contact item with icon, title and clickable link
     * @param {PIXI.Container} container - Parent container
     * @param {string} type - Contact type (GitHub, LinkedIn, etc.)
     * @param {string} value - Contact value/URL
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createContactItem(container, type, value, x, y) 
    {
        // Title
        const titleText = new PIXI.Text(type, {
            fontFamily: "Arial",
            fontSize: 18,
            fontWeight: "bold",
            fill: 0x0011f8
        });
        titleText.position.set(x, y);
        
        // Value with link styling
        const valueText = new PIXI.Text(value, {
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0x0278a0
        });
        valueText.position.set(x, y + 30);
        
        // Interactive hitbox for the link
        const hitArea = new PIXI.Graphics();
        hitArea.beginFill(0xFFFFFF, 0.001);
        hitArea.drawRect(valueText.x, valueText.y, valueText.width, valueText.height);
        hitArea.endFill();
        hitArea.interactive = true;
        hitArea.cursor = 'pointer';
        
        // Open URL on click
        hitArea.on('pointerdown', () => {
            window.open('https://' + value, '_blank');
        });
        
        // Hover effects
        hitArea.on('pointerover', () => {
            valueText.style.fill = 0xffcc33;
        });
        
        hitArea.on('pointerout', () => {
            valueText.style.fill = 0x0278a0;
        });
        
        // Add to container
        container.addChild(titleText);
        container.addChild(valueText);
        container.addChild(hitArea);
    }
    
    /**
     * Initialize Projects page with placeholder content
     */
    initProjects() 
    {
        const container = this.pageGroups.projectsContent;
        
        // Title
        const title = new PIXI.Text("My Projects", {
            fontFamily: "Honk, serif",
            fontSize: 40,
            fill: 0xffcc33
        });
        title.anchor.set(0.5, 0);
        title.position.set(this.app.screen.width / 2, 150);
        container.addChild(title);
        
        // Placeholder text
        const placeholder = new PIXI.Text("Project cards coming soon...", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff
        });
        placeholder.anchor.set(0.5, 0.5);
        placeholder.position.set(this.app.screen.width / 2, 300);
        container.addChild(placeholder);
    }
    
    /**
     * Get current page name
     * @returns {string} Current page name
     */
    getCurrentPage() 
    {
        return this.currentPage;
    }
    
    /**
     * Clean up resources 
     */
    destroy() 
    {
        console.log("ContentManager destroyed");
    }
}

/**
 * Create and initialize a ContentManager
 * @param {PIXI.Application} app - Pixi application
 * @param {PIXI.Container} contentGroup - Content group container
 * @param {Object} pageGroups - Object containing page containers
 * @returns {ContentManager} Initialized ContentManager
 */
export function createContentManager(app, contentGroup, pageGroups) 
{
    return new ContentManager(app, contentGroup, pageGroups).init();
}