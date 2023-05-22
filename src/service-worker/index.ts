import { request } from '../utils/gptRequest';
import { getCurrentTabInfo, setStorageDataByKey } from '../utils/index';
import {
  getDataEntriesByAlarmName,
  getDataByAlarmName,
} from '../utils/todoDataManager';
import logger from '../utils/logger';
import {
  STORAGE_KEY_GPT_RESULT_CACHE,
  STORAGE_KEY_GPT_RESULT_URL_CACHE,
} from '../constants';

const MENU_ITEM_ID = {
  CheckerWorkbench: 'CheckerWorkbench', // Checker设置
  GenerateTodo: 'GenerateTodo', // 生成待办
};

// context menu 点击事件
chrome.contextMenus.onClicked.addListener(genericOnClick);
async function genericOnClick(info: any) {
  logger.info('[click-context-menu]', info);

  const { menuItemId, selectionText } = info || {};
  if (menuItemId === MENU_ITEM_ID.CheckerWorkbench) {
    // Checker设置
    chrome.tabs.create({ url: 'setting.html' });
    return;
  }
  if (menuItemId === MENU_ITEM_ID.GenerateTodo) {
    // 生成待办
    // 获取选中的文本
    let text;
    const tabInfo = await getCurrentTabInfo();
    if (tabInfo?.id) {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tabInfo.id },
        func: () => {
          return window.getSelection()?.toString();
        },
      });
      text = res?.[0]?.result;
    }
    logger.info(
      `[${MENU_ITEM_ID.GenerateTodo}] 选中的内容，window.getSelection`,
      text,
      'contextMenus_selectionText:',
      selectionText
    );
    if (!text) {
      logger.warn(`[${MENU_ITEM_ID.GenerateTodo}] 选中的内容为空`);
      return;
    }
    // return;
    const data = await request({
      text: `${text}
--------------------------------
用表格来展示上述待办事项，需要满足如下要求：
1. 每一行都包含时间字段，并且时间需要解析到单独的字段中
2. 输出完整内容，不要有截断`,
    });
    const { choices } = data || {};
    const [choice] = choices || [];
    const { message } = choice || {};
    const { content } = message || {};
    // 缓存结果
    await setStorageDataByKey(STORAGE_KEY_GPT_RESULT_CACHE, content);
    await setStorageDataByKey(STORAGE_KEY_GPT_RESULT_URL_CACHE, tabInfo?.url);
    chrome.tabs.create({ url: 'popup.html' });
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Checker设置',
    contexts: ['all'],
    id: MENU_ITEM_ID.CheckerWorkbench,
  });

  chrome.contextMenus.create({
    title: '生成待办',
    contexts: ['selection'],
    id: MENU_ITEM_ID.GenerateTodo,
  });
});

// alarm 时间已到
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const { name } = alarm || {};
  const entries = await getDataEntriesByAlarmName(name);

  // 新建通知
  const textList = entries
    ?.filter(([key, _]) => !key.startsWith('_'))
    ?.map(([_, value]) => value);
  const message = (textList || []).join(' | ');
  chrome.notifications.create(name, {
    iconUrl: '/logo192.png',
    message,
    type: 'basic',
    title: 'Checker',
  });

  logger.info('alarm时间到', message);
});

// 点击 notification
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const data = await getDataByAlarmName(notificationId);
  const { _url: url } = data || {};
  url && chrome.tabs.create({ url });
});
