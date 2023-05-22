import { STORAGE_KEY_SECRET_KEY } from '../constants';
import logger from './logger';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';

export async function request(params: { text?: string }) {
  const { text } = params || {};
  if (!text) {
    logger.info('[GPTRequest] GPT 调用参数空');
    return;
  }

  // 获取 api key
  const storageData =
    (await chrome.storage.local.get([STORAGE_KEY_SECRET_KEY])) || {};
  const secretKey = storageData[STORAGE_KEY_SECRET_KEY];

  if (!secretKey) {
    logger.error('OpenAI API secret key 为空');
    return;
  }

  logger.info('[GPTRequest] 请求开始，请求参数:', text);

  let json;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s 超时

    const res = await fetch(OPENAI_ENDPOINT, {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'assistant',
            content: text,
          },
        ],
        temperature: 0,
        max_tokens: 2048,
        top_p: 1.0,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
        // stop: ['\n'],
      }),
    });
    json = await res.json();
  } catch (err) {
    logger.error('GPT 调用失败', (err as any)?.toString());
  }

  logger.info('[GPTRequest] 请求结束，返回结果:', json);

  return json;
}
