'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ModalTestPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">钱包弹窗测试</h1>
          <p className="text-gray-600 mt-2">测试钱包选择器弹窗是否正常显示</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>钱包连接测试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  点击下面的按钮，应该会弹出一个钱包选择器弹窗。
                </p>
                <ConnectButton connectText="连接钱包" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>测试说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-green-600">✅ 正常情况：</h3>
                  <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    <li>点击按钮后弹出钱包选择器</li>
                    <li>弹窗有半透明黑色背景遮罩</li>
                    <li>弹窗内容居中显示</li>
                    <li>可以点击遮罩关闭弹窗</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-600">❌ 异常情况：</h3>
                  <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    <li>点击按钮后没有弹窗</li>
                    <li>弹窗显示在页面底部而不是居中</li>
                    <li>弹窗没有背景遮罩</li>
                    <li>弹窗内容不可见或被遮挡</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>调试信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>当前时间:</strong> {new Date().toLocaleString()}</p>
                <p><strong>页面URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                <p><strong>用户代理:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>解决方案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">如果弹窗不正常：</h3>
                  <ol className="list-decimal list-inside mt-1 text-sm text-gray-600 space-y-1">
                    <li>检查浏览器控制台是否有CSS错误</li>
                    <li>尝试刷新页面</li>
                    <li>检查是否有其他CSS覆盖了弹窗样式</li>
                    <li>尝试在不同的浏览器中测试</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold">如果仍然有问题：</h3>
                  <p className="text-sm text-gray-600">
                    请提供浏览器控制台的错误信息，这样我可以进一步诊断问题。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
