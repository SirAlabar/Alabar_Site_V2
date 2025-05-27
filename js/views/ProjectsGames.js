/**
 * Game Projects page content creator for Pixi.js
 * Creates game development project cards
 */
export default function projectsGames(container, app) 
{
    console.log("ProjectsGames function called for Pixi content!");
    
    // Enable sorting for proper z-index behavior
    container.sortableChildren = true;
    
    // Title
    const title = new PIXI.Text("Game Development Projects", {
        fontFamily: "Honk, Arial, sans-serif", // Added Linux fallback
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
            fontFamily: "Arial, sans-serif", // Added fallback
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
 * Create a game project card with hover expansion
 * @param {PIXI.Container} container - Parent container
 * @param {Object} project - Project data
 * @param {number} x - Card X position
 * @param {number} y - Card Y position
 * @param {number} width - Card width
 * @param {number} height - Card height
 */
function createGameProjectCard(container, project, x, y, width, height) 
{
    const cardContainer = new PIXI.Container();
    cardContainer.position.set(x, y);
    cardContainer.sortableChildren = true;
    
    // MAKE CONTAINER DIRECTLY INTERACTIVE
    cardContainer.interactive = true;
    cardContainer.cursor = 'pointer';
    cardContainer.buttonMode = true;
    
    // Card background with game-themed styling
    const cardBg = new PIXI.Graphics();
    cardBg.beginFill(0x1e1e1e, 0.5);
    cardBg.lineStyle(3, project.color, 0.8);
    cardBg.drawRoundedRect(0, 0, width, height, 15);
    cardBg.endFill();
    cardBg.zIndex = 0;
    
    // Add subtle inner border
    const innerBorder = new PIXI.Graphics();
    innerBorder.lineStyle(1, project.color, 0.3);
    innerBorder.drawRoundedRect(3, 3, width - 6, height - 6, 12);
    innerBorder.zIndex = 1;
    
    // Card title with game-style font
    const cardTitle = new PIXI.Text(project.title, {
        fontFamily: "Honk, Arial, sans-serif", // Added Linux fallback
        fontSize: 20,
        fill: project.color,
        fontWeight: "bold"
    });
    cardTitle.anchor.set(0.5, 0);
    cardTitle.position.set(width / 2, 18);
    cardTitle.zIndex = 2;
    
    // Card description
    const cardDesc = new PIXI.Text(project.description, {
        fontFamily: "Arial, sans-serif", // Added fallback
        fontSize: 14,
        fill: 0xe0e0e0,
        wordWrap: true,
        wordWrapWidth: width - 24,
        lineHeight: 18
    });
    cardDesc.position.set(12, 50);
    cardDesc.zIndex = 2;
    
    // Technology stack
    const techLabel = new PIXI.Text("Tech Stack:", {
        fontFamily: "Arial, sans-serif", // Added fallback
        fontSize: 12,
        fill: 0xaaaaaa,
        fontWeight: "bold"
    });
    techLabel.position.set(12, 100);
    techLabel.zIndex = 2;
    
    const techText = new PIXI.Text(project.tech, {
        fontFamily: "Arial, sans-serif", // Added fallback
        fontSize: 11,
        fill: 0xcccccc,
        wordWrap: true,
        wordWrapWidth: width - 24
    });
    techText.position.set(12, 115);
    techText.zIndex = 2;
    
    // Status badge with game-themed styling
    const statusColor = getStatusColor(project.status);
    const statusBg = new PIXI.Graphics();
    statusBg.beginFill(statusColor, 0.9);
    statusBg.lineStyle(1, statusColor, 1);
    statusBg.drawRoundedRect(0, 0, 100, 25, 12);
    statusBg.endFill();
    statusBg.position.set(width - 112, height - 35);
    statusBg.zIndex = 2;
    
    const statusText = new PIXI.Text(project.status, {
        fontFamily: "Arial, sans-serif", // Added fallback
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    statusText.anchor.set(0.5, 0.5);
    statusText.position.set(width - 62, height - 22.5);
    statusText.zIndex = 3;
    
    // Add basic elements
    cardContainer.addChild(cardBg);
    cardContainer.addChild(innerBorder);
    cardContainer.addChild(cardTitle);
    cardContainer.addChild(cardDesc);
    cardContainer.addChild(techLabel);
    cardContainer.addChild(techText);
    cardContainer.addChild(statusBg);
    cardContainer.addChild(statusText);
    
    // HOVER EXPANSION BACKGROUND (initially hidden)
    const hoverBg = new PIXI.Graphics();
    hoverBg.beginFill(0x1e1e1e, 0.98);
    hoverBg.lineStyle(4, project.color, 1);
    hoverBg.drawRoundedRect(-8, -8, width + 16, height + 80, 18);
    hoverBg.endFill();
    hoverBg.alpha = 0;
    hoverBg.zIndex = -1;
    cardContainer.addChild(hoverBg);
    
    // HOVER ELEMENTS (initially hidden)
    const detailsLabel = new PIXI.Text("Project Details:", {
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        fill: project.color,
        fontWeight: "bold"
    });
    detailsLabel.position.set(12, height + 5);
    detailsLabel.alpha = 0;
    detailsLabel.zIndex = 4;
    cardContainer.addChild(detailsLabel);
    
    const moreInfo = new PIXI.Text("Click to learn more about this project and see detailed implementation.", {
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        fill: 0xcccccc,
        wordWrap: true,
        wordWrapWidth: width - 16,
        lineHeight: 14
    });
    moreInfo.position.set(12, height + 25);
    moreInfo.alpha = 0;
    moreInfo.zIndex = 4;
    cardContainer.addChild(moreInfo);
    
    const featuresText = new PIXI.Text("Features: Advanced graphics, optimized performance, cross-platform compatibility", {
        fontFamily: "Arial, sans-serif",
        fontSize: 10,
        fill: 0xe0e0e0,
        wordWrap: true,
        wordWrapWidth: width - 16,
        lineHeight: 13
    });
    featuresText.position.set(12, height + 50);
    featuresText.alpha = 0;
    featuresText.zIndex = 4;
    cardContainer.addChild(featuresText);
    
    // Store hover elements
    const hoverElements = [detailsLabel, moreInfo, featuresText];
    
    // HOVER EVENT HANDLERS
    let isHovered = false;
    
    cardContainer.on('pointerover', () => {
        if (isHovered) return;
        isHovered = true;
        console.log('Hover start on:', project.title);
        
        hoverBg.alpha = 1;
        hoverElements.forEach(element => element.alpha = 1);
        cardContainer.zIndex = 9999;
        container.zIndex = 9999;
        if (container.sortableChildren) {
            container.sortChildren();
        }
        if (container.parent && container.parent.sortableChildren) {
            container.parent.sortChildren();
        }
    });
    
    cardContainer.on('pointerout', () => {
        if (!isHovered) return;
        isHovered = false;
        console.log('Hover end on:', project.title);
        
        hoverBg.alpha = 0;
        hoverElements.forEach(element => element.alpha = 0);
        cardContainer.zIndex = 0;
        container.zIndex = 0;
    });
    
    // Additional event listeners for better detection
    cardContainer.on('mouseenter', () => {
        if (isHovered) return;
        isHovered = true;
        console.log('Mouse enter on:', project.title);
        
        hoverBg.alpha = 1;
        hoverElements.forEach(element => element.alpha = 1);
        cardContainer.zIndex = 9999;
        container.zIndex = 9999;
        if (container.sortableChildren) {
            container.sortChildren();
        }
        if (container.parent && container.parent.sortableChildren) {
            container.parent.sortChildren();
        }
    });
    
    cardContainer.on('mouseleave', () => {
        if (!isHovered) return;
        isHovered = false;
        console.log('Mouse leave on:', project.title);
        
        hoverBg.alpha = 0;
        hoverElements.forEach(element => element.alpha = 0);
        cardContainer.zIndex = 0;
        container.zIndex = 0;
    });
    
    // Mobile/Touch support
    cardContainer.on('pointertap', (event) => {
        event.stopPropagation();
        console.log('Tap on:', project.title);
        
        if (isHovered) {
            // Hide
            isHovered = false;
            hoverBg.alpha = 0;
            hoverElements.forEach(element => element.alpha = 0);
            cardContainer.zIndex = 0;
            container.zIndex = 0;
        } else {
            // Show
            isHovered = true;
            hoverBg.alpha = 1;
            hoverElements.forEach(element => element.alpha = 1);
            cardContainer.zIndex = 9999;
            container.zIndex = 9999;
            if (container.sortableChildren) {
                container.sortChildren();
            }
            if (container.parent && container.parent.sortableChildren) {
                container.parent.sortChildren();
            }
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (isHovered) {
                    isHovered = false;
                    hoverBg.alpha = 0;
                    hoverElements.forEach(element => element.alpha = 0);
                    cardContainer.zIndex = 0;
                    container.zIndex = 0;
                }
            }, 3000);
        }
    });
    
    cardContainer.sortChildren();
    container.addChild(cardContainer);
    
    // Ensure parent containers are sortable
    if (!container.sortableChildren) {
        container.sortableChildren = true;
    }
    if (container.parent && !container.parent.sortableChildren) {
        container.parent.sortableChildren = true;
    }
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