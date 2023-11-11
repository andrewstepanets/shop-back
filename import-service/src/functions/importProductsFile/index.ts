import { handlerPath } from "@/libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:239661458827:function:authorization-service-dev-basicAuthorizer",
          type: "token",
          identitySource: "method.request.header.Authorization",
          resultTtlInSeconds: 0,
        },
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
};
