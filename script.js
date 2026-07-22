/**
 * ============================================
 * COMFORT GUESTHOUSE — Premium JavaScript
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. PAGE LOADER
    // ============================================
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }, 800);
    }

    // ============================================
    // 2. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // ============================================
    // 3. SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 4. SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.rooms, .location, .testimonials, .room-card, .section-title, .amenities').forEach(function(el) {
        el.classList.add('fade-up');
        revealObserver.observe(el);
    });

    // ============================================
    // 5. GOLD GLOW CURSOR (Hero)
    // ============================================
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--mouse-x', x + '%');
            hero.style.setProperty('--mouse-y', y + '%');
        }, { passive: true });
    }

    // ============================================
    // 6. PRICE COUNTER ANIMATION
    // ============================================
    const priceElements = document.querySelectorAll('.price');
    
    const priceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const priceText = entry.target.textContent;
                const number = parseInt(priceText.replace(/[^0-9]/g, ''));
                const span = entry.target.querySelector('span');
                
                if (number && !isNaN(number)) {
                    animateNumber(entry.target, number, span);
                }
                priceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    priceElements.forEach(function(el) {
        priceObserver.observe(el);
    });

    function animateNumber(element, target, spanElement) {
        let current = 0;
        const increment = Math.ceil(target / 40);
        const steps = 40;
        const stepTime = 800 / steps;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const spanText = spanElement ? ' ' + spanElement.textContent : '';
            element.textContent = 'N$ ' + current.toLocaleString() + spanText;
            if (spanElement) {
                element.appendChild(spanElement);
            }
        }, stepTime);
    }

    // ============================================
    // 7. WHATSAPP CLICK TRACKING
    // ============================================
    document.querySelectorAll('a[href^="https://wa.me"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const roomName = this.closest('.room-info') ? 
                (this.closest('.room-info').querySelector('h3') ? 
                this.closest('.room-info').querySelector('h3').textContent : 'Room') : 
                'Hero Section';
            console.log('📱 WhatsApp inquiry: ' + roomName);
            
            // Google Analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Booking',
                    'event_label': roomName
                });
            }
        });
    });

    // ============================================
    // 8. PHONE CLICK TRACKING
    // ============================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('📞 Phone call initiated');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'Contact',
                    'event_label': 'Reception Call'
                });
            }
        });
    });

    // ============================================
    // 9. KEYBOARD ACCESSIBILITY
    // ============================================
    document.querySelectorAll('.room-card').forEach(function(card) {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.btn-card');
                if (link) link.click();
            }
        });
    });

    // ============================================
    // 10. DYNAMIC COPYRIGHT YEAR
    // ============================================
    const footer = document.querySelector('footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = footer.textContent.replace('2026', year);
    }

    // ============================================
    // 11. PARALLAX HERO (Lightweight)
    // ============================================
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrolled < hero.offsetHeight) {
                        hero.style.backgroundPositionY = (scrolled * 0.3) + 'px';
                        if (heroContent) {
                            heroContent.style.transform = 'translateY(' + (scrolled * 0.05) + 'px)';
                            heroContent.style.opacity = 1 - (scrolled / 800);
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // 12. CONSOLE WELCOME
    // ============================================
    console.log('🏨 Comfort Guesthouse — Premium Experience Loaded');
    console.log('✨ Designed for the discerning traveler');
});