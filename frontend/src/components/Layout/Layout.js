import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

function Layout({ children, showFooter = true }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;

