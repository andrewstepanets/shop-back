import { APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { importProductsFile } from "./handler";
import AWSMock from "aws-sdk-mock";

describe("importProductsFile", () => {
  afterEach(() => {
    AWSMock.restore("S3");
  });

  it("should return a signed URL", async () => {
    AWSMock.mock("S3", "getSignedUrlPromise", (_action, _params, callback) => {
      callback(null, "signedUrlExample");
    });

    const event = {
      queryStringParameters: {
        name: "test.csv",
      },
    } as any;

    const context = {} as Context;
    const callback = null as Callback;

    const response = (await importProductsFile(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(
      "shop-import-back-end.s3.eu-west-1.amazonaws.com/uploaded/test.csv"
    );
  });

  it("should handle missing 'name' in the query parameters", async () => {
    const event = {
      queryStringParameters: {},
    } as any;
    const context = {} as Context;
    const callback = null as Callback;
    const response = (await importProductsFile(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(400);
  });

  it("returns a 200 status code when S3 successfully generate a signed URL", async () => {
    AWSMock.mock("S3", "getSignedUrlPromise", (_action, _params) => {
      return Promise.resolve("DistinctMockedURL");
    });

    const event = {
      queryStringParameters: {
        name: "test.csv",
      },
    } as any;
    const context = {} as Context;
    const callback = null as Callback;
    const response = (await importProductsFile(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
  });
});
