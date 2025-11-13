/**
 * About page content creator for Pixi.js
 * Creates character stats and quest description with improved responsive design
 * Includes font fallback for Linux compatibility
 */

const CONFIG = {
    // Layout positions
    layout: {
        statsY: 150,
        skillsY: 330,
        questY: 540,
        
        // Backgrounds
        statsBgY: 200,
        statsBgHeight: 120,
        skillsBgY: 370,
        skillsBgHeight: 160,
        questBgY: 590,
        
        // Content positioning
        statsContentY: 215,
        skillsContentY: 385,
        statsLineSpacing: 30,
        skillsLineSpacing: 35,
        
        // Padding
        bgPadding: 50,
        questPadding: 20,
        skillTagPadding: 8,
        skillTagSpacing: 10,
        labelValueSpacing: 10,
        categorySkillSpacing: 15
    },
    
    // Responsive sizing
    sizing: {
        // Width constraints
        statsMaxWidth: 600,
        statsMinWidth: 300,
        statsWidthPercent: 0.8,
        
        skillsMaxWidth: 700,
        skillsMinWidth: 350,
        skillsWidthPercent: 0.85,
        
        questMaxWidth: 800,
        questMinMargin: 100,
        
        // Font sizes (percentage of screen width)
        titleFontSize: 0.06,
        titleMaxSize: 36,
        
        subtitleFontSize: 0.05,
        subtitleMaxSize: 32,
        
        textFontSize: 0.022,
        textMaxSize: 16,
        
        labelFontSize: 0.025,
        labelMaxSize: 18,
        
        skillFontSize: 0.02,
        skillMaxSize: 14,
        
        categoryFontSize: 0.023,
        categoryMaxSize: 16
    },
    
    // Border radius
    borderRadius: 10,
    skillTagRadius: 6,
    
    // Text line height
    questLineHeight: 20
};

const THEME_COLORS = {
    dark: {
        title: 0xffcc33,
        skillBg: 0x4a4a4a,
        skillBgAlpha: 0.6,
        skillBgLineAlpha: 0.7,
        fixedBlueBg: 0x1e3a5f,
        bgAlpha: 0.4,
        bgLineAlpha: 0.6,
        whiteText: 0xffffff
    },
    light: {
        title: 0xcc0000,
        skillBg: 0x4a4a4a,
        skillBgAlpha: 0.6,
        skillBgLineAlpha: 0.7,
        fixedBlueBg: 0x1e3a5f,
        bgAlpha: 0.4,
        bgLineAlpha: 0.6,
        whiteText: 0xffffff
    }
};

const STATS_DATA = [
    { label: "Class:", value: "Software Developer" },
    { label: "Former Class:", value: "Accountant" },
    { label: "Level:", value: "34" },
    { label: "Guild:", value: "42 Porto" },
    { label: "Base:", value: "Porto, Portugal" },
    { label: "Interests:", value: "Game Design, Pixel Art" }
];

const SKILLS_DATA = [
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

const QUEST_TEXT = "As a career changer diving into the world of game development, I am excited to explore and create innovative solutions using technology. Currently focusing on mastering C and developing small games in C#, I am passionate about discovering new technologies and leveraging them to craft high-quality projects.\n\nI am a student at 42 School, where I am honing my skills and expanding my horizons in this dynamic field.";


/**
 * Detects if Honk font causes excessive width and returns appropriate fallback
 */
function detectFont() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    context.font = '32px Honk, serif';
    const testWidth = context.measureText('Test').width;
    
    // If width is excessive, use fallback
    return testWidth > 200 ? "Impact, serif" : "Honk, serif";
}

/**
 * Calculate responsive font size
 */
function getResponsiveFontSize(screenWidth, percentOfWidth, maxSize) {
    return Math.min(maxSize, screenWidth * percentOfWidth);
}

/**
 * Calculate responsive width with min/max constraints
 */
function getResponsiveWidth(screenWidth, minWidth, maxWidth, percentOfWidth) {
    const minConstraint = Math.min(screenWidth - 40, minWidth);
    return Math.min(maxWidth, Math.max(minConstraint, screenWidth * percentOfWidth));
}

/**
 * Center position calculation
 */
