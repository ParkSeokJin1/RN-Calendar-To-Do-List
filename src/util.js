import dayjs from "dayjs";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-x-helper";

export const statusBarHeight = getStatusBarHeight();
export const bottomSpace = getBottomSpace(true);
export const ITEM_WIDTH = 220;

export const fillEmptyColumns = (columns, start, end) => {
  const filledColumns = columns.slice(0);

  // 1. 첫날 이전 공백 채우기
  const startDay = dayjs(start).get("day"); // 화 2
  for (let i = 1; i <= startDay; i += 1) {
    const date = dayjs(start).subtract(i, "day");
    filledColumns.unshift(date);
  }
  // 2. 마지막날 이후 공백 채우기
  const endDay = dayjs(end).get("day");
  /**
    0 -> 6
    1 -> 5
    2 -> 4
    endDay + ? = 6
   */
  for (let i = 1; i <= 6 - endDay; i += 1) {
    const date = dayjs(end).add(i, "day");
    filledColumns.push(date);
  }

  return filledColumns;
};
export const getCalendarColumns = (now) => {
  const start = dayjs(now).startOf("month"); // 11. 1
  const end = dayjs(now).endOf("month"); // 11.30
  const endDate = dayjs(end).get("date"); // 30

  const columns = [];
  for (let i = 0; i < endDate; i += 1) {
    const date = dayjs(start).add(i, "day");
    columns.push(date); // 총 30개
  }

  const filledColumns = fillEmptyColumns(columns, start, end); // columns 을 바탕으로 앞뒤를 채워주는 함수
  return filledColumns;
};

/**
 * @param day 0 ~ 6
 * @return 일~월
 */
const dayTexts = ["일", "월", "화", "수", "목", "금", "토"];
export const getDayText = (day) => {
  /* Ex 1 */
  return dayTexts[day];
};

export const getDayColor = (day) => {
  return day === 0 ? "#e67639" : day === 6 ? "#5872d1" : "#2b2b2b";
};
