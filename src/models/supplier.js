import { queryRule } from '../services/supplier';

export default {
  namespace: 'supplier',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('执行effect');
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRule, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    save(state, action) {
      console.log('执行保存数据');
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      console.log('执行changeLoading');
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
