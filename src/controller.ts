import { IncomingMessage } from 'http';
import { axiosClientBE, axiosClientGH } from './axios';
import { GHCheckRunConclusion, GHCheckRunStatus } from './constants';
import { getToken } from './token';
import { verifyCheckRunCompletedData } from './utils';

const createHeaders = async (): Promise<{ headers: Record<string, any> }> => {
  const key = await getToken();
  return {  
    headers: {
      'Authorization': `Bearer ${key}`,
    }
  };
};

export const createCheckRun = async (request: IncomingMessage, payload: Record<string, any>): Promise<string> => {
  console.log('gonna create a check_run', request.headers);
  const headSHA = payload.check_suite ? payload.check_suite.head_sha : payload.check_run.head_sha;
  const headers = await createHeaders();
  
  const ghResponse = await axiosClientGH.post('check-runs', {
    name: `Check run for ${headSHA}`,
    head_sha: headSHA,
  }, headers);

  const echo = await axiosClientBE.get('get', ghResponse.data);
  console.log('echo response', echo);

  console.log('response from github for POST/check_runs', ghResponse.status, ghResponse.data);
  return `check run queued, id=${ghResponse.data.id}`;
};

export const startCheckRun = async (payload: Record<string, any>): Promise<string> => {
  console.log('========= now we can start the pipeline ===========');
  console.log('check_run', payload.check_run);
  const headers = await createHeaders();

  const ghResponse = await axiosClientGH.patch(`check-runs/${payload.check_run.id}`, {
    status: GHCheckRunStatus.IN_PROGGRESS,
  }, headers);
  console.log('response from github for PATCH/check_runs/in_progress', ghResponse.status, ghResponse.data);
  return `check run started, id=${ghResponse.data.id}`;
};

export const completeCheckRun = async (checkRunId: string, payload: Record<string, any>): Promise<string> => {
  const headers = await createHeaders();

  const data = verifyCheckRunCompletedData(payload) ? payload : {
    status: GHCheckRunStatus.COMPLETED,
    conclusion: GHCheckRunConclusion.SUCCESS,
  };

  const ghResponse = await axiosClientGH.patch(`check-runs/${checkRunId}`, data, headers);
  console.log('response from github for PATCH/check_runs/completed', ghResponse.status, ghResponse.data);
  return `check run completed, id=${ghResponse.data.id}`;
};