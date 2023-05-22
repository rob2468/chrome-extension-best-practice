import React from 'react';
import { Button, List } from 'antd';
import dayjs from 'dayjs';
import { STORAGE_KEY_TODO_LIST_KEY } from '../../../../constants.js';
import { TodoDataList, OriginRecord } from '../../../../typing';
import logger from '../../../../utils/logger';
import './index.css';

export default function AllTab(props: {
  todoDataList: TodoDataList;
  refreshTodoData: any;
}) {
  const { todoDataList, refreshTodoData } = props;

  return (
    <div className="all-tab">
      <Button
        danger
        onClick={async () => {
          logger.info('清空待办 onClick');

          // 清空 alarm
          todoDataList.forEach((record) => {
            const [_, alarmName] =
              record.find(([key]) => key === '_alarmName') || [];
            chrome.alarms.clear(alarmName as string);
          });

          // 清除缓存
          await chrome.storage.local.set({ [STORAGE_KEY_TODO_LIST_KEY]: null });

          // 刷新
          refreshTodoData?.();
        }}
      >
        清空待办
      </Button>

      <List
        itemLayout="horizontal"
        dataSource={todoDataList}
        renderItem={(listEntries, index) => {
          // 拼接文案
          const textList = listEntries
            ?.filter(([key, _]) => !key.startsWith('_'))
            ?.map(([_, value]) => value);
          const text = textList.join(' | ');

          // 时间戳
          const item = Object.fromEntries(listEntries) as OriginRecord;
          const { _timestamp } = item || {};

          return (
            <List.Item>
              <List.Item.Meta
                title={<div dangerouslySetInnerHTML={{ __html: text }} />}
                description={dayjs(_timestamp).format('YYYY-MM-DD HH:mm')}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}
