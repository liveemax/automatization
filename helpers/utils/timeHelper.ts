import dayjs from "dayjs";

import { SLASH_DATE_FORMAT } from "../constants/date";

export const formatTimestampToDate = (timestamp: number, format = SLASH_DATE_FORMAT) => dayjs.unix(timestamp).format(format);
