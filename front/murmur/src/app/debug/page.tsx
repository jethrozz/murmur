'use client';

import { useCurrentAccount, useWallets, ConnectButton } from '@mysten/dapp-kit';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import WalletConnectButton from '@/components/WalletConnectButton';

export default function DebugPage() {
  const account = useCurrentAccount();
  const wallets = useWallets();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">钱包调试页面</h1>
          <p className="text-gray-600 mt-2">用于调试钱包连接问题</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>钱包连接 (自定义组件)</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnectButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>钱包连接 (官方组件)</CardTitle>
            </CardHeader>
            <CardContent>
              <ConnectButton 
                connectText="连接钱包"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前账户状态</CardTitle>
            </CardHeader>
            <CardContent>
              {account ? (
                <div className="space-y-2">
                  <p><strong>已连接:</strong> 是</p>
                  <p><strong>地址:</strong> {account.address}</p>
                  <p><strong>链:</strong> {account.chains?.[0] || '未知'}</p>
                </div>
              ) : (
                <p className="text-gray-500">未连接钱包</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>可用钱包</CardTitle>
            </CardHeader>
            <CardContent>
              {wallets.length > 0 ? (
                <div className="space-y-2">
                  {wallets.map((wallet, index) => (
                    <div key={index} className="p-2 border rounded">
                      <p><strong>名称:</strong> {wallet.name || '未知'}</p>
                      <p><strong>版本:</strong> {wallet.version || '未知'}</p>
                      <p><strong>图标:</strong> {wallet.icon || '无'}</p>
                      <p><strong>功能:</strong> {Object.keys(wallet.features || {}).join(', ') || '无'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">未检测到可用钱包</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>调试信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>用户代理:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
                <p><strong>是否支持 Web3:</strong> {typeof window !== 'undefined' && 'ethereum' in window ? '是' : '否'}</p>
                <p><strong>是否支持 Sui:</strong> {typeof window !== 'undefined' && 'sui' in window ? '是' : '否'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">1. 安装钱包</h3>
                <p className="text-gray-600">请安装以下任一钱包：</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><a href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sui Wallet (Chrome Extension)</a></li>
                  <li><a href="https://suiet.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Suiet Wallet</a></li>
                  <li><a href="https://sui.io/wallet" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sui Wallet (官方)</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">2. 连接钱包</h3>
                <p className="text-gray-600">点击"连接钱包"按钮，选择已安装的钱包进行连接。</p>
              </div>

              <div>
                <h3 className="font-semibold">3. 检查控制台</h3>
                <p className="text-gray-600">打开浏览器开发者工具 (F12)，查看 Console 标签页中的日志信息。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
