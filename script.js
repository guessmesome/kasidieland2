const PASS_DATA = true;
const AUTO_REDIRECT_RETURN_VISITOR = true;

let currentSlide = 1;
const totalSlides = 4;
let userEmail = null;

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        p7: urlParams.get('p7') || '',
        clickid: urlParams.get('clickid') || '',
        subid: urlParams.get('subid') || '',
        subid2: urlParams.get('subid2') || ''
    };
}

function encodeEmailToBase64(email) {
    if (!email) return '';
    
    const emailObj = { "email": email };
    const jsonString = JSON.stringify(emailObj);
    const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
    
    return base64Data;
}

function checkReturnVisitor() {
    if (!AUTO_REDIRECT_RETURN_VISITOR) {
        console.log('Auto redirect disabled, user will go through the site');
        return false;
    }
    
    const hasVisited = localStorage.getItem('kasidieVisited');
    console.log('checkReturnVisitor() called, hasVisited:', hasVisited);
    
    if (hasVisited) {
        const savedEmail = localStorage.getItem('userEmail');
        console.log('Return visitor, saved email:', savedEmail);
        
        let baseUrl = 'https://gosgbk.com/gJt99v';
        
        if (PASS_DATA) {
            const params = getUrlParams();
            
            if (savedEmail) {
                const encodedEmail = encodeEmailToBase64(savedEmail);
                console.log('Return visitor encoded email:', encodedEmail);
                baseUrl += `&_fData=${encodeURIComponent(encodedEmail)}`;
            }
            
            baseUrl += `&p7=${params.p7 || ''}&clickid=${params.clickid}&subid=${params.subid}&subid2=${params.subid2}`;
        }
        
        console.log('Return visitor final URL:', baseUrl);
        console.log('Redirecting return visitor...');
        
        window.location.href = baseUrl;
        return true;
    }
    
    return false;
}

function markAsVisited() {
    localStorage.setItem('kasidieVisited', 'true');
    localStorage.setItem('kasidieVisitTime', new Date().getTime());
}

function clearVisitorData() {
    localStorage.removeItem('kasidieVisited');
    localStorage.removeItem('kasidieVisitTime');
    localStorage.removeItem('userEmail');
    console.log('Visitor data cleared');
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

function nextSlideWithEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        userEmail = email;
        localStorage.setItem('userEmail', email);
        console.log('Email saved:', email);
        nextSlide();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
    if (checkReturnVisitor()) {
        return;
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
    console.log('redirectToSite() called');
    markAsVisited();
    
    const currentEmail = userEmail || localStorage.getItem('userEmail');
    console.log('Using email:', currentEmail);
    
    let baseUrl = 'https://gosgbk.com/gJt99v';
    
    if (PASS_DATA) {
        const params = getUrlParams();
        console.log('URL params:', params);
        
        if (currentEmail) {
            const encodedEmail = encodeEmailToBase64(currentEmail);
            console.log('Encoded email:', encodedEmail);
            baseUrl += `&_fData=${encodeURIComponent(encodedEmail)}`;
        }
        
        baseUrl += `&p7=${params.p7 || ''}&clickid=${params.clickid}&subid=${params.subid}&subid2=${params.subid2}`;
    }
    
    console.log('Final URL:', baseUrl);
    console.log('Redirecting...');
    
    window.location.href = baseUrl;
}

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

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && currentSlide < totalSlides) {
            nextSlide();
        }
    }

    startX = 0;
    startY = 0;
});

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else if (currentSlide === totalSlides) {
            redirectToSite();
        }
    }
});
