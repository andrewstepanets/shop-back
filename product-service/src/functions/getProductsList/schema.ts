export default {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      count: { type: "number" },
    },
    required: ["id", "title", "price", "count"],
  },
} as const;
