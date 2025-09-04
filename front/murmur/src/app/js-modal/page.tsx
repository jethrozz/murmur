'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect } from 'react';

export default function JSModalPage() {
  useEffect(() => {
    // 监听DOM变化，强制设置弹窗背景色
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // 查找所有可能的弹窗元素
              const modalElements = element.querySelectorAll('[data-dapp-kit] div, [data-dapp-kit] section, [data-dapp-kit] article');
              modalElements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                const computedStyle = window.getComputedStyle(htmlEl);
                
                // 如果是固定定位的元素，设置深色背景
                if (computedStyle.position === 'fixed' && computedStyle.zIndex !== 'auto') {
                  htmlEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  htmlEl.style.zIndex = '9999';
                }
                
                // 如果是相对定位的白色背景元素，保持白色
                if (computedStyle.position === 'relative' && 
                    (computedStyle.backgroundColor.includes('white') || 
                     computedStyle.backgroundColor.includes('rgb(255'))) {
                  htmlEl.style.backgroundColor = 'white';
                  htmlEl.style.border = '2px solid #e5e7eb';
                  htmlEl.style.borderRadius = '12px';
                  htmlEl.style.padding = '20px';
                  htmlEl.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
                }
              });
            }
          });
        }
      });
    });

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">JavaScript 强制弹窗背景</h1>
          <p className="text-gray-600 mt-2">使用JavaScript监听DOM变化，强制设置弹窗背景色</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>钱包连接测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                点击下面的按钮，JavaScript会自动检测弹窗并设置深黑色背景。
              </p>
              <ConnectButton connectText="连接钱包" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>工作原理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">JavaScript 监听器：</h3>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>监听DOM变化，检测新添加的元素</li>
                  <li>查找所有固定定位的弹窗元素</li>
                  <li>自动设置深黑色背景 (rgba(0, 0, 0, 0.8))</li>
                  <li>保持弹窗内容为白色背景</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">优势：</h3>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>不依赖CSS选择器</li>
                  <li>动态检测弹窗元素</li>
                  <li>实时应用样式</li>
                  <li>兼容性更好</li>
                </ul>
              </div>
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
                <h3 className="font-semibold">测试步骤：</h3>
                <ol className="list-decimal list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>点击"连接钱包"按钮</li>
                  <li>观察弹窗背景是否显示为深黑色</li>
                  <li>检查弹窗内容是否为白色背景</li>
                  <li>测试弹窗功能是否正常</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold">预期效果：</h3>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600 space-y-1">
                  <li>弹窗背景：深黑色 (rgba(0, 0, 0, 0.8))</li>
                  <li>弹窗内容：白色背景，带边框和阴影</li>
                  <li>弹窗功能：正常显示钱包选择器</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
