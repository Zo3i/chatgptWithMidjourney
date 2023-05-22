import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX } from "../constant";

const serverConfig = getServerSideConfig();

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

function parseApiKey(bearToken: string) {
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isOpenAiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  return {
    accessCode: isOpenAiKey ? "" : token.slice(ACCESS_CODE_PREFIX.length),
    apiKey: isOpenAiKey ? token : "",
  };
}

export function auth(req: NextRequest) {
  const authToken = req.headers.get("Authorization") ?? "";

  // check if it is openai api key or user token
  const { accessCode, apiKey: token } = parseApiKey(authToken);

  const hashedCode = md5.hash(accessCode ?? "").trim();

  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
    return {
      error: true,
      needAccessCode: true,
      msg: "Please go settings page and fill your access code.",
    };
  }

  // if user does not provide an api key, inject system api key
  if (!token) {
    const apiKey = serverConfig.apiKey;
    if (apiKey) {
      console.log("[Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${apiKey}`);
    } else {
      console.log("[Auth] admin did not provide an api key");
      return {
        error: true,
        msg: "Empty Api Key",
      };
    }
  } else {
    console.log("[Auth] use user api key");
  }

  return {
    error: false,
  };
}

export function authMj(req: NextRequest) {
  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  // 注入midjourneyAPI
  const midJourneyKey = req.headers.get("token")
    ? req.headers.get("token")
    : serverConfig.midJourneyKey;
  console.log(">>> 注入midjourneyAPI: ", midJourneyKey);
  if (midJourneyKey) {
    req.headers.set("token", midJourneyKey);
  } else {
    return {
      error: true,
      msg: "Empty Midjourney Api Key. Go to: [MidjourneyAPI](https://midjourneyapi.zxx.im/)",
    };
  }

  return {
    error: false,
  };
}
