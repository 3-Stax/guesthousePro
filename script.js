
/**
 * ============================================
 * ROSEVILLE GUESTHOUSE — Premium JavaScript
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

   // ============================================
// 1. PAGE LOADER WITH PROGRESS
// ============================================
const loader = document.getElementById('pageLoader');
const progressBar = document.getElementById('loaderProgress');
const percentageText = document.getElementById('loaderPercentage');

if (loader && progressBar) {
    let progress = 0;
    const interval = setInterval(function() {
        progress += Math.random() * 15 + 5;
        if (progress > 95) progress = 95; // Cap at 95% until fully loaded
        
        progressBar.style.width = progress + '%';
        if (percentageText) {
            percentageText.textContent = Math.round(progress) + '%';
        }
    }, 200);

    // Wait for everything to load
    window.addEventListener('load', function() {
        clearInterval(interval);
        progressBar.style.width = '100%';
        if (percentageText) {
            percentageText.textContent = '100%';
        }
        
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }, 400);
    });

    // ============================================
// NAVBAR WEATHER (Free - No API Key)
// ============================================
(function fetchNavbarWeather() {
    const weatherContainer = document.getElementById('navbarWeather');
    const tempDisplay = document.getElementById('navbarWeatherTemp');
    const conditionDisplay = document.getElementById('navbarWeatherCondition');
    const iconElement = weatherContainer.querySelector('i');
    
    if (!tempDisplay || !weatherContainer) return;

    const LAT = -22.5594;
    const LON = 17.0832;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&temperature_unit=celsius&timezone=Africa/Windhoek`;

    async function fetchWeather() {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const weatherCode = data.current_weather.weathercode;
                const condition = getWeatherCondition(weatherCode);
                
                tempDisplay.textContent = `${temp}°C`;
                conditionDisplay.textContent = condition;
                
                updateWeatherIcon(weatherCode);
                weatherContainer.classList.remove('loading');
            } else {
                throw new Error('Unexpected API response format');
            }
            
        } catch (error) {
            console.warn('Navbar weather fetch failed:', error);
            tempDisplay.textContent = '--°C';
            conditionDisplay.textContent = 'Offline';
            iconElement.className = 'fas fa-cloud';
            weatherContainer.classList.remove('loading');
        }
    }

    function updateWeatherIcon(code) {
        const iconMap = {
            0: 'fa-sun',
            1: 'fa-cloud-sun',
            2: 'fa-cloud-sun',
            3: 'fa-cloud',
            45: 'fa-smog',
            48: 'fa-smog',
            51: 'fa-cloud-rain',
            53: 'fa-cloud-rain',
            55: 'fa-cloud-rain',
            61: 'fa-cloud-rain',
            63: 'fa-cloud-rain',
            65: 'fa-cloud-rain',
            71: 'fa-snowflake',
            73: 'fa-snowflake',
            75: 'fa-snowflake',
            80: 'fa-cloud-rain',
            81: 'fa-cloud-rain',
            82: 'fa-cloud-rain',
            95: 'fa-bolt',
            96: 'fa-bolt',
            99: 'fa-bolt'
        };
        
        const iconClass = iconMap[code] || 'fa-cloud';
        iconElement.className = `fas ${iconClass}`;
    }

    function getWeatherCondition(code) {
        const conditions = {
            0: 'Clear',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Drizzle',
            53: 'Drizzle',
            55: 'Drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            80: 'Showers',
            81: 'Showers',
            82: 'Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm',
            99: 'Thunderstorm'
        };
        return conditions[code] || 'Unknown';
    }

    // Start fetching weather
    weatherContainer.classList.add('loading');
    fetchWeather();
    
    // Refresh weather every 10 minutes
    setInterval(fetchWeather, 600000);
})();

    // Fallback: hide loader after 5 seconds even if not fully loaded
    setTimeout(function() {
        if (!loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }
    }, 6000);
}

    // ============================================
// HERO CAROUSEL
// ============================================
(function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-arrow-prev');
    const nextBtn = document.querySelector('.hero-arrow-next');
    let currentIndex = 0;
    let intervalId = null;
    const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

    if (!slides.length) return;

    function goToSlide(index) {
        // Validate index
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        currentIndex = index;
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    }

    function stopAutoPlay() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Event listeners for arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextSlide();
            resetAutoPlay();
        });
    }

    // Event listeners for dots
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(index);
            resetAutoPlay();
        });

        // Keyboard accessibility for dots
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
                resetAutoPlay();
            }
        });
    });

    // Keyboard navigation for entire hero
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Pause autoplay on hover
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);
        
        // Touch support: pause on touch, resume after touch ends
        let touchTimeout;
        hero.addEventListener('touchstart', function() {
            stopAutoPlay();
            clearTimeout(touchTimeout);
        }, { passive: true });
        
        hero.addEventListener('touchend', function() {
            touchTimeout = setTimeout(startAutoPlay, 3000);
        }, { passive: true });
    }

    // Start auto-play
    startAutoPlay();

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        stopAutoPlay();
    });

    // Expose controls for debugging (optional)
    window.heroCarousel = {
        goTo: goToSlide,
        next: nextSlide,
        prev: prevSlide,
        play: startAutoPlay,
        pause: stopAutoPlay
    };

    console.log('🎠 Hero Carousel initialized with', slides.length, 'slides');
})();

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