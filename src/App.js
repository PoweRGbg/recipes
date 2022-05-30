import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";

import { AuthProvider } from './contexts/AuthContext';
import { MongoContext } from './contexts/MongoContext';
import Authentication  from './components/Authentication/Authentication'
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import MyPatients from './components/MyPatients';
import Create from './components/Create';
import Edit from './components/Edit';
import AddProtocol from './components/Protocol/AddProtocoll';
import EditProtocol from './components/Protocol/EditProtocol';
import DeleteProtocol from './components/Protocol/DeleteProtocol';
import AddRecipe from './components/Recipe/AddRecipe';
import RecipesList from './components/RecipesList';

import Details from './components/Details';
import ErrorBoundary from './components/Common/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import RenewProtocol from './components/Protocol/RenewProtocol';
import * as Realm from 'realm-web';

function App() {
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(new Realm.App({id: "<YOUR-APP-ID-HERE"}));

  useEffect(() => {
    async function init () {
      if (!user) {
        setUser(app.currentUser ? app.currentUser : await app.logIn(Realm.Credentials.anonymous()))
      }

      if (!client) {
        setClient(app.currentUser.mongoClient('mongodb-atlas'));
      }
    }

    init();
  }, [app, client, user]);

  function renderComponent (Component, additionalProps = {}) {
    return <MongoContext.Consumer>{(mongoContext) => <Component mongoContext={mongoContext} {...additionalProps} />}</MongoContext.Consumer>
  };

  return (
    <ErrorBoundary>
      <MongoContext.Provider value={{app, client, user, setClient, setUser, setApp}}>
      <AuthProvider>
        <div id="container">
          {renderComponent(Header)}

          <main id="site-content">
            <Routes>
              <Route path="/dashboard/*" element={renderComponent(Dashboard)} />
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/signup" element={renderComponent(Authentication, {type: 'create'})} />
              <Route path="/signin" element={renderComponent(Authentication)} />
              <Route path="/home" element={renderComponent(Home)} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={renderComponent(Logout)} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-patients" element={<MyPatients />} />
              <Route path="/create" element={renderComponent(Create)} />
              <Route path="/edit/:patientId" element={<Edit />} />
              <Route path="/protocol/add/:patientId" element={renderComponent(AddProtocol)} />
              <Route path="/protocol/edit/:protocolId" element={<EditProtocol />} />
              <Route path="/protocol/delete/:protocolId" element={<DeleteProtocol />} />
              <Route path="/protocol/renew/:protocolId" element={<RenewProtocol />} />
              <Route path="/recipe/add/:protocolId" element={renderComponent(AddRecipe)} />
              <Route path="/recipe/add_recipe/:patientId" element={<AddRecipe />} />
              <Route path="/recipeslist/:protocolId" element={<RecipesList />} />
              <Route path="/details/:patientId" element={renderComponent(Details)} />
            </Routes>
          </main>

          <footer id="site-footer">
            <p>@Recipes project</p>
          </footer>
        </div>
      </AuthProvider>
      </MongoContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
