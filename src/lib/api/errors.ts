import { HTTPError } from "ky";

// ── API Error Response ──

export interface ApiErrorBody {
  code: string;
  message: string;
}

// ── Error Codes ──

export const API_ERROR_CODE = {
  // General — 입력값 검증 실패 (400)
  VALIDATION: "G001",

  // User
  DUPLICATE_EMAIL: "U001", // 이미 사용 중인 이메일 (409)
  USER_NOT_FOUND: "U002", // 사용자를 찾을 수 없음 (404)
  WRONG_PASSWORD: "U003", // 비밀번호 불일치 (401)

  // Auth
  UNAUTHORIZED: "A003", // 인증이 필요함 (401)

  // Course
  COURSE_NOT_FOUND: "C001", // 강의를 찾을 수 없음 (404)
  COURSE_FULL: "C002", // 수강 정원 초과 (400)
  INSTRUCTOR_ONLY: "C003", // 강사만 등록 가능 (403)

  // Enrollment
  ALREADY_ENROLLED: "E001", // 이미 수강 신청한 강의 (409)
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

// ── 복구 가능한 에러 (Recoverable) ──
// 사용자가 조치 가능: 입력 수정, 다른 강의 선택 등
// UI에서 toast로 안내하고 현재 흐름 유지

export class RecoverableError extends Error {
  readonly code: string | null;

  constructor(message: string, code: string | null = null) {
    super(message);
    this.name = "RecoverableError";
    this.code = code;
  }
}

// ── 복구 불가능한 에러 (Unrecoverable) ──
// 시스템 레벨 문제: 네트워크 끊김, 응답 스키마 불일치, 서버 500
// Error Boundary로 전파

export class UnrecoverableError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "UnrecoverableError";
    this.cause = cause;
  }
}

// ── 에러 변환 ──

const RECOVERABLE_STATUS = new Set([400, 401, 403, 404, 409]);

/**
 * catch 블록에서 받은 에러를 RecoverableError 또는 UnrecoverableError로 변환합니다.
 *
 * - HTTP 4xx (400, 401, 403, 404, 409) → RecoverableError (서버 메시지 사용)
 * - HTTP 5xx, 네트워크 에러, Zod 파싱 에러 → UnrecoverableError
 */
export async function classifyError(err: unknown): Promise<RecoverableError | UnrecoverableError> {
  if (err instanceof RecoverableError || err instanceof UnrecoverableError) {
    return err;
  }

  if (err instanceof HTTPError) {
    const status = err.response.status;

    if (RECOVERABLE_STATUS.has(status)) {
      const body = await err.response.json<ApiErrorBody>().catch(() => null);
      return new RecoverableError(body?.message ?? "요청에 실패했습니다", body?.code ?? null);
    }

    // 5xx 등 서버 에러
    return new UnrecoverableError(`서버 오류가 발생했습니다 (${status})`, err);
  }

  // Zod 파싱 에러 (응답 스키마 불일치)
  if (err instanceof Error && err.name === "ZodError") {
    return new UnrecoverableError("서버 응답 형식이 예상과 다릅니다", err);
  }

  // 네트워크 에러 등
  return new UnrecoverableError("서버에 연결할 수 없습니다", err);
}

// ── 로그인 에러 ──

export const LOGIN_ERROR_CODE = {
  INVALID_CREDENTIALS: "invalid_credentials",
  SERVER_UNREACHABLE: "server_unreachable",
  UNKNOWN: "unknown",
} as const;

export type LoginErrorCode = (typeof LOGIN_ERROR_CODE)[keyof typeof LOGIN_ERROR_CODE];

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  [LOGIN_ERROR_CODE.INVALID_CREDENTIALS]: "이메일 또는 비밀번호가 일치하지 않습니다",
  [LOGIN_ERROR_CODE.SERVER_UNREACHABLE]: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요",
  [LOGIN_ERROR_CODE.UNKNOWN]: "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요",
};

/**
 * 에러를 분류하고, 복구 가능하면 메시지를 반환하고,
 * 복구 불가능하면 throw하여 Error Boundary로 전파합니다.
 */
export async function handleApiError(err: unknown): Promise<string> {
  const classified = await classifyError(err);

  if (classified instanceof RecoverableError) {
    return classified.message;
  }

  throw classified;
}
