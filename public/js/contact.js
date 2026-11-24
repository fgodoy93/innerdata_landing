import { showToast } from './toast.js';

export function initContactForm() {
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: 'g5_BbsKMsEyrrbKN1',
        SERVICE_ID: 'service_s85hr3h',
        TEMPLATE_ID: 'template_jzfwy1w'
    };

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            const templateParams = {
                from_name: document.getElementById('nombre').value,
                from_email: document.getElementById('email').value,
                empresa_cargo: document.getElementById('empresa_cargo').value,
                message: document.getElementById('mensaje').value,
                to_email: 'contacto@innerdata.cl'
            };

            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            )
            .then(function () {
                showToast('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                contactForm.reset();
            })
            .catch(function () {
                showToast('Error al enviar el mensaje. Por favor, intenta de nuevo o escríbenos.', 'error');
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }
}
