import schema from "./schema";
import { mockProductData } from "./mockProductData";
import { ERROR_MESSAGE, HTTP_STATUSES } from "../../constants";
import { middyfy } from "@/libs/lambda";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { productId } = event.pathParameters;
  const mockProduct = mockProductData.find((p) => p.id === productId);
  if (!mockProduct) {
    return {
      statusCode: HTTP_STATUSES.NOT_FOUND_404,
      body: JSON.stringify({
        error: ERROR_MESSAGE.PRODUCT_NOT_FOUND,
      }),
    };
  }
  return formatJSONResponse(mockProduct);
};

export const main = middyfy(getProductById);
