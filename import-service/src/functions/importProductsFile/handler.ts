import { S3 } from "aws-sdk";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@/libs/api-gateway";
import { middyfy } from "@/libs/lambda";

const s3 = new S3({ region: "eu-west-1" });

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  any
> = async (event) => {
  const { name } = event.queryStringParameters;

  if (!name) {
    return formatJSONResponse(
      { message: "Missing 'name' in the query parameters." },
      400
    );
  }

  const params = {
    Bucket: "shop-import-back-end",
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    return formatJSONResponse({ signedUrl });
  } catch (error) {
    console.error("Error occurred:", error);
    return formatJSONResponse({ message: "Internal Server Error" }, 500);
  }
};

export const main = middyfy(importProductsFile);
