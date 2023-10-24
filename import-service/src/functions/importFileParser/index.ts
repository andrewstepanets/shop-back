import { handlerPath } from "@/libs/handler-resolver";
import { AwsFunctionHandler } from "serverless/aws";

const handlerConfig: AwsFunctionHandler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "shop-import-back-end",
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }],
        existing: true,
      },
    },
  ],
};

export default handlerConfig;
