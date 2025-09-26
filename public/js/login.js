// 로그인 모달 관련 JavaScript

// 샘플 사용자 계정
const SAMPLE_USERS = [
    { email: 'admin@demo.com', password: 'admin123', name: '관리자', company: '데모건설' },
    { email: 'manager@test.com', password: 'test123', name: '김매니저', company: '테스트건설' },
    { email: 'user@sample.com', password: 'sample123', name: '이담당', company: '샘플건설' }
];

// 모달 표시 함수
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 모달 숨김 함수
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// 탭 전환 함수
function switchTab(tabType) {
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // 탭 활성화 상태 변경
    loginTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (tabType === 'login') {
        loginTabs[0].classList.add('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else if (tabType === 'signup') {
        loginTabs[1].classList.add('active');
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    }
}

// 모달 초기화 및 이벤트 리스너 설정
function initializeModal() {
    // X 버튼 클릭 이벤트 (중요: 가장 먼저 설정)
    const closeButton = document.querySelector('.login-close');
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('X 버튼 클릭됨');
            hideLoginModal();
        });
    }

    // 탭 클릭 이벤트
    const tabButtons = document.querySelectorAll('.login-tab, .login-link[data-tab]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabType = this.getAttribute('data-tab');
            if (tabType) {
                switchTab(tabType);
            }
        });
    });

    // 로그인 폼 제출
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // 회원가입 폼 제출
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideLoginModal();
            }
        });
    }
    
    // 연락처 필드에 포맷팅 이벤트 추가
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            formatPhoneNumber(e.target);
        });
    }

    // 비밀번호 찾기 링크
    const forgotLinks = document.querySelectorAll('.login-link:not([data-tab])');
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('비밀번호 찾기 기능을 준비 중입니다!');
        });
    });

    console.log('로그인 모달 초기화 완료');
}

// 로그인 폼 제출 처리
function handleLoginSubmit(event) {
    event.preventDefault();
    
    // 기존 에러 메시지 제거
    removeFormError();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // 기본 유효성 검사
    if (!email || !password) {
        showFormError('모든 필드를 입력해주세요.');
        return;
    }
    
    if (!LoginUtils.validateEmail(email)) {
        showFormError('올바른 이메일 주소를 입력해주세요.');
        return;
    }

    // 로그인 시도 횟수 확인
    if (!LoginUtils.checkLoginAttempts(email)) {
        showFormError('로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.');
        return;
    }
    
    // 샘플 로그인 처리
    handleSampleLogin(email, password, remember);
}

