export enum GHCheckRunStatus {
  QUEUED = 'queued',
  IN_PROGGRESS = 'in_progress', 
  COMPLETED = 'completed',
};

export enum GHCheckRunConclusion {
  ACTION_REQUIRED = 'action_required',
  CANCELLED = 'cancelled',
  FAILURE = 'failure',
  NEUTRAL = 'neutral',
  SUCCESS = 'success',
  SKIPPED = 'skipped',
  STALE = 'stale',
  TIMED_OUT = 'timed_out',
};

export const COMPLETED_URL = /\/completed\/.+/g;
export const COMPLETED_URL_LENGTH = 11;