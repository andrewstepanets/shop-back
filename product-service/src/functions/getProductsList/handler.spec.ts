import { APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { getProductsList } from "./handler";
import { mockProductData } from "./mockProductData";

describe("All products screen", () => {
  const event = {} as any;
  const context = {} as Context;
  const callback = null as Callback;

  it("verify that all products exist when user visit main page", async () => {
    const products = (await getProductsList(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(products.body).toEqual(JSON.stringify(mockProductData));
  });
});
