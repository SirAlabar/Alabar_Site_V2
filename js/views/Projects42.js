/**
 * 42 School Projects page content creator for Pixi.js
 * Creates project cards for 42 School projects
 */
export default function projects42(container, app) 
{
    console.log("Projects42 function called for Pixi content!");
    
    // Title
    const title = new PIXI.Text("42 School Projects", {
        fontFamily: "Honk, serif",
        fontSize: 40,
        fill: 0xffcc33
    });
    title.anchor.set(0.5, 0);
    title.position.set(app.screen.width / 2, 80);
    container.addChild(title);
    
    // Description
    const description = new PIXI.Text(
        "Here are some of the projects I've completed during my studies at 42 School:",
        {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xffffff,
            wordWrap: true,
            wordWrapWidth: app.screen.width - 100
        }
    );
    description.anchor.set(0.5, 0);
    description.position.set(app.screen.width / 2, 140);
    container.addChild(description);
    
    // Project data
    const projects = [
        {
            title: "Libft",
            description: "Custom C library implementation with essential functions",
            status: "Completed",
            grade: "125/100",
            color: 0x4CAF50
        },
        {
            title: "Get_next_line",
            description: "Function that reads a line from a file descriptor",
            status: "Completed", 
            grade: "125/100",
            color: 0x2196F3
        },
        {
            title: "Born2beroot",
            description: "System administration project with VirtualBox",
            status: "Completed",
            grade: "125/100", 
            color: 0xFF9800
        },
        {
            title: "So_long",
            description: "2D game project using MiniLibX graphics library",
            status: "Completed",
            grade: "125/100",
            color: 0x9C27B0
        },
        {
            title: "Push_swap",
            description: "Sorting algorithm optimization project",
            status: "Completed",
            grade: "125/100",
            color: 0xF44336
        },
        {
            title: "Minishell",
            description: "Simple shell implementation in C (group project)",
            status: "Completed",
            grade: "125/100",
            color: 0x607D8B
        }
    ];
    
    // Create project cards
    const cardsPerRow = 3;
    const cardWidth = 250;
    const cardHeight = 160;
    const cardSpacing = 20;
    const startY = 200;
    
    // Calculate starting X position to center the grid
    const totalWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * cardSpacing;
    const startX = (app.screen.width - totalWidth) / 2;
    
    projects.forEach((project, index) => {
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        
        const cardX = startX + col * (cardWidth + cardSpacing);
        const cardY = startY + row * (cardHeight + cardSpacing);
        
        createProjectCard(container, project, cardX, cardY, cardWidth, cardHeight);
    });
    
    return true;
}

/**
 * Create a single project card
 * @param {PIXI.Container} container - Parent container
 * @param {Object} project - Project data
 * @param {number} x - Card X position
 * @param {number} y - Card Y position
 * @param {number} width - Card width
 * @param {number} height - Card height
 */
function createProjectCard(container, project, x, y, width, height) 
{
    // Card background
    const cardBg = new PIXI.Graphics();
    cardBg.beginFill(0x2c2c2c, 0.9);
    cardBg.lineStyle(2, project.color, 0.8);
    cardBg.drawRoundedRect(0, 0, width, height, 10);
    cardBg.endFill();
    cardBg.position.set(x, y);
    
    // Card title
    const cardTitle = new PIXI.Text(project.title, {
        fontFamily: "Honk, serif",
        fontSize: 22,
        fill: project.color,
        fontWeight: "bold"
    });
    cardTitle.anchor.set(0.5, 0);
    cardTitle.position.set(x + width / 2, y + 15);
    
    // Card description
    const cardDesc = new PIXI.Text(project.description, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xcccccc,
        wordWrap: true,
        wordWrapWidth: width - 20,
        lineHeight: 18
    });
    cardDesc.position.set(x + 10, y + 50);
    
    // Status badge
    const statusBg = new PIXI.Graphics();
    statusBg.beginFill(0x4CAF50, 0.8);
    statusBg.drawRoundedRect(0, 0, 80, 20, 10);
    statusBg.endFill();
    statusBg.position.set(x + 10, y + height - 35);
    
    const statusText = new PIXI.Text(project.status, {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    statusText.anchor.set(0.5, 0.5);
    statusText.position.set(x + 50, y + height - 25);
    
    // Grade badge
    const gradeBg = new PIXI.Graphics();
    gradeBg.beginFill(project.color, 0.8);
    gradeBg.drawRoundedRect(0, 0, 70, 20, 10);
    gradeBg.endFill();
    gradeBg.position.set(x + width - 80, y + height - 35);
    
    const gradeText = new PIXI.Text(project.grade, {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    gradeText.anchor.set(0.5, 0.5);
    gradeText.position.set(x + width - 45, y + height - 25);
    
    // Add hover effects
    const cardContainer = new PIXI.Container();
    cardContainer.addChild(cardBg);
    cardContainer.interactive = true;
    cardContainer.cursor = 'pointer';
    
    // Hover animations
    cardContainer.on('pointerover', () => {
        cardBg.tint = 0xf0f0f0;
        cardContainer.scale.set(1.02);
    });
    
    cardContainer.on('pointerout', () => {
        cardBg.tint = 0xffffff;
        cardContainer.scale.set(1.0);
    });
    
    // Click handler (could open project details)
    cardContainer.on('pointerdown', () => {
        console.log(`Clicked on ${project.title} project`);
        // Future: Open project details modal or navigate to project page
    });
    
    // Add all elements to container
    container.addChild(cardContainer);
    container.addChild(cardTitle);
    container.addChild(cardDesc);
    container.addChild(statusBg);
    container.addChild(statusText);
    container.addChild(gradeBg);
    container.addChild(gradeText);
}