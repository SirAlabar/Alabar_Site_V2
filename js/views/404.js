// views/404.js

// Função para determinar se estamos sendo carregados diretamente (em vez de via router)
function isDirectAccess() {
    // Se estivermos sendo carregados via arquivo HTML, não via router
    return !window.location.hash || window.location.pathname !== "/";
}

// Função para realizar redirecionamento quando acessado diretamente
function redirectToHashVersion() {
    if (isDirectAccess()) {
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
        window.location.replace(redirectTo);
        return true;
    }
    return false;
}

// Executar redirecionamento imediatamente se necessário
redirectToHashVersion();

// Renderização da página 404 personalizada (usada pelo router)
export default function notFound() {
    return `
        <div id="not-found-container">
            <div class="error-card">
                <h2>Page Not Found</h2>
                <div class="pixel-art-404">404</div>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <p>Would you like to return to the castle?</p>
                <div class="action-buttons">
                    <a href="#/" class="btn-home">Return Home</a>
                </div>
            </div>
        </div>
    `;
}
