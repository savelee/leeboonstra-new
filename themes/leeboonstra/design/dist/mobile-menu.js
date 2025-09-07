// Modern Mobile Menu JavaScript
// This file contains the mobile menu functionality without requiring bundling

console.log('Mobile menu script loaded!');

// Initialize mobile menu functionality
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    
    // Modern hamburger menu functionality
    const navbartoggle = document.querySelector('.navbar-toggler');
    const navbar = document.querySelector('.navbar');
    const menuCloseBtn = document.querySelector('.menu-close-btn');
    const menuOverlay = document.querySelector('.menu-overlay');

    // Debug logging
    console.log('Menu elements found:', {
        navbartoggle: !!navbartoggle,
        navbar: !!navbar,
        menuCloseBtn: !!menuCloseBtn,
        menuOverlay: !!menuOverlay
    });

    // Close menu functions
    function closeMenu() {
        if (navbar) {
            navbar.classList.remove('menu-open');
        }
        document.body.classList.remove('menu-open');
    }

    // Remove any existing event listeners to prevent duplicates
    if (navbartoggle) {
        // Clone the element to remove all event listeners
        const newToggle = navbartoggle.cloneNode(true);
        navbartoggle.parentNode.replaceChild(newToggle, navbartoggle);
        
        console.log('Adding click listener to hamburger button');
        newToggle.addEventListener('click', function(event) {
            console.log('Hamburger button clicked!');
            event.preventDefault();
            if (navbar) {
                navbar.classList.add('menu-open');
                document.body.classList.add('menu-open');
            }
        });
    } else {
        console.log('Hamburger button NOT found!');
    }

    // Close button click
    if (menuCloseBtn) {
        // Clone to remove existing listeners
        const newCloseBtn = menuCloseBtn.cloneNode(true);
        menuCloseBtn.parentNode.replaceChild(newCloseBtn, menuCloseBtn);
        
        newCloseBtn.addEventListener('click', function(event) {
            event.preventDefault();
            closeMenu();
        });
    }

    // Overlay click to close
    if (menuOverlay) {
        // Clone to remove existing listeners
        const newOverlay = menuOverlay.cloneNode(true);
        menuOverlay.parentNode.replaceChild(newOverlay, menuOverlay);
        
        newOverlay.addEventListener('click', function(event) {
            event.preventDefault();
            closeMenu();
        });
    }

    // ESC key to close (global listener, no need to clone)
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && navbar && navbar.classList.contains('menu-open')) {
            closeMenu();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMobileMenu);

// Also initialize on page show (for back/forward navigation)
window.addEventListener('pageshow', function(event) {
    console.log('Page show event - reinitializing mobile menu');
    // Small delay to ensure DOM is fully ready
    setTimeout(initMobileMenu, 100);
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    initMobileMenu();
}
