'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TestWalletPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">钱包连接测试</h1>
          <p className="text-gray-600 mt-2">测试原生钱包按钮是否正常工作</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>原生 ConnectButton (无样式)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <ConnectButton />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>带自定义文本的 ConnectButton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <ConnectButton connectText="点击连接钱包" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>在容器中的 ConnectButton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="flex justify-center">
                  <ConnectButton connectText="居中显示" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>多个 ConnectButton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-2">
                <ConnectButton connectText="按钮1" />
                <ConnectButton connectText="按钮2" />
                <ConnectButton connectText="按钮3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>调试信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">测试步骤：</h3>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>点击上面的任意一个"连接钱包"按钮</li>
                  <li>观察是否有钱包选择器弹出</li>
                  <li>检查浏览器控制台是否有错误信息</li>
                  <li>如果按钮没有反应，请检查是否安装了Sui钱包</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold">可能的问题：</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>未安装Sui钱包扩展</li>
                  <li>钱包扩展未启用</li>
                  <li>浏览器阻止了弹窗</li>
                  <li>CSS样式覆盖了点击事件</li>
                  <li>JavaScript错误阻止了功能</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">检查方法：</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>按F12打开开发者工具</li>
                  <li>查看Console标签页是否有错误</li>
                  <li>查看Network标签页是否有请求</li>
                  <li>检查Elements标签页中的按钮元素</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
