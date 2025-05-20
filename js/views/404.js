// views/404.js

// Renderização da página 404 personalizada (usada pelo router)
export default function notFound() 
{
    return `
        <div class="error-container">
            <h2 class="error-title">404</h2>
            <div class="pixel-art-404">404</div>
            <p class="error-message">Oops! The page you're looking for doesn't exist or has been moved.</p>
            <a href="#/" class="btn-home" data-link>Return to Home</a>
        </div>
    `;
}

// Exportar a função de redirecionamento separadamente
export function handleDirectAccess() {
    // Se estivermos sendo carregados via arquivo HTML, não via router
    if (!window.location.hash && window.location.pathname !== "/") {
        // Capturar o caminho atual
        const path = window.location.pathname;
        
        // Construir a URL de redirecionamento com hash
        let redirectTo = window.location.origin;
        
        // Se o caminho não for a raiz, adicione-o como hash
        if (path !== '/' && path !== '/index.html') {
            redirectTo += '/#' + path;
        } else {
            redirectTo += '/#/';
        }
        
        // Redirecionar para a versão com hash
        console.log("Redirecting to hash version:", redirectTo);
        window.location.replace(redirectTo);
        return true;
    }
    return false;
}