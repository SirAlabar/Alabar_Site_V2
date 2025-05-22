/**
 * Web Projects page content creator for Pixi.js
 * Creates web development project cards
 */
export default function projectsWeb(container, app) 
{
    console.log("ProjectsWeb function called for Pixi content!");
    
    // Title
    const title = new PIXI.Text("Web Development Projects", {
        fontFamily: "Honk, serif",
        fontSize: 40,
        fill: 0xffcc33
    });
    title.anchor.set(0.5, 0);
    title.position.set(app.screen.width / 2, 80);
    container.addChild(title);
    
    // Coming soon message
    const comingSoon = new PIXI.Text("Coming Soon...", {
        fontFamily: "Arial",
        fontSize: 32,
        fill: 0xffffff
    });
    comingSoon.anchor.set(0.5, 0.5);
    comingSoon.position.set(app.screen.width / 2, 250);
    container.addChild(comingSoon);
    
    // Description
    const description = new PIXI.Text(
        "Web development projects will be showcased here soon!\nThis will include React, Node.js, and full-stack applications.",
        {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xcccccc,
            align: 'center',
            lineHeight: 25
        }
    );
    description.anchor.set(0.5, 0.5);
    description.position.set(app.screen.width / 2, 320);
    container.addChild(description);
    
    // Placeholder cards
    const placeholderProjects = [
        {
            title: "Portfolio Website",
            description: "This very website you're browsing! Built with Pixi.js",
            status: "In Progress",
            tech: "Pixi.js, HTML5, CSS3",
            color: 0x61DAFB
        },
        // {
        //     title: "E-commerce Platform",
        //     description: "Full-stack e-commerce solution with modern UI/UX",
        //     status: "Coming Soon",
        //     tech: "React, Node.js, MongoDB",
        //     color: 0x4CAF50
        // },
        // {
        //     title: "Task Management App",
        //     description: "Collaborative task management with real-time updates",
        //     status: "Coming Soon", 
        //     tech: "Vue.js, Express, Socket.io",
        //     color: 0xFF9800
        // }
    ];
    
    // Create placeholder cards
    const cardWidth = 280;
    const cardHeight = 140;
    const cardSpacing = 30;
    const startY = 400;
    
    // Calculate starting X position for centering
    const totalWidth = placeholderProjects.length * cardWidth + (placeholderProjects.length - 1) * cardSpacing;
    const startX = (app.screen.width - totalWidth) / 2;
    
    placeholderProjects.forEach((project, index) => {
        const cardX = startX + index * (cardWidth + cardSpacing);
        const cardY = startY;
        
        createWebProjectCard(container, project, cardX, cardY, cardWidth, cardHeight);
    });
    
    return true;
}

/**
 * Create a web project card
 * @param {PIXI.Container} container - Parent container
 * @param {Object} project - Project data
 * @param {number} x - Card X position
 * @param {number} y - Card Y position
 * @param {number} width - Card width
 * @param {number} height - Card height
 */
function createWebProjectCard(container, project, x, y, width, height) 
{
    // Card background with subtle gradient effect
    const cardBg = new PIXI.Graphics();
    cardBg.beginFill(0x1a1a1a, 0.8);
    cardBg.lineStyle(2, project.color, 0.6);
    cardBg.drawRoundedRect(0, 0, width, height, 12);
    cardBg.endFill();
    cardBg.position.set(x, y);
    
    // Card title
    const cardTitle = new PIXI.Text(project.title, {
        fontFamily: "Honk, serif",
        fontSize: 20,
        fill: project.color,
        fontWeight: "bold"
    });
    cardTitle.anchor.set(0.5, 0);
    cardTitle.position.set(x + width / 2, y + 15);
    
    // Card description
    const cardDesc = new PIXI.Text(project.description, {
        fontFamily: "Arial",
        fontSize: 13,
        fill: 0xdddddd,
        wordWrap: true,
        wordWrapWidth: width - 20,
        lineHeight: 16
    });
    cardDesc.position.set(x + 10, y + 45);
    
    // Technology stack
    const techText = new PIXI.Text(`Tech: ${project.tech}`, {
        fontFamily: "Arial",
        fontSize: 11,
        fill: 0x888888,
        wordWrap: true,
        wordWrapWidth: width - 20
    });
    techText.position.set(x + 10, y + 85);
    
    // Status badge
    const statusColor = project.status === "In Progress" ? 0xFF9800 : 0x666666;
    const statusBg = new PIXI.Graphics();
    statusBg.beginFill(statusColor, 0.8);
    statusBg.drawRoundedRect(0, 0, 90, 22, 11);
    statusBg.endFill();
    statusBg.position.set(x + width - 100, y + height - 32);
    
    const statusText = new PIXI.Text(project.status, {
        fontFamily: "Arial",
        fontSize: 11,
        fill: 0xffffff,
        fontWeight: "bold"
    });
    statusText.anchor.set(0.5, 0.5);
    statusText.position.set(x + width - 55, y + height - 21);
    
    // Add hover effects
    const cardContainer = new PIXI.Container();
    cardContainer.addChild(cardBg);
    cardContainer.interactive = true;
    cardContainer.cursor = 'pointer';
    
    cardContainer.on('pointerover', () => {
        cardBg.tint = 0xf5f5f5;
        cardContainer.scale.set(1.03);
    });
    
    cardContainer.on('pointerout', () => {
        cardBg.tint = 0xffffff;
        cardContainer.scale.set(1.0);
    });
    
    // Add all elements to container
    container.addChild(cardContainer);
    container.addChild(cardTitle);
    container.addChild(cardDesc);
    container.addChild(techText);
    container.addChild(statusBg);
    container.addChild(statusText);
}