/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

export {};

declare global {
  namespace Express {
    export type Payload = {
      msg?: string | Object;
      code?: number;
      data?: unknown;
    };
    export interface Response {
      invalid: (payload: Payload) => Response;
      failure: (payload: Payload) => Response;
      unauthorized: (payload: Payload) => Response;
      success: (payload: Payload) => Response;
    }
  }
}
