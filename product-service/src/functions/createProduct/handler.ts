import schema from "./schema";
import { DynamoDB } from "aws-sdk";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";
import { v4 as uuidv4 } from "uuid";
import {
  buildBadRequestResponse,
  buildInternalServerErrorResponse,
} from "@/utils/error-handler";
import { middyfy } from "@/libs/lambda";

const dynamoDB = new DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  console.log("Incoming request:", event);

  try {
    const { title, description, price, count } = event.body;

    if (
      !title ||
      !description ||
      typeof price !== "number" ||
      typeof count !== "number"
    ) {
      return buildBadRequestResponse("Invalid product data");
    }

    const productId = uuidv4();

    const product = {
      id: productId,
      title,
      description,
      price,
    };

    const stock = {
      product_id: productId,
      count,
    };

    const transactionParams = {
      TransactItems: [
        {
          Put: {
            TableName: PRODUCTS_TABLE,
            Item: product,
          },
        },
        {
          Put: {
            TableName: STOCKS_TABLE,
            Item: stock,
          },
        },
      ],
    };

    await dynamoDB.transactWrite(transactionParams).promise();

    return formatJSONResponse(product);
  } catch (error) {
    console.error("Error occurred:", error);
    return buildInternalServerErrorResponse();
  }
};

export const main = middyfy(createProduct);
