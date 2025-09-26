// main.js - 메인 페이지 기능들

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 직직직 페이지 로드 완료');
    
    initializeAnimations();
    initializeInteractions();
        
    initializeLogin();
});

// 로그인 초기화
function initializeLogin() {
    // 로그인 폼 제출 처리
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            const remember = formData.get('remember');
            
            // 간단한 유효성 검사
            if (!email || !password) {
                showNotification('이메일과 비밀번호를 입력해주세요!', 'error');
                return;
            }
            
            // 샘플 로그인 처리
            handleSampleLogin(email, password, remember);
        });
    }

    // 회원가입 링크 클릭
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function() {
            showNotification('회원가입 기능을 준비 중입니다!');
        });
    }

    // 비밀번호 찾기 링크
    const forgotLink = document.querySelector('.login-footer .login-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('비밀번호 찾기 기능을 준비 중입니다!');
        });
    }
}

// 애니메이션 초기화
function initializeAnimations() {
    // 숫자 카운트 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const text = stat.textContent.trim();
                    
                    if (text === '0%') {
                        animateNumber(stat, 0, 0, '%', 1000);
                    } else if (text === '3초') {
                        animateNumber(stat, 0, 3, '초', 1000);
                    } else if (text === '100%') {
                        animateNumber(stat, 0, 100, '%', 1500);
                    }
                });
                
                observer.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// 숫자 애니메이션 함수
function animateNumber(element, start, end, suffix = '', duration = 1000) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// 인터랙션 초기화
function initializeInteractions() {
    // 탭 전환 기능
    document.querySelectorAll('.site-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭에서 active 클래스 제거
            document.querySelectorAll('.site-tab').forEach(t => t.classList.remove('active'));
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            
            console.log('탭 전환:', this.textContent);
        });
    });

    // 필터 버튼 기능
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 필터 버튼에서 active 클래스 제거
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            console.log('필터 변경:', this.textContent);
        });
    });

    // 버튼 클릭 이벤트
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('데모 영상을 준비 중입니다! 🎬');
        });
    });

    // CTA 버튼들
    document.querySelectorAll('.btn-cta').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim();
            if (text.includes('상담')) {
                showNotification('상담 신청 기능을 준비 중입니다! 📞');
            } else {
                showLoginModal();
                //showNotification('서비스를 준비 중입니다! 🚀');
            }
        });
    });

    // 기본 시작하기 버튼들
    document.querySelectorAll('.btn-start, .btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            showLoginModal();
            //showNotification('서비스를 준비 중입니다! 곧 만나요! ✨');
        });
    });

    // 액션 버튼들
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim();
            showNotification(`${text} 기능을 준비 중입니다! 📋`);
        });
    });

    // 임금 관리 버튼들
    document.querySelectorAll('.btn-payment').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim();
            if (text === '선택 지급') {
                const checkedBoxes = document.querySelectorAll('.payment-checkbox:checked');
                if (checkedBoxes.length === 0) {
                    showNotification('지급할 직원을 선택해주세요! ✅');
                } else {
                    showNotification(`${checkedBoxes.length}명 선택 지급을 처리 중입니다! 💰`);
                }
            } else if (text === '일괄 지급') {
                showNotification('전체 일괄 지급을 처리 중입니다! 💸');
            }
        });
    });

    // 서류 카드 클릭 이벤트
    document.querySelectorAll('.document-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.document-title').textContent;
            showNotification(`${title} 자동 생성 기능을 준비 중입니다! 📄`);
        });
    });

    // 체크박스 전체 선택/해제 기능
    let allChecked = false;
    const selectAllButton = document.createElement('button');
    selectAllButton.textContent = '전체 선택';
    selectAllButton.className = 'btn-select-all';
    selectAllButton.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 8px 16px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    `;
    
    // const paymentList = document.querySelector('.payment-list');
    // if (paymentList) {
    //     paymentList.style.position = 'relative';
    //     paymentList.appendChild(selectAllButton);
        
    //     selectAllButton.addEventListener('click', function() {
    //         allChecked = !allChecked;
    //         const checkboxes = document.querySelectorAll('.payment-checkbox');
    //         checkboxes.forEach(checkbox => {
    //             checkbox.checked = allChecked;
    //         });
            
    //         this.textContent = allChecked ? '전체 해제' : '전체 선택';
    //         this.style.background = allChecked ? '#3182f6' : '#f0f0f0';
    //         this.style.color = allChecked ? 'white' : '#333';
            
    //         showNotification(allChecked ? '전체 선택됨' : '전체 해제됨');
    //     });
    // }
}

// 스크롤 효과 초기화
function initializeScrollEffects() {
    // 헤더 스크롤 효과
    let lastScrollY = 0;
    
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        }
        
        lastScrollY = currentScrollY;
    });

    // 부드러운 스크롤 네비게이션
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 헤더 높이 고려
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                console.log('스크롤 이동:', targetId);
            }
        });
    });

    // 스크롤 시 요소 페이드인 효과
    const fadeInElements = document.querySelectorAll('.dashboard-card, .feature-content, .site-item');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        fadeInObserver.observe(element);
    });
}

// 알림 표시 함수 (개선된 버전)
function showNotification(message, type = 'info') {
    // 기존 알림이 있으면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 타입별 색상 설정
    const colors = {
        success: { bg: '#10b981', icon: '✅' },
        error: { bg: '#ef4444', icon: '❌' },
        warning: { bg: '#f59e0b', icon: '⚠️' },
        info: { bg: '#3182f6', icon: '💡' }
    };

    const color = colors[type] || colors.info;

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-icon">${color.icon}</span>
        <span class="notification-text">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${color.bg};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        backdrop-filter: blur(10px);
    `;

    // 애니메이션 키프레임 추가
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // 3초 후 제거
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);

    // 클릭으로 제거
    notification.addEventListener('click', () => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 200);
        }
    });
}

// 유틸리티 함수들
const utils = {
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 스로틀 함수
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 요소가 뷰포트에 있는지 확인
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// 로그인 모달 표시/숨기기
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// 샘플 로그인 처리
function handleSampleLogin(email, password, remember) {
    // 샘플 계정들
    const sampleUsers = [
        { email: 'admin@demo.com', password: 'admin123', name: '관리자', company: '데모건설' },
        { email: 'manager@test.com', password: 'test123', name: '김매니저', company: '테스트건설' },
        { email: 'user@sample.com', password: 'sample123', name: '이담당', company: '샘플건설' }
    ];
    
    // 로그인 시뮬레이션
    showNotification('로그인 중입니다...', 'info');
    
    setTimeout(() => {
        const user = sampleUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 로그인 성공
            showNotification(`환영합니다, ${user.name}님!`, 'success');
            hideLoginModal();
            
            // 로그인 상태 표시 (간단한 데모)
            updateUIForLoggedInUser(user);
        } else {
            // 로그인 실패
            showNotification('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
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
            };
        }
    });
    
    // 헤더에 사용자 정보 표시
    const nav = document.querySelector('nav');
    if (nav && !nav.querySelector('.user-info')) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span class="user-name">${user.name}</span>
            <span class="user-company">${user.company}</span>
        `;
        userInfo.style.cssText = `
            display: flex;
            flex-direction: column;
            text-align: right;
            margin-right: 16px;
            font-size: 14px;
        `;
        
        const startBtn = nav.querySelector('.btn-start');
        nav.insertBefore(userInfo, startBtn);
    }
}

// 모달 외부 클릭으로 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('loginModal');
    if (e.target === modal) {
        hideLoginModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideLoginModal();
    }
});