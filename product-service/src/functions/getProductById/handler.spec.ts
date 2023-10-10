import type { Context, Callback, APIGatewayProxyResult } from "aws-lambda";
import { getProductById } from "./handler";
import { ERROR_MESSAGE } from "../../constants";
import { mockProductData } from "./mockProductData";

describe("Get product by Id Page", () => {
  const context = {} as Context;
  const callback = null as Callback;
  const mockEvent: any = {
    pathParameters: {},
  };
  it("verify that API return product with certain id", async () => {
    mockEvent.pathParameters = {
      productId: "2",
    };

    const products = (await getProductById(
      mockEvent,
      context,
      callback
    )) as APIGatewayProxyResult;

    expect(products.body).toEqual(JSON.stringify(mockProductData[1]));
  });

  it("verify that API return correct error message when id is invalid", async () => {
    mockEvent.pathParameters = {
      productId: "invalid-productId",
    };

    const products = (await getProductById(
      mockEvent,
      context,
      callback
    )) as APIGatewayProxyResult;

    expect(products.body).toEqual(
      JSON.stringify({ error: ERROR_MESSAGE.PRODUCT_NOT_FOUND })
    );
  });
});
