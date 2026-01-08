import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Learning Resource Hub
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/upload" className="navbar-link">Upload</Link>
              <Link to="/my-resources" className="navbar-link">My Resources</Link>
              <span className="navbar-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

