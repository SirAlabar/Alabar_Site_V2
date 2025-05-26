/**
 * Game Projects page content creator for Pixi.js
 * Creates game development project cards
 */
export default function projectsGames(container, app) 
{
    console.log("ProjectsGames function called for Pixi content!");
    
    // Title
    const title = new PIXI.Text("Game Development Projects", {
        fontFamily: "Honk, serif",
        fontSize: 40,
        fill: 0xffcc33
    });
    title.anchor.set(0.5, 0);
    title.position.set(app.screen.width / 2, 80);
    container.addChild(title);
    
    // Description
    const description = new PIXI.Text(
        "Game development projects and interactive experiences:",
        {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xffffff
        }
    );
    description.anchor.set(0.5, 0);
    description.position.set(app.screen.width / 2, 140);
    container.addChild(description);
    
    // Game projects data
    const gameProjects = [
        {
            title: "So_long (42 Project)",
            description: "2D adventure game built with MiniLibX graphics library in C",
            status: "Completed",
            tech: "C, MiniLibX, 2D Graphics",
            color: 0x9C27B0
        },
        {
            title: "This Portfolio Website",
            description: "Interactive portfolio with Pixi.js game elements and animations",
            status: "In Progress",
            tech: "Pixi.js, JavaScript, WebGL",
            color: 0x61DAFB
        },
        {
            title: "Tower Defense Game",
            description: "Strategic tower defense game with custom sprites and AI",
            status: "Coming Soon",
            tech: "C#, Unity, Game AI",
            color: 0x4CAF50
        },
        {
            title: "Puzzle Platformer",
            description: "Physics-based puzzle game with innovative mechanics",
            status: "Coming Soon",
            tech: "C#, Unity, Physics2D",
            color: 0xFF9800
        }
    ];
    
    // Create game project cards
    const cardWidth = 300;
    const cardHeight = 160;
    const cardSpacing = 25;
    const cardsPerRow = 2;
    const startY = 200;
    
    // Calculate starting X position for centering
    const totalWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * cardSpacing;
    const startX = (app.screen.width - totalWidth) / 2;
    
    gameProjects.forEach((project, index) => {
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        
        const cardX = startX + col * (cardWidth + cardSpacing);
        const cardY = startY + row * (cardHeight + cardSpacing);
        
        createGameProjectCard(container, project, cardX, cardY, cardWidth, cardHeight);
    });
    
    return true;
}

/**
 * Create a game project card
 * @param {PIXI.Container} container - Parent container
 * @param {Object} project - Project data
 * @param {number} x - Card X position
 * @param {number} y - Card Y position
 * @param {number} width - Card width
 * @param {number} height - Card height
 */
function createGameProjectCard(container, project, x, y, width, height) 
{
    // Card background with game-themed styling
    const cardBg = new PIXI.Graphics();
    cardBg.beginFill(0x1e1e1e, 0.95);
    cardBg.lineStyle(3, project.color, 0.8);
    cardBg.drawRoundedRect(0, 0, width, height, 15);
    cardBg.endFill();
    cardBg.position.set(x, y);
    
    // Add subtle inner border
    const innerBorder = new PIXI.Graphics();
    innerBorder.lineStyle(1, project.color, 0.3);
    innerBorder.drawRoundedRect(3, 3, width - 6, height - 6, 12);
    innerBorder.position.set(x, y);
    
    // Card title with game-style font
    const cardTitle = new PIXI.Text(project.title, {
        fontFamily: "Honk, serif",
        fontSize: 20,
        fill: project.color,
        fontWeight: "bold"
    });
    cardTitle.anchor.set(0.5, 0);
    cardTitle.position.set(x + width / 2, y + 18);
    
    // Card description
    const cardDesc = new PIXI.Text(project.description, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xe0e0e0,
        wordWrap: true,
        wordWrapWidth: width - 24,
        lineHeight: 18
    });
    cardDesc.position.set(x + 12, y + 50);
    
    // Technology stack
    const techLabel = new PIXI.Text("Tech Stack:", {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xaaaaaa,
        fontWeight: "bold"
    });
    techLabel.position.set(x + 12, y + 100);
    
    const techText = new PIXI.Text(project.tech, {
        fontFamily: "Arial",
        fontSize: 11,
        fill: 0xcccccc,
        wordWrap: true,
        wordWrapWidth: width - 24
    });
    techText.position.set(x + 12, y + 115);
    
    // Status badge with game-themed styling
    const statusColor = getStatusColor(project.status);
    const statusBg = new PIXI.Graphics();
    statusBg.beginFill(statusColor, 0.9);
    statusBg.lineStyle(1, statusColor, 1);
    statusBg.drawRoundedRect(0, 0, 100, 25, 12);
    statusBg.endFill();
    statusBg.position.set(x + width - 112, y + height - 35);
    
    const statusText = new PIXI.Text(project.status, {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    statusText.anchor.set(0.5, 0.5);
    statusText.position.set(x + width - 62, y + height - 22.5);
    
    // Add special effects for game cards
    const cardContainer = new PIXI.Container();
    cardContainer.addChild(cardBg);
    cardContainer.addChild(innerBorder);
    cardContainer.interactive = true;
    cardContainer.cursor = 'pointer';
    
    // Game-themed hover effects
    cardContainer.on('pointerover', () => {
        cardBg.tint = 0xf8f8f8;
        innerBorder.tint = 0xf0f0f0;
        cardContainer.scale.set(1.04);
        
        // Add glow effect
        const glow = new PIXI.filters.GlowFilter();
        glow.color = project.color;
        glow.distance = 8;
        glow.outerStrength = 0.5;
        cardContainer.filters = [glow];
    });
    
    cardContainer.on('pointerout', () => {
        cardBg.tint = 0xffffff;
        innerBorder.tint = 0xffffff;
        cardContainer.scale.set(1.0);
        cardContainer.filters = [];
    });
    
    // Click handler for game projects
    cardContainer.on('pointerdown', () => {
        console.log(`Clicked on ${project.title} game project`);
        // Future: Could open game demo or detailed project page
    });
    
    // Add all elements to container
    container.addChild(cardContainer);
    container.addChild(cardTitle);
    container.addChild(cardDesc);
    container.addChild(techLabel);
    container.addChild(techText);
    container.addChild(statusBg);
    container.addChild(statusText);
}

/**
 * Get status color based on project status
 * @param {string} status - Project status
 * @returns {number} Hex color value
 */
function getStatusColor(status) 
{
    switch (status) 
    {
        case "Completed":
            return 0x4CAF50; // Green
        case "In Progress":
            return 0xFF9800; // Orange
        case "Coming Soon":
            return 0x2196F3; // Blue
        default:
            return 0x757575; // Gray
    }
}