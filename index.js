// Global variables
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// Navigation functionality
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('navMenu').classList.remove('show');
    window.scrollTo(0, 0);
}

// Mobile menu toggle
// function toggleMobileMenu() {
//     const navMenu = document.getElementById('navMenu');
//     navMenu.classList.toggle('show');
// }

function toggleMobileMenu() {
    var nav = document.querySelector('nav');
    nav.classList.toggle('active');
    var btn = document.querySelector('.mobile-menu');
    // Optional: Animate the button icon
    if (nav.classList.contains('active')) {
        btn.innerHTML = '✖'; // Change to close icon
    } else {
        btn.innerHTML = '☰'; // Hamburger icon
    }
}


// Slider functionality
function showSlide(index) {
    const slider = document.getElementById('slider');
    const slideWidth = slides[0].offsetWidth;

    slider.style.transform = `translateX(-${index * slideWidth}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

    currentSlideIndex = index;
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    if (newIndex >= slides.length) newIndex = 0;
    else if (newIndex < 0) newIndex = slides.length - 1;
    showSlide(newIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

function autoAdvanceSlider() {
    changeSlide(1);
}

let sliderInterval = setInterval(autoAdvanceSlider, 5000);

const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
sliderContainer.addEventListener('mouseleave', () => {
    sliderInterval = setInterval(autoAdvanceSlider, 5000);
});

// ✅ FIXED: Form submissions
document.getElementById('admissionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch("https://formspree.io/f/mqalkaoe", {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            alert("✅ Thank you for your application! We will contact you soon.");
            this.reset();
        } else {
            alert("❌ Submission failed. Please try again.");
        }
    } catch (error) {
        alert("❌ Network error. Please check your internet.");
    }
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! We will respond within 24 hours.');
    this.reset();
});

// Handle window resize for slider
window.addEventListener('resize', () => showSlide(currentSlideIndex));

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Fade-in animation
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .notice-board, .gallery-item').forEach(el => observer.observe(el));

// Loading animation
window.addEventListener('load', () => document.body.style.opacity = '1');

document.addEventListener('DOMContentLoaded', function () {
    showSlide(0);
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
});
