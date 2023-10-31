const mockGet = jest.fn();
const mockTransactWrite = jest.fn();
const mockPublish = jest.fn();

jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      get: mockGet,
      transactWrite: mockTransactWrite,
    })),
  },
  SNS: jest.fn().mockImplementation(() => ({
    publish: mockPublish,
  })),
}));

import { main as catalogBatchProcess } from "./handler";

describe("catalogBatchProcess", () => {
  beforeEach(() => {
    process.env.PRODUCTS_TABLE = "ProductsTable";
    process.env.STOCKS_TABLE = "StocksTable";
    process.env.CREATE_PRODUCT_TOPIC_ARN = "SomeARN";

    mockGet.mockClear();
    mockTransactWrite.mockClear();
    mockPublish.mockClear();

    mockGet.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Item: null }),
    });
    mockTransactWrite.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({}),
    });
    mockPublish.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({}),
    });
  });

  it("should handle product creation", async () => {
    const event: any = {
      Records: [
        {
          body: JSON.stringify({
            'id,"count","description","price","title"':
              '"1","5","description","100","title"',
          }),
        },
      ],
    };

    mockGet.mockResolvedValueOnce({ Item: null });
    mockTransactWrite.mockResolvedValueOnce({});
    mockPublish.mockResolvedValueOnce({});

    await catalogBatchProcess(event);

    expect(mockGet).toBeCalledWith({
      TableName: "ProductsTable",
      Key: { id: "1" },
    });
    expect(mockTransactWrite).toBeCalled();
    expect(mockPublish).toBeCalledWith({
      Message: JSON.stringify({
        id: "1",
        count: 5,
        description: "description",
        price: 100,
        title: "title",
      }),
      TopicArn: "SomeARN",
    });
  });

  it("should skip product creation if product exists", async () => {
    const event: any = {
      Records: [
        {
          body: JSON.stringify({
            'id,"count","description","price","title"':
              '"1","5","description","100","title"',
          }),
        },
      ],
    };

    mockGet.mockResolvedValueOnce({ Item: {} });
    mockTransactWrite.mockResolvedValueOnce({});
    mockPublish.mockResolvedValueOnce({});

    await catalogBatchProcess(event);

    expect(mockGet).toBeCalledWith({
      TableName: "ProductsTable",
      Key: { id: "1" },
    });
    expect(mockTransactWrite).not.toBeCalled();
    expect(mockPublish).toBeCalledWith({
      Message: JSON.stringify({
        id: "1",
        count: 5,
        description: "description",
        price: 100,
        title: "title",
      }),
      TopicArn: "SomeARN",
    });
  });
});
