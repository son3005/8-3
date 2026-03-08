document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const messageCard = document.getElementById('message-card');
    const replayBtn = document.getElementById('replay-btn');
    const bgContainer = document.getElementById('bg-container');

    // Create floating elements (hearts, flowers, and photos)
    const elements = ['❤️', '🌸', '✨', '💖', '🌺', '🌷', '🦋', '💐'];
    // Danh sách các ảnh trong folder images
    const userImages = [
        'images/1.jpg', 'images/2.jpg', 'images/3.jpg',
        'images/4.jpg', 'images/5.jpg', 'images/6.jpg',
        'images/7.jpg', 'images/8.jpg', 'images/9.jpg'
    ];
    const maxElements = 35; // increased for better visual effect
    let elementsArray = [];

    function createFloatingElement() {
        // cleanup old elements that might be stuck
        elementsArray = elementsArray.filter(el => document.body.contains(el));

        if (elementsArray.length >= maxElements) return;

        const el = document.createElement('div');
        el.classList.add('floating-element');

        // Randomly decide whether to show an emoji or an image (if images exist)
        const showImage = userImages.length > 0 && Math.random() > 0.6; // 40% chance of image

        if (showImage) {
            const randomImg = userImages[Math.floor(Math.random() * userImages.length)];
            el.classList.add('floating-img');
            el.style.backgroundImage = `url('${randomImg}')`;

            // Randomize image size
            const size = Math.random() * 50 + 50; // Images are bigger: 50px to 100px
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
        } else {
            el.innerText = elements[Math.floor(Math.random() * elements.length)];

            // Randomize emoji size
            const size = Math.random() * 25 + 15; // 15px to 40px
            el.style.fontSize = `${size}px`;
        }

        // Ensure they spawn across the whole screen width
        el.style.left = `${Math.random() * 100}vw`;

        // Randomize animation specific details
        const duration = Math.random() * 6 + 6; // 6s to 12s
        el.style.animationDuration = `${duration}s`;

        // Add some random horizontal drift
        const horizontalDrift = (Math.random() - 0.5) * 100; // -50px to 50px drift

        // Optional: dynamic keyframes inline or just use CSS. Using CSS with simple translation is safer cross-browser
        // But for better visuals, we inject it into the DOM

        bgContainer.appendChild(el);
        elementsArray.push(el);

        // Remove element after animation to prevent memory leak
        el.addEventListener('animationend', () => {
            el.remove();
            elementsArray = elementsArray.filter(item => item !== el);
            // Spawn a new one immediately when one dies to keep screen full
            createFloatingElement();
        });
    }

    // Keep creating elements periodically as well
    setInterval(createFloatingElement, 500);

    // Initial fill for immediate effect
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingElement, i * 150);
    }

    // Envelope Interactions
    envelopeWrapper.addEventListener('click', () => {
        if (envelopeWrapper.classList.contains('open')) return;

        // Play open animation
        envelopeWrapper.classList.add('open');

        // Vibration feedback on mobile if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Wait for flap animation then hide envelope and show message
        setTimeout(() => {
            envelopeWrapper.style.opacity = '0';

            setTimeout(() => {
                envelopeWrapper.style.display = 'none';
                messageCard.classList.remove('hidden');

                // Trigger reflow for animation
                void messageCard.offsetWidth;

                messageCard.classList.add('visible');

                // Spawn a burst of hearts
                for (let i = 0; i < 10; i++) {
                    setTimeout(createFloatingElement, i * 50);
                }
            }, 300); // Wait for opacity fade
        }, 600); // Flap animation time
    });

    replayBtn.addEventListener('click', () => {
        // Hide message
        messageCard.classList.remove('visible');

        // Vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }

        setTimeout(() => {
            messageCard.classList.add('hidden');

            // Show envelope again
            envelopeWrapper.style.display = 'flex';

            // Trigger reflow
            void envelopeWrapper.offsetWidth;

            envelopeWrapper.classList.remove('open');
            envelopeWrapper.style.opacity = '1';
        }, 600);
    });
});
