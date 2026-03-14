# 수강 신청 API 서버

## 빠른 시작

### 사전 요구사항

- **Docker Desktop** 설치 필요

### Docker로 실행 (권장)

```bash
# 1. API 애플리케이션 이미지 로드
docker load -i backend_mock.tar

# 2. 서버 실행
docker run --rm -p 8080:8080 backend_mock_for_assignment-api:latest
```

서버가 `http://localhost:8080`에서 실행됩니다.

---

## API 명세

### Base URL

```
http://localhost:8080/api
```

### 인증

일부 API는 JWT 토큰 인증이 필요합니다. 로그인 후 받은 토큰을 헤더에 포함해주세요.

```
Authorization: Bearer {accessToken}
```

---

## API 상세

### 1. 회원가입

새로운 사용자를 등록합니다.

**Request**

```
POST /api/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test1234",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "STUDENT"
}
```

| 필드     | 타입   | 필수 | 설명                                                   |
| -------- | ------ | ---- | ------------------------------------------------------ |
| email    | string | O    | 이메일 주소                                            |
| password | string | O    | 비밀번호 (6~10자, 영문+숫자 조합 필수)                 |
| name     | string | O    | 사용자 이름                                            |
| phone    | string | O    | 휴대폰 번호 (예: 010-1234-5678)                        |
| role     | string | O    | 회원 유형: `STUDENT` (수강생) 또는 `INSTRUCTOR` (강사) |

**Response** `201 Created`

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "STUDENT",
  "message": "회원가입이 완료되었습니다"
}
```

**Errors**

| Status | Code | Message                                                   |
| ------ | ---- | --------------------------------------------------------- |
| 400    | G001 | 이메일은 필수입니다                                       |
| 400    | G001 | 올바른 이메일 형식이 아닙니다                             |
| 400    | G001 | 비밀번호는 6~10자이며, 영문과 숫자를 모두 포함해야 합니다 |
| 400    | G001 | 이름은 필수입니다                                         |
| 400    | G001 | 휴대폰 번호는 필수입니다                                  |
| 400    | G001 | 올바른 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)    |
| 400    | G001 | 회원 유형은 STUDENT 또는 INSTRUCTOR만 가능합니다          |
| 409    | U001 | 이미 사용 중인 이메일입니다                               |

---

### 2. 로그인

사용자 인증 후 JWT 토큰을 발급받습니다.

**Request**

```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test1234"
}
```

**Response** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "role": "STUDENT"
  }
}
```

**Errors**

| Status | Code | Message                      |
| ------ | ---- | ---------------------------- |
| 404    | U002 | 사용자를 찾을 수 없습니다    |
| 401    | U003 | 비밀번호가 일치하지 않습니다 |

---

### 3. 강의 등록 (강사 전용)

새로운 강의를 등록합니다. **강사(INSTRUCTOR) 권한이 필요합니다.**

**Request**

```
POST /api/courses
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "React 기초 마스터",
  "description": "React의 기본 개념부터 Hooks까지 배웁니다.",
  "instructorName": "김강사",
  "maxStudents": 30,
  "price": 100000
}
```

| 필드           | 타입    | 필수 | 설명                      |
| -------------- | ------- | ---- | ------------------------- |
| title          | string  | O    | 강의 제목                 |
| description    | string  | X    | 강의 설명                 |
| instructorName | string  | O    | 강사 이름                 |
| maxStudents    | integer | O    | 최대 수강 인원 (1명 이상) |
| price          | integer | O    | 수강료 (0원 이상)         |

**Response** `201 Created`

```json
{
  "id": 7,
  "title": "React 기초 마스터",
  "description": "React의 기본 개념부터 Hooks까지 배웁니다.",
  "instructorName": "김강사",
  "maxStudents": 30,
  "currentStudents": 0,
  "availableSeats": 30,
  "isFull": false,
  "price": 100000,
  "createdAt": "2024-01-15T10:30:00"
}
```

**Errors**

