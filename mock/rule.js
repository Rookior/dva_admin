import Mock from 'mockjs';
import { getUrlParams, getByKeyInArray, NOTFOUND } from './utils';

let tableListDataSource = Mock.mock({
  'data|80-100': [
    {
      key: '@increment',
      disabled: '@boolean',
      href: 'https://ant.design',
      no: '@string(number,8)',
      title: '@ctitle',
      owner: '@cname',
      avatar() {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.owner.substr(0, 1));
      },
      description: '这是一段描述',
      'callNo|0-999': 323,
      'status|0-3': 0,
      createdAt: '@datetime',
      updatedAt: '@datetime',
      'progress|0-99': 50,
    },
  ],
}).data;


export function findRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  const currentPage = parseInt(params.currentPage, 10) || 1;
  const result = {
    list: dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    total: dataSource.length,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const data = getByKeyInArray(tableListDataSource, params.id, 'key');
  if (res && res.json) {
    res.status(200).json(data || {});
  } else {
    return data;
  }
}
export function destroyRule(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { key } = body;
  const idArray = key.split(',');
  for (const id of idArray) {
    const data = getByKeyInArray(tableListDataSource, id, 'key');
    if (data) {
      tableListDataSource = tableListDataSource.filter(item => item.key !== data.key);
    }
  }

  if (res && res.json) {
    res.status(204).json();
  } else {
    return '';
  }
}
export function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  console.log(params);

  const body = (b && b.body) || req.body;
  const id = Number.parseInt(body.id, 10);
  let isExist = false;
  if (id) {
    tableListDataSource = tableListDataSource.map((item) => {
      if (item.id === id) {
        isExist = true;
        return Object.assign({}, item, body);
      }
      return item;
    });

    if (isExist) {
      res.status(201).json({ success: true });
    } else {
      res.status(404).json(NOTFOUND);
    }
  } else {
    delete body.id;
    body.createTime = Mock.mock('@now');
    body.key = Mock.mock('@id');
    body.no = Mock.mock('@string(number,8)');
    body.callNo = Mock.Random.natural(0, 999);
    tableListDataSource.unshift(body);
    res.json({ success: true });
  }
}

export default {
  findRule,
  getRule,
  destroyRule,
  postRule,
};
