import { z } from "zod";

// Define ObjectId validation helper
const ObjectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId");

// User schema

// Session schema
const SessionSchema = z.object({
  userId: ObjectIdSchema, // User ID as a string
  messageIds: z.array(ObjectIdSchema), // Array of message IDs as strings
  createdAt: z.date().optional(),
  globalStatisticsId: ObjectIdSchema.optional(), // Optional GlobalStatistics ID
});

// Message schema
const MessageSchema = z.object({
  sessionId: ObjectIdSchema, // Session ID as a string
  authorId: z.string(),
  authorRole: z.string(),
  authorCreateTime: z.date(),
  authorTokens: z.number(),
  authorRecipient: z.string(),
  authorStatus: z.string(),
  statisticsId: ObjectIdSchema.optional(), // Optional Statistics ID
  referenceIds: z.array(z.string()), // Array of references as strings
  responseIds: z.array(ObjectIdSchema), // Array of Response IDs
  messageGlobalStatsId: ObjectIdSchema.optional(), // Optional MessageGlobalStatistics ID
});

// Response schema
const ResponseSchema = z.object({
  messageId: ObjectIdSchema, // Message ID as a string
  authorId: z.string(),
  authorRole: z.string(),
  createTime: z.date(),
  contentType: z.string(),
  contentTokens: z.number(),
  status: z.string(),
  weight: z.number(),
  metadata: z.record(z.any()).optional(),
  recipient: z.string(),
});

// Statistics schema
const StatisticsSchema = z.object({
  messageId: ObjectIdSchema, // Message ID as a string
  responses: z.number(),
  toolsCalled: z.number(),
  assistant: z.number(),
  systemCount: z.number(),
  webSearches: z.number(),
  citations: z.number(),
  images: z.number(),
});

// MessageGlobalStatistics schema
const MessageGlobalStatisticsSchema = z.object({
  messageId: ObjectIdSchema, // Message ID as a string
  questions: z.number(),
  responses: z.number(),
  toolsCalled: z.number(),
  assistant: z.number(),
  systemCount: z.number(),
  webSearches: z.number(),
  citations: z.number(),
  images: z.number(),
  questionsAv: z.number(),
  responsesAv: z.number(),
  toolsCalledAv: z.number(),
  assistantAv: z.number(),
  systemCountAv: z.number(),
  webSearchesAv: z.number(),
  citationsAv: z.number(),
  imagesAv: z.number(),
});

// GlobalStatistics schema
const GlobalStatisticsSchema = z.object({
  sessionId: ObjectIdSchema.optional(), // Optional session ID
  questions: z.number().default(0),
  responses: z.number().default(0),
  toolsCalled: z.number().default(0),
  assistant: z.number().default(0),
  systemCount: z.number().default(0),
  webSearches: z.number().default(0),
  citations: z.number().default(0),
  images: z.number().default(0),
  questionsAv: z.number().default(0),
  responsesAv: z.number().default(0),
  toolsCalledAv: z.number().default(0),
  assistantAv: z.number().default(0),
  systemCountAv: z.number().default(0),
  webSearchesAv: z.number().default(0),
  citationsAv: z.number().default(0),
  imagesAv: z.number().default(0),
});

// Export schemas
export {
  SessionSchema,
  MessageSchema,
  ResponseSchema,
  StatisticsSchema,
  MessageGlobalStatisticsSchema,
  GlobalStatisticsSchema,
};
