if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 900 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.18, random: false },
                size: { value: 2.5, random: true },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.12, width: 1 },
                move: { enable: true, speed: 1.8, random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick:  { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
