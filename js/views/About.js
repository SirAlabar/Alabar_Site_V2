/**
 * About page content creator for Pixi.js
 * Creates character stats and quest description
 */
export default function about(container, app, assetManager) 
{
    console.log("About function called for Pixi content!");
    
    // Character Stats section
    const statsTitle = new PIXI.Text("Character Stats", {
        fontFamily: "Honk, serif",
        fontSize: 36,
        fill: 0xffcc33
    });
    statsTitle.anchor.set(0.5, 0);
    statsTitle.position.set(app.screen.width / 2, 150);
    container.addChild(statsTitle);
    
    // Stats data
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
        const label = new PIXI.Text(stat.label, {
            fontFamily: "Arial",
            fontSize: 18,
            fontWeight: "bold",
            fill: 0x33ccff
        });
        label.position.set(100, 200 + index * 30);
        
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
        const label = new PIXI.Text(stat.label, {
            fontFamily: "Arial",
            fontSize: 18,
            fontWeight: "bold",
            fill: 0x33ccff
        });
        label.position.set(app.screen.width / 2 + 50, 200 + index * 30);
        
        const value = new PIXI.Text(stat.value, {
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0xffffff
        });
        value.position.set(app.screen.width / 2 + 50 + label.width + 10, 200 + index * 30);
        
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
    questTitle.position.set(app.screen.width / 2, 320);
    container.addChild(questTitle);
    
    // Quest background
    const questBg = new PIXI.Graphics();
    questBg.beginFill(0x212529, 0.2);
    questBg.drawRoundedRect(50, 370, app.screen.width - 100, 150, 10);
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
            wordWrapWidth: app.screen.width - 120,
            lineHeight: 20
        }
    );
    questText.position.set(70, 390);
    container.addChild(questText);
    
    return true;
}