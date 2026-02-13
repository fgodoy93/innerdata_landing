document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                // Close menu if open (on mobile)
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                // Scroll
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modals
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Open Modal
    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if inside a link, though here they are buttons
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Close Modal via X button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
    });

    // Close Modal via Clicking Outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });


    // Scroll Animations (Intersection Observer)
    const fadeElems = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // Toast Notification Function (Global)
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
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 400); // Wait for transition
        }, 4000);
    };

    // EmailJS Configuration
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: 'g5_BbsKMsEyrrbKN1',
        SERVICE_ID: 'service_s85hr3h',
        TEMPLATE_ID: 'template_jzfwy1w'
    };

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized successfully');
    } else {
        console.error('❌ EmailJS SDK not loaded!');
    }

    // Contact Form Handler with EmailJS
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log('✅ Form found, attaching event listener');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('📧 Form submitted, sending via EmailJS...');

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
                    console.log('SUCCESS!', response.status, response.text);
                    showToast('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error('FAILED...', error);
                    showToast('Error al enviar el mensaje. Por favor, intenta nuevamente o escríbenos directamente a contacto@innerdata.cl', 'error');
                })
                .finally(function () {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }
});
