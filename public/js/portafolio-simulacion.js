document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * target);
            
            counter.innerText = currentCount + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + suffix;
            }
        };
        requestAnimationFrame(updateCount);
    };

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
});
