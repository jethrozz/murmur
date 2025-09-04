// API服务层 - 用于后期对接后端接口

export interface Circle {
  id: string;
  name: string;
  description: string;
  created_at: number;
  creator: string;
  murmur_count: number;
  is_active: boolean;
  total_members: number;
}

export interface Murmur {
  id: string;
  circle_id: string;
  content: string;
  created_at: number;
  author: string;
  likes: number;
  dislikes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CirclesResponse {
  circles: Circle[];
  total: number;
  limit: number;
  offset: number;
}

export interface MurmursResponse {
  murmurs: Murmur[];
  total: number;
  limit: number;
  offset: number;
}

// 模拟数据
const mockCircles: Circle[] = [
  {
    id: '1',
    name: '程序员吐槽大会',
    description: '程序员们的日常吐槽，代码bug、产品需求、加班生活...',
    created_at: Math.floor(Date.now() / 1000) - 86400 * 7,
    creator: '0x123...abc',
    murmur_count: 156,
    is_active: true,
    total_members: 89
  },
  {
    id: '2',
    name: '学生党日常',
    description: '学生们的学习生活吐槽，考试、作业、宿舍生活...',
    created_at: Math.floor(Date.now() / 1000) - 86400 * 5,
    creator: '0x456...def',
    murmur_count: 89,
    is_active: true,
    total_members: 45
  },
  {
    id: '3',
    name: '职场新人',
    description: '职场新人的成长烦恼，工作压力、人际关系、职业规划...',
    created_at: Math.floor(Date.now() / 1000) - 86400 * 3,
    creator: '0x789...ghi',
    murmur_count: 67,
    is_active: true,
    total_members: 32
  }
];

const mockMurmurs: Murmur[] = [
  {
    id: '1',
    circle_id: '1',
    content: '今天又遇到了一个神奇的bug，明明昨天还能跑，今天就报错了...',
    created_at: Math.floor(Date.now() / 1000) - 3600 * 2,
    author: '0xabc...123',
    likes: 12,
    dislikes: 1
  },
  {
    id: '2',
    circle_id: '1',
    content: '产品经理又改需求了，这已经是这周第三次了...',
    created_at: Math.floor(Date.now() / 1000) - 3600 * 4,
    author: '0xdef...456',
    likes: 8,
    dislikes: 0
  }
];

// API服务类
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  // 获取用户已加入的圈子
  async getUserCircles(): Promise<ApiResponse<CirclesResponse>> {
    // TODO: 后期对接真实API
    // const response = await fetch(`${this.baseUrl}/api/user/circles`);
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            circles: mockCircles,
            total: mockCircles.length,
            limit: 20,
            offset: 0
          }
        });
      }, 500);
    });
  }

  // 搜索圈子
  async searchCircles(keyword: string): Promise<ApiResponse<CirclesResponse>> {
    // TODO: 后期对接真实API
    // const response = await fetch(`${this.baseUrl}/api/circles/search?name=${encodeURIComponent(keyword)}`);
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredCircles = mockCircles.filter(circle => 
          circle.name.toLowerCase().includes(keyword.toLowerCase()) ||
          circle.description.toLowerCase().includes(keyword.toLowerCase())
        );
        
        resolve({
          success: true,
          data: {
            circles: filteredCircles,
            total: filteredCircles.length,
            limit: 20,
            offset: 0
          }
        });
      }, 300);
    });
  }

  // 创建圈子
  async createCircle(name: string, description: string): Promise<ApiResponse<Circle>> {
    // TODO: 后期对接真实API和智能合约
    // const response = await fetch(`${this.baseUrl}/api/circles`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, description })
    // });
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCircle: Circle = {
          id: Date.now().toString(),
          name,
          description,
          created_at: Math.floor(Date.now() / 1000),
          creator: '0xcurrent...user',
          murmur_count: 0,
          is_active: true,
          total_members: 1
        };
        
        resolve({
          success: true,
          data: newCircle
        });
      }, 1000);
    });
  }

  // 获取圈子详情
  async getCircleById(id: string): Promise<ApiResponse<Circle>> {
    // TODO: 后期对接真实API
    // const response = await fetch(`${this.baseUrl}/api/circles/${id}`);
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const circle = mockCircles.find(c => c.id === id);
        if (circle) {
          resolve({
            success: true,
            data: circle
          });
        } else {
          resolve({
            success: false,
            message: '圈子不存在'
          });
        }
      }, 300);
    });
  }

  // 获取圈子的吐槽列表
  async getCircleMurmurs(circleId: string, limit: number = 20, offset: number = 0): Promise<ApiResponse<MurmursResponse>> {
    // TODO: 后期对接真实API
    // const response = await fetch(`${this.baseUrl}/api/circles/${circleId}/murmurs?limit=${limit}&offset=${offset}`);
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const circleMurmurs = mockMurmurs.filter(murmur => murmur.circle_id === circleId);
        
        resolve({
          success: true,
          data: {
            murmurs: circleMurmurs,
            total: circleMurmurs.length,
            limit,
            offset
          }
        });
      }, 300);
    });
  }

  // 发布吐槽
  async publishMurmur(circleId: string, content: string): Promise<ApiResponse<Murmur>> {
    // TODO: 后期对接真实API和智能合约
    // const response = await fetch(`${this.baseUrl}/api/circles/${circleId}/murmurs`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content })
    // });
    // return response.json();
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMurmur: Murmur = {
          id: Date.now().toString(),
          circle_id: circleId,
          content,
          created_at: Math.floor(Date.now() / 1000),
          author: '0xcurrent...user',
          likes: 0,
          dislikes: 0
        };
        
        resolve({
          success: true,
          data: newMurmur
        });
      }, 1000);
    });
  }
}

// 导出默认实例
export const apiService = new ApiService();
