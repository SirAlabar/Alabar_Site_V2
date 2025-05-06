class ParallaxEffect 
{
    constructor() 
    {
        this.layers = document.querySelectorAll('.layer');
        this.bounds = {
            mouse: { min: -1, max: 1 },
            scroll: { min: -3, max: 3 }
        };
        
        this.smoothFactor = 0.02;
        this.currentPositions = new Map();

        // Intensity multipliers
        this.mouseIntensity = 0.2;
        this.scrollIntensity = 0.1;   
        
        this.init();
    }
    
    init() 
    {
        // Initialize current positions for each layer
        this.layers.forEach(layer => {
            this.currentPositions.set(layer, { x: 0, y: 0 });
        });
        
        // Add event listeners
        window.addEventListener('mousemove', this.handleMouse.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Start animation loop
        this.animate();
        
        // Trigger an initial scroll event to set positions
        this.handleScroll();
    }
    
    handleMouse(e) 
    {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed || 0) * this.mouseIntensity;
            
            // Skip background and mountain layers
            if (layer.id === 'background' || layer.id === 'mountain') return;
            
            const targetX = (e.clientX - centerX) * speed;
            const targetY = (e.clientY - centerY) * speed;
            
            const current = this.currentPositions.get(layer);
            const boundedX = this.boundValue(targetX, this.bounds.mouse.min, this.bounds.mouse.max);
            const boundedY = this.boundValue(targetY, this.bounds.mouse.min, this.bounds.mouse.max);
            
            current.targetX = boundedX;
            current.targetY = boundedY;
        });
    }
    
    handleScroll() 
    {
        const scrolled = window.pageYOffset;
        
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed || 0) * this.scrollIntensity;
            
            // Skip background and mountain layers
            if (layer.id === 'background' || layer.id === 'mountain') return;
            
            const yOffset = -(scrolled * speed);
            const boundedY = this.boundValue(yOffset, this.bounds.scroll.min, this.bounds.scroll.max);
            
            const current = this.currentPositions.get(layer);
            current.targetScrollY = boundedY;
        });
    }
    
    animate() 
    {
        this.layers.forEach(layer => {
            const current = this.currentPositions.get(layer);
            
            // Initialize any missing values
            if (!current.targetX) current.targetX = 0;
            if (!current.targetY) current.targetY = 0;
            if (!current.targetScrollY) current.targetScrollY = 0;
            
            // Smoothly interpolate to target values
            current.x = this.lerp(current.x || 0, current.targetX || 0, this.smoothFactor);
            current.y = this.lerp(current.y || 0, current.targetScrollY + (current.targetY || 0), this.smoothFactor);
            
            // Apply transform
            layer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        });
        
        // Continue animation loop
        requestAnimationFrame(this.animate.bind(this));
    }
    
    lerp(start, end, factor) 
    {
        return start + (end - start) * factor;
    }
    
    boundValue(value, min, max) 
    {
        return Math.min(Math.max(value, min), max);
    }
}

// Export globally
window.ParallaxEffect = ParallaxEffect;