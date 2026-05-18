// CSV export helper.
import { ICSVParser, IJson2CSVModule } from "../types";

const { Parser } = require("json2csv") as IJson2CSVModule;

export const buildCSVParser = (fields: string[]): ICSVParser<object> => {
  return new Parser<object>({ fields });
};
