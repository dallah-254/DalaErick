document.addEventListener('DOMContentLoaded', function() {
    const ball = document.getElementById('codeBall');
    const iconItems = document.querySelectorAll('.icon-item');
    
    let ballVisible = false;
    let lastClickTime = 0;
    let clickCount = 0;
    
    // Icon click handlers
    iconItems.forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove active class from all icons
            iconItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked icon
            this.classList.add('active');
            
            // Get page name from icon content
            const pageName = getPageNameFromIcon(this.textContent);
            console.log(`Navigating to: ${pageName}`);
            
            // Remove active class after animation
            setTimeout(() => {
                this.classList.remove('active');
            }, 600);
        });
        
        // Add hover effect
        icon.addEventListener('mouseenter', function() {
            console.log(`Hovering over: ${getPageNameFromIcon(this.textContent)}`);
        });
    });
    
    // Helper function to get page name from icon
    function getPageNameFromIcon(icon) {
        const iconMap = {
            '🏠': 'Home',
            '👤': 'Profile',
            '💼': 'Portfolio',
            '💻': 'Services',
            '📣': 'Blog',
            '📧': 'Contact'
        };
        return iconMap[icon] || 'Unknown';
    }
    
    // Show ball on first interaction
    function showBall() {
        if (!ballVisible) {
            ball.classList.add('visible');
            ballVisible = true;
            
            // Remove event listeners after first interaction
            document.removeEventListener('mousedown', showBall);
            document.removeEventListener('keydown', showBall);
            document.removeEventListener('touchstart', showBall);
        }
    }
    
    // Add event listeners for first interaction
    document.addEventListener('mousedown', showBall);
    document.addEventListener('keydown', showBall);
    document.addEventListener('touchstart', showBall);
    
    // Move ball to click position
    document.addEventListener('click', function(e) {
        if (!ballVisible) return;
        
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
        
        // Detect double click
        if (timeDiff < 300) {
            clickCount++;
            if (clickCount === 2) {
                ball.style.background = 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b)';
                setTimeout(() => {
                    ball.style.background = 'radial-gradient(circle at 30% 30%, #3498db, #2980b9)';
                }, 1000);
                clickCount = 0;
            }
        } else {
            clickCount = 1;
        }
        
        lastClickTime = currentTime;
        
        // Move ball to click position
        ball.style.left = e.clientX + 'px';
        ball.style.top = e.clientY + 'px';
        
        // Add click animation
        ball.classList.remove('click');
        void ball.offsetWidth; // Trigger reflow
        ball.classList.add('click');
    });
    
    // Add scroll effect
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!ballVisible) return;
        
        ball.classList.remove('scroll');
        void ball.offsetWidth; // Trigger reflow
        ball.classList.add('scroll');
        
        clearTimeout(scrollTimeout);
    });
    
    // Add keyboard interaction
    document.addEventListener('keydown', function(e) {
        if (!ballVisible) return;
        
        if (e.key === ' ') {
            ball.classList.remove('bump');
            void ball.offsetWidth; // Trigger reflow
            ball.classList.add('bump');
        } else if (e.key === 'r' || e.key === 'R') {
            ball.style.background = 'radial-gradient(circle at 30% 30%, #2ecc71, #27ae60)';
            setTimeout(() => {
                ball.style.background = 'radial-gradient(circle at 30% 30%, #3498db, #2980b9)';
            }, 1000);
        }
    });
    
    // Add hover effects to page elements
    const interactiveElements = document.querySelectorAll('h1, h2, h3, p, .profile-image-container');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            if (!ballVisible) return;
            
            ball.classList.remove('bump');
            void ball.offsetWidth; // Trigger reflow
            ball.classList.add('bump');
        });
    });
});