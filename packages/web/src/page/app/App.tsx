import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-container" style={{
      minHeight: '100vh',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <main className="main-content" style={{ flexGrow: 1, height: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
