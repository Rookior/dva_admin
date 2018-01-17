import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRule(params) {
    params.aa = 'ddd';
    return request(`http://testdc.okwuyou.com:10031/shop/getShop`,{
        method: 'POST',
        body: {
            ...params,
        },
    });
}