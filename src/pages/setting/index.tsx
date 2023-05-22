// 设置页
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { STORAGE_KEY_SECRET_KEY } from '../../constants.js';
import './index.css';

function Setting() {
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    const getData = async () => {
      // 读缓存
      const storageData =
        (await chrome.storage.local.get([STORAGE_KEY_SECRET_KEY])) || {};
      // 初始化 UI
      setSecretKey(storageData[STORAGE_KEY_SECRET_KEY]);
    };
    getData();
  }, []);

  return (
    <div className="setting">
      <header>
        <h1>Checker</h1>
        <h2>checklist 助手</h2>
      </header>

      <div className="setting-form">
        <div className="secret-key">
          <label>OpenAI API secret key:</label>
          <input id="secret-key" type="text" value={secretKey} />
        </div>

        <button
          className="save"
          onClick={() => {
            const secretKey = (
              document?.getElementById('secret-key') as any
            )?.value?.trim();
            if (!secretKey) {
              return;
            }
            // 写缓存
            chrome.storage.local.set({ [STORAGE_KEY_SECRET_KEY]: secretKey });
          }}
        >
          保存
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Setting></Setting>
  </React.StrictMode>,
  document.getElementById('root')
);
