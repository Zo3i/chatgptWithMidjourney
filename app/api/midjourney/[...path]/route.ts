import { NextRequest, NextResponse } from "next/server";
import { auth, authMj } from "../../auth";
import { requestMidJourney } from "../../common";

function formatResponse(msg: any) {
  const jsonMsg = ["```json\n", JSON.stringify(msg, null, "  "), "\n```"].join(
    "",
  );
  return new Response(jsonMsg);
}

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Midjourney Route] params ", params);

  const authResult = authMj(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const api = await requestMidJourney(req);

    const contentType = api.headers.get("Content-Type") ?? "";

    // try to parse error msg
    try {
      const mayBeErrorBody = await api.json();
      if (mayBeErrorBody.error) {
        console.error("[Midjourney Response] ", mayBeErrorBody);
        return formatResponse(mayBeErrorBody);
      } else {
        const res = new Response(JSON.stringify(mayBeErrorBody));
        res.headers.set("Content-Type", "application/json");
        res.headers.set("Cache-Control", "no-cache");
        return res;
      }
    } catch (e) {
      console.error("[Midjourney Parse] ", e);
      return formatResponse({
        msg: "invalid response from Midjourney server",
        error: e,
      });
    }
  } catch (e) {
    console.error("[Midjourney] ", e);
    return formatResponse(e);
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