| Status | Code | Message                                |
| ------ | ---- | -------------------------------------- |
| 400    | G001 | 강의 제목은 필수입니다                 |
| 400    | G001 | 강사명은 필수입니다                    |
| 400    | G001 | 최대 수강 인원은 1명 이상이어야 합니다 |
| 400    | G001 | 수강료는 0원 이상이어야 합니다         |
| 401    | A003 | 인증이 필요합니다                      |
| 403    | C003 | 강사만 강의를 등록할 수 있습니다       |

---

### 4. 강의 목록 조회

등록된 모든 강의를 조회합니다. 페이지네이션과 정렬을 지원합니다.

**Request**

```
GET /api/courses?page=0&size=10&sort=recent
```

| 파라미터 | 타입    | 기본값 | 설명                                                                              |
| -------- | ------- | ------ | --------------------------------------------------------------------------------- |
| page     | integer | 0      | 페이지 번호 (0부터 시작)                                                          |
| size     | integer | 10     | 페이지 크기                                                                       |
| sort     | string  | recent | 정렬 기준: `recent` (최신순), `popular` (신청자 많은 순), `rate` (신청률 높은 순) |

**Response** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "title": "부동산 투자 기초",
      "instructorName": "김투자",
      "maxStudents": 30,
      "currentStudents": 5,
      "availableSeats": 25,
      "isFull": false,
      "price": 100000,
      "createdAt": "2024-01-15T09:00:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 6,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

### 5. 강의 상세 조회

특정 강의의 상세 정보를 조회합니다.

**Request**

```
GET /api/courses/{courseId}
```

**Response** `200 OK`

```json
{
  "id": 1,
  "title": "부동산 투자 기초",
  "description": "부동산 투자의 기본 개념과 전략을 배웁니다.",
  "instructorName": "김투자",
  "maxStudents": 30,
  "currentStudents": 5,
  "availableSeats": 25,
  "isFull": false,
  "price": 100000,
  "createdAt": "2024-01-15T09:00:00"
}
```

**Errors**

| Status | Code | Message                 |
| ------ | ---- | ----------------------- |
| 404    | C001 | 강의를 찾을 수 없습니다 |

---

### 6. 수강 신청

강의에 수강 신청합니다. **인증이 필요합니다.**

**Request**

```
POST /api/courses/{courseId}/enroll
Authorization: Bearer {accessToken}
```

**Response** `201 Created`

```json
{
  "enrollmentId": 1,
  "courseId": 1,
  "courseTitle": "부동산 투자 기초",
  "instructorName": "김투자",
  "userId": 1,
  "userName": "홍길동",
  "enrolledAt": "2024-01-15T14:30:00",
  "message": "수강 신청이 완료되었습니다"
}
```

**Errors**

| Status | Code | Message                     |
| ------ | ---- | --------------------------- |
| 401    | A003 | 인증이 필요합니다           |
| 404    | C001 | 강의를 찾을 수 없습니다     |
| 400    | C002 | 수강 정원이 초과되었습니다  |
| 409    | E001 | 이미 수강 신청한 강의입니다 |

---

### 7. 배치 수강 신청

여러 강의를 한 번에 수강 신청합니다. **인증이 필요합니다.**

부분 성공을 지원하며, 일부 강의만 성공하더라도 해당 강의들은 수강 신청됩니다.

**Request**

```
POST /api/enrollments/batch
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "courseIds": [1, 2, 3, 6]
}
```

**Response** `200 OK`

```json
{
  "success": [
    {
      "enrollmentId": 1,
      "courseId": 1,
      "courseTitle": "부동산 투자 기초"
    },
    {
      "enrollmentId": 2,
      "courseId": 2,
      "courseTitle": "주식 투자 입문"
    }
  ],
  "failed": [
    {
      "courseId": 3,
      "reason": "이미 수강 신청한 강의입니다"
    },
    {
      "courseId": 6,
      "reason": "수강 정원이 초과되었습니다"
    }
  ]
}
```

**Errors**

| Status | Code | Message                   |
| ------ | ---- | ------------------------- |
| 400    | G001 | 강의 ID 목록은 필수입니다 |
| 401    | A003 | 인증이 필요합니다         |

