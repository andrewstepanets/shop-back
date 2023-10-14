import schema from "./schema";
import { DynamoDB } from "aws-sdk";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";
import { Product } from "@/types/api-types";
import { buildInternalServerErrorResponse } from "@/utils/error-handler";
import { middyfy } from "@/libs/lambda";

const dynamoDB = new DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  console.log("Incoming request");

  try {
    const products = await dynamoDB
      .scan({ TableName: PRODUCTS_TABLE })
      .promise();
    const stocks = await dynamoDB.scan({ TableName: STOCKS_TABLE }).promise();

    const joinedProducts: Product[] = products.Items.map((product) => {
      const stock = stocks.Items.find((s) => s.product_id === product.id);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stock ? stock.count : 0,
      };
    });

    return formatJSONResponse(joinedProducts);
  } catch (error) {
    console.error("Error occurred:", error);
    return buildInternalServerErrorResponse();
  }
};

export const main = middyfy(getProductsList);
