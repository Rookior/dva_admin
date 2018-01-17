import modelExtend from 'dva-model-extend'
import {queryRule, removeRule} from '../../services/api';
import {pageModel} from '../common'

export default modelExtend(pageModel, {
  namespace: 'franchiser_list',

  state: {

  },

  effects: {
    *fetch({payload}, {call, put}) {
      payload = payload || {currentPage: 1, pageSize: 10}
      const response = yield call(queryRule, payload);
      if (response) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.list,
            pagination: {
              currentPage: Number(payload.currentPage) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.total,
            },
          },
        })
      }
    },

    *remove({payload, callback}, {call, put, select}) {
      yield call(removeRule, payload);
      callback && callback();
      // const {selectedRowKeys} = yield select(_ => _.franchiser_list)
      // yield put({type: 'updateState', payload: {selectedRowKeys: selectedRowKeys.filter(key => key !== payload)}})
      yield put({type: 'fetch'})

    },
  },
});
