// main.js - Pixi.js based content rendering with hash routing

import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';
import { getSceneManager, initSceneManager } from './manager/SceneManager.js';
import { LoadingManager } from './loading/LoadingManager.js';
import { CloudsManager } from './manager/CloudsManager.js';

// Store global reference to LoadingManager
let globalLoadingManager;

// Define route titles
const routes = 
{
    "#/": { title: "Home - Hugo Marta" },
    "#/about": { title: "About - Hugo Marta" },
    "#/contact": { title: "Contact - Hugo Marta" },
    "#/404": { title: "Page Not Found - Hugo Marta" }
};

// Function to get current hash or default to home
function getCurrentHash() 
{
    return window.location.hash || "#/";
}

// Function to navigate between pages
function navigateTo(hash) 
{
    // Ensure hash starts with #/
    const path = hash.startsWith('#/') ? hash : 
                 hash.startsWith('/') ? `#${hash}` : 
                 hash === '#' ? '#/' : `#/${hash}`;
    
    // Get the route info
    const route = routes[path] || routes["#/404"];
    
    // Update page title
    document.title = route.title;
    
    // Update URL in browser using hash
    window.location.hash = path;
    
    // Extract page name from hash
    const pageName = path.replace('#/', '') || 'home';
    
    // Use ContentManager to switch to this page
    if (window.contentManager) 
    {
        // Force app stage sorting and rendering
        if (window.app) 
        {
            window.app.stage.sortChildren();
            window.app.renderer.render(window.app.stage);
        }
        
        window.contentManager.navigateTo(pageName);
    }
    else 
    {
        console.warn("ContentManager not initialized yet");
    }
    
    // Highlight active nav link
    updateActiveNavLink();
}

// Update active nav link
function updateActiveNavLink() 
{
    const currentHash = getCurrentHash();
    
    document.querySelectorAll('.nav-link').forEach(link => 
    {
        const href = link.getAttribute('href');
        // Convert href to hash format if needed
        const linkHash = href.startsWith('#') ? href : 
                       href === '/' ? '#/' : `#${href}`;
        
        if (linkHash === currentHash) 
        {
            link.classList.add('active');
        } 
        else 
        {
            link.classList.remove('active');
        }
    });
}

// Handle clicks on links
document.addEventListener('click', e => 
{
    const link = e.target.closest("[data-link]");
    if (link) 
    {
        e.preventDefault();
        // Get the hash from the link
        const hash = link.getAttribute('href');
        // Navigate to the hash
        navigateTo(hash);
    }
});

// Handle hash changes (back/forward buttons, reload)
window.addEventListener('hashchange', () => 
{
    // Get the hash from the URL
    const hash = getCurrentHash();
    // Navigate to the hash
    navigateTo(hash);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => 
{
    // Initialize existing components
    const swordButton = createSwordButton();
    const loadingManager = new LoadingManager();
    
    // Store global reference
    globalLoadingManager = loadingManager;
    
    // Override the onLoadingComplete method to integrate with navigation
    const originalOnLoadingComplete = loadingManager.onLoadingComplete.bind(loadingManager);
    loadingManager.onLoadingComplete = function() 
    {
        // Call the original method first
        originalOnLoadingComplete();
        // After the original method completes, initialize navigation
        setTimeout(() => 
        {
            // Initialize navigation after LoadingManager finishes
            const initialHash = getCurrentHash();
            navigateTo(initialHash);
        }, 1500);
    };
    
    // Update navigation links to use hash format
    document.querySelectorAll('a[data-link]').forEach(link => 
    {
        const href = link.getAttribute('href');
        // Convert href to hash format if needed
        if (!href.startsWith('#')) 
        {
            const newHref = href === '/' ? '#/' : `#${href}`;
            link.setAttribute('href', newHref);
        }
    });
    
    // Start loading
    loadingManager.start();
});