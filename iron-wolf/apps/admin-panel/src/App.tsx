import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Classes from './pages/Classes';
import Payments from './pages/Payments';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/members" component={Members} />
        <Route path="/classes" component={Classes} />
        <Route path="/payments" component={Payments} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;