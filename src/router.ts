import { IncomingMessage } from 'http';
import { axiosClient } from './axios';
import { GHCheckRunStatus } from './constants';
import { getToken } from './token';

const createHeaders = async (): Promise<{ headers: Record<string, any> }> => {
  const key = await getToken();
  return {  
    headers: {
      'Authorization': `Bearer ${key}`,
      // 'Accept': 'application/vnd.github.v3+json',
    }
  };
};

export const createCheckRun = async (request: IncomingMessage, payload: Record<string, any>): Promise<string> => {
  console.log('gonna create a check_run', request.headers);
  const headSHA = payload.check_suite ? payload.check_suite.head_sha : payload.check_run.head_sha;
  const headers = await createHeaders();
  
  const ghResponse = await axiosClient.post('check-runs', {
    name: `Check run for ${headSHA}`,
    head_sha: headSHA,
  }, headers);
  console.log('response from github for POST/check_runs', ghResponse.status, ghResponse.data);
  return `check run queued, id=${ghResponse.data.id}`;
};

export const startCheckRun = async (payload: Record<string, any>): Promise<string> => {
  console.log('========= now we can start the pipeline ===========');
  console.log('check_run', payload.check_run);
  const headers = await createHeaders();

  const ghResponse = await axiosClient.patch(`check-runs/${payload.check_run.id}`, {
    status: GHCheckRunStatus.IN_PROGGRESS,
  }, headers);
  console.log('response from github for PATCH/check_runs/in_progress', ghResponse.status, ghResponse.data);
  return `check run started, id=${ghResponse.data.id}`;
};

export const successCheckRun = async (checkRunId: string): Promise<string> => {
  const headers = await createHeaders();

  const ghResponse = await axiosClient.patch(`check-runs/${checkRunId}`, {
    status: GHCheckRunStatus.COMPLETED,
    conclusion: 'success',
  }, headers);
  console.log('response from github for PATCH/check_runs/success', ghResponse.status, ghResponse.data);
  return `check run completed, id=${ghResponse.data.id}`;
};