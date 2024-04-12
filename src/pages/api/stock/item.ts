import Errors from "@/models/common/error/error-list";
import { CreateItemModel, ItemModel } from "@/models/stock/item";
import { DatabaseExecuteHandler } from "@/models/utils/database";
import { executeQuery, isResultSetHeaderType } from "@/utils/database";
import { isCustomError } from "@/utils/error";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "POST") {
      try {
        const payload: CreateItemModel = JSON.parse(req.body);
        if (
          !payload.name ||
          payload.name === "" ||
          !payload.id ||
          payload.id === "" ||
          !payload.amount ||
          payload.amount < 0 ||
          !payload.price ||
          payload.price < 0 ||
          !payload.created_by ||
          payload.created_by === "" ||
          !payload.created_at
        )
          throw Errors.MissingRequest;
        const statement: DatabaseExecuteHandler = {
          query: `${"INSERT INTO stock(id, name, amount, price, created_by, created_at) VALUES(?, ?, ?, ?, ? ,?)"}`,
          values: [
            payload.id,
            payload.name,
            payload.amount,
            payload.price,
            payload.created_by,
            payload.created_at,
          ],
        };
        const result = await executeQuery(statement);
        if (isResultSetHeaderType(result) && result.affectedRows > 0) {
          res.status(201).send(null);
        } else throw Errors.SQL;
      } catch (error) {
        throw Errors.SQL;
      }
    } else if (req.method === "GET") {
      try {
        const statement: DatabaseExecuteHandler = {
          query: `${"SELECT * FROM stock"}`,
          values: [],
        };
        const result: ItemModel[] = await executeQuery(statement);
        if (result.length > 0) res.status(200).send(result);
        else if (result.length === 0) res.status(204).send(null);
        else throw Errors.SQL;
      } catch (error) {
        throw Errors.SQL;
      }
    } else if (req.method === "PUT") {
      // Handle any other HTTP method u
      res.status(200).send(null);
    } else if (req.method === "DELETE") {
      // Handle any other HTTP method d
      res.status(200).send(null);
    } else {
      throw Errors.InvalidHTTPMethod;
    }
  } catch (err) {
    console.error(err);
    if (isCustomError(err))
      res.status(err.http_status_code).send(err.getDetails());
    else res.status(500).send(Errors.Unknown.getDetails());
  }
}
