import React from 'react';
import { Outlet, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div className="app-container" style={{
        minHeight: '100vh',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 主内容区：子路由会在这里渲染 */}
        <main className="main-content" style={{ flexGrow: 1, height: '100%' }}>
          <Outlet /> {/* 路由出口，匹配的子组件会替换这里 */}
        </main>
      </div>
    )
  }
}

export default App;
