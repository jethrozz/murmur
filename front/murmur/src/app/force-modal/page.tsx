'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ForceModalPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">强制弹窗背景测试</h1>
          <p className="text-gray-600 mt-2">使用内联样式强制设置弹窗背景色</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>钱包连接测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                点击下面的按钮，弹窗背景应该显示为深黑色。
              </p>
              <ConnectButton connectText="连接钱包" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>内联样式测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 9999,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              id="test-overlay"
            >
              <div 
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}
              >
                <h3>测试弹窗</h3>
                <p>这是一个测试弹窗，背景应该是深黑色。</p>
                <button 
                  onClick={() => {
                    const overlay = document.getElementById('test-overlay');
                    if (overlay) {
                      overlay.style.display = 'none';
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  关闭
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const overlay = document.getElementById('test-overlay');
                if (overlay) {
                  overlay.style.display = 'flex';
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              显示测试弹窗
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">测试步骤：</h3>
                <ol className="list-decimal list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>点击"显示测试弹窗"按钮 - 应该显示深黑色背景的弹窗</li>
                  <li>点击"连接钱包"按钮 - 查看钱包选择器弹窗的背景色</li>
                  <li>对比两个弹窗的背景色是否一致</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold">预期效果：</h3>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>测试弹窗：深黑色背景 (rgba(0, 0, 0, 0.8))</li>
                  <li>钱包弹窗：应该也是深黑色背景</li>
                  <li>如果钱包弹窗背景仍然透明，说明CSS选择器需要调整</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
