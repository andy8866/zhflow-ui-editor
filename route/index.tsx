import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter,BrowserRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));
const EditorPage = React.lazy(() => import('../pages/EditorPage'));

export default observer(function ({store}: {store: IMainStore}) {
  return (
    <BrowserRouter>
      <div className="routes-wrapper">
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          <Switch>
            <Route path="/" component={EditorPage} />
            <Route component={Preview} />
          </Switch>
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
});
