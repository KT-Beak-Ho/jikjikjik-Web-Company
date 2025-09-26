// main.js - 메인 페이지 기능들

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 직직직 페이지 로드 완료');
    
    initializeAnimations();
    initializeInteractions();
    initializeScrollEffects();
});

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
                showNotification('서비스를 준비 중입니다! 🚀');
            }
        });
    });

    // 기본 시작하기 버튼들
    document.querySelectorAll('.btn-start, .btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('서비스를 준비 중입니다! 곧 만나요! ✨');
        });
    });

    // 액션 버튼들
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim();
            showNotification(`${text} 기능을 준비 중입니다! 📋`);
        });
    });
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

// 알림 표시 함수
function showNotification(message) {
    // 기존 알림이 있으면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: #3182f6;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        max-width: 300px;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
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

// 개발용 로깅
console.log('🎨 직직직 UI 시스템 초기화 완료');
console.log('📱 반응형 디자인 활성화');
console.log('✨ 인터랙션 애니메이션 준비됨');