---

## 사용 예시 (curl)

서버가 실행 중일 때 아래 명령어로 API를 테스트할 수 있습니다.

### 1. 서버 동작 확인

```bash
curl http://localhost:8080/api/courses
```

### 2. 회원가입

```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"테스트","phone":"010-1234-5678","role":"STUDENT"}'
```

### 3. 로그인 (토큰 발급)

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### 4. 강의 목록 조회 (페이지네이션)

```bash
# 최신순
curl "http://localhost:8080/api/courses?page=0&size=10&sort=recent"

# 인기순 (신청자 많은 순)
curl "http://localhost:8080/api/courses?page=0&size=10&sort=popular"

# 신청률순
curl "http://localhost:8080/api/courses?page=0&size=10&sort=rate"
```

### 5. 수강 신청 (토큰 필요)

```bash
# 로그인 응답에서 받은 accessToken을 사용
curl -X POST http://localhost:8080/api/courses/1/enroll \
  -H "Authorization: Bearer {accessToken}"
```

### 6. 배치 수강 신청 (토큰 필요)

```bash
curl -X POST http://localhost:8080/api/enrollments/batch \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"courseIds":[1,2,3]}'
```

### 7. 전체 플로우 테스트 (복사해서 사용)

```bash
# 회원가입
curl -s -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"Demo1234","name":"데모유저","phone":"010-9999-8888","role":"STUDENT"}'

echo ""

# 로그인 & 토큰 저장
TOKEN=$(curl -s -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"Demo1234"}' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:50}..."

# 수강 신청
curl -s -X POST http://localhost:8080/api/courses/1/enroll \
  -H "Authorization: Bearer $TOKEN"
```

---

## 샘플 데이터

서버 시작 시 다음 샘플 강의가 자동으로 등록됩니다:

| ID  | 강의명               | 강사     | 정원 | 현재 인원    | 수강료    |
| --- | -------------------- | -------- | ---- | ------------ | --------- |
| 1   | 부동산 투자 기초     | 김투자   | 30   | 0            | 100,000원 |
| 2   | 주식 투자 입문       | 이주식   | 50   | 0            | 150,000원 |
| 3   | 재테크 마스터 클래스 | 박재테크 | 20   | 0            | 200,000원 |
| 4   | 부동산 경매 실전     | 최경매   | 25   | 0            | 180,000원 |
| 5   | ETF 투자 전략        | 정ETF    | 40   | 0            | 120,000원 |
| 6   | 마감된 인기 강의     | 인기강사 | 5    | **5 (마감)** | 99,000원  |

> **참고**: ID 6번 강의는 정원이 마감된 상태입니다. 수강 신청 시 `C002` 에러가 발생합니다.

---

## 개발 도구

### Swagger UI (API 문서)

브라우저에서 API 명세를 확인하고 직접 테스트할 수 있습니다.

- **URL**: `http://localhost:8080/swagger-ui/index.html`

> 인증이 필요한 API 테스트 시, 우측 상단 **Authorize** 버튼을 클릭하고 로그인에서 받은 JWT 토큰을 입력하세요.

### H2 Console

인메모리 데이터베이스 조회가 가능합니다.

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:coursedb`
- Username: `sa`
- Password: (빈 값)

---

## 주의사항

1. **서버 재시작 시 데이터 초기화**: 인메모리 DB(H2)를 사용하므로 서버 재시작 시 모든 데이터가 초기화됩니다.
2. **동시 수강신청**: 동일 강의에 여러 사용자가 동시에 수강신청할 경우 정원 초과가 발생할 수 있습니다 (테스트 환경에서는 문제 없음).
3. **토큰 만료**: JWT 토큰은 24시간 후 만료됩니다. 만료 시 다시 로그인하세요.

---

## CORS 설정

프론트엔드 개발 시 CORS 문제 없이 API 호출이 가능하도록 모든 Origin을 허용하고 있습니다.

- Allowed Origins: `*`
- Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Allowed Headers: `*`
