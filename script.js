let currentSlide = 1;
const totalSlides = 4;

// Encode email to base64 JSON format
function encodeEmailToBase64(email) {
    const emailData = {
        "email": email
    };
    const jsonString = JSON.stringify(emailData);
    return btoa(jsonString);
}

// Save email to localStorage
function saveEmail(email) {
    localStorage.setItem('kasidieEmail', email);
}

// Get saved email from localStorage
function getSavedEmail() {
    return localStorage.getItem('kasidieEmail');
}

// Build redirect URL with email data
function buildRedirectURL(baseURL, email = null) {
    if (!email) {
        email = getSavedEmail();
    }
    
    if (email) {
        const encodedData = encodeEmailToBase64(email);
        const separator = baseURL.includes('?') ? '&' : '?';
        return `${baseURL}${separator}_fData=${encodedData}`;
    }
    
    return baseURL;
}

// Check if user has visited before
function checkReturnVisitor() {
    const hasVisited = localStorage.getItem('kasidieVisited');
    
    if (hasVisited) {
        // User has visited before, redirect immediately with saved email
        const redirectURL = buildRedirectURL('https://ef-to-wz.com/tds/ae?tds_campaign=s7788kru&tdsId=s7788kru_r&s1=int&utm_source=int&utm_term=5&p7=%7Bp7%7D&clickid=%7Bclickid%7D&subid=%7Bsubid%7D&subid2=%7Bsubid2%7D&affid=cf9f103c');
        window.location.href = redirectURL;
        return true;
    }
    
    return false;
}

// Mark user as visited
function markAsVisited() {
    localStorage.setItem('kasidieVisited', 'true');
    localStorage.setItem('kasidieVisitTime', new Date().getTime());
}

// Clear visitor data (for testing - can be called from browser console)
function clearVisitorData() {
    localStorage.removeItem('kasidieVisited');
    localStorage.removeItem('kasidieVisitTime');
    localStorage.removeItem('kasidieEmail');
    console.log('Visitor data cleared');
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        // Hide current slide
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        
        // Show next slide
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

function nextSlideWithEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    // Check if email is valid
    if (email && isValidEmail(email)) {
        // Save email to localStorage
        saveEmail(email);
        nextSlide();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email input validation for slide 3
document.addEventListener('DOMContentLoaded', function() {
    // Check for return visitor first
    if (checkReturnVisitor()) {
        return; // Will redirect, no need to continue
    }
    
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('continueBtn3');
    
    if (emailInput && continueBtn) {
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            
            if (email && isValidEmail(email)) {
                continueBtn.disabled = false;
                continueBtn.classList.remove('disabled');
            } else {
                continueBtn.disabled = true;
                continueBtn.classList.add('disabled');
            }
        });
    }
});

function redirectToSite() {
    markAsVisited();
    const redirectURL = buildRedirectURL('https://ef-to-wz.com/tds/ae?tds_campaign=s7788kru&tdsId=s7788kru_r&s1=int&utm_source=int&utm_term=5&p7=%7Bp7%7D&clickid=%7Bclickid%7D&subid=%7Bsubid%7D&subid2=%7Bsubid2%7D&affid=cf9f103c');
    window.location.href = redirectURL;
}

// Touch/swipe functionality for mobile
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!startX || !startY) {
        return;
    }

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let diffX = startX - endX;
    let diffY = startY - endY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe left (next slide)
        if (diffX > 50 && currentSlide < totalSlides) {
            nextSlide();
        }
    }

    startX = 0;
    startY = 0;
});

// Prevent scroll on mobile
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else if (currentSlide === totalSlides) {
            redirectToSite();
        }
    }
});
