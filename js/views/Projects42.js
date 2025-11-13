/**
 * 42 School Projects - Collectible Card Game Style
 * Features: Game card design, shine effect, responsive grid
 */

// Configuration
const CONFIG = {
    fonts: {
        heading: "Honk, Arial, sans-serif",
        body: "Arial, sans-serif"
    },
    
    card: {
        width: 180,
        height: 240,
        borderSize: 6,
        cornerRadius: 12,
        imageHeight: 120,
        nameHeight: 30,
        spacing: 20
    },
    
    colors: {
        dark: {
            title: 0xffcc33,
            text: 0xffffff,
            cardBg: 0x2a3a4a,
            // Rarity colors
            common: 0x808080,
            uncommon: 0x4CAF50,
            rare: 0x2196F3,
            epic: 0x9C27B0,
            legendary: 0xFF9800
        },
        light: {
            title: 0xcc0000,
            text: 0xffffff,
            cardBg: 0x2a3a4a,
            common: 0x808080,
            uncommon: 0x4CAF50,
            rare: 0x2196F3,
            epic: 0x9C27B0,
            legendary: 0xFF9800
        }
    },
    
    shine: {
        duration: 2000,
        interval: 5000,
        width: 40,
        opacity: 0.6
    }
};

// Project data with rarity
const PROJECT_DATA = [
    {
        category: "📚 Foundation",
        projects: [
            {
                name: "Libft",
                icon: "📚",
                skills: ["C", "Memory", "Algorithms"],
                grade: "125/100",
                rarity: "uncommon",
                github: "https://github.com/SirAlabar/libft"
            },
            {
                name: "Born2beRoot",
                icon: "🖥️",
                skills: ["Linux", "Security", "VM"],
                grade: "125/100",
                rarity: "uncommon",
                github: "https://github.com/SirAlabar/born2beroot"
            },
            {
                name: "ft_printf",
                icon: "🖨️",
                skills: ["C", "Variadic", "Format"],
                grade: "125/100",
                rarity: "uncommon",
                github: "https://github.com/SirAlabar/ft_printf"
            },
            {
                name: "get_next_line",
                icon: "📄",
                skills: ["C", "File I/O", "Static"],
                grade: "125/100",
                rarity: "uncommon",
                github: "https://github.com/SirAlabar/get_next_line"
            }
        ]
    },
    {
        category: "🔄 Algorithmic",
        projects: [
            {
                name: "push_swap",
                icon: "🔄",
                skills: ["C", "Algo", "Optimize"],
                grade: "125/100",
                rarity: "rare",
                github: "https://github.com/SirAlabar/push_swap"
            },
            {
                name: "pipex",
                icon: "⚙️",
                skills: ["C", "Process", "IPC"],
                grade: "125/100",
                rarity: "rare",
                github: "https://github.com/SirAlabar/pipex"
            },
            {
                name: "so_long",
                icon: "🎮",
                skills: ["C", "Graphics", "Game"],
                grade: "125/100",
                rarity: "rare",
                github: "https://github.com/SirAlabar/so_long"
            },
            {
                name: "NetPractice",
                icon: "🌐",
                skills: ["Network", "IP", "Subnet"],
                grade: "100/100",
                rarity: "rare",
                github: "https://github.com/SirAlabar/netpractice"
            }
        ]
    },
    {
        category: "👥 Team",
        projects: [
            {
                name: "minishell",
                icon: "🐚",
                skills: ["C", "Parse", "Process"],
                grade: "125/100",
                rarity: "epic",
                github: "https://github.com/SirAlabar/minishell"
            },
            {
                name: "cub3d",
                icon: "🎯",
                skills: ["C", "Graphics", "Math"],
                grade: "125/100",
                rarity: "epic",
                github: "https://github.com/SirAlabar/cub3d"
            },
            {
                name: "ft_irc",
                icon: "💬",
                skills: ["C++", "Network", "Protocol"],
                grade: "Progress",
                rarity: "common",
                github: null
            },
            {
                name: "transcendence",
                icon: "🎲",
                skills: ["TypeScript", "NestJS", "SQL"],
                grade: "Progress",
                rarity: "common",
                github: null
            }
        ]
    },
    {
        category: "🧠 Advanced",
        projects: [
            {
                name: "Philosophers",
                icon: "🤔",
                skills: ["C", "Thread", "Mutex"],
                grade: "125/100",
                rarity: "legendary",
                github: "https://github.com/SirAlabar/philosophers"
            },
            {
                name: "Inception",
                icon: "🐳",
                skills: ["Docker", "Compose", "DevOps"],
                grade: "Progress",
                rarity: "common",
                github: null
            },
            {
                name: "CPP Modules",
                icon: "⚡",
                skills: ["C++", "OOP", "Templates"],
                grade: "100/100",
                rarity: "legendary",
                github: "https://github.com/SirAlabar/cpp-modules"
            }
        ]
    }
];

