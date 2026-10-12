/* ==========================================================================
   LOGIQUE JAVASCRIPT - L'ÉPICURE GOURMET
   Fonctionnalités incluses (100% Vanille JS) :
   1. Menu Navigation Mobile Responsive (Hamburger)
   2. Commutateur Thème Clair / Sombre (Dark Mode) avec LocalStorage
   3. Validation Dynamique du Formulaire de Réservation & Message Modal de Confirmation
   4. Filtrage dynamique des plats par catégorie (Entrées, Plats, Desserts, Boissons)
   5. Visionneuse d'images Lightbox pour la Galerie
   6. Détection de défilement pour la barre de navigation active
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. COMMUTATEUR DE THÈME (LIGHT / DARK MODE)
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Charger le thème sauvegardé dans localStorage ou détecter les préférences système
    const savedTheme = localStorage.getItem('epicure-theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('epicure-theme', newTheme);
        });
    }

    /* --------------------------------------------------------------------------
       2. MENU RESPONSIVE MOBILE (HAMBURGER TOGGLE)
       -------------------------------------------------------------------------- */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });

        // Fermer le menu mobile lors d'un clic sur un lien de navigation
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       3. NAVIGATION DÉROULANTE INTERACTIVE & DÉTECTION DU DEFILEMENT (SCROLL)
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const siteHeader = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Effet d'ombre sur le header au scroll
        if (scrollY > 50) {
            siteHeader.style.boxShadow = 'var(--shadow-md)';
        } else {
            siteHeader.style.boxShadow = 'none';
        }

        // Surbrillance du lien actif selon la section visible
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const currentNavLink = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (currentNavLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    currentNavLink.classList.add('active');
                }
            }
        });
    });

    /* --------------------------------------------------------------------------
       4. FILTRAGE DYNAMIQUE DU MENU (ENTRÉES, PLATS, DESSERTS, BOISSONS)
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       5. VISIONNEUSE LIGHTBOX POUR LA GALERIE PHOTO
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('img');
            const title = item.getAttribute('data-title') || imgElement.alt;
            
            if (imgElement && lightboxModal && lightboxImg) {
                lightboxImg.src = imgElement.src;
                lightboxCaption.textContent = title;
                lightboxModal.classList.add('active');
                lightboxModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
        }
    }

    /* --------------------------------------------------------------------------
       6. VALIDATION DU FORMULAIRE DE RÉSERVATION & MODAL DE CONFIRMATION
       -------------------------------------------------------------------------- */
    const reservationForm = document.getElementById('reservation-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const btnReset = document.getElementById('btn-reset');

    // RegEx pour validation email et téléphone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\s\+\-\(\)]{8,20}$/;

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validation Champ Nom
            const nom = document.getElementById('nom');
            if (!nom.value.trim()) {
                showError(nom, 'error-nom');
                isValid = false;
            } else {
                hideError(nom, 'error-nom');
            }

            // Validation Champ Prénom
            const prenom = document.getElementById('prenom');
            if (!prenom.value.trim()) {
                showError(prenom, 'error-prenom');
                isValid = false;
            } else {
                hideError(prenom, 'error-prenom');
            }

            // Validation Champ Email
            const email = document.getElementById('email');
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                showError(email, 'error-email');
                isValid = false;
            } else {
                hideError(email, 'error-email');
            }

            // Validation Champ Téléphone
            const telephone = document.getElementById('telephone');
            if (!telephone.value.trim() || !phoneRegex.test(telephone.value.trim())) {
                showError(telephone, 'error-telephone');
                isValid = false;
            } else {
                hideError(telephone, 'error-telephone');
            }

            // Validation Nombre de Personnes
            const personnes = document.getElementById('personnes');
            if (!personnes.value) {
                showError(personnes, 'error-personnes');
                isValid = false;
            } else {
                hideError(personnes, 'error-personnes');
            }

            // Validation Date
            const dateRes = document.getElementById('date_reservation');
            if (!dateRes.value) {
                showError(dateRes, 'error-date_reservation');
                isValid = false;
            } else {
                hideError(dateRes, 'error-date_reservation');
            }

            // Validation Heure
            const heure = document.getElementById('heure');
            if (!heure.value) {
                showError(heure, 'error-heure');
                isValid = false;
            } else {
                hideError(heure, 'error-heure');
            }

            // Si tous les champs sont valides
            if (isValid) {
                // Remplir les données dans la modal de confirmation
                document.getElementById('modal-client-name').textContent = `${prenom.value.trim()} ${nom.value.trim()}`;
                
                // Formater la date en français (JJ/MM/AAAA)
                const dateObj = new Date(dateRes.value);
                const formattedDate = dateObj.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                
                document.getElementById('modal-res-date').textContent = formattedDate;
                document.getElementById('modal-res-time').textContent = heure.value;

                // Afficher la modal
                if (confirmationModal) {
                    confirmationModal.classList.add('active');
                    confirmationModal.setAttribute('aria-hidden', 'false');
                }

                // Réinitialiser le formulaire
                reservationForm.reset();
                clearValidationStyles();
            }
        });
    }

    // Gestion de la réinitialisation du formulaire
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            clearValidationStyles();
        });
    }

    // Fermeture de la modal de confirmation
    if (modalCloseBtn && confirmationModal) {
        modalCloseBtn.addEventListener('click', () => {
            confirmationModal.classList.remove('active');
            confirmationModal.setAttribute('aria-hidden', 'true');
        });
    }

    // Fonctions utilitaires d'affichage des erreurs
    function showError(inputElement, errorId) {
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.style.display = 'block';
        }
    }

    function hideError(inputElement, errorId) {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    }

    function clearValidationStyles() {
        const inputs = reservationForm.querySelectorAll('.form-control');
        const errors = reservationForm.querySelectorAll('.error-message');
        
        inputs.forEach(input => {
            input.classList.remove('invalid', 'valid');
        });
        errors.forEach(err => {
            err.style.display = 'none';
        });
    }

});
