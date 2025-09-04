'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ConfirmModal } from '@/components/ui/Modal';
import { apiService, Circle } from '@/services/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Search, Users, MessageSquare, Calendar, Shuffle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CirclesPage() {
  const account = useCurrentAccount();
  const router = useRouter();
  const [userCircles, setUserCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Circle[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    circle: Circle | null;
  }>({ isOpen: false, circle: null });

  const fetchUserCircles = async () => {
    try {
      setLoading(true);
      const result = await apiService.getUserCircles();
      
      if (result.success && result.data) {
        setUserCircles(result.data.circles);
      } else {
        console.error('获取用户圈子失败:', result.message);
      }
    } catch (error) {
      console.error('获取用户圈子时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    setSearchLoading(true);
    try {
      const result = await apiService.searchCircles(searchTerm);
      
      if (result.success && result.data) {
        setSearchResults(result.data.circles);
        setShowSearchResults(true);
      } else {
        console.error('搜索圈子失败:', result.message);
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('搜索圈子时出错:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCircleClick = (circle: Circle) => {
    setConfirmModal({ isOpen: true, circle });
  };

  const handleConfirmEnter = () => {
    if (confirmModal.circle) {
      router.push(`/circles/${confirmModal.circle.id}`);
    }
  };

  const handleRandomEnter = () => {
    setShowSearchResults(true);
  };

  useEffect(() => {
    if (account) {
      fetchUserCircles();
    }
  }, [account]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN');
  };

  if (!account) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先连接钱包</h2>
          <p className="text-gray-600">连接钱包后才能查看和加入圈子</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的圈子</h1>
          <p className="text-gray-600 mt-2">管理你已加入的吐槽圈子</p>
        </div>

        {/* 随机进入入口 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shuffle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">随机进入</h3>
                  <p className="text-gray-600">搜索或创建新的圈子</p>
                </div>
              </div>
              <Button onClick={handleRandomEnter} variant="outline">
                开始探索
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 搜索框 - 只在显示搜索结果时出现 */}
        {showSearchResults && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="搜索圈子名称或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  loading={searchLoading}
                  className="px-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  搜索
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                >
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 搜索结果 */}
        {showSearchResults && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">搜索结果</h2>
            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">未找到相关圈子</h3>
                  <p className="text-gray-600 mb-4">
                    没有找到匹配的圈子，是否要创建一个新圈子？
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建新圈子
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((circle) => (
                  <Card key={circle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{circle.name}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          circle.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {circle.is_active ? '活跃' : '非活跃'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {circle.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {circle.total_members} 成员
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {circle.murmur_count} 条吐槽
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(circle.created_at)}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleCircleClick(circle)}
                      >
                        进入圈子
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 用户已加入的圈子 */}
        {!showSearchResults && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">已加入的圈子</h2>
            {userCircles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有加入任何圈子</h3>
                  <p className="text-gray-600 mb-4">
                    点击上方的"开始探索"来搜索和加入圈子吧！
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userCircles.map((circle) => (
                  <Card key={circle.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCircleClick(circle)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{circle.name}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          circle.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {circle.is_active ? '活跃' : '非活跃'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {circle.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {circle.total_members} 成员
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {circle.murmur_count} 条吐槽
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(circle.created_at)}
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        进入圈子
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 确认进入圈子对话框 */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, circle: null })}
          onConfirm={handleConfirmEnter}
          title="确认进入圈子"
          message={`确定要进入圈子"${confirmModal.circle?.name}"吗？`}
          confirmText="进入"
          cancelText="取消"
        />
      </div>
    </Layout>
  );
}
