import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import MyPatients from './components/MyPatients';
import Create from './components/Create';
import Edit from './components/Edit';
import Add_Protocol from './components/AddProtocol'
import Details from './components/Details';
import ErrorBoundary from './components/Common/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div id="container">
          <Header />

          <main id="site-content">
            <Routes>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-patients" element={<MyPatients />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:patientId" element={<Edit />} />
              <Route path="/add_protocol/:patientId" element={<Add_Protocol />} />
              <Route path="/details/:patientId" element={<Details />} />
            </Routes>
          </main>

          <footer id="site-footer">
            <p>@Recipes project</p>
          </footer>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
