// auth.js - 인증 관련 API 서비스 (TypeScript에서 변환)

class AuthService {
    constructor() {
        // 환경변수에서 API URL 가져오기
        this.loadConfigFromServer();
        this.baseUrl = this.getApiUrl();
        console.log('AuthService 초기화, API URL:', this.baseUrl);
    }

    /**
     * 환경변수 또는 설정에서 API URL 가져오기
     */
     getApiUrl() {
        // 브라우저 환경에서 전역 변수 확인 (우선순위 1)
        if (typeof window !== 'undefined' && window.API_BASE_URL) {
            console.log(window.API_BASE_URL);
            return window.API_BASE_URL;
        }
        
        // 서버에서 주입된 ENV 객체 확인 (우선순위 2)
        if (typeof window !== 'undefined' && window.ENV && window.ENV.API_BASE_URL) {
            return window.ENV.API_BASE_URL;
        }
        
        
        // 기본값 (우선순위 4) - 브라우저 환경에서는 기본 URL 사용
        return window.API_BASE_URL;
    }

    async loadConfigFromServer() {
        try {
            console.log('서버에서 환경변수 로드 시도...');
            const response = await fetch('/api/config');
            
            if (response.ok) {
                const config = await response.json();
                console.log('서버 환경변수 로드 성공:', config);
                
                if (config.API_BASE_URL && config.API_BASE_URL !== this.baseUrl) {
                    console.log('API URL 업데이트:', this.baseUrl, '->', config.API_BASE_URL);
                    this.setBaseUrl(config.API_BASE_URL);
                    
                    // 전역 변수에도 설정
                    if (typeof window !== 'undefined') {
                        window.API_BASE_URL = config.API_BASE_URL;
                    }
                }
                
                return config;
            } else {
                console.warn('서버 환경변수 로드 실패:', response.status, response.statusText);
            }
        } catch (error) {
            console.warn('서버에서 환경변수를 가져올 수 없습니다:', error.message);
        }
        return null;
    }

    /**
     * 현재 API URL 반환
     */
    getBaseUrl() {
        return this.baseUrl;
    }

    /**
     * API URL 동적 변경 (개발/테스트용)
     */
    setBaseUrl(url) {
        this.baseUrl = url;
        console.log('API URL 변경됨:', url);
    }

    /**
     * 로그인 API 호출
     */
    async login(credentials) {
        try {
            console.log('로그인 시도:', { loginIdOrPhone: credentials.loginIdOrPhone });
            
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const responseData = await response.json();

            if (!response.ok) {
                // API 에러 응답 처리 - 백엔드 메시지를 그대로 사용
                if (responseData.data && responseData.data.errorMessage) {
                    const apiError = {
                        message: responseData.data.errorMessage, // 백엔드에서 제공하는 메시지 그대로 사용
                        status: response.status,
                        code: responseData.data.code,
                        errorType: responseData.data.status
                    };
                    throw apiError;
                } else {
                    // 예상치 못한 에러 형식
                    throw {
                        message: responseData.message || `서버 오류가 발생했습니다. (${response.status})`,
                        status: response.status
                    };
                }
            }

            console.log('로그인 성공');
            return responseData;
        } catch (error) {
            console.error('로그인 실패:', error);
            
            // 이미 ApiError 형태라면 그대로 throw
            if (error && typeof error === 'object' && 'message' in error) {
                throw error;
            }
            
            // 네트워크 오류 등
            throw {
                message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
                status: 0
            };
        }
    }

    /**
     * API 에러 메시지 반환 (백엔드 메시지를 그대로 사용)
     */
    getErrorMessage(error) {
        // 백엔드에서 제공하는 에러 메시지를 그대로 반환
        if (error.message) {
            return error.message;
        }

        // 네트워크 오류 등 예외적인 경우만 기본 메시지 사용
        switch (error.status) {
            case 0:
                return '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
            case 500:
                return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            case 503:
                return '서비스가 일시적으로 이용할 수 없습니다.';
            default:
                return '알 수 없는 오류가 발생했습니다.';
        }
    }

