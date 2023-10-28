import { SQSEvent } from "aws-lambda";
import { SNS, DynamoDB } from "aws-sdk";

const sns = new SNS({ region: process.env.REGION });
const dynamoDB = new DynamoDB.DocumentClient();

const parseProductFromCSV = (csvString: string) => {
  const csvParts = csvString.split(",");
  return {
    id: csvParts[0].replace(/"/g, ""),
    count: parseInt(csvParts[1].replace(/"/g, ""), 10),
    description: csvParts[2].replace(/"/g, ""),
    price: parseFloat(csvParts[3].replace(/"/g, "")),
    title: csvParts[4].replace(/"/g, ""),
  };
};

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log("Received event:", JSON.stringify(event));
  const parsedProducts = event.Records.map((record) => {
    console.log("data from record before JSON.parse", record.body);
    const body = JSON.parse(record.body);
    return parseProductFromCSV(
      body['id,"count","description","price","title"']
    );
  });

  try {
    const productCreateResponses = await Promise.allSettled(
      parsedProducts.map(async (product) => {
        const existingProduct = await dynamoDB
          .get({
            TableName: process.env.PRODUCTS_TABLE as string,
            Key: { id: product.id },
          })
          .promise();

        if (!existingProduct.Item) {
          return dynamoDB
            .transactWrite({
              TransactItems: [
                {
                  Put: {
                    TableName: process.env.PRODUCTS_TABLE as string,
                    Item: product,
                  },
                },
                {
                  Put: {
                    TableName: process.env.STOCKS_TABLE,
                    Item: {
                      product_id: product.id,
                      count: product.count,
                    },
                  },
                },
              ],
            })
            .promise();
        }
      })
    );

    productCreateResponses.forEach((res, i) =>
      console.log(
        `record: ${event.Records[i].body}`,
        `item create result: ${res.status}, ${
          res.status === "fulfilled" ? res.value : res.reason
        }`
      )
    );

    const snsPublishResponses = await Promise.allSettled(
      parsedProducts.map((product) =>
        sns
          .publish({
            Message: JSON.stringify(product),
            TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN as string,
          })
          .promise()
      )
    );

    console.log(
      snsPublishResponses.map((res) =>
        res.status === "fulfilled" ? res.value : res.reason
      )
    );
  } catch (err) {
    console.error(err);
  }
};

export const main = catalogBatchProcess;
