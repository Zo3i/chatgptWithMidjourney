import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { auth, authMj } from "../../auth";
import { requestMidJourney } from "../../common";

async function createStream(res: Response) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk, { stream: true }));
      }
    },
  });
  return stream;
}

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

    // streaming response
    if (contentType.includes("stream")) {
      const stream = await createStream(api);
      const res = new Response(stream);
      res.headers.set("Content-Type", contentType);
      return res;
    }

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
