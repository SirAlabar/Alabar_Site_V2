// main.js - Universal hash routing version

import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';
import { getSceneManager, initSceneManager } from './manager/SceneManager.js';
import { LoadingManager } from './loading/LoadingManager.js';
import { CloudsManager } from './manager/CloudsManager.js';

// Import page views
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import notFound from "./views/404.js";

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
    console.log("Navigating to hash:", hash);
    
    // Ensure hash starts with #/
    const path = hash.startsWith('#/') ? hash : 
                 hash.startsWith('/') ? `#${hash}` : 
                 hash === '#' ? '#/' : `#/${hash}`;
    
    // Get the content of the route
    const route = routes[path] || routes["#/404"];
    
    // Update page title
    document.title = route.title;
    
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) 
    {
        loadingScreen.style.display = 'flex';
    }
    
    // Update URL in browser using hash
    window.location.hash = path;
    
    // Render after small delay to show loading
    setTimeout(() => 
    {
        renderPage(route);
        
        // Hide loading screen after navigation
        if (loadingScreen) 
        {
            loadingScreen.style.display = 'none';
        }
    }, 500);
}

// Separate function to render the page
function renderPage(route) {
    // Get mainScene element
    const mainScene = document.getElementById('main-scene');
    
    if (mainScene) {
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
        
        // Find any other custom containers and hide them
        document.querySelectorAll('[id$="-container"]').forEach(container => {
            if (container.id !== 'game-container' && 
                container.id !== 'about-container' && 
                container.id !== 'contact-container' && 
                container.id !== 'not-found-container') {
                container.style.display = 'none';
            }
        });
        
        // Show the appropriate container based on hash
       switch (hash) 
       {
            case "#/":
            case "":
                // Home page - Show game container
                if (gameContainer) 
                {
                    gameContainer.style.display = 'block';
                    console.log("Showing game-container");
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
                        console.log("Showing about-container");
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
                        console.log("Showing contact-container");
                    } 
                    catch (error) 
                    {
                        console.error("Error rendering contact content:", error);
                        contactContainer.innerHTML = "<div style='color:red'>Error loading Contact content</div>";
                        contactContainer.style.display = 'block';
                    }
                }
                break;
                
            case "#/404":
                // 404 page - Render content and show container
                if (notFoundContainer) 
                {
                    try 
                    {
                        notFoundContainer.innerHTML = route.render();
                        notFoundContainer.style.display = 'block';
                        console.log("Showing not-found-container");
                    } 
                    catch (error) 
                    {
                        console.error("Error rendering 404 content:", error);
                        notFoundContainer.innerHTML = "<div style='color:red'>Error loading 404 content</div>";
                        notFoundContainer.style.display = 'block';
                    }
                }
                break;
                
            default:
                // Custom pages - Render content based on hash
                const containerID = hash.substring(2).replace(/^(\d)/, 'page-$1') + '-container';
                const customContainer = document.getElementById(containerID);
                if (customContainer) 
                {
                    try 
                    {
                        customContainer.innerHTML = route.render();
                        customContainer.style.display = 'block';
                        console.log("Showing custom container:", containerID);
                    } 
                    catch (error) 
                    {
                        console.error(`Error rendering ${containerID} content:`, error);
                        customContainer.innerHTML = "<div style='color:red'>Error loading content</div>";
                        customContainer.style.display = 'block';
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
        console.log("Link clicked:", hash);
        
        // Navigate to the hash
        navigateTo(hash);
    }
});

// Handle hash changes (back/forward buttons, reload)
window.addEventListener('hashchange', () => 
{
    console.log("Hash changed to:", getCurrentHash());
    
    // Get the route based on current hash
    const hash = getCurrentHash();
    const route = routes[hash] || routes["#/404"];
    
    // Render the page
    renderPage(route);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => 
{
    console.log("DOM loaded");
    
    // Initialize existing components
    const swordButton = createSwordButton();
    const loadingManager = new LoadingManager();
    loadingManager.start();
    
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
        console.log("Link updated:", link.href);
    });
    
    // Navigate to initial hash
    const initialHash = getCurrentHash();
    console.log("Initial hash:", initialHash);
    
    // If it's the first load, wait a bit for LoadingManager to finish
    setTimeout(() => 
    {
        const route = routes[initialHash] || routes["#/404"];
        renderPage(route);
    }, 1000);
});