import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  TextField, 
  Button, 
  Card, 
  Badge,
  Spinner,
  Separator
} from '@radix-ui/themes';
import { ArrowLeftIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { Circle, Murmur } from '../types';
import { api } from '../services/api';
import { MurmurCard } from './MurmurCard';

interface CircleDetailPageProps {
  circle: Circle;
  onBack: () => void;
}

export const CircleDetailPage: React.FC<CircleDetailPageProps> = ({ 
  circle, 
  onBack 
}) => {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [newMurmurContent, setNewMurmurContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载圈子的吐槽列表
  useEffect(() => {
    const loadMurmurs = async () => {
      try {
        setIsLoading(true);
        const response = await api.murmur.getMurmursByCircleId(circle.id);
        if (response.success && response.data) {
          setMurmurs(response.data);
        } else {
          setError(response.error || '加载吐槽失败');
        }
      } catch (err) {
        setError('加载吐槽时发生错误');
      } finally {
        setIsLoading(false);
      }
    };

    loadMurmurs();
  }, [circle.id]);

  // 发布新吐槽
  const handleSubmitMurmur = async () => {
    if (!newMurmurContent.trim()) {
      setError('请输入吐槽内容');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await api.murmur.createMurmur({
        circleId: circle.id,
        content: newMurmurContent.trim()
      });

      if (response.success && response.data) {
        // 将新吐槽添加到列表顶部
        setMurmurs(prev => [response.data!, ...prev]);
        setNewMurmurContent('');
      } else {
        setError(response.error || '发布吐槽失败');
      }
    } catch (err) {
      setError('发布吐槽时发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化成员数量
  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '今天';
    if (diffInDays === 1) return '昨天';
    if (diffInDays < 7) return `${diffInDays}天前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前`;
    return `${Math.floor(diffInDays / 30)}个月前`;
  };

  return (
    <Container size="3" py="6">
      {/* 头部 */}
      <Flex align="center" gap="3" mb="6">
        <Button variant="ghost" size="2" onClick={onBack}>
          <ArrowLeftIcon />
          返回
        </Button>
        <Box style={{ flex: 1 }}>
          <Flex align="center" gap="2" mb="1">
            <Heading size="6">{circle.name}</Heading>
            <Badge color="green" variant="soft">
              {formatMemberCount(circle.memberCount)} 成员
            </Badge>
          </Flex>
          {circle.description && (
            <Text color="gray" size="3">
              {circle.description}
            </Text>
          )}
          <Text color="gray" size="2" mt="1">
            创建于 {formatDate(circle.createdAt)}
          </Text>
        </Box>
      </Flex>

      {error && (
        <Box p="3" mb="4" style={{ 
          backgroundColor: 'var(--red-3)', 
          border: '1px solid var(--red-6)',
          borderRadius: 'var(--radius-2)',
          color: 'var(--red-11)'
        }}>
          <Text weight="medium">错误</Text>
          <Text size="2">{error}</Text>
        </Box>
      )}

      {/* 发布吐槽 */}
      <Card style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Heading size="4" mb="3">发布吐槽</Heading>
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="分享你的想法和吐槽..."
            value={newMurmurContent}
            onChange={(e) => setNewMurmurContent(e.target.value)}
            style={{ minHeight: '80px' }}
          />
          <Flex justify="end">
            <Button 
              onClick={handleSubmitMurmur}
              disabled={isSubmitting || !newMurmurContent.trim()}
            >
              {isSubmitting ? <Spinner size="1" /> : '发布'}
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Separator mb="4" />

      {/* 吐槽列表 */}
      <Box>
        <Flex align="center" gap="2" mb="4">
          <ChatBubbleIcon />
          <Heading size="4">吐槽动态</Heading>
          <Badge variant="soft" color="gray">
            {murmurs.length}
          </Badge>
        </Flex>

        {isLoading ? (
          <Flex align="center" justify="center" py="8">
            <Spinner size="3" />
            <Text ml="3">加载中...</Text>
          </Flex>
        ) : murmurs.length === 0 ? (
          <Card style={{ padding: 'var(--space-6)' }}>
            <Flex direction="column" align="center" gap="3">
              <Text color="gray" size="3">
                还没有任何吐槽
              </Text>
              <Text color="gray" size="2">
                成为第一个分享想法的人吧！
              </Text>
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="4">
            {murmurs.map((murmur) => (
              <MurmurCard 
                key={murmur.id} 
                murmur={murmur}
                onUpdate={(updatedMurmur: Murmur) => {
                  setMurmurs(prev => 
                    prev.map(m => m.id === updatedMurmur.id ? updatedMurmur : m)
                  );
                }}
              />
            ))}
          </Flex>
        )}
      </Box>
    </Container>
  );
};
