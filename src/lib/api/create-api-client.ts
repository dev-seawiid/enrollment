import type { KyInstance, Options } from "ky";
import type { ZodType } from "zod";

export interface ApiClient {
  get<T>(url: string, schema: ZodType<T>, options?: Options): Promise<T>;
  post<T>(url: string, schema: ZodType<T>, options?: Options): Promise<T>;
  put<T>(url: string, schema: ZodType<T>, options?: Options): Promise<T>;
  delete<T>(url: string, schema: ZodType<T>, options?: Options): Promise<T>;
}

/**
 * ky 인스턴스를 감싸서 Zod 스키마 검증이 강제되는 API 클라이언트를 생성합니다.
 * 스키마 없이 요청하면 컴파일 에러 — 런타임 검증 누락 방지.
 */
export function createApiClient(getInstance: () => KyInstance): ApiClient {
  function request(method: "get" | "post" | "put" | "delete") {
    return async <T>(url: string, schema: ZodType<T>, options?: Options): Promise<T> => {
      const json = await getInstance()[method](url, options).json();
      return schema.parse(json);
    };
  }

  return {
    get: request("get"),
    post: request("post"),
    put: request("put"),
    delete: request("delete"),
  };
}
