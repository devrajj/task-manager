export {};

declare global {
  namespace Interface {
    export type ApiResponse<Data> = {
      ok: boolean;
      data?: Data;
      err?: string;
    };
  }
}
