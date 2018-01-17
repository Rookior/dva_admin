import React, { PureComponent } from 'react';
import { Route, Switch,Redirect } from 'dva/router';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
const { AuthorizedRoute } = Authorized;

export default class ManagementLayout extends PureComponent {
  render() {
    const { match, routerData,redirectFrom,redirectTo } = this.props;
    return (
      <div>
        <Switch>
          {
            getRoutes(match.path, routerData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
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
