import { DatabaseExecuteHandler } from "@/models/utils/database";
import mysql, { ConnectionOptions, ResultSetHeader } from "mysql2";

const config: ConnectionOptions = {
  host: process.env.DATABASE_HOST as string,
  port: parseInt(process.env.DATABASE_PORT as string),
  database: process.env.DATABASE_NAME as string,
  user: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  insecureAuth: true,
};

export async function executeQuery({
  query,
  values,
}: DatabaseExecuteHandler) {
  try {
    const conn = mysql.createConnection(config);
    const [results] = await conn.promise().query<any | ResultSetHeader>(query, values);
    await conn.promise().end();
    return results;
  } catch (error) {
    return { error };
  }
}

export function isResultSetHeaderType(result: any): result is mysql.ResultSetHeader {
  return typeof result === 'object' && 'affectedRows' in result && 'insertId' in result;
}