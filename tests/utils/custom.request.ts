import { app } from "../../src/app";
import { generateUserAuthToken } from "../../src/utils/security/token";
import request, { Response } from "supertest";

interface RequestParams<T> {
  path: string;
  method?: "get" | "post" | "patch" | "delete";
  payload?: Partial<T>;
  token?: string;
}

export const testBaseUrl = "/ts-template-service/v1";

//Wrapper around supertest request
export const customRequest = async <T = object>(
  params: RequestParams<T> | string
): Promise<Response> => {
  if (typeof params == "string") {
    const requestUrl = `${testBaseUrl}${params}`;
    //--> GET
    const accessToken = await getTokens(requestUrl);
    return request(app)
      .get(`${testBaseUrl}${params}`)
      .set("authorization", `bearer ${accessToken}`);
  }

  // Continue...
  const { path, method = "get", payload = {} } = params;
  let token = params.token;
  const requestUrl = `${testBaseUrl}${path}`;

  if (!params.token) {
    const accessToken = await getTokens(requestUrl);
    token = accessToken;
  }

  const bearerToken = `bearer ${token}`;
  if (method == "post")
    return request(app).post(requestUrl).send(payload).set("authorization", bearerToken);
  if (method == "patch")
    return request(app).patch(requestUrl).send(payload).set("authorization", bearerToken);
  if (method == "delete")
    return request(app).delete(requestUrl).send(payload).set("authorization", bearerToken);

  //--> GET
  return request(app).get(requestUrl).set("authorization", bearerToken);
};

const getTokens = async (url: string) => {
  if (url?.includes("/v1/auth/")) {
    const { access } = await generateUserAuthToken({ id: 1, name: "Developer Guy" });
    return access.token;
  }
};
