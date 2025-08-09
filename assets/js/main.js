document.addEventListener('DOMContentLoaded', function () {
    // Centralized function to create bubbles
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

    // Get all bubble containers
    const heroBubbleContainer = document.getElementById('bubble-container-hero');
    const advantagesBubbleContainer = document.getElementById('bubble-container-advantages');
    const howBubbleContainer = document.getElementById('bubble-container-how');
    const showcaseBubbleContainer = document.getElementById('bubble-container-showcase');
    const ctaBubbleContainer = document.getElementById('bubble-container-cta');
    const contactBubbleContainer = document.getElementById('bubble-container-contact');

    // Create bubbles for each section with appropriate colors
    createBubbles(heroBubbleContainer, 30, 'white-bubble');
    createBubbles(advantagesBubbleContainer, 30, 'blue-bubble');
    createBubbles(howBubbleContainer, 30, 'white-bubble');
    createBubbles(showcaseBubbleContainer, 15, 'white-bubble');
    createBubbles(ctaBubbleContainer, 30, 'white-bubble');
    createBubbles(contactBubbleContainer, 30, 'blue-bubble');
});
