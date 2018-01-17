import modelExtend from 'dva-model-extend'
import {queryRule, removeRule} from '../../services/service_provider';
import {pageModel} from '../common'

export default modelExtend(pageModel, {
    namespace: 'service_provider',
  
    state: {
      
    },
    effects: {
        *fetch({payload}, {call, put}) {
            console.log('初始化列表');
            console.log(payload);
            payload = payload || {pageNo: 1, pageSize: 10}
            console.log(payload);
            const response = yield call(queryRule, payload);
            if (response) {
                console.log(response);
                yield put({
                    type: 'querySuccess',
                    payload: {
                      list: response.data,
                      pagination: {
                        pageNo: Number(payload.pageNo) || 1,
                        pageSize: Number(payload.pageSize) || 10,
                        total: response.data.length || Number(10),
                      },
                    },
                })
            }
        },
    },
});