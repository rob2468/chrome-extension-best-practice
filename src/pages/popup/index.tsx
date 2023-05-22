import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Tabs } from 'antd';
import AllTab from './components/AllTab';
import AdvancedTab from './components/AdvancedTab';
import { TAB_KEY } from './typing';
import { TodoDataList } from '../../typing';
import { parseGPTResultIfNeeded } from './util';
import { getAllData } from '../../utils/todoDataManager';
import './index.css';

// 页面组件
function Popup() {
  const [activeKey, setActiveKey] = useState(TAB_KEY.ALL);
  const [todoDataList, setTodoDataList] = useState<TodoDataList>([]);

  useEffect(() => {
    refreshTodoData();
  }, []);

  const changeTab = (key: TAB_KEY) => {
    setActiveKey(key);
    if (key === TAB_KEY.ALL) {
      refreshTodoData();
    }
  };

  const refreshTodoData = async () => {
    // 解析 GPT 结果
    await parseGPTResultIfNeeded();

    // 读缓存
    const todoDataList = await getAllData();
    setTodoDataList(todoDataList);
  };

  return (
    <div className="popup">
      <header>
        <a className="setting" href="setting.html" target="_blank">
          设置Checker
        </a>
        <a className="view-log" href="log.html" target="_blank">
          查看日志
        </a>
        <a className="new-page" href="popup.html" target="_blank">
          在新页面中打开
        </a>
      </header>

      <Tabs
        className="tabs"
        activeKey={activeKey}
        defaultActiveKey={activeKey}
        items={[
          {
            key: 'ALL',
            label: `所有待办`,
            children: (
              <AllTab
                todoDataList={todoDataList}
                refreshTodoData={refreshTodoData}
              />
            ),
          },
          {
            key: 'ADVANCED',
            label: `高级`,
            children: <AdvancedTab changeTab={changeTab} />,
          },
        ]}
        onChange={(key: string) => {
          changeTab(key as TAB_KEY);
        }}
      />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Popup></Popup>
  </React.StrictMode>,
  document.getElementById('root')
);
