import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button
} from '@radix-ui/themes';
import { 
  ThickArrowUpIcon, 
  ThickArrowDownIcon, 
  PersonIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { Comment } from '../types';
import { api } from '../services/api';

interface CommentListProps {
  comments: Comment[];
  murmurId: string;
  onUpdate: (updatedComments: Comment[]) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate 
}) => {
  const [reactingCommentId, setReactingCommentId] = useState<string | null>(null);
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

  // 处理评论的点赞/点踩
  const handleCommentReaction = async (comment: Comment, reaction: 'like' | 'dislike' | null) => {
    if (reactingCommentId) return;

    try {
      setReactingCommentId(comment.id);
      setError(null);

      const response = await api.reaction.setReaction({
        targetId: comment.id,
        targetType: 'comment',
        reaction: reaction
      });

      if (response.success && response.data) {
        // 更新评论数据
        const updatedComment = {
          ...comment,
          likeCount: response.data.likeCount,
          dislikeCount: response.data.dislikeCount,
          userReaction: reaction
        };

        const updatedComments = comments.map(c => 
          c.id === comment.id ? updatedComment : c
        );
        onUpdate(updatedComments);
      } else {
        setError(response.error || '操作失败');
      }
    } catch (err) {
      setError('操作时发生错误');
    } finally {
      setReactingCommentId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <Box>
        <Text color="gray" size="2" style={{ fontStyle: 'italic' }}>
          还没有评论，来抢沙发吧！
        </Text>
      </Box>
    );
  }

  return (
    <Box>
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

      <Flex direction="column" gap="3">
        {comments.map((comment) => (
          <Box key={comment.id} pl="4" style={{ borderLeft: '2px solid var(--gray-a3)' }}>
            {/* 评论用户信息 */}
            <Flex align="center" gap="2" mb="2">
              <PersonIcon width="14" height="14" />
              <Text weight="medium" size="1">
                {comment.author.nickname || comment.author.address.slice(0, 8) + '...'}
              </Text>
              <Text color="gray" size="1">
                •
              </Text>
              <Flex align="center" gap="1">
                <ClockIcon width="10" height="10" />
                <Text color="gray" size="1">
                  {formatTime(comment.createdAt)}
                </Text>
              </Flex>
            </Flex>

            {/* 评论内容 */}
            <Text size="2" mb="2" style={{ lineHeight: 1.5 }}>
              {comment.content}
            </Text>

            {/* 评论互动按钮 */}
            <Flex align="center" gap="3">
              {/* 点赞 */}
              <Button
                variant={comment.userReaction === 'like' ? 'solid' : 'ghost'}
                color={comment.userReaction === 'like' ? 'green' : 'gray'}
                size="1"
                onClick={() => handleCommentReaction(
                  comment, 
                  comment.userReaction === 'like' ? null : 'like'
                )}
                disabled={reactingCommentId === comment.id}
              >
                <ThickArrowUpIcon width="12" height="12" />
                {comment.likeCount > 0 && (
                  <Text size="1" ml="1">
                    {comment.likeCount}
                  </Text>
                )}
              </Button>

              {/* 点踩 */}
              <Button
                variant={comment.userReaction === 'dislike' ? 'solid' : 'ghost'}
                color={comment.userReaction === 'dislike' ? 'red' : 'gray'}
                size="1"
                onClick={() => handleCommentReaction(
                  comment, 
                  comment.userReaction === 'dislike' ? null : 'dislike'
                )}
                disabled={reactingCommentId === comment.id}
              >
                <ThickArrowDownIcon width="12" height="12" />
                {comment.dislikeCount > 0 && (
                  <Text size="1" ml="1">
                    {comment.dislikeCount}
                  </Text>
                )}
              </Button>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
