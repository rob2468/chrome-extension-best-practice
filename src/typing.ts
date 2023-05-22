// ts 类型

/**
 * 待办数据缓存
 */
export type TodoDataList = Record[];
/**
 * 一条记录的数据模型为 { a: 1, b: 2, _c: 3 }。为方便处理，格式化为 [[a, 1], [b, 2], [_c: 3]]
 * 原始数据模型见 OriginRecord
 * 约定：以下划线开头的 key，该数据仅内部使用，不对用户展示
 */
export type Record = [string, string | number][];
export interface OriginRecord {
  _timeText: string; // 时间
  _timestamp: number; // 时间戳
  _url: string; // 页面链接
  _alarmName: string; // alerm 名称，唯一标识
  _notificationId: string;
  [key: string]: string | number;
}
