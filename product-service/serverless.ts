import getProductById from "@/functions/getProductById";
import getProductsList from "@/functions/getProductsList";
import createProduct from "@/functions/createProduct";
import type { AWS } from "@serverless/typescript";
import catalogBatchProcess from "@/functions/catalogBatchProcess";

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
      {
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ],
        Resource: {
          "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: ["sns:Publish"],
        Resource: {
          Ref: "CreateProductTopic",
        },
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
    catalogBatchProcess: {
      ...catalogBatchProcess,
      environment: {
        CREATE_PRODUCT_TOPIC_ARN: {
          Ref: "CreateProductTopic",
        },
      },
    },
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: "AWS::SQS::Queue",
      },
      CreateProductTopic: {
        Type: "AWS::SNS::Topic",
      },
      EmailSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "andrii_stepanets@epam.com",
          TopicArn: {
            Ref: "CreateProductTopic",
          },
        },
      },
      LowStockEmailSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "andrii.stepanets@gmail.com",
          TopicArn: {
            Ref: "CreateProductTopic",
          },
          FilterPolicy: {
            count: [{ numeric: ["<", 10] }],
          },
        },
      },
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Value: {
          Ref: "CatalogItemsQueue",
        },
        Export: {
          Name: "CatalogItemsQueueUrl",
        },
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
