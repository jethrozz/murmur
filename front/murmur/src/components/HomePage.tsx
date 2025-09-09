import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Card, 
  Spinner
} from '@radix-ui/themes';
import DomeGallery from "./DomeGallery.tsx";
import TextType from './TextType.tsx';

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Circle } from '../types';
import { api } from '../services/api';

interface HomePageProps {
  onCircleSelect: (circle: Circle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCircleSelect }) => {
  const account = useCurrentAccount();
  const [joinedCircles, setJoinedCircles] = useState<Circle[]>([]);
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
        <TextType
          text="吐个槽吧，没有人知道是你"
          className="text-2xl font-bold"
          typingSpeed={50}
          initialDelay={1000}
          pauseDuration={2000}
        />
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
                  快去搜索一下吧！
                </Text>
              </Flex>
            </Card>
          ) : (
            <div style={{ width: '80vw', height: '80vh', margin: '5rem auto' }}>
            <DomeGallery 
              circles={joinedCircles}
              onCircleSelect={onCircleSelect}
            />
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
