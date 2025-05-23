/**
 * About page content creator for Pixi.js
 * Creates character stats and quest description with improved responsive design
 */
export default function about(container, app, assetManager) 
{
    console.log("About function called for Pixi content!");
    
    // Get current theme for dynamic colors
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    // Dynamic colors based on theme - IMPROVED CONTRAST WITH BETTER STROKE
    const colors = {
        title: currentTheme === 'dark' ? 0xffcc33 : 0xff4444,
        label: currentTheme === 'dark' ? 0x33ccff : 0x0066cc,
        value: currentTheme === 'dark' ? 0xffffff : 0x333333,
        skillBg: currentTheme === 'dark' ? 0x4a4a4a : 0xf0f8ff,
        skillText: currentTheme === 'dark' ? 0xffffff : 0x2c3e50,
        questBg: currentTheme === 'dark' ? 0x2a2a2a : 0x3e5c76,
        questText: currentTheme === 'dark' ? 0xffffff : 0xffffff
    };
    
    // Character Stats section - IMPROVED STROKE
    const statsTitle = new PIXI.Text("Character Stats", {
        fontFamily: "Honk, serif",
        fontSize: Math.min(36, app.screen.width * 0.06),
        fill: colors.title,
        stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
        strokeThickness: currentTheme === 'light' ? 1.5 : 1
    });
    statsTitle.anchor.set(0.5, 0);
    statsTitle.position.set(app.screen.width / 2, 150); // FIXED like original
    statsTitle.name = 'statsTitle';
    container.addChild(statsTitle);
    
    // Stats data - Updated with interests instead of main focus
    const stats = [
        { label: "Class:", value: "Software Developer" },
        { label: "Former Class:", value: "Accountant" },
        { label: "Level:", value: "34" },
        { label: "Guild:", value: "42 Porto" },
        { label: "Base:", value: "Porto, Portugal" },
        { label: "Interests:", value: "Game Design, Pixel Art" }
    ];
    
    // Create responsive stats layout
    const statsContainer = new PIXI.Container();
    statsContainer.name = 'statsContainer';
    container.addChild(statsContainer);
    
    // Create two columns for stats
    const leftColumn = stats.slice(0, 3);
    const rightColumn = stats.slice(3);
    
    // Calculate responsive positions - COMPACT SPACING
    const statsY = 200; // FIXED like original
    const leftX = Math.max(100, app.screen.width * 0.1);
    const rightX = Math.min(app.screen.width - 250, app.screen.width / 2 + 50);
    const lineHeight = 30; // FIXED like original
    
    // Render left column stats - IMPROVED STROKE
    leftColumn.forEach((stat, index) => {
        const label = new PIXI.Text(stat.label, {
            fontFamily: "Arial",
            fontSize: Math.min(18, app.screen.width * 0.025),
            fontWeight: "bold",
            fill: colors.label,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.8 : 0.5
        });
        label.position.set(leftX, statsY + index * lineHeight);
        statsContainer.addChild(label);
        
        const value = new PIXI.Text(stat.value, {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: colors.value,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.3 : 0.2
        });
        value.position.set(leftX + label.width + 10, statsY + index * lineHeight);
        statsContainer.addChild(value);
    });
    
    // Render right column stats - IMPROVED STROKE
    rightColumn.forEach((stat, index) => {
        const label = new PIXI.Text(stat.label, {
            fontFamily: "Arial",
            fontSize: Math.min(18, app.screen.width * 0.025),
            fontWeight: "bold",
            fill: colors.label,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.8 : 0.5
        });
        label.position.set(rightX, statsY + index * lineHeight);
        statsContainer.addChild(label);
        
        const value = new PIXI.Text(stat.value, {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: colors.value,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.3 : 0.2
        });
        value.position.set(rightX + label.width + 10, statsY + index * lineHeight);
        statsContainer.addChild(value);
    });
    
    // Skills Section - IMPROVED STROKE
    const skillsTitle = new PIXI.Text("Technical Skills", {
        fontFamily: "Honk, serif",
        fontSize: Math.min(32, app.screen.width * 0.05),
        fill: colors.title,
        stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
        strokeThickness: currentTheme === 'light' ? 1.5 : 1
    });
    skillsTitle.anchor.set(0.5, 0);
    skillsTitle.position.set(app.screen.width / 2, 320); // FIXED like original
    skillsTitle.name = 'skillsTitle';
    container.addChild(skillsTitle);
    
    // Skills data organized by categories - CORRECTED
    const skillCategories = [
        {
            title: "Main Stack:",
            skills: ["C", "C++", "Git"]
        },
        {
            title: "Secondary Stack:",
            skills: ["C#", "CSS", "HTML", "JavaScript"]
        },
        {
            title: "Studying Now:",
            skills: ["Unity", "Game Development", "Algorithms"]
        },
        {
            title: "Tools:",
            skills: [".NET", "VS Code", "Linux", "Slack"]
        }
    ];
    
    // Create skills container
    const skillsContainer = new PIXI.Container();
    skillsContainer.name = 'skillsContainer';
    container.addChild(skillsContainer);
    
    // Render skills - COMPACT SPACING
    const skillsStartY = 370; // FIXED like original
    const skillRowHeight = 35; // FIXED like original
    
    skillCategories.forEach((category, categoryIndex) => {
        // Category title - IMPROVED STROKE
        const categoryTitle = new PIXI.Text(category.title, {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.023),
            fontWeight: "bold",
            fill: colors.label,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.5 : 0.3
        });
        categoryTitle.position.set(leftX, skillsStartY + categoryIndex * skillRowHeight);
        skillsContainer.addChild(categoryTitle);
        
        // Skills badges
        let skillX = leftX + categoryTitle.width + 15;
        
        category.skills.forEach((skill, skillIndex) => {
            // Create skill badge background
            const skillBg = new PIXI.Graphics();
            skillBg.beginFill(colors.skillBg, 0.4);
            skillBg.lineStyle(1, colors.label, 0.6);
            
            // Create skill text first to measure size - IMPROVED STROKE
            const skillText = new PIXI.Text(skill, {
                fontFamily: "Arial",
                fontSize: Math.min(14, app.screen.width * 0.02),
                fill: colors.skillText,
                stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
                strokeThickness: currentTheme === 'light' ? 0.2 : 0.1
            });
            
            // Draw rounded rectangle based on text size
            const padding = 8;
            skillBg.drawRoundedRect(0, 0, skillText.width + padding * 2, skillText.height + padding, 6);
            skillBg.endFill();
            skillBg.position.set(skillX, skillsStartY + categoryIndex * skillRowHeight - 2);
            
            // Position text inside the badge
            skillText.position.set(skillX + padding, skillsStartY + categoryIndex * skillRowHeight + 2);
            
            skillsContainer.addChild(skillBg);
            skillsContainer.addChild(skillText);
            
            // Update X position for next skill
            skillX += skillText.width + padding * 2 + 10;
        });
    });
    
    // Current Quest section - IMPROVED STROKE
    const questTitle = new PIXI.Text("Current Quest", {
        fontFamily: "Honk, serif",
        fontSize: Math.min(32, app.screen.width * 0.05),
        fill: colors.title,
        stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
        strokeThickness: currentTheme === 'light' ? 1.5 : 1
    });
    questTitle.anchor.set(0.5, 0);
    questTitle.position.set(app.screen.width / 2, 520); // FIXED - more compact
    questTitle.name = 'questTitle';
    container.addChild(questTitle);
    
    // Quest background - COMPACT SPACING
    const questBg = new PIXI.Graphics();
    questBg.name = 'questBg';
    questBg.beginFill(colors.questBg, 0.3);
    questBg.lineStyle(2, colors.label, 0.4);
    const questBgY = 570; // FIXED - more compact
    const questBgHeight = 150; // FIXED like original
    questBg.drawRoundedRect(50, questBgY, app.screen.width - 100, questBgHeight, 10);
    questBg.endFill();
    container.addChild(questBg);
    
    // Quest description text - IMPROVED STROKE
    const questText = new PIXI.Text(
        "As a career changer diving into the world of game development, I am excited to explore and create innovative solutions using technology. Currently focusing on mastering C and developing small games in C#, I am passionate about discovering new technologies and leveraging them to craft high-quality projects.\n\nI am a student at 42 School, where I am honing my skills and expanding my horizons in this dynamic field.",
        {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: colors.questText,
            stroke: currentTheme === 'light' ? 0x000000 : 0x000000,
            strokeThickness: currentTheme === 'light' ? 0.3 : 0.2,
            wordWrap: true,
            wordWrapWidth: app.screen.width - 120,
            lineHeight: 20 // FIXED like original
        }
    );
    questText.name = 'questText';
    questText.position.set(70, questBgY + 20); // FIXED - more compact
    container.addChild(questText);
    
    // Store original elements for resize
    const elements = {
        statsTitle,
        skillsTitle,
        questTitle,
        questBg,
        questText,
        statsContainer,
        skillsContainer
    };
    
    // Resize function - FIXED CONTAINER AND IMPROVED STROKE
    const resizeElements = () => {
        console.log("Resizing about page elements...");
        
        // Get current theme for colors
        const theme = document.body.getAttribute('data-theme') || 'light';
        const newColors = {
            title: theme === 'dark' ? 0xffcc33 : 0xff4444,
            label: theme === 'dark' ? 0x33ccff : 0x0066cc,
            value: theme === 'dark' ? 0xffffff : 0x333333,
            skillBg: theme === 'dark' ? 0x4a4a4a : 0xf0f8ff,
            skillText: theme === 'dark' ? 0xffffff : 0x2c3e50,
            questBg: theme === 'dark' ? 0x2a2a2a : 0x3e5c76,
            questText: theme === 'dark' ? 0xffffff : 0xffffff
        };
        
        // Update title positions and stroke (horizontal centering only)
        elements.statsTitle.position.set(app.screen.width / 2, 150);
        elements.statsTitle.style.fontSize = Math.min(36, app.screen.width * 0.06);
        elements.statsTitle.style.fill = newColors.title;
        elements.statsTitle.style.strokeThickness = theme === 'light' ? 1.5 : 1;
        
        elements.skillsTitle.position.set(app.screen.width / 2, 320);
        elements.skillsTitle.style.fontSize = Math.min(32, app.screen.width * 0.05);
        elements.skillsTitle.style.fill = newColors.title;
        elements.skillsTitle.style.strokeThickness = theme === 'light' ? 1.5 : 1;
        
        elements.questTitle.position.set(app.screen.width / 2, 520);
        elements.questTitle.style.fontSize = Math.min(32, app.screen.width * 0.05);
        elements.questTitle.style.fill = newColors.title;
        elements.questTitle.style.strokeThickness = theme === 'light' ? 1.5 : 1;
        
        // Update quest background (width only)
        elements.questBg.clear();
        elements.questBg.beginFill(newColors.questBg, 0.3);
        elements.questBg.lineStyle(2, newColors.label, 0.4);
        elements.questBg.drawRoundedRect(50, 570, app.screen.width - 100, 150, 10);
        elements.questBg.endFill();
        
        // Update quest text (width and stroke)
        elements.questText.style.fontSize = Math.min(16, app.screen.width * 0.022);
        elements.questText.style.fill = newColors.questText;
        elements.questText.style.wordWrapWidth = app.screen.width - 120;
        elements.questText.style.stroke = 0x000000;
        elements.questText.style.strokeThickness = theme === 'light' ? 0.3 : 0.2;
        
        // Clear and rebuild stats (responsive horizontal positioning)
        elements.statsContainer.removeChildren();
        
        const newLeftX = Math.max(100, app.screen.width * 0.1);
        const newRightX = Math.min(app.screen.width - 250, app.screen.width / 2 + 50);
        
        // Create columns for resize - CORRECTED SKILLS
        const leftColumn = [
            { label: "Class:", value: "Software Developer" },
            { label: "Former Class:", value: "Accountant" },
            { label: "Level:", value: "34" }
        ];
        const rightColumn = [
            { label: "Guild:", value: "42 Porto" },
            { label: "Base:", value: "Porto, Portugal" },
            { label: "Interests:", value: "Game Design, Pixel Art" }
        ];
        
        // Rebuild stats with new colors and IMPROVED stroke
        leftColumn.forEach((stat, index) => {
            const label = new PIXI.Text(stat.label, {
                fontFamily: "Arial",
                fontSize: Math.min(18, app.screen.width * 0.025),
                fontWeight: "bold",
                fill: newColors.label,
                stroke: 0x000000,
                strokeThickness: theme === 'light' ? 0.8 : 0.5
            });
            label.position.set(newLeftX, 200 + index * 30);
            elements.statsContainer.addChild(label);
            
            const value = new PIXI.Text(stat.value, {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.022),
                fill: newColors.value,
                stroke: 0x000000,
                strokeThickness: theme === 'light' ? 0.3 : 0.2
            });
            value.position.set(newLeftX + label.width + 10, 200 + index * 30);
            elements.statsContainer.addChild(value);
        });
        
        rightColumn.forEach((stat, index) => {
            const label = new PIXI.Text(stat.label, {
                fontFamily: "Arial",
                fontSize: Math.min(18, app.screen.width * 0.025),
                fontWeight: "bold",
                fill: newColors.label,
                stroke: 0x000000,
                strokeThickness: theme === 'light' ? 0.8 : 0.5
            });
            label.position.set(newRightX, 200 + index * 30);
            elements.statsContainer.addChild(label);
            
            const value = new PIXI.Text(stat.value, {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.022),
                fill: newColors.value,
                stroke: 0x000000,
                strokeThickness: theme === 'light' ? 0.3 : 0.2
            });
            value.position.set(newRightX + label.width + 10, 200 + index * 30);
            elements.statsContainer.addChild(value);
        });
        
        // Clear and rebuild skills (responsive horizontal positioning)
        elements.skillsContainer.removeChildren();
        
        // CORRECTED skills categories
        const skillCategories = [
            {
                title: "Main Stack:",
                skills: ["C", "C++", "Git"]
            },
            {
                title: "Secondary Stack:",
                skills: ["C#", "CSS", "HTML", "JavaScript"]
            },
            {
                title: "Studying Now:",
                skills: ["Unity", "Game Development", "Algorithms"]
            },
            {
                title: "Tools:",
                skills: [".NET", "VS Code", "Linux", "Slack"]
            }
        ];
        
        skillCategories.forEach((category, categoryIndex) => {
            const categoryTitle = new PIXI.Text(category.title, {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.023),
                fontWeight: "bold",
                fill: newColors.label,
                stroke: 0x000000,
                strokeThickness: theme === 'light' ? 0.5 : 0.3
            });
            categoryTitle.position.set(newLeftX, 370 + categoryIndex * 35);
            elements.skillsContainer.addChild(categoryTitle);
            
            let skillX = newLeftX + categoryTitle.width + 15;
            
            category.skills.forEach((skill) => {
                const skillBg = new PIXI.Graphics();
                skillBg.beginFill(newColors.skillBg, 0.4);
                skillBg.lineStyle(1, newColors.label, 0.6);
                
                const skillText = new PIXI.Text(skill, {
                    fontFamily: "Arial",
                    fontSize: Math.min(14, app.screen.width * 0.02),
                    fill: newColors.skillText,
                    stroke: 0x000000,
                    strokeThickness: theme === 'light' ? 0.2 : 0.1
                });
                
                const padding = 8;
                skillBg.drawRoundedRect(0, 0, skillText.width + padding * 2, skillText.height + padding, 6);
                skillBg.endFill();
                skillBg.position.set(skillX, 370 + categoryIndex * 35 - 2);
                
                skillText.position.set(skillX + padding, 370 + categoryIndex * 35 + 2);
                
                elements.skillsContainer.addChild(skillBg);
                elements.skillsContainer.addChild(skillText);
                
                skillX += skillText.width + padding * 2 + 10;
            });
        });
    };
    
    // Listen for resize events
    window.addEventListener('resize', resizeElements);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                resizeElements();
            }
        });
    });
    observer.observe(document.body, { attributes: true });
    
    // Store cleanup function
    container.cleanup = () => {
        window.removeEventListener('resize', resizeElements);
        observer.disconnect();
    };
    
    return true;
}