import schema from "./schema";
import { mockProductData } from "./mockProductData";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";
import { middyfy } from "@/libs/lambda";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  return formatJSONResponse(mockProductData);
};

export const main = middyfy(getProductsList);
