import { 
  ApiResponse, 
  Circle, 
  Murmur, 
  Comment, 
  SearchCircleRequest, 
  JoinCircleRequest, 
  CreateMurmurRequest, 
  CreateCommentRequest, 
  ReactionRequest 
} from '../types';

// 配置API基础URL - 这里预留接口对接位置
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 通用请求函数 - 预留用于真实API对接
// const request = async <T>(
//   endpoint: string, 
//   options: RequestInit = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('API request failed:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//   }
// };

// 圈子相关API
export const circleApi = {
  // 获取用户已加入的圈子
  getJoinedCircles: async (): Promise<ApiResponse<Circle[]>> => {
    // TODO: 对接真实接口
    // return request<Circle[]>('/circles/joined');
    
    // 临时使用模拟数据
    const { getJoinedCircles } = await import('../data/mockData');
    return {
      success: true,
      data: getJoinedCircles()
    };
  },

  // 搜索圈子
  searchCircles: async (request: SearchCircleRequest): Promise<ApiResponse<Circle[]>> => {
    // TODO: 对接真实接口
    // return request<Circle[]>('/circles/search', {
    //   method: 'POST',
    //   body: JSON.stringify(request)
    // });
    
    // 临时使用模拟数据
    const { searchCircles } = await import('../data/mockData');
    return {
      success: true,
      data: searchCircles(request.query)
    };
  },

  // 加入圈子
  joinCircle: async (request: JoinCircleRequest): Promise<ApiResponse<Circle>> => {
    // TODO: 对接真实接口
    // return request<Circle>('/circles/join', {
    //   method: 'POST',
    //   body: JSON.stringify(request)
    // });
    
    // 临时使用模拟数据
    const { getCircleById } = await import('../data/mockData');
    const circle = getCircleById(request.circleId);
    if (circle) {
      circle.isJoined = true;
      circle.memberCount += 1;
    }
    return {
      success: true,
      data: circle
    };
  },

  // 获取圈子详情
  getCircleById: async (id: string): Promise<ApiResponse<Circle>> => {
    // TODO: 对接真实接口
    // return request<Circle>(`/circles/${id}`);
    
    // 临时使用模拟数据
    const { getCircleById } = await import('../data/mockData');
    const circle = getCircleById(id);
    return {
      success: true,
      data: circle
    };
  }
};

// 吐槽相关API
export const murmurApi = {
  // 获取圈子的吐槽列表
  getMurmursByCircleId: async (circleId: string): Promise<ApiResponse<Murmur[]>> => {
    // TODO: 对接真实接口
    // return request<Murmur[]>(`/circles/${circleId}/murmurs`);
    
    // 临时使用模拟数据
    const { getMurmursByCircleId } = await import('../data/mockData');
    return {
      success: true,
      data: getMurmursByCircleId(circleId)
    };
  },

  // 发布吐槽
  createMurmur: async (requestData: CreateMurmurRequest): Promise<ApiResponse<Murmur>> => {
    // TODO: 对接真实接口
    // return request<Murmur>('/murmurs', {
    //   method: 'POST',
    //   body: JSON.stringify(request)
    // });
    
    // 临时使用模拟数据 - 这里应该创建新的吐槽
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        circleId: requestData.circleId,
        authorId: '1', // 临时使用固定用户ID
        author: {
          id: '1',
          address: '0x1234567890abcdef',
          nickname: '当前用户'
        },
        content: requestData.content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        dislikeCount: 0,
        commentCount: 0,
        userReaction: null,
        comments: []
      }
    };
  },

  // 获取吐槽详情
  getMurmurById: async (id: string): Promise<ApiResponse<Murmur>> => {
    // TODO: 对接真实接口
    // return request<Murmur>(`/murmurs/${id}`);
    
    // 临时使用模拟数据
    const { getMurmurById } = await import('../data/mockData');
    const murmur = getMurmurById(id);
    return {
      success: true,
      data: murmur
    };
  }
};

// 评论相关API
export const commentApi = {
  // 获取吐槽的评论列表
  getCommentsByMurmurId: async (murmurId: string): Promise<ApiResponse<Comment[]>> => {
    // TODO: 对接真实接口
    // return request<Comment[]>(`/murmurs/${murmurId}/comments`);
    
    // 临时使用模拟数据
    const { getCommentsByMurmurId } = await import('../data/mockData');
    return {
      success: true,
      data: getCommentsByMurmurId(murmurId)
    };
  },

  // 发布评论
  createComment: async (requestData: CreateCommentRequest): Promise<ApiResponse<Comment>> => {
    // TODO: 对接真实接口
    // return request<Comment>('/comments', {
    //   method: 'POST',
    //   body: JSON.stringify(request)
    // });
    
    // 临时使用模拟数据
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        murmurId: requestData.murmurId,
        authorId: '1', // 临时使用固定用户ID
        author: {
          id: '1',
          address: '0x1234567890abcdef',
          nickname: '当前用户'
        },
        content: requestData.content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        dislikeCount: 0,
        userReaction: null
      }
    };
  }
};

// 互动相关API
export const reactionApi = {
  // 点赞/点踩
  setReaction: async (_requestData: ReactionRequest): Promise<ApiResponse<{ likeCount: number; dislikeCount: number }>> => {
    // TODO: 对接真实接口
    // return request<{ likeCount: number; dislikeCount: number }>('/reactions', {
    //   method: 'POST',
    //   body: JSON.stringify(request)
    // });
    
    // 临时使用模拟数据
    // 在实际实现中，这里会根据requestData来更新具体的点赞/点踩数据
    return {
      success: true,
      data: {
        likeCount: Math.floor(Math.random() * 50),
        dislikeCount: Math.floor(Math.random() * 10)
      }
    };
  }
};

// 导出所有API
export const api = {
  circle: circleApi,
  murmur: murmurApi,
  comment: commentApi,
  reaction: reactionApi
};
