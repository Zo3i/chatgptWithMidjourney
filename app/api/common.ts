import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
const MIDJOURNEY_URL = process.env.MIDJOURNEY_API_URL;

export async function requestOpenai(req: NextRequest) {
  const authValue = req.headers.get("Authorization") ?? "";
  console.log(">>>> [OpenAI Request] ", req);
  const openaiPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
    "/api/openai/",
    "",
  );

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  console.log("[Proxy] ", openaiPath);
  console.log("[Base Url]", baseUrl);

  if (process.env.OPENAI_ORG_ID) {
    console.log("[Org ID]", process.env.OPENAI_ORG_ID);
  }

  if (!authValue || !authValue.startsWith("Bearer sk-")) {
    console.error("[OpenAI Request] invalid api key provided", authValue);
  }

  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authValue,
      ...(process.env.OPENAI_ORG_ID && {
        "OpenAI-Organization": process.env.OPENAI_ORG_ID,
      }),
    },
    cache: "no-store",
    method: req.method,
    body: req.body,
  });
}

export async function requestMidJourney(req: NextRequest) {
  const token = req.headers.get("token") ?? "";
  const reqPath = `${req.nextUrl.pathname}`.replaceAll("/api/midjourney/", "");
  console.log(">>>> [MidJourney Request] ", reqPath);
  const midJourneyAPIPath = `${MIDJOURNEY_URL}` + reqPath;
  console.log(">>> 画图", midJourneyAPIPath);
  if (!token) {
    console.error("[Midjourney Request] invalid api key provided", token);
  }

  return fetch(midJourneyAPIPath, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    cache: "no-store",
    method: req.method,
    body: req.body,
  });
}
