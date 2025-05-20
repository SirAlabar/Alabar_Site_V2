// main.js - Versão com hash routing universal

import { SwordButtonComponent, createSwordButton } from './components/SwordButtonComponent.js';
import { getSceneManager, initSceneManager } from './manager/SceneManager.js';
import { LoadingManager } from './loading/LoadingManager.js';
import { CloudsManager } from './manager/CloudsManager.js';

// Import page views
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import notFound from "./views/404.js";

// Define routes usando hash
const routes = {
    "#/": { title: "Home - Hugo Marta", render: home },
    "#/about": { title: "About - Hugo Marta", render: about },
    "#/contact": { title: "Contact - Hugo Marta", render: contact },
    "#/404": { title: "Page Not Found - Hugo Marta", render: notFound },
};

// Função para obter o hash atual ou default para home
function getCurrentHash() {
    return window.location.hash || "#/";
}

// Função para navegar entre páginas
function navigateTo(hash) {
    console.log("Navegando para hash:", hash);
    
    // Garantir que hash comece com #/
    const path = hash.startsWith('#/') ? hash : 
                 hash.startsWith('/') ? `#${hash}` : 
                 hash === '#' ? '#/' : `#/${hash}`;
    
    // Obter o conteúdo da rota
    const route = routes[path] || routes["#/"];
    
    // Atualizar o título
    document.title = route.title;
    
    // Mostrar tela de loading
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
    
    // Atualizar a URL no navegador usando hash
    window.location.hash = path;
    
    // Renderizar após pequeno delay para mostrar loading
    setTimeout(() => {
        renderPage(route);
        
        // Esconder tela de loading após a navegação
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 500);
}

// Função separada para renderizar a página
function renderPage(route) {
    // Obter o mainScene
    const mainScene = document.getElementById('main-scene');
    
    if (mainScene) {
        // Preservar o canvas PIXI.js
        const pixiCanvas = mainScene.querySelector('canvas');
        
        // Remover qualquer container de conteúdo anterior
        const oldContentContainer = mainScene.querySelector('.page-content-container');
        if (oldContentContainer) {
            mainScene.removeChild(oldContentContainer);
        }
        
        // Criar um novo container para o conteúdo da página
        const contentContainer = document.createElement('div');
        contentContainer.className = 'page-content-container';
        
        // Adicionar o conteúdo da página ao container
        contentContainer.innerHTML = route.render();
        
        // Adicionar o container ao mainScene
        mainScene.appendChild(contentContainer);
        
        console.log("Conteúdo atualizado mantendo background");
        
        // Destacar link ativo no menu
        updateActiveNavLink();
    } else {
        console.error("Elemento main-scene não encontrado!");
    }
}

// Atualizar link ativo no menu
function updateActiveNavLink() {
    const currentHash = getCurrentHash();
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        // Converter href para formato hash se necessário
        const linkHash = href.startsWith('#') ? href : 
                       href === '/' ? '#/' : `#${href}`;
        
        if (linkHash === currentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Manipular cliques em links
document.addEventListener('click', e => {
    const link = e.target.closest("[data-link]");
    if (link) {
        e.preventDefault();
        
        // Obter o hash do link
        const hash = link.getAttribute('href');
        console.log("Link clicado:", hash);
        
        // Navegar para o hash
        navigateTo(hash);
    }
});

// Manipular mudanças no hash (botão voltar/avançar, recarregamento)
window.addEventListener('hashchange', () => {
    console.log("Hash mudou para:", getCurrentHash());
    
    // Obter a rota com base no hash atual
    const hash = getCurrentHash();
    const route = routes[hash] || routes["#/"];
    
    // Renderizar a página
    renderPage(route);
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado");
    
    // Inicializar componentes existentes
    const swordButton = createSwordButton();
    const loadingManager = new LoadingManager();
    loadingManager.start();
    
    // Atualizar os links de navegação para usar formato hash
    document.querySelectorAll('a[data-link]').forEach(link => {
        const href = link.getAttribute('href');
        // Converter href para formato hash se necessário
        if (!href.startsWith('#')) {
            const newHref = href === '/' ? '#/' : `#${href}`;
            link.setAttribute('href', newHref);
        }
        console.log("Link atualizado:", link.href);
    });
    
    document.head.appendChild(style);
    
    // Navegar para o hash inicial
    const initialHash = getCurrentHash();
    console.log("Hash inicial:", initialHash);
    
    const style = document.createElement('style');
    style.textContent += notFoundStyles;
    document.head.appendChild(style);
    // Se for a primeira carga, esperar um pouco para o LoadingManager terminar
    setTimeout(() => {
        const route = routes[initialHash] || routes["#/"];
        renderPage(route);
    }, 1000);
});