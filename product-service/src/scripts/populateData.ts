import { DynamoDB } from "aws-sdk";
import { mockProductData } from "../functions/getProductsList/mockProductData";

const dynamoDB = new DynamoDB.DocumentClient();

const PRODUCTS_TABLE = "products";
const STOCKS_TABLE = "stocks";

const putProduct = async (
  id: string,
  title: string,
  description: string,
  price: number
) => {
  const params = {
    TableName: PRODUCTS_TABLE,
    Item: {
      id,
      title,
      description,
      price,
    },
  };
  return dynamoDB.put(params).promise();
};

const putStock = async (productId: string, count: number) => {
  const params = {
    TableName: STOCKS_TABLE,
    Item: {
      product_id: productId,
      count,
    },
  };
  return dynamoDB.put(params).promise();
};

export const populateData = async (event, context) => {
  try {
    for (let product of mockProductData) {
      await putProduct(
        product.id,
        product.title,
        product.description,
        product.price
      );
      await putStock(product.id, product.count);
    }

    console.log("Data populated successfully!");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data populated successfully!" }),
    };
  } catch (error) {
    console.error("Error populating data:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to populate data." }),
    };
  }
};
