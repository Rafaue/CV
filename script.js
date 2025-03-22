document.addEventListener('DOMContentLoaded', () => {
    // main elements for language switching functionality
    const flipButton = document.querySelector('#flip-button');
    const mainTitle = document.querySelector('#main-title');
    const subtitle = document.querySelector('#subtitle');
    const footerText = document.querySelector('#footer-text');
    const cvContent = document.querySelector('#cv-content');

    // language configuration and state management
    let isPolish = false;
    const translations = {
        en: {
            button: 'Switch to Polish',
            title: 'My Curriculum Vitae',
            subtitle: 'Click the button below to switch between English and Polish versions',
            footer: '© 2025 My CV | All rights reserved'
        },
        pl: {
            button: 'Przełącz na angielski',
            title: 'Moje Curriculum Vitae',
            subtitle: 'Kliknij przycisk poniżej, aby przełączyć między wersją polską i angielską',
            footer: '© 2025 Moje CV | Wszystkie prawa zastrzeżone'
        }
    };

    // function to handle language updates and UI changes
    function updateLanguage(lang) {
        const text = translations[lang];
        flipButton.textContent = text.button;
        updateTitle(lang === 'en');
        footerText.textContent = text.footer;
        document.documentElement.lang = lang;
    }

    flipButton.addEventListener('click', () => {
        isPolish = !isPolish;
        updateLanguage(isPolish ? 'pl' : 'en');
        cvContent.classList.toggle('flipped');
        // note paper flipping
        document.querySelector('.note-paper').classList.toggle('flipped');
    });

    // interaction logic
    const lanyard = document.querySelector('.lanyard');
    const lanyardString = document.querySelector('.lanyard-string');
    const badge = document.querySelector('.badge');
    const badgeContent = document.querySelector('.badge-content');

    // physics simulation variables for smooth animation
    let isDragging = false;
    let startX, startY;
    let currentX, currentY;
    let velocity = { x: 0, y: 0 };
    let rafId;

    // function for smooth movement
    function animate() {
        if (!isDragging) {
            velocity.x *= 0.95;
            velocity.y *= 0.95;
            
            currentX += velocity.x;
            currentY += velocity.y;
    
            const rotation = (currentX - startX) * 0.1;
            const boundedRotation = Math.max(Math.min(rotation, 45), -45);
            
            lanyard.style.transform = `rotate(${boundedRotation}deg)`;
    
            if (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01) {
                rafId = requestAnimationFrame(animate);
            } else {
                lanyard.style.animation = 'lanyardSway 3s ease-in-out infinite';
            }
        }
    }

    // mouse handler for dragging interaction
    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const dx = e.clientX - currentX;
        const dy = e.clientY - currentY;
        
        velocity.x = dx;
        velocity.y = dy;
        
        currentX = e.clientX;
        currentY = e.clientY;
        
        const rotation = (currentX - startX) * 0.1;
        const boundedRotation = Math.max(Math.min(rotation, 45), -45);
        
        lanyard.style.transform = `rotate(${boundedRotation}deg)`;
    }

    lanyardString.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = currentX = e.clientX;
        startY = currentY = e.clientY;
        lanyard.style.animation = 'none';
        lanyard.style.transition = 'none';
        document.addEventListener('mousemove', handleMouseMove);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            lanyard.style.transition = 'transform 0.5s ease';
            lanyard.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                lanyard.style.animation = 'lanyardSway 3s ease-in-out infinite';
            }, 500);
        }
    });

    // badge hover effect
    badge.addEventListener('mousemove', (e) => {
        if (!isDragging) {
            const rect = badge.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            badgeContent.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
        }
    });

    badge.addEventListener('mouseleave', () => {
        if (!isDragging) {
            badgeContent.style.transform = 'none';
        }
    });

    // initial animation
    lanyard.style.animation = 'lanyardSway 3s ease-in-out infinite';

    // accessibility
    flipButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipButton.click();
        }
    });
});

// title update function with animation handling
function updateTitle(isEnglish) {
    const title = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');
    
    // restart animation
    title.classList.remove('animate');
    subtitle.classList.remove('animate');
    
    //tTrigger reflow
    void title.offsetWidth;
    void subtitle.offsetWidth;
    
    // add animation class
    title.classList.add('animate');
    subtitle.classList.add('animate');
    
    // update content
    title.textContent = isEnglish ? 'My Curriculum Vitae' : 'Moje CV';
    subtitle.textContent = isEnglish ? 
        'Click the button below to switch between English and Polish versions' : 
        'Kliknij przycisk poniżej, aby przełączyć między wersjami angielską i polską';
}
