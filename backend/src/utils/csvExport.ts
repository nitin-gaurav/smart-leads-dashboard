interface CSVParser<T extends object> {
  parse(data: T[]): string;
}

interface Json2CSVModule {
  Parser: new <T extends object>(options: { fields: string[] }) => CSVParser<T>;
}

const { Parser } = require("json2csv") as Json2CSVModule;

export const buildCSVParser = (fields: string[]): CSVParser<object> => {
  return new Parser<object>({ fields });
};
