/**
 * Mobile Projects page content creator for Pixi.js
 * Creates mobile development project cards
 */
export default function projectsMobile(container, app) 
{
    console.log("ProjectsMobile function called for Pixi content!");
    
    // Title
    const title = new PIXI.Text("Mobile Development Projects", {
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
    comingSoon.position.set(app.screen.width / 2, 200);
    container.addChild(comingSoon);
    
    // Description
    const description = new PIXI.Text(
        "Mobile development projects will be featured here!\nIncluding React Native and native iOS/Android apps.",
        {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xcccccc,
            align: 'center',
            lineHeight: 25
        }
    );
    description.anchor.set(0.5, 0.5);
    description.position.set(app.screen.width / 2, 270);
    container.addChild(description);
    
    return true;
}