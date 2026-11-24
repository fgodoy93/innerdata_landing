export function initAnimations() {
    const fadeElems = document.querySelectorAll('.fade-in, .reveal-block');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fadeElems.length > 0) {
        if (prefersReducedMotion) {
            fadeElems.forEach(elem => {
                elem.classList.add('visible', 'is-visible');
            });
        } else {
            const appearOptions = {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            };

            const appearOnScroll = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible', 'is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, appearOptions);

            fadeElems.forEach(elem => appearOnScroll.observe(elem));
        }
    }

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
                typeSpeed = 50;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }
}
