import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { parseContent } from '../../util';
import { TAB_KEY } from '../../typing';
import './index.css';

const { TextArea } = Input;

export default function AdvancedTab(props: any) {
  const { changeTab } = props;

  const [textValue, setTextValue] = useState(`| --- | --- | --- | --- |
| 时间 | 事项 | 链接 | 灰度范围 |
| ----------- | ------------ | -------------------- | -------- |
| 5.16 18:46 | 活动主会场 | https://s.a.c/p/6 | 灰度 |
| 5月17日 16:00 | 活动主会场 | https://s.a.c/p/6 | 1~30% |
| 5月18号 16:00 | 活动主会场 | https://s.a.c/p/6 | 50%~100% |`);

  return (
    <div className="advanced-tab">
      <p>
        选择待办事项文本右击，然后选择 Checker -&gt; 生成待办。随后 Checker
        会调用 GPT API
        对待办事项文本进行结构化，然后持久化结构化后的数据，并在时间到达后通过
        Chrome 浏览器推送通知。实现细节见文档：
        <a href="" target="_blank">
          none
        </a>
      </p>
      <br />
      <p>
        当前 Checker 使用的模型是
        <a
          href="https://platform.openai.com/docs/models/gpt-3-5"
          target="_blank"
        >
          gpt-3.5-turbo
        </a>
        ，prompts 可以在
        <a href="log.html" target="_blank">
          日志
        </a>
        中看到。若默认生成的信息不符合预期，可与 ChatGPT 对话，调教 GPT
        给出正确答案。复制结果然后填入下面的输入框。
      </p>
      <p>
        (Checker 能够解析的内容是 markdown
        格式的表格，你也可以手动在下面的输入框中输入。)
      </p>

      <TextArea
        rows={6}
        defaultValue={textValue}
        onChange={(e) => {
          setTextValue(e?.target?.value || '');
        }}
      />
      <br />
      <br />
      <Button
        type="primary"
        onClick={async () => {
          await parseContent({ content: textValue });
          changeTab?.(TAB_KEY.ALL);
        }}
      >
        生成待办
      </Button>
    </div>
  );
}
