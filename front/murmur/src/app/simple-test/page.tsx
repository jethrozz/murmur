'use client';

import { ConnectButton } from '@mysten/dapp-kit';

export default function SimpleTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>简单钱包测试</h1>
      <p>如果您能看到下面的按钮，说明组件正在渲染：</p>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid blue' }}>
        <h2>ConnectButton 测试：</h2>
        <ConnectButton />
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid green' }}>
        <h2>带文本的 ConnectButton：</h2>
        <ConnectButton connectText="点击我连接钱包" />
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid red' }}>
        <h2>普通按钮对比：</h2>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'orange', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('普通按钮可以点击！')}
        >
          普通按钮测试
        </button>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid purple' }}>
        <h2>调试信息：</h2>
        <p>当前时间: {new Date().toLocaleString()}</p>
        <p>页面已加载: 是</p>
        <p>React 组件: 正常渲染</p>
      </div>
    </div>
  );
}
