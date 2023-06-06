import { Api } from "@/pages/api/api";
import { useAsyncCallback } from "react-async-hook";
import { AbysApi } from "@/pages/api/abys/api";
import Http, { HttpOptions } from "@/pages/api/http-client";
import { config } from "../config";
import { AxiosInstance } from "axios";
import { UsersApi } from "@/pages/api/users/api";
import { AuthenticationApi } from "@/pages/api/Authentication/api";

import { getItem } from "../session-storage";

const HTTP_OPTIONS: HttpOptions = {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.value.APPTOKEN,
  },
  onRequest: (req: any) => {
    const accessToken = getItem<string | undefined>("AT");
    if (req.headers && accessToken)
      req.headers.Authorization = `Bearer ${accessToken}`;
  },
};

export const httpClient = new Http({
  ...HTTP_OPTIONS,
  baseURL: config.value.DEV_URL,
});

export const useApiCallBack = <R, A extends unknown>(
  asyncFn: (api: Api, args: A) => Promise<R>
) =>
  useAsyncCallback(async (args?: A) => {
    try {
      return await asyncFn(createApi(httpClient.client), args as A);
    } catch (error) {
      throw error;
    }
  });

function createApi(client: AxiosInstance) {
  return new Api(
    new AuthenticationApi(client),
    new AbysApi(client),
    new UsersApi(client)
  );
}
