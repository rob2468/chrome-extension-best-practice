// 管理待办数据
import { STORAGE_KEY_TODO_LIST_KEY } from '../constants';
import { TodoDataList, OriginRecord } from '../typing';

/**
 * 获取所有数据
 */
export const getAllData = async () => {
  // 取缓存数据
  const storageData =
    (await chrome.storage.local.get([STORAGE_KEY_TODO_LIST_KEY])) || {};
  const todoDataList: TodoDataList =
    storageData[STORAGE_KEY_TODO_LIST_KEY] || [];
  return todoDataList;
};

/**
 * 根据 notificationId 检索数据
 */
export const getDataByNotificationId = async (notificationId: string) => {
  const todoDataList: TodoDataList = await getAllData();

  const target = todoDataList?.find((record) => {
    const data = Object.fromEntries(record);
    return data._notificationId === notificationId;
  });

  return (target && Object.fromEntries(target)) as OriginRecord | undefined;
};

/**
 * 根据 alarmName 检索数据
 */
export const getDataEntriesByAlarmName = async (alarmName: string) => {
  const todoDataList: TodoDataList = await getAllData();

  const target = todoDataList?.find((record) => {
    const data = Object.fromEntries(record);
    return data._alarmName === alarmName;
  });

  return target;
};

export const getDataByAlarmName = async (alarmName: string) => {
  const target = await getDataEntriesByAlarmName(alarmName);
  return (target && Object.fromEntries(target)) as OriginRecord | undefined;
};
