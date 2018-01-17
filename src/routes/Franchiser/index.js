import React, { PureComponent } from 'react';
import { Route, Switch,Redirect } from 'dva/router';
import NotFound from '../Exception/404';
import { getRoutes } from '../../utils/utils';

export default class ManagementMain extends PureComponent {
  render() {
    const { match, routerData,redirectFrom,redirectTo } = this.props;
    return (
      <div>
        <Switch>
          {
            getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))
          }
          <Redirect exact from={redirectFrom} to={redirectTo} />
          <Route render={NotFound} />
        </Switch>
      </div>
    );
  }
}
