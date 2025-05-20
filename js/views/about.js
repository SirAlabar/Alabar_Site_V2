export default function about() 
{
    return `
        <div id="about-container" class="content-card">
            <div class="character-stats">
                <h3>Character Stats</h3>
                <div class="row">
                    <div class="col-md-6">
                        <div class="stat-item">
                            <span class="stat-label">Class:</span>
                            <span class="stat-value">Software Developer</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Former Class:</span>
                            <span class="stat-value">Accountant</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">34</span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="stat-item">
                            <span class="stat-label">Guild:</span>
                            <span class="stat-value">42 Porto</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Base:</span>
                            <span class="stat-value">Porto, Portugal</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Language:</span>
                            <span class="stat-value">English B2</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="quest-description">
                <h3>Current Quest</h3>
                <p>As a career changer diving into the world of game development, I am excited to explore and create innovative solutions using technology. Currently focusing on mastering C and developing small games in C#, I am passionate about discovering new technologies and leveraging them to craft high-quality projects.</p>
                <p>I am a student at 42 School, where I am honing my skills and expanding my horizons in this dynamic field.</p>
            </div>
        </div>
    `;
}