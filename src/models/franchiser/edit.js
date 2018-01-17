import { saveRule, getRule } from '../../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'franchiser_edit',
  state: {
    record: {},
  },

  effects: {
    * get({ payload }, { call, put }) {
      const data = yield call(getRule, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          record: data,
        },
      });
    },
    * save({ payload }, { call, put }) {
      const data = yield call(saveRule, payload);
      if (data.success) {
        yield put(routerRedux.push('/basic/franchiser/list'));
      } else {
        throw data;
      }
    },
  },
  reducers: {

    querySuccess(state, { payload }) {
      const { record } = payload;
      return {
        ...state,
        record,
      };
    },

  },
};
