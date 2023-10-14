import schema from "./schema";
import { DynamoDB } from "aws-sdk";
import { HTTP_STATUSES, ERROR_MESSAGE } from "../../constants";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";
import { buildInternalServerErrorResponse } from "@/utils/error-handler";
import { middyfy } from "@/libs/lambda";

const dynamoDB = new DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  console.log("Incoming request:", event);

  try {
    const { productId } = event.pathParameters;

    const product = await dynamoDB
      .get({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId },
      })
      .promise();

    const stock = await dynamoDB
      .get({
        TableName: STOCKS_TABLE,
        Key: { product_id: productId },
      })
      .promise();

    if (!product.Item) {
      return {
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
        body: JSON.stringify({
          error: ERROR_MESSAGE.PRODUCT_NOT_FOUND,
        }),
      };
    }

    return formatJSONResponse({
      ...product.Item,
      count: stock.Item ? stock.Item.count : 0,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return buildInternalServerErrorResponse();
  }
};

export const main = middyfy(getProductById);
