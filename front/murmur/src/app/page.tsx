import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { MessageSquare, Shield, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            欢迎来到 <span className="text-blue-600">Murmur</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            基于Sui链的匿名吐槽墙，在这里你可以安全地分享想法，创建专属圈子，通过NFT控制访问权限
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/circles">
              <Button size="lg" className="w-full sm:w-auto">
                进入我的圈子
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">匿名吐槽</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                在保护隐私的前提下，安全地分享你的想法和吐槽
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">圈子社区</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                创建或加入感兴趣的圈子，与志同道合的人交流
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">NFT权限</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                通过NFT门票控制圈子访问权限，确保内容安全
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">区块链技术</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                基于Sui区块链，去中心化、透明、不可篡改
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">如何使用</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">连接钱包</h3>
              <p className="text-gray-600">
                使用Sui钱包连接，获得访问权限
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">加入圈子</h3>
              <p className="text-gray-600">
                浏览现有圈子或创建新的专属圈子
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">开始吐槽</h3>
              <p className="text-gray-600">
                在圈子中匿名发布吐槽，与其他用户互动
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
