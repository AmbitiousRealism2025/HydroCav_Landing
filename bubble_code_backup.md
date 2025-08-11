# Bubble Animation Code Backup
**Date:** 2025-01-11  
**Branch:** bubble-improvement  
**Purpose:** Backup of original bubble code before 3D enhancements

## Original CSS Code (from assets/css/style.css)

### Bubble Base Styles (Lines 24-31)
```css
.bubble {
    position: absolute;
    bottom: -100px;
    border-radius: 50%;
    animation-name: rise;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
}
```

### Bubble Color Variants (Lines 33-41)
```css
.blue-bubble {
    background: radial-gradient(circle at 30% 30%, rgba(49, 155, 224, 0.4), rgba(49, 155, 224, 0.1));
    box-shadow: 0 4px 15px rgba(49, 155, 224, 0.1);
}

.white-bubble {
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1));
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
```

### Animation Keyframes (Lines 43-48)
```css
@keyframes rise {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: 1; }
    95% { opacity: 1; }
    100% { transform: translateY(-110vh); opacity: 0; }
}
```

### Process Step Bubble (Lines 410-418)
```css
.process-step-bubble {
    width: 64px; /* w-16 */
    height: 64px; /* h-16 */
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(49, 155, 224, 0.3), rgba(49, 155, 224, 0.1));
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}
```

### Reduced Motion Support (Lines 705-708)
```css
.bubble {
    animation: none;
    opacity: 0.1;
}
```

## Original JavaScript Code (from assets/js/main.js)

### createBubbles Function (Lines 15-34)
```javascript
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
```

### Bubble Container Setup (Lines 37-44)
```javascript
// Get bubble containers for sections that still have bubbles
const heroBubbleContainer = document.getElementById('bubble-container-hero');
const advantagesBubbleContainer = document.getElementById('bubble-container-advantages');
const ctaBubbleContainer = document.getElementById('bubble-container-cta');

// Create bubbles for sections that still need them (reduced by 50%)
createBubbles(heroBubbleContainer, 15, 'white-bubble');
createBubbles(advantagesBubbleContainer, 15, 'blue-bubble');
createBubbles(ctaBubbleContainer, 15, 'white-bubble');
```

## Current Implementation Notes
- **Bubble Count**: 15 per section (reduced from 30)
- **Size Range**: 10px to 70px (random)
- **Animation Duration**: 15-35 seconds (varied)
- **Movement**: Simple vertical rise from bottom to top
- **Classes**: `.blue-bubble` and `.white-bubble` variants
- **Performance**: Basic GPU acceleration with `transform` animations