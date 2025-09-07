import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Flex, 
  Text, 
  Button, 
  Separator,
  TextField,
  Spinner
} from '@radix-ui/themes';
import { 
  ThickArrowUpIcon, 
  ThickArrowDownIcon, 
  ChatBubbleIcon,
  PersonIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { Murmur, Comment } from '../types';
import { api } from '../services/api';
import { CommentList } from './CommentList';

interface MurmurCardProps {
  murmur: Murmur;
  onUpdate: (updatedMurmur: Murmur) => void;
}

export const MurmurCard: React.FC<MurmurCardProps> = ({ murmur, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  // 处理点赞/点踩
  const handleReaction = async (reaction: 'like' | 'dislike' | null) => {
    if (isReacting) return;

    try {
      setIsReacting(true);
      setError(null);

      const response = await api.reaction.setReaction({
        targetId: murmur.id,
        targetType: 'murmur',
        reaction: reaction
      });

      if (response.success && response.data) {
        // 更新吐槽数据
        const updatedMurmur = {
          ...murmur,
          likeCount: response.data.likeCount,
          dislikeCount: response.data.dislikeCount,
          userReaction: reaction
        };
        onUpdate(updatedMurmur);
      } else {
        setError(response.error || '操作失败');
      }
    } catch (err) {
      setError('操作时发生错误');
    } finally {
      setIsReacting(false);
    }
  };

  // 发布评论
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      setError('请输入评论内容');
      return;
    }

    try {
      setIsSubmittingComment(true);
      setError(null);

      const response = await api.comment.createComment({
        murmurId: murmur.id,
        content: newComment.trim()
      });

      if (response.success && response.data) {
        // 更新吐槽的评论列表
        const updatedMurmur = {
          ...murmur,
          comments: [...murmur.comments, response.data],
          commentCount: murmur.commentCount + 1
        };
        onUpdate(updatedMurmur);
        setNewComment('');
        setShowComments(true); // 显示评论列表
      } else {
        setError(response.error || '发布评论失败');
      }
    } catch (err) {
      setError('发布评论时发生错误');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Card style={{ padding: 'var(--space-4)' }}>
      {error && (
        <Box p="3" mb="3" style={{ 
          backgroundColor: 'var(--red-3)', 
          border: '1px solid var(--red-6)',
          borderRadius: 'var(--radius-2)',
          color: 'var(--red-11)'
        }}>
          <Text size="2">{error}</Text>
        </Box>
      )}

      {/* 用户信息 */}
      <Flex align="center" gap="2" mb="3">
        <PersonIcon width="16" height="16" />
        <Text weight="medium" size="2">
          {murmur.author.nickname || murmur.author.address.slice(0, 8) + '...'}
        </Text>
        <Text color="gray" size="1">
          •
        </Text>
        <Flex align="center" gap="1">
          <ClockIcon width="12" height="12" />
          <Text color="gray" size="1">
            {formatTime(murmur.createdAt)}
          </Text>
        </Flex>
      </Flex>

      {/* 吐槽内容 */}
      <Text size="3" mb="4" style={{ lineHeight: 1.6 }}>
        {murmur.content}
      </Text>

      {/* 互动按钮 */}
      <Flex align="center" gap="4" mb="3">
        {/* 点赞 */}
        <Button
          variant={murmur.userReaction === 'like' ? 'solid' : 'ghost'}
          color={murmur.userReaction === 'like' ? 'green' : 'gray'}
          size="2"
          onClick={() => handleReaction(murmur.userReaction === 'like' ? null : 'like')}
          disabled={isReacting}
        >
          <ThickArrowUpIcon width="14" height="14" />
          {murmur.likeCount > 0 && (
            <Text size="1" ml="1">
              {murmur.likeCount}
            </Text>
          )}
        </Button>

        {/* 点踩 */}
        <Button
          variant={murmur.userReaction === 'dislike' ? 'solid' : 'ghost'}
          color={murmur.userReaction === 'dislike' ? 'red' : 'gray'}
          size="2"
          onClick={() => handleReaction(murmur.userReaction === 'dislike' ? null : 'dislike')}
          disabled={isReacting}
        >
          <ThickArrowDownIcon width="14" height="14" />
          {murmur.dislikeCount > 0 && (
            <Text size="1" ml="1">
              {murmur.dislikeCount}
            </Text>
          )}
        </Button>

        {/* 评论 */}
        <Button
          variant="ghost"
          color="gray"
          size="2"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleIcon width="14" height="14" />
          {murmur.commentCount > 0 && (
            <Text size="1" ml="1">
              {murmur.commentCount}
            </Text>
          )}
        </Button>
      </Flex>

      {/* 评论区域 */}
      {showComments && (
        <Box>
          <Separator mb="3" />
          
          {/* 发布评论 */}
          <Flex direction="column" gap="2" mb="3">
            <TextField.Root
              placeholder="写下你的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="2"
            />
            <Flex justify="end">
              <Button 
                size="1" 
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? <Spinner size="1" /> : '评论'}
              </Button>
            </Flex>
          </Flex>

          {/* 评论列表 */}
          <CommentList 
            comments={murmur.comments}
            murmurId={murmur.id}
            onUpdate={(updatedComments: Comment[]) => {
              const updatedMurmur = {
                ...murmur,
                comments: updatedComments
              };
              onUpdate(updatedMurmur);
            }}
          />
        </Box>
      )}
    </Card>
  );
};
