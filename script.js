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

    document.querySelectorAll('.rooms, .location, .testimonials, .room-card, .section-title, .amenities, .booking').forEach(function(el) {
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
    // 7. BOOKING FORM HANDLING
    // ============================================
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('.submit-btn');

    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    checkInInput.setAttribute('min', today);

    // Update check-out min date when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = this.value;
        if (checkInDate) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const minCheckOut = nextDay.toISOString().split('T')[0];
            checkOutInput.setAttribute('min', minCheckOut);
            if (checkOutInput.value && checkOutInput.value <= checkInDate) {
                checkOutInput.value = minCheckOut;
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous errors
        form.querySelectorAll('.form-group').forEach(function(group) {
            group.classList.remove('error');
        });

        // Validate form
        let isValid = true;
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');

        // Validate name
        if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            fullName.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate phone
        if (!phone.value.trim() || phone.value.trim().length < 8) {
            phone.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate dates
        if (!checkIn.value) {
            checkIn.closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!checkOut.value) {
            checkOut.closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) {
            checkOut.closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = firstError.querySelector('input, select');
                if (input) input.focus();
            }
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin" style="margin-left: 0.75rem;"></i>';

        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Hide form, show success
            form.style.display = 'none';
            successMessage.classList.add('show');

            // Log form data (for demo)
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('📋 Booking Inquiry Submitted:', data);

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'booking_inquiry', {
                    'event_category': 'Booking',
                    'event_label': data.roomType || 'General',
                    'value': 1
                });
            }

            // Reset button state (though form is hidden)
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Inquiry</span><i class="fas fa-paper-plane" style="margin-left: 0.75rem;"></i>';

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }, 1800);
    });

    // Real-time validation on input
    form.querySelectorAll('input, select, textarea').forEach(function(field) {
        field.addEventListener('blur', function() {
            const group = this.closest('.form-group');
            if (this.hasAttribute('required') && !this.value.trim()) {
                group.classList.add('error');
            } else if (this.type === 'email' && this.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value.trim())) {
                    group.classList.add('error');
                } else {
                    group.classList.remove('error');
                }
            } else {
                group.classList.remove('error');
            }
        });

        field.addEventListener('input', function() {
            const group = this.closest('.form-group');
            if (this.hasAttribute('required') && this.value.trim()) {
                group.classList.remove('error');
            }
        });
    });

    // ============================================
    // 8. WHATSAPP CLICK TRACKING
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
    // 9. PHONE CLICK TRACKING
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
    // 10. KEYBOARD ACCESSIBILITY
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
    // 11. DYNAMIC COPYRIGHT YEAR
    // ============================================
    const footer = document.querySelector('footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.textContent = footer.textContent.replace('2026', year);
    }

    // ============================================
    // 12. PARALLAX HERO (Lightweight)
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
    // 13. CONSOLE WELCOME
    // ============================================
    console.log('🏨 Comfort Guesthouse — Premium Experience Loaded');
    console.log('✨ Booking form, animations, and luxury details active');
});