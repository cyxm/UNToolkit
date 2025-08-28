import React from 'react';
import { Outlet, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div className="app-container">
        {/* 全局导航栏 */}
        <header className="navbar">
          <nav>
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/about" className="nav-link">关于</Link>
            <Link to="/user" className="nav-link">用户中心</Link>
          </nav>
        </header>

        {/* 主内容区：子路由会在这里渲染 */}
        <main className="main-content">
          <Outlet /> {/* 路由出口，匹配的子组件会替换这里 */}
        </main>

        {/* 全局页脚 */}
        <footer className="footer">
          <p>© 2023 My App. All rights reserved.</p>
        </footer>
      </div>
    )
  }
}

export default App;
