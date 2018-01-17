import { stringify } from 'qs';
import request from '../utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function getRule(params) {
  return request(`/api/rule/get?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function saveRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
