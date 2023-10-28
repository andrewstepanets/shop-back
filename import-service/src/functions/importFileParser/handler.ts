import { S3Event, S3Handler } from "aws-lambda";
import "source-map-support/register";
import AWS from "aws-sdk";
import csv from "csv-parser";
import { middyfy } from "@/libs/lambda";

const s3 = new AWS.S3({ region: "eu-west-1" });
const sqs = new AWS.SQS();
const CATALOG_ITEMS_QUEUE_URL = process.env.CATALOG_ITEMS_QUEUE_URL;

const processRecord = async (record): Promise<void> => {
  const bucketName = record.s3.bucket.name;
  const originalKey = record.s3.object.key;
  const newKey = originalKey.replace("uploaded/", "parsed/");

  const s3Stream = s3
    .getObject({
      Bucket: bucketName,
      Key: originalKey,
    })
    .createReadStream();

  return new Promise<void>((resolve, reject) => {
    s3Stream
      .pipe(csv({ separator: "," }))
      .on("error", (error) => {
        console.error("CSV parsing error:", error);
      })
      .on("data", async (data) => {
        console.log("its work", data);
        await sqs
          .sendMessage(
            {
              QueueUrl: CATALOG_ITEMS_QUEUE_URL,
              MessageBody: JSON.stringify(data),
            },
            function (err, data) {
              if (err) {
                console.log("error", err);
              } else {
                console.log("Success sent message", data.MessageId);
                console.log("Message", data.MD5OfMessageBody);
              }
            }
          )
          .promise();
      })
      .on("end", async () => {
        console.log(`Successfully processed ${originalKey}`);

        try {
          // Copy file to 'parsed' folder
          await s3
            .copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${originalKey}`,
              Key: newKey,
            })
            .promise();

          // Delete the original file in 'uploaded' folder
          await s3
            .deleteObject({
              Bucket: bucketName,
              Key: originalKey,
            })
            .promise();

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
};

const importFileParser: S3Handler = async (event: S3Event) => {
  const processingPromises = event.Records.map(processRecord);
  await Promise.all(processingPromises);
};

export const main = middyfy(importFileParser);