    /**
     * 디바이스 토큰 생성 (UUID 기반)
     */
    generateDeviceToken() {
        return 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 로컬 스토리지에 토큰 저장
     */
    saveTokens(accessToken, refreshToken, memberId, role) {
        const tokenData = {
            accessToken,
            refreshToken,
            memberId,
            role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('jikjikjik_tokens', JSON.stringify(tokenData));
        console.log('토큰 저장 완료');
    }

    /**
     * 저장된 토큰 가져오기
     */
    getStoredTokens() {
        try {
            const tokenData = localStorage.getItem('jikjikjik_tokens');
            if (!tokenData) return null;
            
            const parsed = JSON.parse(tokenData);
            
            // 24시간 이내 토큰만 유효
            const loginTime = new Date(parsed.loginTime);
            const now = new Date();
            const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                console.log('토큰 만료, 삭제');
                this.clearTokens();
                return null;
            }
            
            return parsed;
        } catch (error) {
            console.error('토큰 파싱 오류:', error);
            this.clearTokens();
            return null;
        }
    }

    /**
     * 토큰 삭제
     */
    clearTokens() {
        localStorage.removeItem('jikjikjik_tokens');
        localStorage.removeItem('jikjikjik_user'); // 기존 사용자 정보도 삭제
        console.log('토큰 삭제 완료');
    }

    /**
     * 인증된 API 요청을 위한 헤더 생성
     */
    getAuthHeaders() {
        const tokens = this.getStoredTokens();
        if (!tokens) {
            throw {
                message: '로그인이 필요합니다.',
                status: 401,
                errorType: 'UNAUTHORIZED'
            };
        }

        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokens.accessToken}`
        };
    }

    /**
     * 토큰 갱신 (refresh token 사용)
     */
    async refreshToken() {
        try {
            const tokens = this.getStoredTokens();
            if (!tokens) return false;

            const response = await fetch(`${this.baseUrl}/reissue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Authorization': `Bearer ${tokens.refreshToken}`
                },
                body: JSON.stringify({"refreshToken": tokens.refreshToken})          
            });

            if (response.ok) {
                const newTokenData = await response.json();
                this.saveTokens(
                    newTokenData.data.accessToken,
                    newTokenData.data.refreshToken,
                    tokens.memberId,
                    tokens.role
                );
                console.log('토큰 갱신 완료');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            return false;
        }
    }

    /**
     * 로그아웃
     */
    // async logout() {
    //   try {
    //     const tokens = this.getStoredTokens();
    //     if (tokens) {
    //       // 서버에 로그아웃 요청 (선택사항)
    //       await fetch(`${this.baseUrl}/logout`, {
    //         method: 'POST',
    //         headers: this.getAuthHeaders()
    //       });
    //     }
    //   } catch (error) {
    //     console.error('로그아웃 API 호출 실패:', error);
    //   } finally {
    //     // 로컬 토큰은 항상 삭제
    //     this.clearTokens();
    //   }
    // }

    /**
     * 현재 로그인 상태 확인
     */
    isLoggedIn() {
        return this.getStoredTokens() !== null;
    }

    /**
     * 회원가입 API 호출
     */
    async join(request, signatureImage = '') {
        try {
            console.log('회원가입 시도');

            const formData = new FormData();
            formData.append('request', JSON.stringify(request));
            formData.append('signatureImage', signatureImage);

            const response = await fetch(`${this.baseUrl}/join/company/join`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.data && responseData.data.errorMessage) {
                    const apiError = {
                        message: responseData.data.errorMessage,
                        status: response.status,
                        code: responseData.data.code,
                        errorType: responseData.data.status
                    };
                    throw apiError;
                } else {
                    throw {
                        message: responseData.message || `서버 오류가 발생했습니다. (${response.status})`,
                        status: response.status
                    };
                }
            }

            console.log('회원가입 성공');
            return responseData;
        } catch (error) {
            console.error('회원가입 실패:', error);

            if (error && typeof error === 'object' && 'message' in error) {
                throw error;
            }

            throw {
                message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
                status: 0
            };
        }
    }
}

// 전역 인스턴스 생성
const authService = new AuthService();

// 브라우저 환경에서 전역 객체에 추가
if (typeof window !== 'undefined') {
    window.authService = authService;
    window.AuthService = AuthService;
    
    // 로드 완료 이벤트 발생
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('authServiceReady', { 
            detail: { authService, AuthService } 
        }));
        console.log('✅ authService 전역 등록 완료');
    }, 0);
}

// ES6 모듈 방식 export (필요한 경우)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService, authService };
}

console.log('📦 auth.js 로드 완료');