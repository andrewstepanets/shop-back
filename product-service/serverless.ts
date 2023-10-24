import getProductById from "@/functions/getProductById";
import getProductsList from "@/functions/getProductsList";
import createProduct from "@/functions/createProduct";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-auto-swagger",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: "products", // Adding these so all Lambdas can access these environment variables
      STOCKS_TABLE: "stocks",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:BatchGetItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
        ],
        Resource: "arn:aws:dynamodb:*:*:*",
      },
    ],
  },
  // Import the function via paths
  functions: {
    getProductById: {
      ...getProductById,
      environment: {
        PRODUCTS_TABLE: "products",
        STOCKS_TABLE: "stocks",
      },
    },
    getProductsList: {
      ...getProductsList,
      environment: {
        PRODUCTS_TABLE: "products",
        STOCKS_TABLE: "stocks",
      },
    },
    createProduct: {
      ...createProduct,
      environment: {
        PRODUCTS_TABLE: "products",
      },
    },
    populateData: {
      handler: "src/scripts/populateData.populateData",
      timeout: 10,
      environment: {
        PRODUCTS_TABLE: "products",
        STOCKS_TABLE: "stocks",
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
