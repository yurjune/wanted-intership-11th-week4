import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { Recommend } from './model';

const client = axios.create({
  baseURL: 'http://localhost:4000',
});
const responseBody = (response: AxiosResponse) => response.data;

type getSickRequest = {
  key: string;
};
type getSickResponse = Recommend[];

export const getSick = async ({ key }: getSickRequest): Promise<getSickResponse> => {
  console.info('calling api');
  return client.get(`/sick?q=${key}`).then(responseBody);
};
