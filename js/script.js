function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.mobile-menu');
    if (!nav || !btn) return;

    nav.classList.toggle('active');
    btn.innerHTML = nav.classList.contains('active') ? '✖' : '☰';
}

function markActiveNav() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = pageName === 'index.html' ? 'index' : pageName.replace('.html', '');

    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkPage = href === 'index.html' || href === '/' ? 'index' : href.replace('.html', '');
        link.classList.toggle('active', linkPage === currentPage);
    });
}

function showSlide(index) {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slider || !slides.length) return;

    slider.style.transform = `translateX(-${index * slides[0].offsetWidth}px)`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
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

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = faculty.filter(item =>
        [item.name, item.designation, item.subjects, item.qualification]
            .some(value => String(value || '').toLowerCase().includes(normalizedQuery))
    );
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
                ? `<div class="faculty-photo-frame"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="faculty-image"></div>`
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

    const searchBox = document.getElementById('facultySearch');
    if (searchBox) searchBox.addEventListener('input', event => renderFaculty(event.target.value));
    renderFaculty();

    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const sliderContainer = document.querySelector('.slider-container');

    if (slider && slides.length) {
        showSlide(0);
        let sliderInterval = setInterval(autoAdvanceSlider, 5000);

        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
            sliderContainer.addEventListener('mouseleave', () => {
                sliderInterval = setInterval(autoAdvanceSlider, 5000);
            });
        }

        window.addEventListener('resize', () => showSlide(window.currentSlideIndex || 0));
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        });
    }, observerOptions);

    document.querySelectorAll('.card, .notice-board, .gallery-item').forEach(el => observer.observe(el));

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
});

window.addEventListener('load', () => document.body.style.opacity = '1');
