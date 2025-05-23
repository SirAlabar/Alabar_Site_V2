/**
 * About page content creator for Pixi.js
 * Creates character stats and quest description with improved responsive design
 */
export default function about(container, app, assetManager) 
{
    console.log("About function called for Pixi content!");
    
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    const colors = {
        title: currentTheme === 'dark' ? 0xffcc33 : 0xcc0000,
        label: currentTheme === 'dark' ? 0x33ccff : 0x003366,
        value: currentTheme === 'dark' ? 0xffffff : 0x000000,
        skillBg: currentTheme === 'dark' ? 0x4a4a4a : 0xffffff,
        skillText: currentTheme === 'dark' ? 0xffffff : 0x000000,
        fixedBlueBg: 0x1e3a5f,
        questText: 0xffffff
    };
    
    const statsTitle = new PIXI.Text("Character Stats", 
    {
        fontFamily: "Honk, serif",
        fontSize: Math.min(36, app.screen.width * 0.06),
        fill: colors.title
    });
    statsTitle.anchor.set(0.5, 0);
    statsTitle.position.set(app.screen.width / 2, 150);
    statsTitle.name = 'statsTitle';
    container.addChild(statsTitle);
    
    const stats = [
        { label: "Class:", value: "Software Developer" },
        { label: "Former Class:", value: "Accountant" },
        { label: "Level:", value: "34" },
        { label: "Guild:", value: "42 Porto" },
        { label: "Base:", value: "Porto, Portugal" },
        { label: "Interests:", value: "Game Design, Pixel Art" }
    ];
    
    const statsContainer = new PIXI.Container();
    statsContainer.name = 'statsContainer';
    container.addChild(statsContainer);
    
    const statsBg = new PIXI.Graphics();
    statsBg.name = 'statsBg';
    
    const statsY = 200;
    const leftX = Math.max(100, app.screen.width * 0.1);
    const rightX = Math.min(app.screen.width - 250, app.screen.width / 2 + 50);
    const lineHeight = 30;
    
    const statsWidth = app.screen.width - 100;
    const statsHeight = 120;
    
    statsBg.beginFill(colors.fixedBlueBg, 0.4);
    statsBg.lineStyle(1, colors.fixedBlueBg, 0.6);
    statsBg.drawRoundedRect(50, statsY - 15, statsWidth, statsHeight, 10);
    statsBg.endFill();
    container.addChild(statsBg);
    
    const leftColumn = stats.slice(0, 3);
    const rightColumn = stats.slice(3);
    
    leftColumn.forEach((stat, index) => 
    {
        const label = new PIXI.Text(stat.label, 
        {
            fontFamily: "Arial",
            fontSize: Math.min(18, app.screen.width * 0.025),
            fontWeight: "bold",
            fill: 0xffffff
        });
        label.position.set(leftX, statsY + index * lineHeight);
        statsContainer.addChild(label);
        
        const value = new PIXI.Text(stat.value, 
        {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: 0xffffff
        });
        value.position.set(leftX + label.width + 10, statsY + index * lineHeight);
        statsContainer.addChild(value);
    });
    
    rightColumn.forEach((stat, index) => 
    {
        const label = new PIXI.Text(stat.label, 
        {
            fontFamily: "Arial",
            fontSize: Math.min(18, app.screen.width * 0.025),
            fontWeight: "bold",
            fill: 0xffffff
        });
        label.position.set(rightX, statsY + index * lineHeight);
        statsContainer.addChild(label);
        
        const value = new PIXI.Text(stat.value, 
        {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: 0xffffff
        });
        value.position.set(rightX + label.width + 10, statsY + index * lineHeight);
        statsContainer.addChild(value);
    });
    
    const skillsTitle = new PIXI.Text("Technical Skills", 
    {
        fontFamily: "Honk, serif",
        fontSize: Math.min(32, app.screen.width * 0.05),
        fill: colors.title
    });
    skillsTitle.anchor.set(0.5, 0);
    skillsTitle.position.set(app.screen.width / 2, 320);
    skillsTitle.name = 'skillsTitle';
    container.addChild(skillsTitle);
    
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
    
    const skillsContainer = new PIXI.Container();
    skillsContainer.name = 'skillsContainer';
    container.addChild(skillsContainer);
    
    const skillsBg = new PIXI.Graphics();
    skillsBg.name = 'skillsBg';
    
    const skillsStartY = 370;
    const skillRowHeight = 35;
    
    const skillsWidth = app.screen.width - 100;
    const skillsHeight = 160;
    
    skillsBg.beginFill(colors.fixedBlueBg, 0.4);
    skillsBg.lineStyle(1, colors.fixedBlueBg, 0.6);
    skillsBg.drawRoundedRect(50, skillsStartY - 15, skillsWidth, skillsHeight, 10);
    skillsBg.endFill();
    container.addChild(skillsBg);
    
    skillCategories.forEach((category, categoryIndex) => 
    {
        const categoryTitle = new PIXI.Text(category.title, 
        {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.023),
            fontWeight: "bold",
            fill: 0xffffff
        });
        categoryTitle.position.set(leftX, skillsStartY + categoryIndex * skillRowHeight);
        skillsContainer.addChild(categoryTitle);
        
        let skillX = leftX + categoryTitle.width + 15;
        
        category.skills.forEach((skill, skillIndex) => 
        {
            const skillBg = new PIXI.Graphics();
            skillBg.beginFill(colors.skillBg, currentTheme === 'light' ? 0.9 : 0.6);
            skillBg.lineStyle(1, colors.label, currentTheme === 'light' ? 0.8 : 0.7);
            
            const skillText = new PIXI.Text(skill, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(14, app.screen.width * 0.02),
                fill: colors.skillText
            });
            
            const padding = 8;
            skillBg.drawRoundedRect(0, 0, skillText.width + padding * 2, skillText.height + padding, 6);
            skillBg.endFill();
            skillBg.position.set(skillX, skillsStartY + categoryIndex * skillRowHeight - 2);
            
            skillText.position.set(skillX + padding, skillsStartY + categoryIndex * skillRowHeight + 2);
            
            skillsContainer.addChild(skillBg);
            skillsContainer.addChild(skillText);
            
            skillX += skillText.width + padding * 2 + 10;
        });
    });
    
    const questTitle = new PIXI.Text("Current Quest", 
    {
        fontFamily: "Honk, serif",
        fontSize: Math.min(32, app.screen.width * 0.05),
        fill: colors.title
    });
    questTitle.anchor.set(0.5, 0);
    questTitle.position.set(app.screen.width / 2, 540);
    questTitle.name = 'questTitle';
    container.addChild(questTitle);
    
    const questText = new PIXI.Text(
        "As a career changer diving into the world of game development, I am excited to explore and create innovative solutions using technology. Currently focusing on mastering C and developing small games in C#, I am passionate about discovering new technologies and leveraging them to craft high-quality projects.\n\nI am a student at 42 School, where I am honing my skills and expanding my horizons in this dynamic field.",
        {
            fontFamily: "Arial",
            fontSize: Math.min(16, app.screen.width * 0.022),
            fill: 0xffffff,
            wordWrap: true,
            wordWrapWidth: Math.min(app.screen.width - 120, 800),
            lineHeight: 20
        }
    );
    questText.name = 'questText';
    
    const questBg = new PIXI.Graphics();
    questBg.name = 'questBg';
    questBg.beginFill(colors.fixedBlueBg, 0.4);
    questBg.lineStyle(1, colors.fixedBlueBg, 0.6);
    
    const questBgY = 590;
    const questBgWidth = Math.min(questText.width + 40, app.screen.width - 100);
    const questBgHeight = questText.height + 40;
    const questBgX = (app.screen.width - questBgWidth) / 2;
    
    questBg.drawRoundedRect(questBgX, questBgY, questBgWidth, questBgHeight, 10);
    questBg.endFill();
    container.addChild(questBg);
    
    questText.position.set(questBgX + 20, questBgY + 20);
    container.addChild(questText);
    
    const elements = {
        statsTitle,
        skillsTitle,
        questTitle,
        statsBg,
        skillsBg,
        questBg,
        questText,
        statsContainer,
        skillsContainer
    };
    
    const resizeElements = () => 
    {
        console.log("Resizing about page elements...");
        
        const theme = document.body.getAttribute('data-theme') || 'light';
        const newColors = {
            title: theme === 'dark' ? 0xffcc33 : 0xcc0000,
            label: theme === 'dark' ? 0x33ccff : 0x003366,
            value: theme === 'dark' ? 0xffffff : 0x000000,
            skillBg: theme === 'dark' ? 0x4a4a4a : 0xffffff,
            skillText: theme === 'dark' ? 0xffffff : 0x000000,
            fixedBlueBg: 0x1e3a5f,
            questText: 0xffffff
        };
        
        elements.statsTitle.position.set(app.screen.width / 2, 150);
        elements.statsTitle.style.fontSize = Math.min(36, app.screen.width * 0.06);
        elements.statsTitle.style.fill = newColors.title;
        
        elements.skillsTitle.position.set(app.screen.width / 2, 320);
        elements.skillsTitle.style.fontSize = Math.min(32, app.screen.width * 0.05);
        elements.skillsTitle.style.fill = newColors.title;
        
        elements.questTitle.position.set(app.screen.width / 2, 540);
        elements.questTitle.style.fontSize = Math.min(32, app.screen.width * 0.05);
        elements.questTitle.style.fill = newColors.title;
        
        const newLeftX = Math.max(100, app.screen.width * 0.1);
        const newRightX = Math.min(app.screen.width - 250, app.screen.width / 2 + 50);
        
        elements.statsBg.clear();
        elements.statsBg.beginFill(newColors.fixedBlueBg, 0.4);
        elements.statsBg.lineStyle(1, newColors.fixedBlueBg, 0.6);
        elements.statsBg.drawRoundedRect(50, 185, app.screen.width - 100, 120, 10);
        elements.statsBg.endFill();
        
        elements.skillsBg.clear();
        elements.skillsBg.beginFill(newColors.fixedBlueBg, 0.4);
        elements.skillsBg.lineStyle(1, newColors.fixedBlueBg, 0.6);
        elements.skillsBg.drawRoundedRect(50, 355, app.screen.width - 100, 160, 10);
        elements.skillsBg.endFill();
        
        elements.questText.style.fontSize = Math.min(16, app.screen.width * 0.022);
        elements.questText.style.fill = 0xffffff;
        elements.questText.style.wordWrapWidth = Math.min(app.screen.width - 120, 800);
        
        const newQuestBgWidth = Math.min(elements.questText.width + 40, app.screen.width - 100);
        const newQuestBgHeight = elements.questText.height + 40;
        const newQuestBgX = (app.screen.width - newQuestBgWidth) / 2;
        
        elements.questBg.clear();
        elements.questBg.beginFill(newColors.fixedBlueBg, 0.4);
        elements.questBg.lineStyle(1, newColors.fixedBlueBg, 0.6);
        elements.questBg.drawRoundedRect(newQuestBgX, 590, newQuestBgWidth, newQuestBgHeight, 10);
        elements.questBg.endFill();
        
        elements.questText.position.set(newQuestBgX + 20, 610);
        
        elements.statsContainer.removeChildren();
        
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
        
        leftColumn.forEach((stat, index) => 
        {
            const label = new PIXI.Text(stat.label, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(18, app.screen.width * 0.025),
                fontWeight: "bold",
                fill: 0xffffff
            });
            label.position.set(newLeftX, 200 + index * 30);
            elements.statsContainer.addChild(label);
            
            const value = new PIXI.Text(stat.value, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.022),
                fill: 0xffffff
            });
            value.position.set(newLeftX + label.width + 10, 200 + index * 30);
            elements.statsContainer.addChild(value);
        });
        
        rightColumn.forEach((stat, index) => 
        {
            const label = new PIXI.Text(stat.label, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(18, app.screen.width * 0.025),
                fontWeight: "bold",
                fill: 0xffffff
            });
            label.position.set(newRightX, 200 + index * 30);
            elements.statsContainer.addChild(label);
            
            const value = new PIXI.Text(stat.value, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.022),
                fill: 0xffffff
            });
            value.position.set(newRightX + label.width + 10, 200 + index * 30);
            elements.statsContainer.addChild(value);
        });
        
        elements.skillsContainer.removeChildren();
        
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
        
        skillCategories.forEach((category, categoryIndex) => 
        {
            const categoryTitle = new PIXI.Text(category.title, 
            {
                fontFamily: "Arial",
                fontSize: Math.min(16, app.screen.width * 0.023),
                fontWeight: "bold",
                fill: 0xffffff
            });
            categoryTitle.position.set(newLeftX, 370 + categoryIndex * 35);
            elements.skillsContainer.addChild(categoryTitle);
            
            let skillX = newLeftX + categoryTitle.width + 15;
            
            category.skills.forEach((skill) => 
            {
                const skillBg = new PIXI.Graphics();
                skillBg.beginFill(newColors.skillBg, theme === 'light' ? 0.9 : 0.6);
                skillBg.lineStyle(1, newColors.label, theme === 'light' ? 0.8 : 0.7);
                
                const skillText = new PIXI.Text(skill, 
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(14, app.screen.width * 0.02),
                    fill: newColors.skillText
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
    
    window.addEventListener('resize', resizeElements);
    
    const observer = new MutationObserver((mutations) => 
    {
        mutations.forEach((mutation) => 
        {
            if (mutation.attributeName === 'data-theme') 
            {
                resizeElements();
            }
        });
    });
    observer.observe(document.body, { attributes: true });
    
    container.cleanup = () => 
    {
        window.removeEventListener('resize', resizeElements);
        observer.disconnect();
    };
    
    return true;
}