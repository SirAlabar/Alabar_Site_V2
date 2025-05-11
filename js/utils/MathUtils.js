function adjustFontSizes() {
    // Log inicial para verificar se a função está sendo chamada
    console.log("Ajustando tamanhos de fonte...");
    
    // Define breakpoints e tamanhos
    const minScreenWidth = 320;
    const maxScreenWidth = 1920;
    
    const minNavLinkSize = 16;
    const maxNavLinkSize = 32;
    
    const minDropdownSize = 15;
    const maxDropdownSize = 30;
    
    // Dimensões atuais
    const currentWidth = window.innerWidth;
    
    // Calcular o percentual
    let ratio = (currentWidth - minScreenWidth) / (maxScreenWidth - minScreenWidth);
    ratio = Math.max(0, Math.min(1, ratio));
    
    // Calcular tamanhos
    const navLinkSize = minNavLinkSize + (maxNavLinkSize - minNavLinkSize) * ratio;
    const dropdownSize = minDropdownSize + (maxDropdownSize - minDropdownSize) * ratio;
    
    console.log(`================Largura atual: ${currentWidth}px` );
    console.log(`===================Ratio calculado: ${ratio.toFixed(2)}`);
    console.log(`=====================Tamanho calculado para nav-link: ${Math.round(navLinkSize)}px`);
    
    // Aplicar tamanhos com !important para sobrescrever CSS
    document.head.insertAdjacentHTML('beforeend', `
        <style id="dynamic-font-styles">
            .nav-link {
                font-size: ${Math.round(navLinkSize)}px !important;
                padding: ${3 + (Math.round(navLinkSize) / 16) * 3}px ${3 + (Math.round(navLinkSize) / 16) * 3}px !important;
                margin: ${2 + (Math.round(navLinkSize) / 16) * 8}px !important;
            }
            
            .dropdown-item {
                font-size: ${Math.round(dropdownSize)}px !important;
            }
            
            .social-media {
                width: ${30 + ratio * 20}px !important;
                height: ${30 + ratio * 20}px !important;
            }
            
            .header-logo {
                width: ${40 + ratio * 10}px !important;
                height: ${40 + ratio * 10}px !important;
            }
        </style>
    `);


    // if (currentWidth >= 768 && currentWidth < 992) {
    //     console.log("Aplicando ajustes específicos para telas médias");
        
    //     // Remover estilos anteriores
    //     const oldMediumFixes = document.getElementById('medium-screen-fixes');
    //     if (oldMediumFixes) {
    //         oldMediumFixes.remove();
    //     }
        
    //     // Adicionar novos estilos
    //     document.head.insertAdjacentHTML('beforeend', `
    //         <style id="medium-screen-fixes">
    //             /* Centralizar nav-items */
    //             .container-fluid > .row > .col-md-8 {
    //                 width: 100% !important;
    //                 flex: 0 0 100% !important;
    //                 max-width: 100% !important;
    //                 margin-top: 5px !important;
    //             }
    //         </style>
    //     `);
    // }
        
    // Verificar se os estilos foram aplicados
    const navLink = document.querySelector('.nav-link');
    if (navLink) {
        const computedStyle = window.getComputedStyle(navLink);
        console.log(`Tamanho real aplicado: ${computedStyle.fontSize}`);
    }
}

// Executar no carregamento e redimensionamento
document.addEventListener('DOMContentLoaded', function() {
    // Remover estilos dinâmicos anteriores se existirem
    const oldStyles = document.getElementById('dynamic-font-styles');
    if (oldStyles) {
        oldStyles.remove();
    }
    
    // Aplicar novos estilos
    adjustFontSizes();
    
    // Verificar layout inicial
    if (window.innerWidth > 768) {
        const navbarCollapse = document.getElementById('navbarSupportedContent');
        if (navbarCollapse && !navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.add('show');
        }
    }
});

window.addEventListener('resize', function() {
    // Remover estilos dinâmicos anteriores
    const oldStyles = document.getElementById('dynamic-font-styles');
    if (oldStyles) {
        oldStyles.remove();
    }
    
    // Aplicar novos estilos
    adjustFontSizes();
});