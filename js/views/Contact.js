/**
 * Contact page content creator for Pixi.js
 * Creates contact information display
 */
export default function contact(container, app) 
{
    console.log("Contact function called for Pixi content!");
    
    // Title
    const title = new PIXI.Text("Contact Me", {
        fontFamily: "Honk, serif",
        fontSize: 40,
        fill: 0xffcc33
    });
    title.anchor.set(0.5, 0);
    title.position.set(app.screen.width / 2, 150);
    container.addChild(title);
    
    // Get In Touch section
    const infoTitle = new PIXI.Text("Get In Touch", {
        fontFamily: "Honk, serif",
        fontSize: 36,
        fill: 0xffcc33
    });
    infoTitle.anchor.set(0.5, 0);
    infoTitle.position.set(app.screen.width / 2, 220);
    container.addChild(infoTitle);
    
    // Contact info background
    const infoBg = new PIXI.Graphics();
    infoBg.beginFill(0x212529, 0.2);
    infoBg.drawRoundedRect(50, 270, app.screen.width - 100, 150, 10);
    infoBg.endFill();
    container.addChild(infoBg);
    
    // Contact items
    const contacts = [
        { type: "GitHub", value: "github.com/SirAlabar" },
        { type: "LinkedIn", value: "linkedin.com/in/hugollmarta" }
    ];
    
    // Create contact items
    contacts.forEach((contact, index) => {
        const x = index === 0 ? 100 : app.screen.width / 2 + 50;
        const y = 300;
        
        // Title
        const titleText = new PIXI.Text(contact.type, {
            fontFamily: "Arial",
            fontSize: 18,
            fontWeight: "bold",
            fill: 0x0011f8
        });
        titleText.position.set(x, y);
        
        // Value/link text
        const valueText = new PIXI.Text(contact.value, {
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
            window.open('https://' + contact.value, '_blank');
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
    });
    
    return true;
}