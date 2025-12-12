/**
 * script.js - Logique universelle pour Nova Syndicate (Phases 1, 2, 3)
 * Gère le mode "Diaporama" (Index/Phase3) et le mode "Page" (Phase2)
 */

document.addEventListener('DOMContentLoaded', () => {
    initNovaSystem();
});

// --- VARIABLES GLOBALES ---
let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let isSlideshowMode = false;

// --- INITIALISATION ---
function initNovaSystem() {
    // Détection du mode : Si la classe .slide existe, on est en mode Diaporama
    slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        isSlideshowMode = true;
        totalSlides = slides.length;
        
        // Initialiser le diaporama
        showSlide(0);
        
        // Gérer les flèches du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'ArrowRight') changeSlide(1);
        });
    } else {
        // Mode Phase 2 (Page simple avec zoom image)
        console.log("Mode Page détecté (Phase 2)");
    }

    // Gestion universelle de la touche Echap (Ferme tout)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSommaire();
            closeZoom(); // Seulement utile pour Phase 2
        }
    });
}

// ==========================================
// 1. LOGIQUE NAVIGATION (Diaporama)
// ==========================================

// Fonction globale pour changer de slide via boutons Suivant/Précédent
window.changeSlide = function(direction) {
    if (!isSlideshowMode) return;
    let newIndex = currentSlide + direction;
    if (newIndex >= 0 && newIndex < totalSlides) {
        showSlide(newIndex);
    }
};

// Fonction pour aller à une slide spécifique (via Sommaire)
window.goToSlideFromSommaire = function(index) {
    if (!isSlideshowMode) return;
    showSlide(index);
    closeSommaire(); // Ferme le menu après le clic
};

// Cœur du système d'affichage des slides
function showSlide(n) {
    if (!isSlideshowMode) return;

    // Gestion des limites
    if (n >= totalSlides) n = totalSlides - 1;
    if (n < 0) n = 0;

    currentSlide = n;

    // 1. Gestion des classes .active sur les slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === n) slide.classList.add('active');
    });

    // 2. Gestion des boutons (Désactivation si début/fin)
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = (n === 0);
    if (nextBtn) nextBtn.disabled = (n === totalSlides - 1);

    // 3. Barre de progression
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = ((n + 1) / totalSlides) * 100;
        progressFill.style.width = percentage + '%';
    }

    // 4. Mise à jour du Sommaire (Surbrillance de l'élément actif)
    const sommaireItems = document.querySelectorAll('.sommaire-panel .sommaire-item');
    sommaireItems.forEach((item, index) => {
        // On vérifie si l'item a un onclick (donc c'est un lien de slide, pas un lien vers une autre page)
        if (item.hasAttribute('onclick')) {
            item.classList.toggle('active-item', index === n);
        }
    });

    // Scroll en haut (utile sur mobile)
    window.scrollTo(0, 0);
}


// ==========================================
// 2. LOGIQUE INTERFACE COMMUNE
// ==========================================

// Ouvrir/Fermer le sommaire
window.toggleSommaire = function() {
    const panel = document.getElementById('sommairePanel');
    const overlay = document.getElementById('overlay');
    const btn = document.querySelector('.sommaire-btn');

    if (panel && overlay) {
        const isOpen = panel.classList.toggle('open');
        overlay.classList.toggle('show');
        
        if (btn) btn.setAttribute('aria-expanded', isOpen);
    }
};

// Fonction helper pour fermer explicitement
function closeSommaire() {
    const panel = document.getElementById('sommairePanel');
    const overlay = document.getElementById('overlay');
    if (panel && panel.classList.contains('open')) {
        panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
}

// Basculer Plein Écran
window.toggleFullscreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn(`Erreur plein écran: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};


// ==========================================
// 3. LOGIQUE SPÉCIFIQUE PHASE 2 (Zoom Image)
// ==========================================

window.openZoom = function(src) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    
    if (modal && zoomedImg) {
        zoomedImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêche le scroll arrière-plan
    }
};

window.closeZoom = function() {
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};