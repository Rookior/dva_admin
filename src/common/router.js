import React from 'react';
import dynamic from 'dva/dynamic';
import {getMenuData} from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component, redirectFrom, redirectTo) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({namespace}) => namespace === m)).map(m => import(`../models/${m}`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} redirectFrom={redirectFrom}
                                 redirectTo={redirectTo}/>;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = {...item};
      keys = {...keys, ...getFlatMenuData(item.children)};
    } else {
      keys[item.path] = {...item};
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard': {
      component: dynamicWrapper(app, [], () => import('../routes/Dashboard')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/basic/franchiser': {
      component: dynamicWrapper(app, ['franchiser/list.js'], () => import('../layouts/ManagementLayout'), '/basic/franchiser', '/basic/franchiser/list'),
    },
    '/basic/franchiser/list': {
      name: '列表',
      component: dynamicWrapper(app, ['franchiser/list.js'], () => import('../routes/Franchiser/List')),
    },
    '/basic/franchiser/edit/:id': {
      name: '编辑',
      component: dynamicWrapper(app, ['franchiser/edit.js'], () => import('../routes/Franchiser/Edit')),
    },
    '/basic/supplier': {
      component: dynamicWrapper(app, ['supplier'], () => import('../routes/Supplier/List')),
    },
    '/list/product-details': {
      component: dynamicWrapper(app, ['product_details'], () => import('../routes/Product/List')),
    },
    '/result/service_provider': {
      component: dynamicWrapper(app, ['result/service_provider.js'], () => import('../layouts/ManagementLayout'), '/result/service_provider', '/result/service_provider/list'),
    },
    '/result/service_provider/list': {
      name: '列表',
      component: dynamicWrapper(app, ['result/service_provider.js'], () => import('../routes/Result/ServiceProvider')),
    },
    '/system/management_department': {
      component: dynamicWrapper(app, ['system/management_department.js'], () => import('../layouts/ManagementLayout'), '/system/management_department', '/system/management_department/list'),
    },
    '/system/management_department/list': {
      name: '列表',
      component: dynamicWrapper(app, ['system/management_department.js'], () => import('../routes/System/ManagementDepartment')),
    },
    '/system/management_user': {
      component: dynamicWrapper(app, ['system/management_user.js'], () => import('../layouts/ManagementLayout'), '/system/management_user', '/system/management_user/list'),
    },
    '/system/management_user/list': {
      name: '列表',
      component: dynamicWrapper(app, ['system/management_user.js'], () => import('../routes/System/ManagementUser')),
    },
    '/system/management_user/management_user_detail/:id': {
      name: '详情',
      component: dynamicWrapper(app, ['system/management_user_detail.js'], () => import('../routes/System/ManagementUserDetail')),
    },

  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
