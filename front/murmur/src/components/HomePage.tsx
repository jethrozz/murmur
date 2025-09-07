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
  Spinner,
  Grid
} from '@radix-ui/themes';
import DomeGallery from "./DomeGallery.tsx";

import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Circle } from '../types';
import { api } from '../services/api';

interface HomePageProps {
  onCircleSelect: (circle: Circle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCircleSelect }) => {
  const account = useCurrentAccount();
  const [joinedCircles, setJoinedCircles] = useState<Circle[]>([]);
  const [searchResults, setSearchResults] = useState<Circle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载已加入的圈子
  useEffect(() => {
    const loadJoinedCircles = async () => {
      if (!account) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.circle.getJoinedCircles();
        if (response.success && response.data) {
          setJoinedCircles(response.data);
        } else {
          setError(response.error || '加载圈子失败');
        }
      } catch (err) {
        setError('加载圈子时发生错误');
      } finally {
        setIsLoading(false);
      }
    };

    loadJoinedCircles();
  }, [account]);

  // 搜索圈子
  const handleSearch = async () => {
    if (!account) {
      setError('请先连接钱包');
      return;
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await api.circle.searchCircles({ query: searchQuery });
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        setError(response.error || '搜索失败');
      }
    } catch (err) {
      setError('搜索时发生错误');
    } finally {
      setIsSearching(false);
    }
  };

  // 加入圈子
  const handleJoinCircle = async (circle: Circle) => {
    try {
      const response = await api.circle.joinCircle({ circleId: circle.id });
      if (response.success && response.data) {
        // 更新已加入圈子列表
        setJoinedCircles(prev => [...prev, response.data!]);
        // 从搜索结果中移除
        setSearchResults(prev => prev.filter(c => c.id !== circle.id));
        // 清空搜索框
        setSearchQuery('');
      } else {
        setError(response.error || '加入圈子失败');
      }
    } catch (err) {
      setError('加入圈子时发生错误');
    }
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

  if (isLoading) {
    return (
      <Container size="3" py="6">
        <Flex align="center" justify="center" py="8">
          <Spinner size="3" />
          <Text ml="3">加载中...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="3" py="6">
      <Box mb="6">
        <Heading size="8" mb="2">吐槽圈</Heading>
        <Text color="gray" size="3">
          在这里找到志同道合的朋友，分享你的吐槽和想法
        </Text>
      </Box>

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

      {/* 搜索圈子 */}


      {/* 已加入的圈子 */}
      {account && (
        <Box>
         
          {joinedCircles.length === 0 ? (
            <Card style={{ padding: 'var(--space-6)' }}>
              <Flex direction="column" align="center" gap="3">
                <Text color="gray" size="3">
                  你还没有加入任何圈子
                </Text>
                <Text color="gray" size="2">
                  使用搜索功能找到感兴趣的圈子并加入吧！
                </Text>
              </Flex>
            </Card>
          ) : (
            <div style={{ width: '80vw', height: '80vh', margin: '80px auto' }}>
            <DomeGallery />
            </div>
          )}
        </Box>
      )}

      {/* 未连接钱包时的提示 */}
      {!account && (
        <Box>
          <Card style={{ padding: 'var(--space-6)' }}>
            <Flex direction="column" align="center" gap="3">
              <Text color="gray" size="3">
                请先连接钱包
              </Text>
              <Text color="gray" size="2">
                连接钱包后即可浏览已加入的圈子和搜索新圈子
              </Text>
            </Flex>
          </Card>
        </Box>
      )}
    </Container>
  );
};
