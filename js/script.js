function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.mobile-menu');
    if (!nav || !btn) return;

    const isOpen = nav.classList.toggle('active');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    btn.textContent = isOpen ? '✖' : '☰';
}

function markActiveNav() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = pageName === 'index.html' ? 'index' : pageName.replace('.html', '');

    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkPage = href === 'index.html' || href === '/' ? 'index' : href.replace('.html', '');
        link.classList.toggle('active', linkPage === currentPage);
        if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function showSlide(index) {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slider || !slides.length) return;

    slider.style.transform = `translateX(-${index * slides[0].offsetWidth}px)`;
    dots.forEach((dot, dotIndex) => {
        const isCurrent = dotIndex === index;
        dot.classList.toggle('active', isCurrent);
        dot.setAttribute('aria-pressed', String(isCurrent));
    });
    window.currentSlideIndex = index;
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    let nextIndex = (window.currentSlideIndex || 0) + direction;
    if (nextIndex >= slides.length) nextIndex = 0;
    else if (nextIndex < 0) nextIndex = slides.length - 1;
    showSlide(nextIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

function autoAdvanceSlider() {
    changeSlide(1);
}

function renderFaculty(query = '') {
    const grid = document.getElementById('facultyGrid');
    if (!grid) return;
    const status = document.getElementById('facultySearchStatus');

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = faculty.filter(item =>
        [item.name, item.designation, item.subjects, item.qualification]
            .some(value => String(value || '').toLowerCase().includes(normalizedQuery))
    );
    if (status) {
        status.textContent = filtered.length
            ? `${filtered.length} ${filtered.length === 1 ? 'faculty member' : 'faculty members'} found.`
            : 'No faculty members match your search.';
    }
    const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);

    grid.innerHTML = filtered.map(item => `
        <article class="faculty-card">
            ${item.image
                ? `<div class="faculty-photo-frame"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="faculty-image" loading="lazy" decoding="async"></div>`
                : `<div class="faculty-photo-frame faculty-photo-placeholder" role="img" aria-label="${escapeHtml(item.name)} photo coming soon"><span aria-hidden="true">Photo coming soon</span></div>`}
            <div class="faculty-content">
                <span class="faculty-tag">${escapeHtml(item.designation)}</span>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="faculty-subject"><strong>Subjects:</strong> ${escapeHtml(item.subjects || 'Subjects coming soon')}</p>
                <p class="faculty-qualification"><strong>Highest Qualification:</strong> ${escapeHtml(item.qualification || 'Education details coming soon')}</p>
            </div>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const nav = document.querySelector('nav');
        const btn = document.querySelector('.mobile-menu');
        if (nav && btn && nav.classList.contains('active')) {
            toggleMobileMenu();
            btn.focus();
        }
    });
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('nav');
            if (nav && nav.classList.contains('active')) toggleMobileMenu();
        });
    });

    const searchBox = document.getElementById('facultySearch');
    if (searchBox) searchBox.addEventListener('input', event => renderFaculty(event.target.value));
    renderFaculty();

    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const sliderContainer = document.querySelector('.slider-container');

    if (slider && slides.length) {
        showSlide(0);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sliderToggle = document.getElementById('sliderToggle');
        let sliderInterval = null;
        let sliderPausedByUser = false;
        const pauseSlider = () => {
            if (sliderInterval) clearInterval(sliderInterval);
            sliderInterval = null;
        };
        const resumeSlider = () => {
            if (!prefersReducedMotion && !sliderPausedByUser && !sliderInterval) {
                sliderInterval = setInterval(autoAdvanceSlider, 6000);
            }
        };

        resumeSlider();
        if (sliderToggle) {
            sliderToggle.addEventListener('click', () => {
                sliderPausedByUser = !sliderPausedByUser;
                sliderToggle.setAttribute('aria-pressed', String(sliderPausedByUser));
                sliderToggle.textContent = sliderPausedByUser
                    ? 'Resume automatic slide changes'
                    : 'Pause automatic slide changes';
                if (sliderPausedByUser) pauseSlider();
                else resumeSlider();
            });
        }

        document.querySelectorAll('.slider-container, .slider-controls').forEach(control => {
            control.addEventListener('mouseenter', pauseSlider);
            control.addEventListener('focusin', pauseSlider);
            control.addEventListener('mouseleave', () => {
                if (!control.contains(document.activeElement)) resumeSlider();
            });
            control.addEventListener('focusout', event => {
                if (!control.contains(event.relatedTarget)) resumeSlider();
            });
        });

        window.addEventListener('resize', () => showSlide(window.currentSlideIndex || 0));
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.getElementById(this.getAttribute('href').slice(1));
            if (!target) return;
            e.preventDefault();
            const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            target.scrollIntoView({ behavior });
        });
    });

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.card, .gallery-item').forEach(el => observer.observe(el));
    }
});
