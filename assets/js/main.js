// Force scroll to top on page load/refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Ensure scroll to top and prevent browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', function () {
    // Force scroll to top when DOM loads
    window.scrollTo(0, 0);
    // Enhanced 3D bubble creation system with background-specific colors
    function create3DBubbles(container, count = 18, backgroundType = 'blue', startHidden = false) {
        if (!container) return;

        // Bubble size configurations with weights
        const bubbleSizes = [
            { size: 'xl', weight: 0.1 },
            { size: 'lg', weight: 0.2 },
            { size: 'md', weight: 0.3 },
            { size: 'sm', weight: 0.25 },
            { size: 'xs', weight: 0.15 }
        ];

        // Color variants based on background type
        let colorClasses;
        if (backgroundType === 'white') {
            // Blue bubbles for white backgrounds (Advantages section)
            colorClasses = ['bubble-blue-on-white', 'bubble-secondary-blue', 'bubble-neutral'];
        } else {
            // White bubbles for blue backgrounds (Hero, Contact, etc.)
            colorClasses = ['bubble-white-on-blue', 'bubble-light-white', 'bubble-neutral'];
        }

        // Speed variations with weighted distribution for more slow bubbles
        const speedOptions = [
            { name: 'very-slow', duration: '60s', weight: 0.35 },  // 35% - most common
            { name: 'slow', duration: '50s', weight: 0.30 },       // 30% - common
            { name: 'medium', duration: '40s', weight: 0.20 },     // 20% - moderate
            { name: 'fast', duration: '32s', weight: 0.10 },       // 10% - occasional
            { name: 'very-fast', duration: '25s', weight: 0.05 }   // 5% - rare
        ];
        
        // Helper function for weighted speed selection
        function getWeightedRandomSpeed() {
            const random = Math.random();
            let cumulativeWeight = 0;
            
            for (const speed of speedOptions) {
                cumulativeWeight += speed.weight;
                if (random <= cumulativeWeight) {
                    return speed;
                }
            }
            return speedOptions[0]; // Fallback to slowest
        }

        // 3 Different drift patterns for variety
        const driftPatterns = [
            'lazyFloatWithDrift',
            'lazyFloatWithDrift2', 
            'lazyFloatWithDrift3'
        ];

        // Helper function for weighted random size selection
        function getWeightedRandomSize() {
            const random = Math.random();
            let cumulativeWeight = 0;
            
            for (const sizeConfig of bubbleSizes) {
                cumulativeWeight += sizeConfig.weight;
                if (random <= cumulativeWeight) {
                    return sizeConfig.size;
                }
            }
            return bubbleSizes[bubbleSizes.length - 1].size; // Fallback
        }

        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            
            // Random size selection
            const bubbleSize = getWeightedRandomSize();
            
            // Random selections
            const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            const randomSpeed = getWeightedRandomSpeed(); // Use weighted selection
            const randomDrift = driftPatterns[Math.floor(Math.random() * driftPatterns.length)];
            
            // Apply bubble classes for 3D effect
            bubble.classList.add(
                'bubble', 
                'bubble-3d',
                `bubble-${bubbleSize}`,
                randomColor
            );
            
            // Add visibility class based on startHidden parameter
            if (startHidden) {
                bubble.classList.add('bubbles-hidden');
            } else {
                // Ensure non-hero bubbles are visible
                bubble.classList.add('bubbles-visible');
            }

            // Apply random drift pattern and speed
            bubble.style.animation = `${randomDrift} ${randomSpeed.duration} linear infinite`;

            // Random position across the width
            bubble.style.left = `${Math.random() * 100}%`;
            
            // Reduced animation delay to ensure bubbles appear quickly
            bubble.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(bubble);
        }
    }

    // Legacy bubble creation function for backward compatibility
    function createBubbles(container, count, bubbleClass) {
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble', bubbleClass);

            const size = Math.random() * 60 + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;

            // Make animation durations more varied
            const duration = Math.random() * 20 + 15; // Slower, more ambient bubbles
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${Math.random() * 10}s`;

            container.appendChild(bubble);
        }
    }

    // Get bubble containers for sections that still have bubbles
    const heroBubbleContainer = document.getElementById('bubble-container-hero');
    const advantagesBubbleContainer = document.getElementById('bubble-container-advantages');
    const ctaBubbleContainer = document.getElementById('bubble-container-cta');

    // Create enhanced 3D bubbles for all sections with appropriate colors
    console.log('Creating bubbles...');
    
    // Hero section - white bubbles on blue background (start hidden)
    console.log('Hero container:', heroBubbleContainer);
    create3DBubbles(heroBubbleContainer, 30, 'blue', true); // Increased to 30 bubbles, start hidden
    console.log('Hero bubbles created:', heroBubbleContainer?.children.length);
    
    // Store hero bubble container globally for typewriter callback
    window.heroBubbleContainer = heroBubbleContainer;
    
    // Advantages section - blue bubbles on white background  
    console.log('Advantages container:', advantagesBubbleContainer);
    create3DBubbles(advantagesBubbleContainer, 18, 'white');
    console.log('Advantages bubbles created:', advantagesBubbleContainer?.children.length);
    
    // CTA section - white bubbles on blue background
    console.log('CTA container:', ctaBubbleContainer);
    create3DBubbles(ctaBubbleContainer, 18, 'blue');
    console.log('CTA bubbles created:', ctaBubbleContainer?.children.length);
    
    // Initialize enhanced navigation
    initializeEnhancedNavigation();
    
    // Initialize typewriter effect
    initializeTypewriter();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize advantages section animations
    initializeAdvantagesAnimations();
    
    // Initialize process section animations
    initializeProcessAnimations();
});

// ====================================================================== 
// ENHANCED NAVIGATION FEATURES
// ====================================================================== 

/**
 * Scroll Progress Indicator
 * Updates the progress bar width based on scroll position
 */
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    scrollProgress.style.width = Math.min(progress, 100) + '%';
}

/**
 * Scroll Spy Navigation
 * Highlights the current section in the navigation
 */
class ScrollSpy {
    constructor() {
        this.sections = [];
        this.navLinks = [];
        this.currentActive = null;
        this.init();
    }
    
    init() {
        // Get all sections with data-nav attribute
        this.sections = Array.from(document.querySelectorAll('[data-nav]'));
        
        // Get corresponding navigation links
        this.navLinks = this.sections.map(section => {
            const navId = section.getAttribute('data-nav');
            return document.querySelector(`a[href="#${navId}"], a[href*="${navId}"]`);
        }).filter(Boolean);
        
        if (this.sections.length === 0) {
            console.warn('No sections found for scroll spy');
            return;
        }
        
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is 20% from top
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target);
                }
            });
        }, options);
        
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }
    
    setActiveLink(activeSection) {
        const navId = activeSection.getAttribute('data-nav');
        const activeLink = document.querySelector(`a[href="#${navId}"], a[href*="${navId}"]`);
        
        if (activeLink && activeLink !== this.currentActive) {
            // Remove active class from all links
            this.navLinks.forEach(link => {
                if (link) link.classList.remove('active');
            });
            
            // Add active class to current link
            activeLink.classList.add('active');
            this.currentActive = activeLink;
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Enhanced smooth scrolling for all anchor links
 * Ensures contact section is fully visible with proper offset
 */
function initializeSmoothScrollForAllLinks() {
    // Select all anchor links that point to sections (including CTA buttons)
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate proper offset for contact section vs other sections
                let headerOffset = 80; // Standard offset for fixed header
                
                // For contact section, ensure it's fully visible from the top
                if (targetId === 'contact') {
                    // Calculate to show the entire contact section in viewport
                    const viewportHeight = window.innerHeight;
                    const sectionHeight = targetSection.offsetHeight;
                    
                    // If section is taller than viewport, position at top with header offset
                    // If section fits in viewport, position to show entire section with nice spacing
                    if (sectionHeight < viewportHeight - 160) {
                        // Add some breathing room - position section nicely in viewport
                        headerOffset = Math.max(100, (viewportHeight - sectionHeight) / 6);
                    } else {
                        // For larger sections, just use standard header offset
                        headerOffset = 80;
                    }
                }
                
                const targetPosition = targetSection.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition), // Ensure we don't scroll above page top
                    behavior: 'smooth'
                });
                
                console.log(`📍 Scrolling to ${targetId} with offset ${headerOffset}px`);
            }
        });
    });
    
    console.log(`✅ Enhanced smooth scrolling initialized for ${anchorLinks.length} anchor links`);
}

/**
 * Enhanced Navigation Controller
 * Manages all navigation enhancements
 */
function initializeEnhancedNavigation() {
    try {
        // Initialize scroll spy
        const scrollSpy = new ScrollSpy();
        
        // Initialize smooth scrolling for all anchor links
        initializeSmoothScrollForAllLinks();
        
        // Set up scroll progress indicator
        updateScrollProgress();
        
        // Set up performance-optimized scroll listener
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Use passive listener for better performance
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Update on resize
        window.addEventListener('resize', () => {
            updateScrollProgress();
        }, { passive: true });
        
        console.log('✅ Enhanced navigation initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize enhanced navigation:', error);
    }
}

// ====================================================================== 
// TYPEWRITER EFFECT
// ====================================================================== 

/**
 * TypewriterEffect Class
 * Creates a realistic character-by-character typing effect with proper line wrapping
 */
class TypewriterEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.fullText = text;
        this.currentText = '';
        this.index = 0;
        
        // Configuration options with defaults
        this.speed = options.speed || 50; // Default 50ms per character
        this.delay = options.delay || 2000; // 2 second delay before starting
        this.cursor = options.cursor || document.querySelector('.typewriter-cursor');
        this.onComplete = options.onComplete || null;
        this.onHalfway = options.onHalfway || null; // New callback for halfway point
        this.respectsReducedMotion = options.respectsReducedMotion !== false;
        this.halfwayTriggered = false; // Track if halfway callback was triggered
        
        // Mobile optimization
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            this.speed = Math.max(30, this.speed - 20); // Faster on mobile
        }
        
        this.isTyping = false;
        this.init();
    }
    
    init() {
        // Check for reduced motion preference
        if (this.respectsReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.showInstantly();
            return;
        }
        
        // Show cursor and start typing after delay
        setTimeout(() => {
            if (this.cursor) {
                this.cursor.style.opacity = '1';
            }
            this.startTyping();
        }, this.delay);
    }
    
    startTyping() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.typeNextCharacter();
    }
    
    typeNextCharacter() {
        if (this.index < this.fullText.length) {
            this.currentText += this.fullText[this.index];
            this.element.textContent = this.currentText;
            this.index++;
            
            // Check if we've reached halfway point
            if (!this.halfwayTriggered && this.index >= Math.floor(this.fullText.length / 2)) {
                this.halfwayTriggered = true;
                if (this.onHalfway) {
                    this.onHalfway();
                    console.log('🎯 Typewriter reached halfway point');
                }
            }
            
            // Variable speed for more natural typing (slight randomization)
            const variance = Math.random() * 20 - 10; // ±10ms variance
            const nextDelay = Math.max(10, this.speed + variance);
            
            setTimeout(() => this.typeNextCharacter(), nextDelay);
        } else {
            this.onTypingComplete();
        }
    }
    
    onTypingComplete() {
        this.isTyping = false;
        
        // Optional callback when typing is complete
        if (this.onComplete) {
            this.onComplete();
        }
        
        console.log('✅ Typewriter effect completed');
    }
    
    showInstantly() {
        // For users who prefer reduced motion
        this.element.textContent = this.fullText;
        if (this.cursor) {
            this.cursor.style.opacity = '1';
            this.cursor.style.animation = 'none';
        }
        
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    // Method to restart the animation
    restart() {
        this.index = 0;
        this.currentText = '';
        this.element.textContent = '';
        this.isTyping = false;
        
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
        
        this.init();
    }
}

/**
 * Initialize the typewriter effect for the hero section
 */
function initializeTypewriter() {
    try {
        const typewriterElement = document.getElementById('typewriter-text');
        const cursor = document.querySelector('.typewriter-cursor');
        
        if (!typewriterElement) {
            console.warn('Typewriter element not found');
            return;
        }
        
        // The new improved text
        const heroText = "Tired of high chemical costs, inconsistent water quality, and constant maintenance? HydroCav offers the solution!";
        
        // Create typewriter effect
        const typewriter = new TypewriterEffect(typewriterElement, heroText, {
            speed: 50,        // 50ms per character
            delay: 2000,      // Start after 2 seconds
            cursor: cursor,
            onHalfway: () => {
                console.log('Hero typewriter reached halfway point');
                
                // Trigger hero bubble animations at halfway point
                if (window.heroBubbleContainer) {
                    const heroBubbles = window.heroBubbleContainer.querySelectorAll('.bubble');
                    
                    // Reveal bubbles with staggered effect
                    heroBubbles.forEach((bubble, index) => {
                        setTimeout(() => {
                            bubble.classList.remove('bubbles-hidden');
                            bubble.classList.add('bubbles-visible');
                        }, index * 30); // 30ms stagger for smoother reveal with more bubbles
                    });
                    
                    console.log('✨ Hero bubbles animation triggered at halfway point');
                }
            },
            onComplete: () => {
                console.log('Hero typewriter animation completed');
            }
        });
        
        // Store reference for potential future use
        window.heroTypewriter = typewriter;
        
        console.log('✅ Typewriter effect initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize typewriter effect:', error);
    }
}

// ====================================================================== 
// MOBILE MENU CONTROLLER
// ====================================================================== 

/**
 * MobileMenuController Class
 * Handles mobile menu open/close functionality with smooth animations
 */
class MobileMenuController {
    constructor() {
        this.menuButton = document.getElementById('mobile-menu-button');
        this.menuOverlay = document.getElementById('mobile-menu');
        this.menuCloseButton = document.getElementById('mobile-menu-close');
        this.menuLinks = document.querySelectorAll('.mobile-menu-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuButton || !this.menuOverlay) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Add event listeners
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        
        if (this.menuCloseButton) {
            this.menuCloseButton.addEventListener('click', () => this.closeMenu());
        }
        
        // Close menu when clicking on overlay
        this.menuOverlay.addEventListener('click', (e) => {
            if (e.target === this.menuOverlay) {
                this.closeMenu();
            }
        });
        
        // Close menu and navigate when clicking on menu links
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Update active states based on scroll position
        this.updateActiveStates();
        
        console.log('✅ Mobile menu controller initialized');
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menuOverlay.classList.remove('hidden');
        this.menuButton.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Update active states when opening
        this.updateActiveStates();
        
        console.log('📱 Mobile menu opened');
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menuOverlay.classList.add('hidden');
        this.menuButton.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('📱 Mobile menu closed');
    }
    
    updateActiveStates() {
        // Get the currently active section from the main navigation
        const activeMainLink = document.querySelector('.menu-link.active');
        
        if (activeMainLink) {
            // Remove active class from all mobile menu links
            this.menuLinks.forEach(link => link.classList.remove('active'));
            
            // Find corresponding mobile menu link and add active class
            const activeHref = activeMainLink.getAttribute('href');
            const activeMobileLink = document.querySelector(`.mobile-menu-link[href="${activeHref}"]`);
            
            if (activeMobileLink) {
                activeMobileLink.classList.add('active');
            }
        }
    }
}

/**
 * Initialize the mobile menu functionality
 */
function initializeMobileMenu() {
    try {
        // Only initialize on devices that might use mobile menu
        const mobileMenuController = new MobileMenuController();
        
        // Store reference for potential future use
        window.mobileMenuController = mobileMenuController;
        
        // Update mobile menu active states when main navigation changes
        const observer = new MutationObserver(() => {
            mobileMenuController.updateActiveStates();
        });
        
        // Observe changes to main navigation active states
        const mainNav = document.querySelector('nav');
        if (mainNav) {
            observer.observe(mainNav, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }
        
        console.log('✅ Mobile menu initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize mobile menu:', error);
    }
}

// ====================================================================== 
// ADVANTAGES SECTION SCROLL ANIMATIONS
// ====================================================================== 

/**
 * AdvantagesAnimator Class
 * Creates scroll-triggered animations for the advantages section with staggered card reveals
 */
class AdvantagesAnimator {
    constructor() {
        this.cards = document.querySelectorAll('.liquid-glass-card');
        this.observer = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Add animation classes to cards in advantages section
        this.cards.forEach(card => {
            if (card.closest('#advantages')) {
                card.classList.add('advantages-card');
                // Add advantage-icon class to SVG containers
                const iconContainer = card.querySelector('svg')?.parentElement;
                if (iconContainer) {
                    iconContainer.classList.add('advantage-icon');
                }
            }
        });

        this.setupIntersectionObserver();
        this.setupReducedMotionListener();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // Trigger when 10% visible
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.animateCard(entry.target);
                }
            });
        }, options);

        // Observe all advantage cards
        this.cards.forEach(card => {
            if (card.closest('#advantages')) {
                this.observer.observe(card);
            }
        });
    }

    animateCard(card) {
        if (this.prefersReducedMotion) {
            // Immediate animation for reduced motion
            card.classList.add('animate-in');
            return;
        }

        // Get card index for stagger effect
        const advantageCards = Array.from(document.querySelectorAll('#advantages .liquid-glass-card'));
        const cardIndex = advantageCards.indexOf(card);
        const delay = cardIndex * 150; // 150ms stagger between cards

        setTimeout(() => {
            card.classList.add('animate-in');
        }, delay);

        // Unobserve after animation to prevent re-triggering
        setTimeout(() => {
            this.observer.unobserve(card);
        }, delay + 600);
    }

    setupReducedMotionListener() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            this.prefersReducedMotion = e.matches;
            if (e.matches) {
                // Apply immediate animations if reduced motion is enabled
                this.cards.forEach(card => {
                    if (card.closest('#advantages')) {
                        card.classList.add('animate-in');
                    }
                });
            }
        });
    }

    // Public method to reset animations (useful for development/testing)
    resetAnimations() {
        this.cards.forEach(card => {
            if (card.closest('#advantages')) {
                card.classList.remove('animate-in');
                if (this.observer) {
                    this.observer.observe(card);
                }
            }
        });
    }
}

/**
 * Initialize advantages animator
 */
function initializeAdvantagesAnimations() {
    try {
        // Initialize after DOM is fully loaded and other animations are set up
        const advantagesAnimator = new AdvantagesAnimator();
        
        // Store reference for potential future use
        window.advantagesAnimator = advantagesAnimator;
        
        console.log('✅ Advantages section animations initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize advantages animations:', error);
    }
}

// ====================================================================== 
// PROCESS SECTION INTERACTIVE ENHANCEMENTS
// ====================================================================== 

/**
 * ProcessAnimationController Class
 * Creates scroll-triggered animations for process section with step-by-step reveals and progress connectors
 */
class ProcessAnimationController {
    constructor() {
        this.processSteps = [];
        this.connectors = [];
        this.observer = null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.findProcessElements();
        this.createConnectorLines();
        this.initIntersectionObserver();
        this.addEventListeners();
    }

    findProcessElements() {
        // Find process section by various selectors
        const processSection = document.querySelector('#how-it-works') || 
                             document.querySelector('[data-section="process"]') || 
                             document.querySelector('section:has(h2:contains("How It Works"))') ||
                             document.querySelector('section:has(h2:contains("Process"))');
        
        if (!processSection) {
            // Try to find by content - look for sections with 4 cards that might be process steps
            const allSections = document.querySelectorAll('section');
            for (const section of allSections) {
                const cards = section.querySelectorAll('.liquid-glass-card');
                if (cards.length >= 4) {
                    // This might be our process section
                    this.processSteps = Array.from(cards).slice(0, 4); // Take first 4 as process steps
                    break;
                }
            }
        } else {
            this.processSteps = Array.from(processSection.querySelectorAll('.liquid-glass-card'));
        }

        // Add process-step class and step numbers
        this.processSteps.forEach((step, index) => {
            step.classList.add('process-step');
            
            // Add step number if not present
            if (!step.querySelector('.step-number')) {
                const stepNumber = document.createElement('div');
                stepNumber.className = 'step-number';
                stepNumber.textContent = index + 1;
                
                // Insert before the h3 title (first element) to position correctly
                const firstElement = step.querySelector('h3') || step.firstElementChild;
                if (firstElement) {
                    step.insertBefore(stepNumber, firstElement);
                } else {
                    step.insertBefore(stepNumber, step.firstChild);
                }
            }
        });
    }

    createConnectorLines() {
        if (this.processSteps.length < 2) return;

        const processContainer = this.processSteps[0].parentElement;
        processContainer.classList.add('process-container');

        // Create connector lines between steps
        for (let i = 0; i < this.processSteps.length - 1; i++) {
            const connector = document.createElement('div');
            connector.className = 'progress-connector';
            connector.setAttribute('data-connector', i + 1);
            processContainer.appendChild(connector);
            this.connectors.push(connector);
        }
    }

    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProcessSection(entry.target);
                }
            });
        }, options);

        // Observe the process steps
        this.processSteps.forEach(step => {
            this.observer.observe(step);
        });
    }

    animateProcessSection(triggeredStep) {
        const stepIndex = this.processSteps.indexOf(triggeredStep);
        
        // Animate steps sequentially up to the triggered step
        this.processSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                setTimeout(() => {
                    step.classList.add('animate-in');
                }, this.reducedMotion ? 0 : index * 150);
            }
        });

        // Animate connectors after steps
        this.connectors.forEach((connector, index) => {
            if (index < stepIndex) {
                setTimeout(() => {
                    connector.classList.add('animate');
                }, this.reducedMotion ? 0 : (index + 2) * 200);
            }
        });
    }

    addEventListeners() {
        // Enhanced hover effects
        this.processSteps.forEach((step, index) => {
            step.addEventListener('mouseenter', (e) => this.handleStepHover(e, index, true));
            step.addEventListener('mouseleave', (e) => this.handleStepHover(e, index, false));
        });

        // Listen for reduced motion preference changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addListener((e) => {
            this.reducedMotion = e.matches;
        });
    }

    handleStepHover(event, stepIndex, isEntering) {
        if (this.reducedMotion) return;

        if (isEntering) {
            // Add subtle glow effect to adjacent connectors
            this.connectors.forEach((connector, index) => {
                if (index === stepIndex - 1 || index === stepIndex) {
                    connector.style.filter = 'brightness(1.2) saturate(1.3)';
                }
            });
        } else {
            // Remove glow effect
            this.connectors.forEach(connector => {
                connector.style.filter = '';
            });
        }
    }

    // Method to manually trigger animations (useful for testing)
    triggerAllAnimations() {
        this.processSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animate-in');
            }, this.reducedMotion ? 0 : index * 150);
        });

        this.connectors.forEach((connector, index) => {
            setTimeout(() => {
                connector.classList.add('animate');
            }, this.reducedMotion ? 0 : (index + 2) * 200);
        });
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Initialize process animations
 */
function initializeProcessAnimations() {
    try {
        const processController = new ProcessAnimationController();
        
        // Store reference for potential future use
        window.processAnimationController = processController;
        
        console.log('✅ Process section animations initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize process animations:', error);
    }
}
