export enum GHCheckRunStatus {
  QUEUED = 'queued',
  IN_PROGGRESS = 'in_progress', 
  COMPLETED = 'completed',
};

export const SUCCESS_URL = /\/success\/.+/g;
export const SUCCESS_URL_LENGTH = 9;