function getCenteredX(screenWidth, elementWidth) {
    return (screenWidth - elementWidth) / 2;
}

/**
 * Create text element with consistent styling
 */
function createText(text, options = {}) {
    const defaults = {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: 'normal'
    };
    
    return new PIXI.Text(text, { ...defaults, ...options });
}

/**
 * Draw rounded rectangle background
 */
function drawBackground(graphics, x, y, width, height, color, alpha, lineAlpha, radius) {
    graphics.clear();
    graphics.beginFill(color, alpha);
    graphics.lineStyle(1, color, lineAlpha);
    graphics.drawRoundedRect(x, y, width, height, radius);
    graphics.endFill();
}

export default function about(container, app, assetManager) {
    const fontFamily = detectFont();
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    let colors = THEME_COLORS[currentTheme];

    const elements = {
        // Backgrounds
        statsBg: new PIXI.Graphics(),
        skillsBg: new PIXI.Graphics(),
        questBg: new PIXI.Graphics(),
        
        // Containers
        statsContainer: new PIXI.Container(),
        skillsContainer: new PIXI.Container(),
        
        // Titles
        statsTitle: createText("Character Stats", {
            fontFamily,
            fontSize: getResponsiveFontSize(app.screen.width, CONFIG.sizing.titleFontSize, CONFIG.sizing.titleMaxSize),
            fill: colors.title,
            fontWeight: 'bold'
        }),
        
        skillsTitle: createText("Technical Skills", {
            fontFamily,
            fontSize: getResponsiveFontSize(app.screen.width, CONFIG.sizing.subtitleFontSize, CONFIG.sizing.subtitleMaxSize),
            fill: colors.title,
            fontWeight: 'bold'
        }),
        
        questTitle: createText("Current Quest", {
            fontFamily,
            fontSize: getResponsiveFontSize(app.screen.width, CONFIG.sizing.subtitleFontSize, CONFIG.sizing.subtitleMaxSize),
            fill: colors.title,
            fontWeight: 'bold'
        }),
        
        // Quest text
        questText: createText(QUEST_TEXT, {
            fontSize: getResponsiveFontSize(app.screen.width, CONFIG.sizing.textFontSize, CONFIG.sizing.textMaxSize),
            fill: colors.whiteText,
            wordWrap: true,
            wordWrapWidth: Math.min(app.screen.width - 120, CONFIG.sizing.questMaxWidth),
            lineHeight: CONFIG.questLineHeight
        })
    };
    
    // Set name properties for easier debugging
    Object.keys(elements).forEach(key => {
        elements[key].name = key;
    });
    
    // Set anchors for titles
    elements.statsTitle.anchor.set(0.5, 0);
    elements.skillsTitle.anchor.set(0.5, 0);
    elements.questTitle.anchor.set(0.5, 0);
    
    // Add all elements to container
    container.addChild(
        elements.statsBg,
        elements.skillsBg,
        elements.questBg,
        elements.statsTitle,
        elements.skillsTitle,
        elements.questTitle,
        elements.questText,
        elements.statsContainer,
        elements.skillsContainer
    );
    
    function drawBackgrounds() {
        const screenWidth = app.screen.width;
        
        // Stats background
        const statsWidth = getResponsiveWidth(
            screenWidth,
            CONFIG.sizing.statsMinWidth,
            CONFIG.sizing.statsMaxWidth,
            CONFIG.sizing.statsWidthPercent
        );
        const statsX = getCenteredX(screenWidth, statsWidth);
        
        drawBackground(
            elements.statsBg,
            statsX,
            CONFIG.layout.statsBgY,
            statsWidth,
            CONFIG.layout.statsBgHeight,
            colors.fixedBlueBg,
            colors.bgAlpha,
            colors.bgLineAlpha,
            CONFIG.borderRadius
        );
        
        // Skills background
        const skillsWidth = getResponsiveWidth(
            screenWidth,
            CONFIG.sizing.skillsMinWidth,
            CONFIG.sizing.skillsMaxWidth,
            CONFIG.sizing.skillsWidthPercent
        );
        const skillsX = getCenteredX(screenWidth, skillsWidth);
        
        drawBackground(
            elements.skillsBg,
            skillsX,
            CONFIG.layout.skillsBgY,
            skillsWidth,
            CONFIG.layout.skillsBgHeight,
            colors.fixedBlueBg,
            colors.bgAlpha,
            colors.bgLineAlpha,
            CONFIG.borderRadius
        );
        
        // Quest background (dynamic size based on text)
        const questWidth = Math.min(
            elements.questText.width + CONFIG.layout.questPadding * 2,
            screenWidth - CONFIG.sizing.questMinMargin
        );
        const questHeight = elements.questText.height + CONFIG.layout.questPadding * 2;
        const questX = getCenteredX(screenWidth, questWidth);
        
        drawBackground(
            elements.questBg,
            questX,
            CONFIG.layout.questBgY,
            questWidth,
            questHeight,
            colors.fixedBlueBg,
            colors.bgAlpha,
            colors.bgLineAlpha,
            CONFIG.borderRadius
        );
        
        // Position quest text relative to its background
        elements.questText.position.set(
            questX + CONFIG.layout.questPadding,
            CONFIG.layout.questBgY + CONFIG.layout.questPadding
        );
    }

    function buildStatsContent() {
        elements.statsContainer.removeChildren();
        
        const screenWidth = app.screen.width;
        const statsWidth = getResponsiveWidth(
            screenWidth,
            CONFIG.sizing.statsMinWidth,
            CONFIG.sizing.statsMaxWidth,
            CONFIG.sizing.statsWidthPercent
        );
        const statsX = getCenteredX(screenWidth, statsWidth);
        
        const leftX = statsX + CONFIG.layout.bgPadding;
        const rightX = statsX + (statsWidth / 2);
        const startY = CONFIG.layout.statsContentY;
        
        const fontSize = getResponsiveFontSize(screenWidth, CONFIG.sizing.labelFontSize, CONFIG.sizing.labelMaxSize);
        const valueSize = getResponsiveFontSize(screenWidth, CONFIG.sizing.textFontSize, CONFIG.sizing.textMaxSize);
        
        // Split into two columns
        const leftColumn = STATS_DATA.slice(0, 3);
        const rightColumn = STATS_DATA.slice(3);
        
        // Helper function to create stat row
        const createStatRow = (stat, x, y) => {
            const label = createText(stat.label, {
                fontSize,
                fontWeight: "bold",
                fill: colors.whiteText
            });
            label.position.set(x, y);
            elements.statsContainer.addChild(label);
            
            const value = createText(stat.value, {
                fontSize: valueSize,
                fill: colors.whiteText
            });
            value.position.set(x + label.width + CONFIG.layout.labelValueSpacing, y);
            elements.statsContainer.addChild(value);
        };
        
        // Build left column
        leftColumn.forEach((stat, index) => {
            createStatRow(stat, leftX, startY + index * CONFIG.layout.statsLineSpacing);
        });
        
        // Build right column
        rightColumn.forEach((stat, index) => {
            createStatRow(stat, rightX, startY + index * CONFIG.layout.statsLineSpacing);
        });
    }

    function buildSkillsContent() {
        elements.skillsContainer.removeChildren();
        
        const screenWidth = app.screen.width;
        const skillsWidth = getResponsiveWidth(
            screenWidth,
            CONFIG.sizing.skillsMinWidth,
            CONFIG.sizing.skillsMaxWidth,
            CONFIG.sizing.skillsWidthPercent
        );
        const skillsX = getCenteredX(screenWidth, skillsWidth);
        const startX = skillsX + CONFIG.layout.bgPadding;
        const startY = CONFIG.layout.skillsContentY;
        
        const categorySize = getResponsiveFontSize(screenWidth, CONFIG.sizing.categoryFontSize, CONFIG.sizing.categoryMaxSize);
        const skillSize = getResponsiveFontSize(screenWidth, CONFIG.sizing.skillFontSize, CONFIG.sizing.skillMaxSize);
        
        SKILLS_DATA.forEach((category, categoryIndex) => {
            const y = startY + categoryIndex * CONFIG.layout.skillsLineSpacing;
            
            // Category title
            const categoryTitle = createText(category.title, {
                fontSize: categorySize,
                fontWeight: "bold",
                fill: colors.whiteText
            });
            categoryTitle.position.set(startX, y);
            elements.skillsContainer.addChild(categoryTitle);
            
            // Skills as tags
            let skillX = startX + categoryTitle.width + CONFIG.layout.categorySkillSpacing;
            
            category.skills.forEach((skill) => {
                // Create skill tag background
                const skillBg = new PIXI.Graphics();
                const skillText = createText(skill, {
                    fontSize: skillSize,
                    fill: colors.whiteText
                });
                
                const padding = CONFIG.layout.skillTagPadding;
                const tagWidth = skillText.width + padding * 2;
                const tagHeight = skillText.height + padding;
                
                skillBg.beginFill(colors.skillBg, colors.skillBgAlpha);
                skillBg.lineStyle(1, colors.skillBg, colors.skillBgLineAlpha);
                skillBg.drawRoundedRect(0, 0, tagWidth, tagHeight, CONFIG.skillTagRadius);
                skillBg.endFill();
                skillBg.position.set(skillX, y - 2);
                
                skillText.position.set(skillX + padding, y + 2);
                
                elements.skillsContainer.addChild(skillBg);
                elements.skillsContainer.addChild(skillText);
                
                skillX += tagWidth + CONFIG.layout.skillTagSpacing;
            });
        });
    }

    function resizeElements() {
        if (!elements.statsTitle || !elements.questText) {
            console.warn("About page elements not found during resize");
            return;
        }
        
        const screenWidth = app.screen.width;
        
        // Update title positions and sizes
        elements.statsTitle.position.set(screenWidth / 2, CONFIG.layout.statsY);
        elements.statsTitle.style.fontSize = getResponsiveFontSize(
            screenWidth,
            CONFIG.sizing.titleFontSize,
            CONFIG.sizing.titleMaxSize
        );
        
        elements.skillsTitle.position.set(screenWidth / 2, CONFIG.layout.skillsY);
        elements.skillsTitle.style.fontSize = getResponsiveFontSize(
            screenWidth,
            CONFIG.sizing.subtitleFontSize,
            CONFIG.sizing.subtitleMaxSize
        );
        
        elements.questTitle.position.set(screenWidth / 2, CONFIG.layout.questY);
        elements.questTitle.style.fontSize = getResponsiveFontSize(
            screenWidth,
            CONFIG.sizing.subtitleFontSize,
            CONFIG.sizing.subtitleMaxSize
        );
        
        // Update quest text
        elements.questText.style.fontSize = getResponsiveFontSize(
            screenWidth,
            CONFIG.sizing.textFontSize,
            CONFIG.sizing.textMaxSize
        );
        elements.questText.style.wordWrapWidth = Math.min(
            screenWidth - 120,
            CONFIG.sizing.questMaxWidth
        );
        
        // Force text recalculation
        elements.questText._autoResolution = true;
        
        // Small delay to ensure text has recalculated
        setTimeout(() => {
            drawBackgrounds();
            buildStatsContent();
            buildSkillsContent();
        }, 10);
    }

    function updateTheme() {
        const newTheme = document.body.getAttribute('data-theme') || 'light';
        colors = THEME_COLORS[newTheme];
        
        // Update title colors
        elements.statsTitle.style.fill = colors.title;
        elements.skillsTitle.style.fill = colors.title;
        elements.questTitle.style.fill = colors.title;
        
        // Redraw everything with new colors
        drawBackgrounds();
        buildSkillsContent(); // Skills have colored backgrounds
    }

    // Initial build
    drawBackgrounds();
    buildStatsContent();
    buildSkillsContent();
    
    // Position titles after initial build
    elements.statsTitle.position.set(app.screen.width / 2, CONFIG.layout.statsY);
    elements.skillsTitle.position.set(app.screen.width / 2, CONFIG.layout.skillsY);
    elements.questTitle.position.set(app.screen.width / 2, CONFIG.layout.questY);

    window.addEventListener('resize', resizeElements);
    
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateTheme();
            }
        });
    });
    themeObserver.observe(document.body, { attributes: true });

    container.cleanup = () => {
        window.removeEventListener('resize', resizeElements);
        themeObserver.disconnect();
    };
    
    return true;
}