// 日志
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import { STORAGE_KEY_LOGGER_KEY } from '../../constants.js';
import './index.css';

function Log() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    refreshData();

    setInterval(() => {
      refreshData();
    }, 1000);
  }, []);

  const refreshData = async () => {
    // 读缓存
    const storageData =
      (await chrome.storage.local.get([STORAGE_KEY_LOGGER_KEY])) || {};
    // 更新 UI
    setLogs(storageData[STORAGE_KEY_LOGGER_KEY] || []);
  };

  return (
    <div className="log">
      <Button
        danger
        onClick={async () => {
          // 清除缓存
          await chrome.storage.local.set({ [STORAGE_KEY_LOGGER_KEY]: null });
          refreshData();
        }}
      >
        清空日志
      </Button>

      {
        // 按时间倒序展示日志
        logs.map((_, idx, array) => {
          const oneLine = array[array.length - 1 - idx];
          return <p key={idx}>{JSON.stringify(oneLine)}</p>;
        })
      }
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Log></Log>
  </React.StrictMode>,
  document.getElementById('root')
);
