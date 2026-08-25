/**
 * SARVEE DENTAL HOSPITAL - INTERACTIVE FRONT-END SCRIPTS
 * Plain JavaScript, modular structure.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer dynamically
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================
       INTRO ANIMATION STATE CONTROLLER
       ========================================== */
    const introOverlay = document.getElementById('intro-overlay');
    const skipBtn = document.getElementById('skip-intro-btn');
    const introTimeouts = [];

    const skipIntro = () => {
        // Clear all active timelines
        introTimeouts.forEach(t => clearTimeout(t));
        
        if (introOverlay) {
            introOverlay.classList.add('fade-out');
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 900); // 900ms ensures smooth transition finishes
        }
    };

    if (introOverlay) {
        // Ensure it is visible on reload
        introOverlay.style.display = 'flex';
        introOverlay.classList.remove('fade-out', 'state-smile1', 'state-smile2', 'state-heart', 'state-tagline', 'state-logo');

        // Step 1: Small glowing smile path from left appears (0.2s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('state-smile1');
        }, 200));

        // Step 2: Second glowing smile path from right appears (1.0s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('state-smile2');
        }, 1000));

        // Step 3: Paths cross near center, creating heart pulse with 300ms delay (2.5s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('state-heart');
        }, 2500));

        // Step 4: Tagline text fades in (3.7s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('state-tagline');
        }, 3700));

        // Step 5: Large SDH logo fades in center (5.1s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('state-logo');
        }, 5100));

        // Step 6: Fade out intro overlay (6.5s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.classList.add('fade-out');
        }, 6500));

        // Step 7: Completely hide overlay and clean up (7.5s)
        introTimeouts.push(setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 7500));

        if (skipBtn) {
            skipBtn.addEventListener('click', skipIntro);
        }
    }

    /* ==========================================
       1. MOBILE MENU DRAWER
       ========================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigationMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navigationMenu) {
        // Toggle active menu state on hamburger click
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navigationMenu.classList.toggle('active');
        });

        // Close menu drawer when any navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navigationMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed to retain visual state
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback: If browser doesn't support IntersectionObserver, show elements immediately
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    /* ==========================================
       3. NAVIGATION SCROLL SPY
       ========================================== */
    const scrollSpySections = document.querySelectorAll('section, header');
    
    if ('IntersectionObserver' in window) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    if (!sectionId) return;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.25,
            rootMargin: '-10% 0px -50% 0px'
        });

        scrollSpySections.forEach(section => {
            spyObserver.observe(section);
        });
    }

    // Header styling shift on scroll
    const mainHeader = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    /* ==========================================
       4. HERO FLOATING PARTICLES CANVAS ANIMATION
       ========================================== */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let animationFrameId;

        // Resize Canvas dynamically
        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Blueprint Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                // Generate particles across height, or start at bottom
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 1; // Size of particle (1px to 5px)
                this.speedY = -(Math.random() * 0.4 + 0.1); // Slow rise speed
                this.speedX = Math.random() * 0.2 - 0.1; // Slight sideways drift
                this.opacity = Math.random() * 0.4 + 0.1; // Semi-transparent glow
                this.fadeRate = Math.random() * 0.001 + 0.0003;
                this.amplitude = Math.random() * 0.4 + 0.1; // Drift amplitude
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speedY;
                this.angle += 0.01;
                this.x += this.speedX + Math.sin(this.angle) * this.amplitude;
                this.opacity -= this.fadeRate;

                // Reset particle when it fades or leaves screen
                if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + 10;
                    this.size = Math.random() * 4 + 1;
                    this.speedY = -(Math.random() * 0.4 + 0.1);
                    this.opacity = Math.random() * 0.4 + 0.2;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(38, 215, 217, ${this.opacity})`; // Aqua particle glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(38, 215, 217, 0.4)';
                ctx.fill();
            }
        }

        // Initialize particles
        const particleCount = 25; // Keep it low and minimal for performance & premium feel
        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < particleCount; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 0; // Reset shadow blur on canvas clears
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================
       5. BEFORE/AFTER SLIDER (Vertical Drag Reveal)
       ========================================== */
    const sliderContainer = document.getElementById('before-after-slider');
    const afterImgContainer = document.getElementById('after-img-container');
    const sliderBar = document.getElementById('slider-bar');

    if (sliderContainer && afterImgContainer && sliderBar) {
        let isDragging = false;

        function updateSlider(clientY) {
            const rect = sliderContainer.getBoundingClientRect();
            // Calculate height percentage from bottom of the slider container to the mouse position
            let percentage = ((rect.bottom - clientY) / rect.height) * 100;
            
            // Clamp percentage between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Apply percentages
            afterImgContainer.style.height = `${percentage}%`;
            sliderBar.style.bottom = `${percentage}%`;
        }

        // Mouse Events
        sliderContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientY);
            e.preventDefault(); // Stop text highlighting
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientY);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch Events for Mobile/Tablet Support
        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    /* ==========================================
       6. LIGHTBOX CAPABILITY
       ========================================== */
    const triggers = document.querySelectorAll('.main-lightbox-trigger');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (triggers && lightbox && lightboxImg && lightboxCaption) {
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const src = trigger.getAttribute('src');
                const alt = trigger.getAttribute('alt');
                
                lightboxImg.setAttribute('src', src);
                lightboxCaption.textContent = alt || 'Sarvee Dental Hospital';
                
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Stop scrolling behind overlay
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restore scroll
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on background clicking
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard support (Escape key to exit)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================
       7. APPOINTMENT FORM SUBMIT (FETCH API)
       ========================================== */
    const appointmentForm = document.getElementById('appointment-form');
    const successCard = document.getElementById('appointment-success');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const formSpinner = document.getElementById('form-spinner');
    const submitBtn = document.getElementById('form-submit-btn');

    // Input fields for validation
    const nameInput = document.getElementById('form-name');
    const mobileInput = document.getElementById('form-mobile');

    if (appointmentForm && successCard && resetFormBtn) {
        
        // Remove error classes on user input
        nameInput.addEventListener('input', () => {
            nameInput.parentElement.classList.remove('invalid');
        });
        mobileInput.addEventListener('input', () => {
            mobileInput.parentElement.classList.remove('invalid');
        });

        // Form Submit Event Listener
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default HTML page refresh

            let isValid = true;

            // 1. Validate Name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // 2. Validate Mobile (Simple 10-digit number check)
            const mobileVal = mobileInput.value.trim();
            const phoneRegex = /^[0-9]{10}$/;
            if (!mobileVal || !phoneRegex.test(mobileVal)) {
                mobileInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                mobileInput.parentElement.classList.remove('invalid');
            }

            // Exit if fields are invalid
            if (!isValid) return;

            // Show spinner inside submit button, disable interaction
            if (formSpinner) formSpinner.style.display = 'block';
            if (submitBtn) submitBtn.disabled = true;

            // CLINIC OWNER FETCH VALUES CONFIGURATION:
            // Gather all input values to send to backend
            const formData = {
                name: nameInput.value.trim(),
                mobile: mobileInput.value.trim(),
                city: document.getElementById('form-city').value.trim(),
                date: document.getElementById('form-date').value,
                timeSlot: document.getElementById('form-timeslot').value,
                notes: document.getElementById('form-notes').value.trim()
            };

            // Post request to Node.js/Express API backend
            fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error during appointment request.');
                }
                return response.json();
            })
            .then(data => {
                // Reset loading spinner
                if (formSpinner) formSpinner.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;

                if (data.success) {
                    // Hide Form and reveal success message card
                    appointmentForm.style.display = 'none';
                    successCard.style.display = 'flex';
                    
                    // Smoothly scroll user up slightly to view the success message
                    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert('Error: ' + (data.message || 'Submission failed. Please try again.'));
                }
            })
            .catch(error => {
                if (formSpinner) formSpinner.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
                console.error('Error posting appointment details:', error);
                alert('We are having trouble reaching the server. Please try again or call us directly.');
            });
        });

        // Reset Form Handler (Let user request another slot)
        resetFormBtn.addEventListener('click', () => {
            appointmentForm.reset(); // Reset form field values
            
            // Toggle element displays back
            successCard.style.display = 'none';
            appointmentForm.style.display = 'block';
            
            // Clean up error outline wrappers
            nameInput.parentElement.classList.remove('invalid');
            mobileInput.parentElement.classList.remove('invalid');
        });
    }

    /* ==========================================
       8. FUNNY REVIEWS FILTER MODAL
       ========================================== */
    const reviewsFilterBtn = document.getElementById('reviews-filter-btn');
    const reviewsModal = document.getElementById('reviews-filter-modal');
    const reviewsModalClose = document.getElementById('filter-modal-close');

    if (reviewsFilterBtn && reviewsModal && reviewsModalClose) {
        
        // Show modal popup
        const showReviewsModal = () => {
            reviewsModal.classList.add('active');
            reviewsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        };

        // Hide modal popup
        const hideReviewsModal = () => {
            reviewsModal.classList.remove('active');
            reviewsModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restore background scrolling
        };

        // Open trigger
        reviewsFilterBtn.addEventListener('click', showReviewsModal);

        // Close triggers
        reviewsModalClose.addEventListener('click', hideReviewsModal);
        
        // Close on background overlay click
        reviewsModal.addEventListener('click', (e) => {
            if (e.target === reviewsModal) {
                hideReviewsModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && reviewsModal.classList.contains('active')) {
                hideReviewsModal();
            }
        });
    }

    /* ==========================================
       9. CURSOR & TOUCH NEON GLITTER EFFECT
       ========================================== */
    const MAX_SPARKS = 20;
    const sparkPool = [];
    let sparkIndex = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const movementThreshold = 8; // minimum movement in px to spawn a cluster

    // Create container for sparks
    const sparkContainer = document.createElement('div');
    sparkContainer.id = 'spark-container';
    sparkContainer.style.position = 'fixed';
    sparkContainer.style.top = '0';
    sparkContainer.style.left = '0';
    sparkContainer.style.width = '100vw';
    sparkContainer.style.height = '100vh';
    sparkContainer.style.pointerEvents = 'none';
    sparkContainer.style.zIndex = '999999';
    document.body.appendChild(sparkContainer);

    // Color options: 3 shades of aqua/teal + 1 soft white
    const sparkColors = [
        '#26D7D9', // Theme Aqua Accent
        '#00F2F2', // Bright Cyan
        '#14B8A6', // Teal
        '#FFFFFF'  // Soft White
    ];

    // Initialize Pool
    for (let i = 0; i < MAX_SPARKS; i++) {
        const spark = document.createElement('div');
        spark.className = 'glitter-spark';
        sparkContainer.appendChild(spark);
        sparkPool.push(spark);
    }

    const triggerSparkCluster = (x, y) => {
        // Spawn 2-3 sparks in a cluster
        const numSparks = Math.floor(Math.random() * 2) + 2; 

        for (let i = 0; i < numSparks; i++) {
            const spark = sparkPool[sparkIndex];
            spark.classList.remove('active');
            void spark.offsetWidth; // Reflow to restart animation

            // Randomize size: 10px to 16px
            const size = Math.floor(Math.random() * 7) + 10;
            // Randomize color from list
            const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];

            // Randomize scatter angle & distance (spread)
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30 + 10; // 10 to 40px spread
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            spark.style.setProperty('--dx', `${dx}px`);
            spark.style.setProperty('--dy', `${dy}px`);
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            spark.style.backgroundColor = color;
            spark.style.boxShadow = `0 0 10px 2px ${color}, 0 0 3px #ffffff`;
            spark.style.left = `${x - size / 2}px`;
            spark.style.top = `${y - size / 2}px`;

            spark.classList.add('active');
            sparkIndex = (sparkIndex + 1) % MAX_SPARKS;
        }
    };

    // Desktop: Mouse Move
    window.addEventListener('mousemove', (e) => {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        if (dist > movementThreshold) {
            triggerSparkCluster(e.clientX, e.clientY);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });

    // Mobile/Desktop: Tap/Click
    const handleTapClick = (clientX, clientY) => {
        // Spawn 4-5 sparks around tap point for a beautiful click impact
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                triggerSparkCluster(clientX, clientY);
            }, i * 50);
        }
    };

    window.addEventListener('click', (e) => {
        // Avoid double triggering if touchstart already handled it
        if (e.pointerType === 'touch') return;
        handleTapClick(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        handleTapClick(touch.clientX, touch.clientY);
    }, { passive: true });
});
