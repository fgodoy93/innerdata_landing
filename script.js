document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle - Con verificaciĂ³n de seguridad
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                // Close menu if open (on mobile)
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                // Scroll smoothly
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Modales - LĂ³gica centralizada y optimizada
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    };

    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    };

    // Open Modal
    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    // Close Modal via X button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close Modal via clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Soporte para tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // 4. Scroll Animations (Intersection Observer corregido)
    const fadeElems = document.querySelectorAll('.fade-in');

    if (fadeElems.length > 0) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        fadeElems.forEach(elem => appearOnScroll.observe(elem));
    }

    // 5. Typing Effect
    const typingSpan = document.getElementById('typing-text');

    if (typingSpan) {
        const words = ["sus datos", "su operación", "la complejidad", "el futuro"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster when deleting
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            // Logic for word completion
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing effect with a small delay
        setTimeout(type, 1000);
    }

    // 6. Toast Function (Global)
    window.showToast = function (message, type = 'success') {
        // Create container if not exists
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${iconClass}"></i></div>
            <div class="toast-message">${message}</div>
        `;

        // Add to container
        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
                // Remove container if empty
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 400);
        }, 4000);
    };

    // 7. EmailJS Configuration and Form Handler
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: 'g5_BbsKMsEyrrbKN1',
        SERVICE_ID: 'service_s85hr3h',
        TEMPLATE_ID: 'template_jzfwy1w'
    };

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('âœ… EmailJS initialized successfully');
    } else {
        console.warn('âš ď¸Ź EmailJS SDK not loaded');
    }

    // Contact Form Handler with EmailJS
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        console.log('âœ… Contact form found, attaching event listener');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('ðŸ"§ Form submitted, sending via EmailJS...');

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // Prepare template parameters
            const templateParams = {
                from_name: document.getElementById('nombre').value,
                from_email: document.getElementById('email').value,
                empresa_cargo: document.getElementById('empresa_cargo').value,
                message: document.getElementById('mensaje').value,
                to_email: 'contacto@innerdata.cl'
            };

            // Send email using EmailJS
            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            )
                .then(function (response) {
                    console.log('âœ… SUCCESS!', response.status, response.text);
                    showToast('ÂĄMensaje enviado con Ă©xito! Te contactaremos pronto.', 'success');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error('âŒ FAILED...', error);
                    showToast('Error al enviar el mensaje. Por favor, intenta nuevamente o escrĂ­benos directamente a contacto@innerdata.cl', 'error');
                })
                .finally(function () {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }

    // 8. Particles.js Configuration
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.2,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // 9. Header Scroll Class
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});