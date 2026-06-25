// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');

function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    themeIcon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
}

themeBtn.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Set default theme to dark
function initTheme() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'dark'; // DEFAULT DARK
        localStorage.setItem('theme', savedTheme);
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

initTheme();

// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        updateThemeIcon();
    }
});

// Language Toggle Logic
let currentLang = 'en'; // DEFAULT ENGLISH
const langBtn = document.getElementById('lang-toggle');
let translations = {};

// Fetch translations from JSON
fetch('data/content.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
        applyTranslations(); // Apply default language
    })
    .catch(err => console.error("Failed to load translations", err));

function applyTranslations() {
    if (!translations[currentLang]) return;
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (key === 'hero-greet') {
                el.textContent = translations[currentLang][key];
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    });
}

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    applyTranslations();
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Optional: only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(section => {
    observer.observe(section);
});

// Header & Back to Top Scroll Effects
const header = document.querySelector('.glass-header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Timeline Toggle
window.toggleTimeline = function(btn) {
    const wrapper = document.getElementById('timelineWrapper');
    const isExpanded = btn.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
        // Collapse
        wrapper.classList.add('collapsed');
        wrapper.style.maxHeight = null;
        btn.textContent = 'Show more experience';
        btn.setAttribute('data-expanded', 'false');
        
        // Optionally scroll back up to the top of the experience section if it's too long
        const expSection = document.getElementById('experience');
        if (window.scrollY > expSection.offsetTop) {
            window.scrollTo({ top: expSection.offsetTop - 55, behavior: 'smooth' });
        }
    } else {
        // Expand
        wrapper.classList.remove('collapsed');
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        btn.textContent = 'Show less experience';
        btn.setAttribute('data-expanded', 'true');
    }
};

// Skills Toggle
window.toggleSkills = function(btn) {
    const wrapper = btn.parentElement.previousElementSibling;
    if (wrapper.classList.contains('collapsed')) {
        // Expand
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        wrapper.classList.remove('collapsed');
        btn.innerText = "Show less";

        // Once transition is complete, set to none to allow responsive resizing
        setTimeout(() => {
            if (!wrapper.classList.contains('collapsed')) {
                wrapper.style.maxHeight = 'none';
            }
        }, 400);
    } else {
        // Collapse
        // Set explicit pixel height first to transition from
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        // Force a reflow
        wrapper.offsetHeight;
        // Apply collapsed state
        wrapper.style.maxHeight = null;
        wrapper.classList.add('collapsed');
        btn.innerText = btn.getAttribute('data-original-text');
    }
};

// Mobile Menu Toggle
window.toggleMobileMenu = function() {
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.mobile-menu-btn');
    const icon = btn.querySelector('i');

    nav.classList.toggle('active');
    btn.classList.toggle('active');

    if (nav.classList.contains('active')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
    } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
    }
};

// Close mobile menu when a link is clicked
document.querySelectorAll('nav .nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('nav');
        if (nav.classList.contains('active')) {
            window.toggleMobileMenu();
        }
    });
});

// Dynamic Skills Checking for Responsive Rows
function checkSkillRows() {
    const wrappers = document.querySelectorAll('.skill-items-wrapper');
    wrappers.forEach(wrapper => {
        const separator = wrapper.nextElementSibling;
        if (!separator || !separator.classList.contains('show-all-separator')) return;

        // Threshold of 100px. If content is larger, it spans multiple rows.
        if (wrapper.scrollHeight > 100) {
            separator.style.display = 'flex';
            const btn = separator.querySelector('.show-all-btn');
            if (btn && btn.innerText === btn.getAttribute('data-original-text')) {
                wrapper.classList.add('collapsed');
                wrapper.style.maxHeight = null;
            } else if (btn && btn.innerText === "Show less") {
                wrapper.classList.remove('collapsed');
                wrapper.style.maxHeight = 'none';
            }
        } else {
            // Hide separator since there's only 1 row
            separator.style.display = 'none';
            wrapper.classList.remove('collapsed');
            wrapper.style.maxHeight = 'none';
        }
    });
}

window.addEventListener('load', checkSkillRows);
window.addEventListener('resize', checkSkillRows);
checkSkillRows(); // Run initially

// Portfolio Carousel Logic
const carouselContainer = document.querySelector('.portfolio-carousel');
const cards = document.querySelectorAll('.carousel-card');

let currentActiveIndex = 2; // Initial active index

function updateCarousel(activeIndex) {
    cards.forEach(c => {
        c.className = 'carousel-card'; // reset classes
        
        const idx = parseInt(c.getAttribute('data-index'));
        let diff = idx - activeIndex;

        // Handle circular wrapping dynamically
        const total = cards.length;
        const half = Math.floor(total / 2);

        if (diff < -half) diff += total;
        if (diff > half) diff -= total;

        if (diff === 0) {
            c.classList.add('active');
        } else if (diff === -1) {
            c.classList.add('prev-1');
        } else if (diff === -2) {
            c.classList.add('prev-2');
        } else if (diff === -3) {
            c.classList.add('prev-3');
        } else if (diff === 1) {
            c.classList.add('next-1');
        } else if (diff === 2) {
            c.classList.add('next-2');
        } else if (diff === 3) {
            c.classList.add('next-3');
        }
    });
}

window.shiftCarousel = function(direction) {
    currentActiveIndex = (currentActiveIndex + direction + cards.length) % cards.length;
    updateCarousel(currentActiveIndex);
};

if (carouselContainer && cards.length > 0) {
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            currentActiveIndex = parseInt(this.getAttribute('data-index'));
            updateCarousel(currentActiveIndex);
        });
    });
}
