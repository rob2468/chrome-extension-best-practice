import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-cn';
import logger from './logger';

dayjs.extend(customParseFormat);

/**
 * 生成唯一 id
 */
export const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 获取当前标签页的信息
 */
export const getCurrentTabInfo = async () => {
  const tabInfo = await new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        resolve(tabs[0]);
      }
    );
  });

  return tabInfo as chrome.tabs.Tab | undefined;
};

/**
 * 根据时间文本，生成对应的时间戳
 */
export const getTimestampFromTimeText = (timeText: string) => {
  if (!timeText) {
    return;
  }
  let time = dayjs(timeText);
  if (!time.isValid()) {
    logger.warn('[getTimestampFromTimeText] invalid time1', timeText);

    // 时间转换失败，手动干预处理
    time = dayjs(timeText, ['YYYY年MM月DD日 HH:mm', 'MM月DD日 HH:mm', 'M月D日 HH:mm'], 'zh-cn');
    if (!time.isValid()) {
      logger.warn('[getTimestampFromTimeText] invalid time2', timeText);
      return;
    }
  }

  if (time.year() === 2001) {
    // 若没有年份，则设置为当前年
    // (2001 为 dayjs 的默认年份)
    time = time.year(dayjs().year());
  }
  return time.valueOf();
};

/**
 * 根据缓存 key，取缓存
 */
export const getStorageDataByKey = async (key: string) => {
  if (!key) {
    return;
  }

  // 取缓存数据
  const storageData = (await chrome.storage.local.get([key])) || {};
  return storageData[key];
};

/**
 * 根据缓存 key，写缓存
 */
export const setStorageDataByKey = async (key: string, value: any) => {
  if (!key) {
    return;
  }
  await chrome.storage.local.set({ [key]: value });
};

/**
 * 根据缓存 key，清除
 */
export const clearStorageDataByKey = async (key: string) => {
  setStorageDataByKey(key, null);
};

export function debounce(callback: any, timeout: number) {
  let timeoutID: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(...args), timeout);
  };
}
