'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { apiService, Circle, Murmur } from '@/services/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ArrowLeft, Users, MessageSquare, Calendar, Heart, ThumbsDown, Send } from 'lucide-react';

export default function CircleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const account = useCurrentAccount();
  const circleId = params.id as string;
  
  const [circle, setCircle] = useState<Circle | null>(null);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [murmursLoading, setMurmursLoading] = useState(false);
  const [newMurmur, setNewMurmur] = useState('');
  const [publishing, setPublishing] = useState(false);

  const fetchCircle = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCircleById(circleId);
      
      if (result.success && result.data) {
        setCircle(result.data);
      } else {
        console.error('获取圈子详情失败:', result.message);
        router.push('/circles');
      }
    } catch (error) {
      console.error('获取圈子详情时出错:', error);
      router.push('/circles');
    } finally {
      setLoading(false);
    }
  };

  const fetchMurmurs = async () => {
    try {
      setMurmursLoading(true);
      const result = await apiService.getCircleMurmurs(circleId);
      
      if (result.success && result.data) {
        setMurmurs(result.data.murmurs);
      } else {
        console.error('获取吐槽列表失败:', result.message);
      }
    } catch (error) {
      console.error('获取吐槽列表时出错:', error);
    } finally {
      setMurmursLoading(false);
    }
  };

  const handlePublishMurmur = async () => {
    if (!newMurmur.trim() || !account) return;
    
    try {
      setPublishing(true);
      const result = await apiService.publishMurmur(circleId, newMurmur.trim());
      
      if (result.success && result.data) {
        setNewMurmur('');
        // 重新获取吐槽列表
        await fetchMurmurs();
        // 更新圈子统计
        if (circle) {
          setCircle({
            ...circle,
            murmur_count: circle.murmur_count + 1
          });
        }
      } else {
        console.error('发布吐槽失败:', result.message);
        alert('发布吐槽失败，请重试');
      }
    } catch (error) {
      console.error('发布吐槽时出错:', error);
      alert('发布吐槽时出错，请重试');
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    if (circleId) {
      fetchCircle();
      fetchMurmurs();
    }
  }, [circleId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
    return formatDate(timestamp);
  };

  if (!account) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先连接钱包</h2>
          <p className="text-gray-600">连接钱包后才能查看圈子内容</p>
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

  if (!circle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">圈子不存在</h2>
          <p className="text-gray-600 mb-4">该圈子可能已被删除或不存在</p>
          <Button onClick={() => router.push('/circles')}>
            返回圈子列表
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* 返回按钮和圈子信息 */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/circles')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{circle.name}</h1>
            <p className="text-gray-600 mt-1">{circle.description}</p>
          </div>
        </div>

        {/* 圈子统计信息 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{circle.total_members}</div>
                <div className="text-sm text-gray-600">成员</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{circle.murmur_count}</div>
                <div className="text-sm text-gray-600">吐槽</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatDate(circle.created_at)}</div>
                <div className="text-sm text-gray-600">创建时间</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 发布吐槽 */}
        <Card>
          <CardHeader>
            <CardTitle>发布吐槽</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="在这里分享你的想法..."
                value={newMurmur}
                onChange={(e) => setNewMurmur(e.target.value)}
                rows={4}
                maxLength={1000}
                helperText={`${newMurmur.length}/1000`}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handlePublishMurmur}
                  disabled={!newMurmur.trim() || publishing}
                  loading={publishing}
                  className="flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>发布</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 吐槽列表 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">最新吐槽</h2>
          
          {murmursLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : murmurs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有吐槽</h3>
                <p className="text-gray-600">成为第一个在这个圈子发布吐槽的人吧！</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {murmurs.map((murmur) => (
                <Card key={murmur.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-gray-800 leading-relaxed">{murmur.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatRelativeTime(murmur.created_at)}</span>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{murmur.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{murmur.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
