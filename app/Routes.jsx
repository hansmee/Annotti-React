/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './constants/routes.json';
import App from './containers/App';
import CreateProjectPage from './containers/CreateProjectPage';

const LazyClassificationPage = React.lazy(() => import('./containers/ClassificationPage'));
const ClassificationPage = (props) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyClassificationPage {...props} />
  </React.Suspense>
);

const LazyDetectionPage = React.lazy(() => import('./containers/DetectionPage'));
const DetectionPage = (props) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyDetectionPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.CLASSIFICATION} component={ClassificationPage} />
        <Route path={routes.DETECTION} component={DetectionPage} />
        <Route path={routes.HOME} component={CreateProjectPage} />
      </Switch>
    </App>
  );
}
