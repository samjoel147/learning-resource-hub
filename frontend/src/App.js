import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './components/Pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResourceDetail from './components/Resources/ResourceDetail';
import ResourceUpload from './components/Resources/ResourceUpload';
import MyResources from './components/Resources/MyResources';
import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resource/:id" element={<ResourceDetail />} />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <ResourceUpload />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-resources"
                element={
                  <PrivateRoute>
                    <MyResources />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

