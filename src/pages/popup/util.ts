import {
  clearStorageDataByKey,
  getStorageDataByKey,
  getTimestampFromTimeText,
  uniqueId,
} from '../../utils/index';
import { tableToJSON } from '../../utils/mdUtil';
import { getAllData } from '../../utils/todoDataManager';
import {
  STORAGE_KEY_TODO_LIST_KEY,
  STORAGE_KEY_GPT_RESULT_CACHE,
  STORAGE_KEY_GPT_RESULT_URL_CACHE,
  TIME_KEY_CANDIDATE,
} from '../../constants.js';
import { OriginRecord, Record } from '../../typing';
import logger from '../../utils/logger';

export async function parseGPTResultIfNeeded() {
  // 取缓存
  const content = await getStorageDataByKey(STORAGE_KEY_GPT_RESULT_CACHE);
  const url = await getStorageDataByKey(STORAGE_KEY_GPT_RESULT_URL_CACHE);
  logger.info('[parseGPTResultIfNeeded] GPT Result', content);
  if (!content) {
    return;
  }

  await parseContent({ content, url });

  // 清除缓存
  await clearStorageDataByKey(STORAGE_KEY_GPT_RESULT_CACHE);
  await clearStorageDataByKey(STORAGE_KEY_GPT_RESULT_URL_CACHE);
}

export async function parseContent(params: { content: string; url?: string }) {
  const { content, url } = params || {};
  if (!content) {
    logger.warn('[parseContent] 入参空');
    return;
  }

  // markdown 表格转为 json
  const dataList = tableToJSON(content);

  if (!dataList?.length) {
    logger.warn(
      '[parseContent][tableToJSON] 内容转JSON为空',
      content,
      dataList
    );
    return;
  }

  // 保存
  await saveTodoList({ dataList, url });
}

// 保存待办
async function saveTodoList(params?: {
  dataList: OriginRecord[];
  url?: string;
}) {
  const { dataList, url } = params || {};
  if (!dataList || !dataList.length) {
    return;
  }

  logger.info('[saveTodoList] dataList:', dataList, 'url:', url);

  const newList: Record[] = []; // 新增的待办
  dataList.forEach((listItem) => {
    const entries: Record = Object.entries(listItem);

    // 解析出时间
    const timeEntry = entries.find(
      ([key, value]) =>
        TIME_KEY_CANDIDATE.find((e) => key.includes(e)) &&
        getTimestampFromTimeText(value as string)
    );
    if (!timeEntry) {
      logger.warn('[saveTodoList]未解析到时间字段', listItem);
      return;
    }

    const timeText = timeEntry[1] as string;
    const timestamp = getTimestampFromTimeText(timeText);
    logger.info('[saveTodoList]时间转时间戳', timeText, timestamp);
    if (!timestamp) {
      return;
    }

    // 新增时间字段
    entries.push(['_timeText', timeText]);
    // 新增时间戳字段
    entries.push(['_timestamp', timestamp]);
    // 新增 url 字段
    entries.push(['_url', url || '']);
    // 准备新建 alarm，用于发送 notification
    const alarmName = uniqueId();
    entries.push(['_alarmName', alarmName]);

    newList.push(entries);
  });

  if (!newList.length) {
    logger.warn('[saveTodoList] 新增待办为空');
    return;
  }

  // 更新缓存数据
  const todoDataList = await getAllData();
  chrome.storage.local.set({
    [STORAGE_KEY_TODO_LIST_KEY]: [...todoDataList, ...newList],
  });

  // 新建 alarm，用于发送 notification
  newList.forEach((entries) => {
    const data = Object.fromEntries(entries);
    const alarmName = data._alarmName as string;
    const timestamp = data._timestamp as number;
    chrome.alarms.create(alarmName, {
      when: timestamp,
    });
  });
}
