/**
 * Main JavaScript for Gino Colombi's DJ Website
 * Handles navigation, animations, and interactive elements
 */

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => loadingScreen.remove(), 500);
        }, 800); // Show for at least 800ms
    }
});


// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#main-nav ul');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', navList.classList.contains('open'));
    });

    // Close mobile nav after clicking a link
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('open')) {
                navList.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation
            // fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
});

// Active navigation link highlighting
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#main-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else if (!href.startsWith('http')) {
            link.classList.remove('active');
        }
    });
};

setActiveNavLink();

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section (subtle)
const hero = document.querySelector('.hero');
if (hero) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                if (scrolled < hero.offsetHeight) {
                    hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Gallery lightbox functionality
const initLightbox = () => {
    const galleryImages = document.querySelectorAll('.gallery img');
    if (galleryImages.length === 0) return;

    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
        <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
        <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryImages).map(img => img.src);

    const showImage = (index) => {
        currentIndex = (index + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
};

// Initialize lightbox if gallery exists
if (document.querySelector('.gallery')) {
    initLightbox();
}

// Add lightbox styles dynamically
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .lightbox.active {
        opacity: 1;
        visibility: visible;
    }
    
    .lightbox img {
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .lightbox-close:hover,
    .lightbox-prev:hover,
    .lightbox-next:hover {
        background: var(--primary-color);
        color: #000;
    }
    
    .lightbox-close {
        top: 1rem;
        right: 1rem;
        font-size: 2.5rem;
        padding: 0.25rem 0.75rem;
    }
    
    .lightbox-prev {
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .lightbox-next {
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
    }
    
    @media (max-width: 600px) {
        .lightbox-prev,
        .lightbox-next {
            top: auto;
            bottom: 2rem;
            transform: none;
        }
        
        .lightbox-prev { left: 2rem; }
        .lightbox-next { right: 2rem; }
    }
`;
document.head.appendChild(lightboxStyles);

// Console greeting for developers
console.log(
    '%c🎵 Gino Colombi - House Is Life Records 🎵',
    'color: #7ED957; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cUnderground house & garage from Buenos Aires to the world.',
    'color: #9ca3af; font-size: 12px;'
);
