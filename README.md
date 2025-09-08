# jikjikjik-Web-Company
🏢 직직직 기업용 채용 플랫폼 - AI 기반 스마트 매칭으로 최적의 인재를 찾는 기업 전용 채용 솔루션, 올인원 채용/노무 관리 시스템.

# 직직직 기업용 플랫폼 🏢

## 🚀 프로젝트 소개

직직직 기업용 플랫폼은 AI 기반 스마트 매칭으로 최적의 인재를 찾는 기업 전용 채용 솔루션입니다.
채용부터 노무 관리까지 모든 인사 업무를 하나의 플랫폼에서 처리할 수 있는 올인원 채용/노무 관리 시스템을 제공합니다.

## ✨ 주요 기능

### 📋 채용 공고 관리
- **간편한 공고 등록**: 직무별 맞춤 템플릿 제공
- **실시간 지원 현황**: 지원자 수, 조회수 등 상세 분석
- **공고 자동 갱신**: 마감일 관리 및 알림 기능

### 🎯 스마트 매칭
- **AI 기반 추천**: 공고에 최적화된 인재 자동 추천
- **스킬 기반 필터링**: 필요 기술과 경험 기준 정밀 검색
- **적합도 점수**: 각 지원자별 매칭 점수 제공

### 📊 채용 분석
- **채용 대시보드**: 실시간 채용 현황 모니터링
- **성과 리포트**: 채용 효율성 및 비용 분석
- **시장 트렌드**: 업계별 채용 동향 분석

### 📄 전자 문서 자동 관리
- **근로계약서 관리**: 디지털 계약서 작성 및 전자서명
- **출입신고서**: 건설현장 출입신고 자동화
- **일급 자동 계산**: 출퇴근 기록 기반 실시간 급여 계산

### 📊 노무 관리 대시보드
- **근태 관리**: 출퇴근, 휴게시간 실시간 모니터링
- **현장별 인력 현황**: 배치 인원 및 출근 현황 관리
- **안전 관리**: 안전교육 이수 현황 및 사고 이력 추적

## 📖 API 문서: NodeJS+TS+Fastify

### 설치
```
git clone git@github.com:KT-Beak-Ho/jikjikjik-Web-Worker.git
cd jikjikjik-Web-Worker

# 서브모듈 초기화 및 clone
git submodule update --init --recursive

npm i fastify @fastify/cors @fastify/helmet @fastify/rate-limit fastify-type-provider-zod zod dotenv
npm i -D typescript tsx @types/node pino-pretty
npm i @fastify/static
```

### 싫행
```
npm run dev

localhost:3000/
```
### 주요 엔드포인트

```
GET    /api/jobs              # 채용공고 목록
POST   /api/jobs              # 채용공고 등록
GET    /api/jobs/:id          # 채용공고 상세
PUT    /api/jobs/:id          # 채용공고 수정

GET    /api/applications      # 지원서 목록
POST   /api/applications      # 지원서 처리
GET    /api/applications/:id  # 지원서 상세

GET    /api/analytics         # 채용 분석 데이터
GET    /api/recommendations   # AI 추천 인재
```

## 📞 지원 및 문의

- **이메일**: enterprise-support@jikjikjik.co.kr
- **문서**: https://docs.jikjikjik.co.kr/enterprise
- **이슈 트래커**: https://github.com/your-org/jikjikjik-enterprise/issues

## 🗺 로드맵

### 2025 Q1
- [ ] 다국어 지원 (영어, 중국어)
- [ ] 모바일 앱 출시

### 2024 Q2
- [ ] AI 면접 분석 도구
- [ ] 채용 자동화 워크플로
- [ ] API 플랫폼 오픈
