import {
  ModelConfig,
  ModelType,
  useAccessStore,
  useAppConfig,
  useChatStore,
} from "./store";
import { showToast } from "./components/ui-lib";
import { ACCESS_CODE_PREFIX } from "./constant";
import { RequestBody } from "./api/midjourney/RequestBody";
import { requestMidJourney } from "./api/common";

const TIME_OUT_MS = 60000;

const makeRequestImageParam = (
  action: string,
  fast: boolean,
  options?: {
    imageId: string | undefined;
    index: number | undefined;
    prompt: string | undefined;
  },
): RequestBody => {
  return <RequestBody>{
    action,
    fast,
    imageId: options?.imageId,
    index: options?.index,
    prompt: options?.prompt,
  };
};
export function getHeaders() {
  const accessStore = useAccessStore.getState();
  let headers: Record<string, string> = {};

  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  // mj key
  headers.token = accessStore.midJourneyKey;

  // use user's api key first
  if (validString(accessStore.token)) {
    headers.Authorization = makeBearer(accessStore.token);
  } else if (
    accessStore.enabledAccessControl() &&
    validString(accessStore.accessCode)
  ) {
    headers.Authorization = makeBearer(
      ACCESS_CODE_PREFIX + accessStore.accessCode,
    );
  }

  return headers;
}

export function requestOpenaiClient(path: string) {
  const openaiUrl = useAccessStore.getState().openaiUrl;
  return (body: any, method = "POST") =>
    fetch(openaiUrl + path, {
      method,
      body: body && JSON.stringify(body),
      headers: getHeaders(),
    });
}

export function requestMidjourney(path: string) {
  const midJourneyAPI = useAccessStore.getState().midJourneyAPI;
  return (body: any, method = "POST") =>
    fetch(midJourneyAPI + path, {
      method,
      body: body && JSON.stringify(body),
      headers: getHeaders(),
    });
}

export async function requestImage(
  action: string,
  fast: boolean,
  prompt?: string,
  index?: number,
  imageId?: string,
) {
  try {
    const midJourneyAPI = useAccessStore.getState().midJourneyAPI;
    prompt = prompt?.replaceAll("/mj", "");
    // mj 快慢制图
    fast = useAccessStore.getState().mjMode;
    const req: RequestBody = makeRequestImageParam(action, fast, {
      prompt,
      index,
      imageId,
    });

    const res = await requestMidjourney("/v1/request")(req);
    return res.json();
    // handle the response here, for example:
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function requestImageResult(taskId: string) {
  try {
    const midJourneyAPI = useAccessStore.getState().midJourneyAPI;
    const proxyUrl = useAccessStore.getState().proxyUrl;
    const path = "/v1/webhook/" + taskId + "?proxyUrl=" + proxyUrl;
    const res = await requestMidjourney(path)({});
    return res.json();
    // handle the response here, for example:
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function requestUsage() {
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDate = formatDate(startOfMonth);
  const endDate = formatDate(new Date(Date.now() + ONE_DAY));

  const [used, subs] = await Promise.all([
    requestOpenaiClient(
      `dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`,
    )(null, "GET"),
    requestOpenaiClient("dashboard/billing/subscription")(null, "GET"),
  ]);

  const response = (await used.json()) as {
    total_usage?: number;
    error?: {
      type: string;
      message: string;
    };
  };

  const total = (await subs.json()) as {
    hard_limit_usd?: number;
  };

  if (response.error && response.error.type) {
    showToast(response.error.message);
    return;
  }

  if (response.total_usage) {
    response.total_usage = Math.round(response.total_usage) / 100;
  }

  if (total.hard_limit_usd) {
    total.hard_limit_usd = Math.round(total.hard_limit_usd * 100) / 100;
  }

  return {
    used: response.total_usage,
    subscription: total.hard_limit_usd,
  };
}