// 회원가입 폼 제출 처리
function handleSignupSubmit(event) {
    event.preventDefault();
    
    // 기존 에러 메시지 제거
    removeFormError();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const email = formData.get('email');
    const companyName = formData.get('companyName');
    const managerName = formData.get('managerName');
    const phone = formData.get('phone');
    const agreeTerms = formData.get('agreeTerms');
    
    // 기본 유효성 검사
    if (!companyName || !managerName || !email || !password || !confirmPassword || !phone) {
        showFormError('모든 필드를 입력해주세요.');
        return;
    }
    
    if (!LoginUtils.validateEmail(email)) {
        showFormError('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    if (!LoginUtils.validatePassword(password)) {
        showFormError('비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    if (password !== confirmPassword) {
        showFormError('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showFormError('올바른 연락처를 입력해주세요. (예: 010-1234-5678)');
        return;
    }
    
    if (!agreeTerms) {
        showFormError('이용약관에 동의해주세요.');
        return;
    }
    
    const signupData = {
        companyName: companyName,
        managerName: managerName,
        email: email,
        password: password,
        phone: phone,
        agreeTerms: agreeTerms
    };
    
    console.log('회원가입 시도:', signupData);
    
    // 임시 성공 처리
    showSuccessMessage('회원가입이 완료되었습니다!');
    setTimeout(() => {
        switchTab('login');
    }, 1500);
}

// 샘플 로그인 처리
function handleSampleLogin(email, password, remember) {
    showNotification('로그인 중입니다...', 'info');
    
    setTimeout(() => {
        const user = SAMPLE_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 로그인 성공
            LoginUtils.recordLoginAttempt(email, true);
            showNotification(`환영합니다, ${user.name}님!`, 'success');
            hideLoginModal();
            
            // 로그인 상태 표시
            updateUIForLoggedInUser(user);
            
            // 로그인 정보 저장
            if (remember) {
                saveUserSession(user);
            }
        } else {
            // 로그인 실패
            LoginUtils.recordLoginAttempt(email, false);
            showFormError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }, 1000);
}

// 로그인된 사용자 UI 업데이트
function updateUIForLoggedInUser(user) {
    const startButtons = document.querySelectorAll('.btn-start, .btn-primary, .btn-cta');
    startButtons.forEach(btn => {
        if (btn.textContent.includes('시작') || btn.textContent.includes('무료')) {
            btn.textContent = '대시보드';
            btn.onclick = function() {
                showNotification('대시보드로 이동합니다!');
                // 실제로는 대시보드 페이지로 이동
                // window.location.href = '/dashboard';
            };
        }
    });
    
    // 헤더에 사용자 정보 표시
    const nav = document.querySelector('nav');
    if (nav && !nav.querySelector('.user-info')) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-details">
                <span class="user-name">${user.name}</span>
                <span class="user-company">${user.company}</span>
            </div>
            <button class="user-menu-btn" onclick="showUserMenu()">▼</button>
        `;
        userInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            margin-right: 16px;
            padding: 8px 16px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e8eb;
        `;
        
        const userDetails = userInfo.querySelector('.user-details');
        userDetails.style.cssText = `
            display: flex;
            flex-direction: column;
            text-align: right;
            font-size: 14px;
        `;
        
        const userName = userInfo.querySelector('.user-name');
        userName.style.cssText = `
            font-weight: 600;
            color: #191919;
        `;
        
        const userCompany = userInfo.querySelector('.user-company');
        userCompany.style.cssText = `
            font-size: 12px;
            color: #8b95a1;
        `;
        
        const menuBtn = userInfo.querySelector('.user-menu-btn');
        menuBtn.style.cssText = `
            background: none;
            border: none;
            color: #8b95a1;
            cursor: pointer;
            font-size: 12px;
            padding: 4px;
        `;
        
        const startBtn = nav.querySelector('.btn-start');
        if (startBtn) {
            nav.insertBefore(userInfo, startBtn);
            startBtn.style.display = 'none';
        }
    }
}

// 사용자 메뉴 표시
function showUserMenu() {
    const existingMenu = document.querySelector('.user-dropdown');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const userInfo = document.querySelector('.user-info');
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="menu-item" onclick="showNotification('프로필 기능 준비중')">프로필</div>
        <div class="menu-item" onclick="showNotification('설정 기능 준비중')">설정</div>
        <div class="menu-separator"></div>
        <div class="menu-item logout" onclick="handleLogout()">로그아웃</div>
    `;
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e5e8eb;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        min-width: 150px;
        z-index: 1000;
        margin-top: 8px;
        padding: 8px 0;
    `;
    
    userInfo.style.position = 'relative';
    userInfo.appendChild(dropdown);
    
    // 메뉴 아이템 스타일
    const menuItems = dropdown.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.cssText = `
            padding: 12px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
            color: #191919;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.background = '#f9fafb';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
    });
    
    // 로그아웃 버튼 스타일
    const logoutItem = dropdown.querySelector('.logout');
    logoutItem.style.color = '#ef4444';
    
    // 구분선 스타일
    const separator = dropdown.querySelector('.menu-separator');
    separator.style.cssText = `
        height: 1px;
        background: #e5e8eb;
        margin: 8px 0;
    `;
    
    // 외부 클릭시 메뉴 닫기
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!userInfo.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// 로그아웃 처리
function handleLogout() {
    showNotification('로그아웃 되었습니다.', 'info');
    
    // 사용자 정보 제거
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.remove();
    }
    
    // 버튼들을 원래대로 복원
    const startButtons = document.querySelectorAll('.btn-start, .btn-primary, .btn-cta');
    startButtons.forEach(btn => {
        if (btn.textContent === '대시보드') {
            if (btn.classList.contains('btn-start')) {
                btn.textContent = '시작하기';
                btn.style.display = 'block';
            } else if (btn.classList.contains('btn-primary')) {
                btn.textContent = '무료로 시작하기';
            } else if (btn.classList.contains('btn-cta')) {
                btn.textContent = '무료로 시작하기';
            }
            btn.onclick = showLoginModal;
        }
    });
    
    // 세션 정보 삭제
    clearUserSession();
}

// 사용자 세션 저장
function saveUserSession(user) {
    localStorage.setItem('jikjikjik_user', JSON.stringify({
        ...user,
        loginTime: new Date().toISOString()
    }));
}

// 사용자 세션 불러오기
function loadUserSession() {
    const userSession = localStorage.getItem('jikjikjik_user');
    if (userSession) {
        try {
            const user = JSON.parse(userSession);
            // 24시간 이내 로그인만 유효
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                updateUIForLoggedInUser(user);
                return user;
            } else {
                clearUserSession();
            }
        } catch (e) {
            clearUserSession();
        }
    }
    return null;
}

// 사용자 세션 삭제
function clearUserSession() {
    localStorage.removeItem('jikjikjik_user');
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 연락처 유효성 검사
function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// 폼 에러 표시 함수
function showFormError(message) {
    removeFormError(); // 기존 에러 제거
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    // 활성화된 폼에 에러 메시지 추가
    const activeForm = document.querySelector('.login-form.active');
    if (activeForm) {
        const submitButton = activeForm.querySelector('.login-submit');
        activeForm.insertBefore(errorDiv, submitButton);
    }
    
    // 5초 후 에러 메시지 제거
    setTimeout(() => {
        removeFormError();
    }, 5000);
}

// 성공 메시지 표시 함수
function showSuccessMessage(message) {
    removeFormError(); // 기존 메시지 제거
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #f0f9ff;
        color: #0369a1;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        border: 1px solid #bae6fd;
        animation: errorSlideIn 0.3s ease-out;
    `;
    
    // 활성화된 폼에 성공 메시지 추가
    const activeForm = document.querySelector('.login-form.active');
    if (activeForm) {
        const submitButton = activeForm.querySelector('.login-submit');
        activeForm.insertBefore(successDiv, submitButton);
    }
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        success: { bg: '#10b981', border: '#059669' },
        error: { bg: '#ef4444', border: '#dc2626' },
        info: { bg: '#3b82f6', border: '#2563eb' },
        warning: { bg: '#f59e0b', border: '#d97706' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        border-left: 4px solid ${color.border};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 애니메이션 CSS 추가
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 에러/성공 메시지 제거 함수
function removeFormError() {
    const existingMessages = document.querySelectorAll('.form-error, .form-success');
    existingMessages.forEach(message => message.remove());
}

// 연락처 입력 시 자동 하이픈 추가
function formatPhoneNumber(input) {
    let value = input.value.replace(/[^\d]/g, '');
    
    if (value.length >= 3 && value.length < 7) {
        value = value.replace(/(\d{3})(\d+)/, '$1-$2');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    }
    
    input.value = value;
}

// 로그인 관련 유틸리티 함수들
const LoginUtils = {
    // 이메일 유효성 검사
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 비밀번호 강도 검사
    validatePassword: function(password) {
        return password.length >= 8; // 최소 8자
    },
    
    // 로그인 시도 횟수 제한
    checkLoginAttempts: function(email) {
        const key = `login_attempts_${email}`;
        const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "lastAttempt": 0}');
        const now = Date.now();
        
        // 15분이 지나면 초기화
        if (now - attempts.lastAttempt > 15 * 60 * 1000) {
            attempts.count = 0;
        }
        
        return attempts.count < 5; // 최대 5회 시도
    },
    
    // 로그인 시도 기록
    recordLoginAttempt: function(email, success) {
        const key = `login_attempts_${email}`;
        const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "lastAttempt": 0}');
        
        if (success) {
            localStorage.removeItem(key); // 성공시 초기화
        } else {
            attempts.count++;
            attempts.lastAttempt = Date.now();
            localStorage.setItem(key, JSON.stringify(attempts));
        }
    }
};

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideLoginModal();
    }
});

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 세션 확인
    loadUserSession();
    
    // 페이지 로드 시 모달 HTML을 동적으로 로드하고 초기화
    const loginModalContainer = document.getElementById('loginModalContainer');
    if (loginModalContainer) {
        fetch('./components/login-modal.html')
            .then(response => response.text())
            .then(data => {
                loginModalContainer.innerHTML = data;
                initializeModal(); // 모달 로드 후 초기화
            })
            .catch(error => {
                console.error('로그인 모달 로드 오류:', error);
            });
    }
});

// 전역 함수로 내보내기 (HTML에서 onclick 사용을 위해)
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.showUserMenu = showUserMenu;
window.handleLogout = handleLogout;

console.log('로그인 시스템 초기화 완료');