// 日志
import dayjs from 'dayjs';
import { debounce } from './index';
import { STORAGE_KEY_LOGGER_KEY } from '../constants';

/**
 * 内存队列
 * 日志先保存到内存中，再定时写入缓存
 */
const queue: string[] = [];

const MAX_NUM = 1500; // 最多缓存的日志的条数

const _log = async (level: string, ...args: any[]) => {
  // 处理数据
  const result = [`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`, level];
  args.forEach((i) => {
    if (typeof i === 'string') {
      result.push(i);
    } else {
      result.push(JSON.stringify(i));
    }
  });
  const oneLog = result.join(' ');
  queue.push(oneLog);

  // todo 发布前注释掉 console.log
  console.log(oneLog);

  // 写缓存
  debounce(save, 500)();
};

async function save() {
  if (!queue?.length) {
    return;
  }

  // 取缓存
  const storageData =
    (await chrome.storage.local.get([STORAGE_KEY_LOGGER_KEY])) || {};
  const logList = storageData[STORAGE_KEY_LOGGER_KEY] || [];

  // 写缓存
  const data = [...logList, ...queue];
  const idx = data.length - MAX_NUM < 0 ? 0 : data.length - MAX_NUM;
  await chrome.storage.local.set({
    [STORAGE_KEY_LOGGER_KEY]: data.slice(idx),
  });

  while (queue.length) {
    queue.pop();
  }
}

const info = (...args: any[]) => {
  _log('[info]', ...args);
};

const warn = (...args: any[]) => {
  _log('[warn]', ...args);
};

const error = (...args: any[]) => {
  _log('[error]', ...args);
};

export default { info, warn, error };