export default function projects42(container, app) {
    container.sortableChildren = true;
    
    const getTheme = () => document.body.getAttribute('data-theme') || 'light';
    let colors = CONFIG.colors[getTheme()];
    
    const elements = { cards: [], titles: [], shines: [] };
    
    // Create shine effect for a card
    const createShineEffect = (cardContainer) => {
        const shine = new PIXI.Graphics();
        shine.beginFill(0xffffff, CONFIG.shine.opacity);
        shine.drawRect(0, 0, CONFIG.shine.width, CONFIG.card.height);
        shine.endFill();
        shine.position.x = -CONFIG.shine.width;
        shine.alpha = 0;
        cardContainer.addChild(shine);
        
        return shine;
    };
    
    // Animate shine across card
    const animateShine = (shine) => {
        shine.alpha = 0;
        shine.position.x = -CONFIG.shine.width;
        
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / CONFIG.shine.duration;
            
            if (progress < 1) {
                shine.position.x = -CONFIG.shine.width + (CONFIG.card.width + CONFIG.shine.width) * progress;
                shine.alpha = Math.sin(progress * Math.PI) * CONFIG.shine.opacity;
                requestAnimationFrame(animate);
            } else {
                shine.alpha = 0;
            }
        };
        
        animate();
    };
    
    // Create game card
    const createGameCard = (project, x, y) => {
        const cardContainer = new PIXI.Container();
        cardContainer.position.set(x, y);
        cardContainer.sortableChildren = true;
        
        const borderColor = colors[project.rarity];
        const hasLink = project.github !== null;
        
        if (hasLink) {
            cardContainer.interactive = true;
            cardContainer.buttonMode = true;
            cardContainer.cursor = 'pointer';
        }
        
        // Card shadow
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.4);
        shadow.drawRoundedRect(4, 4, CONFIG.card.width, CONFIG.card.height, CONFIG.card.cornerRadius);
        shadow.endFill();
        shadow.zIndex = 0;
        cardContainer.addChild(shadow);
        
        // Card background
        const cardBg = new PIXI.Graphics();
        cardBg.beginFill(colors.cardBg, 1);
        cardBg.drawRoundedRect(0, 0, CONFIG.card.width, CONFIG.card.height, CONFIG.card.cornerRadius);
        cardBg.endFill();
        cardBg.zIndex = 1;
        cardContainer.addChild(cardBg);
        
        // Thick border (game card style)
        const border = new PIXI.Graphics();
        border.lineStyle(CONFIG.card.borderSize, borderColor, 1);
        border.drawRoundedRect(
            CONFIG.card.borderSize / 2,
            CONFIG.card.borderSize / 2,
            CONFIG.card.width - CONFIG.card.borderSize,
            CONFIG.card.height - CONFIG.card.borderSize,
            CONFIG.card.cornerRadius
        );
        border.zIndex = 2;
        cardContainer.addChild(border);
        
        // Image area background (darker)
        const imageArea = new PIXI.Graphics();
        imageArea.beginFill(0x1a1a2e, 1);
        imageArea.drawRoundedRect(
            CONFIG.card.borderSize,
            CONFIG.card.borderSize,
            CONFIG.card.width - CONFIG.card.borderSize * 2,
            CONFIG.card.imageHeight,
            8
        );
        imageArea.endFill();
        imageArea.zIndex = 3;
        cardContainer.addChild(imageArea);
        
        // Icon (large emoji)
        const icon = new PIXI.Text(project.icon, {
            fontFamily: CONFIG.fonts.body,
            fontSize: 60,
            fill: colors.text
        });
        icon.anchor.set(0.5, 0.5);
        icon.position.set(
            CONFIG.card.width / 2,
            CONFIG.card.borderSize + CONFIG.card.imageHeight / 2
        );
        icon.zIndex = 4;
        cardContainer.addChild(icon);
        
        // Name banner
        const nameBanner = new PIXI.Graphics();
        nameBanner.beginFill(borderColor, 0.9);
        nameBanner.drawRoundedRect(
            CONFIG.card.borderSize,
            CONFIG.card.borderSize + CONFIG.card.imageHeight - 5,
            CONFIG.card.width - CONFIG.card.borderSize * 2,
            CONFIG.card.nameHeight,
            6
        );
        nameBanner.endFill();
        nameBanner.zIndex = 5;
        cardContainer.addChild(nameBanner);
        
        // Project name
        const nameText = new PIXI.Text(project.name, {
            fontFamily: CONFIG.fonts.heading,
            fontSize: 16,
            fill: 0xffffff,
            fontWeight: 'bold',
            wordWrap: true,
            wordWrapWidth: CONFIG.card.width - CONFIG.card.borderSize * 2 - 10
        });
        nameText.anchor.set(0.5, 0.5);
        nameText.position.set(
            CONFIG.card.width / 2,
            CONFIG.card.borderSize + CONFIG.card.imageHeight + CONFIG.card.nameHeight / 2 - 5
        );
        nameText.zIndex = 6;
        cardContainer.addChild(nameText);
        
        // Skills section
        const skillsY = CONFIG.card.borderSize + CONFIG.card.imageHeight + CONFIG.card.nameHeight + 5;
        
        project.skills.forEach((skill, index) => {
            const skillText = new PIXI.Text(`• ${skill}`, {
                fontFamily: CONFIG.fonts.body,
                fontSize: 11,
                fill: colors.text
            });
            skillText.position.set(
                CONFIG.card.borderSize + 10,
                skillsY + index * 16
            );
            skillText.zIndex = 6;
            cardContainer.addChild(skillText);
        });
        
        // Grade badge at bottom
        const gradeY = CONFIG.card.height - CONFIG.card.borderSize - 25;
        const gradeColor = project.grade.includes('Progress') ? 0xFF9800 : 0x4CAF50;
        
        const gradeBg = new PIXI.Graphics();
        gradeBg.beginFill(gradeColor, 0.3);
        gradeBg.lineStyle(2, gradeColor, 0.8);
        gradeBg.drawRoundedRect(
            CONFIG.card.borderSize + 5,
            gradeY,
            CONFIG.card.width - CONFIG.card.borderSize * 2 - 10,
            20,
            6
        );
        gradeBg.endFill();
        gradeBg.zIndex = 6;
        cardContainer.addChild(gradeBg);
        
        const gradeText = new PIXI.Text(project.grade, {
            fontFamily: CONFIG.fonts.body,
            fontSize: 12,
            fill: gradeColor,
            fontWeight: 'bold'
        });
        gradeText.anchor.set(0.5, 0.5);
        gradeText.position.set(CONFIG.card.width / 2, gradeY + 10);
        gradeText.zIndex = 7;
        cardContainer.addChild(gradeText);
        
        // Shine effect
        const shine = createShineEffect(cardContainer);
        shine.zIndex = 10;
        elements.shines.push(shine);
        
        // Start random shine animation
        const startShine = () => {
            const randomDelay = Math.random() * CONFIG.shine.interval;
            setTimeout(() => {
                animateShine(shine);
                startShine(); // Loop
            }, randomDelay);
        };
        startShine();
        
        // Hover effects
        if (hasLink) {
            let isHovered = false;
            
            cardContainer.on('pointerover', () => {
                if (isHovered) return;
                isHovered = true;
                
                cardContainer.scale.set(1.08);
                cardContainer.zIndex = 1000;
                
                // Brighten border
                border.clear();
                border.lineStyle(CONFIG.card.borderSize + 2, borderColor, 1);
                border.drawRoundedRect(
                    CONFIG.card.borderSize / 2,
                    CONFIG.card.borderSize / 2,
                    CONFIG.card.width - CONFIG.card.borderSize,
                    CONFIG.card.height - CONFIG.card.borderSize,
                    CONFIG.card.cornerRadius
                );
                
                // Trigger shine on hover
                animateShine(shine);
                
                cardContainer.parent.sortChildren();
            });
            
            cardContainer.on('pointerout', () => {
                if (!isHovered) return;
                isHovered = false;
                
                cardContainer.scale.set(1);
                cardContainer.zIndex = 0;
                
                // Reset border
                border.clear();
                border.lineStyle(CONFIG.card.borderSize, borderColor, 1);
                border.drawRoundedRect(
                    CONFIG.card.borderSize / 2,
                    CONFIG.card.borderSize / 2,
                    CONFIG.card.width - CONFIG.card.borderSize,
                    CONFIG.card.height - CONFIG.card.borderSize,
                    CONFIG.card.cornerRadius
                );
            });
            
            cardContainer.on('pointertap', (event) => {
                event.stopPropagation();
                window.open(project.github, '_blank');
            });
        }
        
        return cardContainer;
    };
    
    // Build page
    const buildPage = () => {
        // Clear existing
        elements.cards.forEach(card => card.destroy());
        elements.titles.forEach(title => title.destroy());
        elements.cards = [];
        elements.titles = [];
        elements.shines = [];
        
        // Main title
        const mainTitle = new PIXI.Text('42 School Projects', {
            fontFamily: CONFIG.fonts.heading,
            fontSize: 36,
            fill: colors.title
        });
        mainTitle.anchor.set(0.5, 0);
        mainTitle.position.set(app.screen.width / 2, 60);
        container.addChild(mainTitle);
        elements.titles.push(mainTitle);
        
        // Description
        const description = new PIXI.Text(
            'Collectible Project Cards - Click to view on GitHub',
            {
                fontFamily: CONFIG.fonts.body,
                fontSize: 16,
                fill: colors.text,
                wordWrap: true,
                wordWrapWidth: app.screen.width - 100,
                align: 'center'
            }
        );
        description.anchor.set(0.5, 0);
        description.position.set(app.screen.width / 2, 105);
        container.addChild(description);
        elements.titles.push(description);
        
        let currentY = 150;
        
        // Calculate cards per row (responsive)
        const minMargin = 40;
        const availableWidth = app.screen.width - minMargin * 2;
        const cardsPerRow = Math.max(1, Math.floor((availableWidth + CONFIG.card.spacing) / (CONFIG.card.width + CONFIG.card.spacing)));
        
        // Create categories
        PROJECT_DATA.forEach(category => {
            // Category title
            const categoryTitle = new PIXI.Text(category.category, {
                fontFamily: CONFIG.fonts.heading,
                fontSize: 24,
                fill: colors.title
            });
            categoryTitle.anchor.set(0.5, 0);
            categoryTitle.position.set(app.screen.width / 2, currentY);
            container.addChild(categoryTitle);
            elements.titles.push(categoryTitle);
            
            currentY += 40;
            
            // Create cards in rows
            category.projects.forEach((project, index) => {
                const row = Math.floor(index / cardsPerRow);
                const col = index % cardsPerRow;
                
                // Center each row
                const cardsInRow = Math.min(cardsPerRow, category.projects.length - row * cardsPerRow);
                const rowWidth = cardsInRow * CONFIG.card.width + (cardsInRow - 1) * CONFIG.card.spacing;
                const startX = (app.screen.width - rowWidth) / 2;
                
                const cardX = startX + col * (CONFIG.card.width + CONFIG.card.spacing);
                const cardY = currentY + row * (CONFIG.card.height + CONFIG.card.spacing);
                
                const card = createGameCard(project, cardX, cardY);
                container.addChild(card);
                elements.cards.push(card);
            });
            
            // Update Y for next category
            const rows = Math.ceil(category.projects.length / cardsPerRow);
            currentY += rows * (CONFIG.card.height + CONFIG.card.spacing) + 40;
        });
    };
    
    // Resize handler
    const handleResize = () => {
        setTimeout(() => buildPage(), 10);
    };
    
    // Theme handler
    const handleTheme = () => {
        colors = CONFIG.colors[getTheme()];
        buildPage();
    };
    
    // Initial build
    buildPage();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-theme') {
                handleTheme();
            }
        });
    });
    themeObserver.observe(document.body, { attributes: true });
    
    // Cleanup
    container.cleanup = () => {
        window.removeEventListener('resize', handleResize);
        themeObserver.disconnect();
    };
    
    return true;
}