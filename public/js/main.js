import { initNavigation } from './navigation.js';
import { initModals } from './modals.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './contact.js';
import { initParticles } from './particles-setup.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initAnimations();
    initContactForm();
    initParticles();
});
