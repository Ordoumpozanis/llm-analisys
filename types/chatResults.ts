export type GlobalStatisticsType = {
  questions: number;
  responses: number;
  toolsCalled: number;
  assistant: number;
  systemCount: number;
  webSearches: number;
  citations: number;
  images: number;
};

export type MessagesType = {
  user: object[];
  response: object[];
  statistics: {
    responses: number;
    toolsCalled: number;
    assistant: number;
    systemCount: number;
    webSearches: number;
    citations: number;
    images: number;
  };
  references: {
    url: string | null;
    title: string | null;
  }[];
};

export type SessionInfoType = {
  Country: string;
  City: string;
  Title: string;
};

export type ChatAnalysisType = {
  messages: MessagesType[];
  globalStatistics: GlobalStatisticsType;
  sessionInfo: SessionInfoType;
};
