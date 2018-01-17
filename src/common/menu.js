const menuData = [{
  name: '工作台',
  icon: 'dashboard',
  path: 'dashboard',
}, {
  name: '入驻管理',
  icon: 'form',
  path: 'basic',
  children: [{
    name: '区域经销商管理 ',
    path: 'franchiser',
  }, {
    name: '品牌供货商管理 ',
    path: 'supplier',
  }],
}, {
  name: '商品管理',
  icon: 'table',
  path: 'list',
  children: [{
    name: '类目管理',
    path: 'category',
  }, {
    name: 'SPU管理',
    path: 'spu',
  }, {
    name: '商品明细',
    path: 'product-details',
  }, {
    name: '属性维护',
    path: 'attributes',
  }],
}, {
  name: '订单管理',
  icon: 'profile',
  path: 'profile',
  children: [{
    name: '政采云订单',
    path: 'zcy',
  }, {
    name: '自营订单',
    path: 'self',
  }, {
    name: '品牌供货商订单',
    path: 'brand-supplier',
  }],
}, {
  name: '供应链金融',
  icon: 'check-circle-o',
  path: 'result',
  children: [{
    name: '服务商管理',
    path: 'service_provider',
  }, {
    name: '订单进程',
    path: 'order-process',
  }, {
    name: '还款信息',
    path: 'repayment-information',
  }, {
    name: '逾期催收',
    path: 'overdue-collection',
  }, {
    name: '风控规则',
    path: 'wind-control',
  }, {
    name: '账单统计',
    path: 'billing-statistics',
  }],
}, {
  name: '系统管理',
  icon: 'warning',
  path: 'system',
  children: [{
    name: '部门管理',
    path: 'management_department',
    // authority: 'user',
  }, {
    name: '用户管理',
    path: 'management_user',
  }, {
    name: '角色管理',
    path: 'management_role',
  }, {
    name: '系统管理',
    path: 'management_system',
  }, {
    name: '日志管理',
    path: 'management_log',
  }],
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
