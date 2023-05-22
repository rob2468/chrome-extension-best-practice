import { marked } from 'marked';
import { OriginRecord } from '../typing';

/**
 * 将 markdown 文本中的表格数据转为 json 结构的数据
 * (函数中用到了 DOMParser API，需要在 web 环境中运行)
 */
export function tableToJSON(text: string) {
  if (!text) {
    return;
  }

  marked.use({
    mangle: false,
    headerIds: false,
  });

  // markdown 解析成 html
  const htmlText = marked.parse(text);

  // 解析 html
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlText, 'text/html');

  const tableEle = htmlDoc.querySelector('table');
  if (!tableEle) {
    return;
  }

  // 解析表头 (json key)
  const keysEle = tableEle.querySelectorAll('thead tr th');
  const keys = Array.from(keysEle).map((ele: any) => ele?.innerHTML?.trim());

  const arr: OriginRecord[] = [];

  // 解析表格数据
  const linesEle = tableEle.querySelectorAll('tbody tr');
  Array.from(linesEle).forEach((trEle) => {
    const values = Array.from(trEle.querySelectorAll('td'));

    const val: any = {};
    keys.forEach((key, index) => {
      val[key] = values?.[index]?.innerHTML?.trim();
    });
    arr.push(val);
  });

  return arr;
}
