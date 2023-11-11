import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";

type Effect = "Allow" | "Deny";

const generatePolicy = (
  principalId: string,
  effect: Effect,
  resource: string
) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const main = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log("Event: ", event);

  const authorizationToken = event.authorizationToken;
  if (!authorizationToken) {
    return generatePolicy("user", "Deny", event.methodArn);
  }
  const encodedCreds = authorizationToken.split(" ")[1];
  const credentials = Buffer.from(encodedCreds, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  const expectedPassword = process.env[username];

  if (expectedPassword && expectedPassword === password) {
    return generatePolicy("user", "Allow", event.methodArn);
  }
  return generatePolicy("user", "Deny", event.methodArn);
};
