import type { AxiosResponse } from 'axios';
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000',
});
const responseBody = (response: AxiosResponse) => response.data;

type getSickRequest = {
  key: string;
};
export type Recommend = {
  sickCd: string;
  sickNm: string;
};
type getSickResponse = Recommend[];

export const getSick = ({ key }: getSickRequest): Promise<getSickResponse> => {
  console.info('calling api');
  return client.get(`/sick?q=${key}`).then(responseBody);
};
