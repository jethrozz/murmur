export default function BasicTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>基础测试页面</h1>
      <p>这个页面不使用任何复杂的组件，只测试基本的HTML渲染。</p>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid blue' }}>
        <h2>HTML 按钮测试：</h2>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'blue', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('HTML按钮可以点击！')}
        >
          HTML 按钮
        </button>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid green' }}>
        <h2>JavaScript 测试：</h2>
        <p>当前时间: {new Date().toLocaleString()}</p>
        <p>Math.random(): {Math.random()}</p>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '2px solid red' }}>
        <h2>CSS 测试：</h2>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: 'yellow', 
          border: '2px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          黄色方块
        </div>
      </div>
    </div>
  );
}
