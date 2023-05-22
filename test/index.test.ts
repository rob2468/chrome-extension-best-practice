import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { getTimestampFromTimeText } from '../src/utils/index';

describe('src/utils/index.js', () => {
  describe('getTimestampFromTimeText', () => {
    it('default', () => {
      expect(getTimestampFromTimeText('')).toEqual(undefined);

      let val = getTimestampFromTimeText('4.4 20:00');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-04-04T20:00:00+08:00Z`
      );

      val = getTimestampFromTimeText('2023.4.4 20:00');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `2023-04-04T20:00:00+08:00Z`
      );
    });
    it('有中文', () => {
      let val = getTimestampFromTimeText('05月17日 12:05');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-05-17T12:05:00+08:00Z`
      );

      val = getTimestampFromTimeText('05月18号 09:05');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-05-18T09:05:00+08:00Z`
      );

      val = getTimestampFromTimeText('05月19 09:06');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-05-19T09:06:00+08:00Z`
      );

      val = getTimestampFromTimeText('5月17日 16:00');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-05-17T16:00:00+08:00Z`
      );

      val = getTimestampFromTimeText('5月17号 16:00');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `${dayjs().year()}-05-17T16:00:00+08:00Z`
      );
    });
    it('有年份', () => {
      let val = getTimestampFromTimeText('2024年05月17日 12:05');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `2024-05-17T12:05:00+08:00Z`
      );

      val = getTimestampFromTimeText('2024年05月17号 12:05');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `2024-05-17T12:05:00+08:00Z`
      );

      val = getTimestampFromTimeText('2024年05月17 12:05');
      expect(dayjs(val).format('YYYY-MM-DDTHH:mm:ssZ[Z]')).toEqual(
        `2024-05-17T12:05:00+08:00Z`
      );
    });
  });
});
