// main.js - Universal hash routing version

import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';
import { getSceneManager, initSceneManager } from './manager/SceneManager.js';
import { LoadingManager } from './loading/LoadingManager.js';
import { CloudsManager } from './manager/CloudsManager.js';


// Import page views
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import notFound, { handleDirectAccess } from "./views/404.js";

// Store global reference to LoadingManager
let globalLoadingManager;

// Define routes using hash
const routes = 
{
    "#/": { title: "Home - Hugo Marta", render: home },
    "#/about": { title: "About - Hugo Marta", render: about },
    "#/contact": { title: "Contact - Hugo Marta", render: contact },
    "#/404": { title: "Page Not Found - Hugo Marta", render: notFound },
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
    
    // Get the content of the route
    const route = routes[path] || routes["#/404"];
    
    // Update page title
    document.title = route.title;
    
    // Update URL in browser using hash
    window.location.hash = path;
    
    // Use the existing LoadingUI instance if available
    if (globalLoadingManager && globalLoadingManager.ui) 
    {
        const loadingUI = globalLoadingManager.ui;
        
        // Show the loading screen
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        
        // Reset progress
        loadingUI.updateProgress(0);
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => 
        {
            progress += 5;
            loadingUI.updateProgress(Math.min(progress, 100));
            
            if (progress >= 100) 
            {
                clearInterval(interval);
                
                // Show completion animation and wait for it
                loadingUI.showComplete().then(() => 
                {
                    // Wait for animations to complete
                    setTimeout(() => 
                    {
                        // Render page
                        renderPage(route);
                        
                        // Hide loading screen
                        loadingUI.hide();
                    }, 1500);
                });
            }
        }, 30);
    } 
    else 
    {
        // Fallback if LoadingUI isn't available
        renderPage(route);
    }
}

// Separate function to render the page
function renderPage(route) 
{
    // Get mainScene element
    const mainScene = document.getElementById('main-scene');
    
    if (mainScene) 
    {
        // Check which page we're displaying
        const hash = getCurrentHash();
        
        // Get all possible containers
        const gameContainer = document.getElementById('game-container');
        const aboutContainer = document.getElementById('about-container');
        const contactContainer = document.getElementById('contact-container');
        const notFoundContainer = document.getElementById('not-found-container');
        
        // Hide all containers first
        if (gameContainer) gameContainer.style.display = 'none';
        if (aboutContainer) aboutContainer.style.display = 'none';
        if (contactContainer) contactContainer.style.display = 'none';
        if (notFoundContainer) notFoundContainer.style.display = 'none';
        
        // Show the appropriate container based on hash
        switch (hash) 
        {
            case "#/":
            case "":
                // Home page - Show game container
                if (gameContainer) 
                {
                    gameContainer.style.display = 'block';
                }
                break;
                
            case "#/about":
                // About page - Render content and show container
                if (aboutContainer) 
                {
                    try 
                    {
                        const aboutHTML = route.render();
                        aboutContainer.innerHTML = aboutHTML;
                        aboutContainer.style.display = 'block';
                    } 
                    catch (error) 
                    {
                        console.error("Error rendering about content:", error);
                        aboutContainer.innerHTML = "<div style='color:red'>Error loading About content</div>";
                        aboutContainer.style.display = 'block';
                    }
                }
                break;
                
            case "#/contact":
                // Contact page - Render content and show container
                if (contactContainer) 
                {
                    try 
                    {
                        const contactHTML = route.render();
                        contactContainer.innerHTML = contactHTML;
                        contactContainer.style.display = 'block';
                    } 
                    catch (error) 
                    {
                        console.error("Error rendering contact content:", error);
                        contactContainer.innerHTML = "<div style='color:red'>Error loading Contact content</div>";
                        contactContainer.style.display = 'block';
                    }
                }
                break;
                
            default:
                // Route not found - Show 404 page
                if (notFoundContainer) 
                {
                    try 
                    {
                        // Use the 404 route from routes object
                        const notFoundHTML = routes["#/404"].render();
                        notFoundContainer.innerHTML = notFoundHTML;
                        notFoundContainer.style.display = 'block';
                    } 
                    catch (error) 
                    {
                        console.error("Error rendering 404 content:", error);
                        notFoundContainer.innerHTML = "<div style='color:red'>Error loading 404 content</div>";
                        notFoundContainer.style.display = 'block';
                    }
                }
                break;
        }
        
        // Highlight active nav link
        updateActiveNavLink();
    } 
    else 
    {
        console.error("Element main-scene not found!");
    }
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
    // Get the route based on current hash
    const hash = getCurrentHash();
    const route = routes[hash] || routes["#/404"];
    
    // Render the page
    renderPage(route);
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
            const route = routes[initialHash] || routes["#/404"];
            renderPage(route);
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