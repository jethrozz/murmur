import { User, Circle, Murmur, Comment } from '../types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    address: '0x1234567890abcdef',
    nickname: '吐槽达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
  },
  {
    id: '2',
    address: '0xabcdef1234567890',
    nickname: '匿名用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2'
  },
  {
    id: '3',
    address: '0x9876543210fedcba',
    nickname: '圈内老司机',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3'
  },
  {
    id: '4',
    address: '0xfedcba0987654321',
    nickname: '新手上路',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4'
  },
  {
    id: '5',
    address: '0x1111222233334444',
    nickname: '技术大牛',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5'
  },
  {
    id: '6',
    address: '0x5555666677778888',
    nickname: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6'
  },
  {
    id: '7',
    address: '0x9999aaaabbbbcccc',
    nickname: '设计师小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7'
  },
  {
    id: '8',
    address: '0xdddd1111eeee2222',
    nickname: '运营小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8'
  }
];

// 模拟圈子数据
export const mockCircles: Circle[] = [
  {
    id: '1',
    name: '程序员吐槽圈',
    description: '程序员们的日常吐槽，代码bug、产品需求、加班日常',
    memberCount: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    isJoined: true
  },
  {
    id: '2',
    name: '学生党吐槽圈',
    description: '学生们的学习生活吐槽，作业、考试、宿舍生活',
    memberCount: 890,
    createdAt: '2024-01-20T14:30:00Z',
    isJoined: true
  },
  {
    id: '3',
    name: '打工人吐槽圈',
    description: '职场打工人的日常，工作压力、同事关系、薪资待遇',
    memberCount: 2100,
    createdAt: '2024-01-10T09:15:00Z',
    isJoined: false
  },
  {
    id: '4',
    name: '游戏玩家吐槽圈',
    description: '游戏玩家的游戏体验分享，bug吐槽、平衡性讨论',
    memberCount: 750,
    createdAt: '2024-01-25T16:45:00Z',
    isJoined: true
  },
  {
    id: '5',
    name: '美食爱好者吐槽圈',
    description: '美食相关的吐槽，餐厅服务、外卖体验、厨艺分享',
    memberCount: 450,
    createdAt: '2024-02-01T12:00:00Z',
    isJoined: false
  },
  {
    id: '6',
    name: '健身达人吐槽圈',
    description: '健身路上的酸甜苦辣，器材、教练、饮食控制',
    memberCount: 680,
    createdAt: '2024-02-05T08:30:00Z',
    isJoined: true
  },
  {
    id: '7',
    name: '宠物主人吐槽圈',
    description: '铲屎官的日常，宠物拆家、看病、训练',
    memberCount: 920,
    createdAt: '2024-02-08T15:45:00Z',
    isJoined: true
  },
  {
    id: '8',
    name: '旅行者吐槽圈',
    description: '旅行中的各种遭遇，航班延误、酒店服务、景点坑',
    memberCount: 750,
    createdAt: '2024-02-12T11:20:00Z',
    isJoined: false
  },
  {
    id: '9',
    name: '电影爱好者吐槽圈',
    description: '观影体验分享，烂片吐槽、好片推荐、影院服务',
    memberCount: 1100,
    createdAt: '2024-02-15T19:00:00Z',
    isJoined: true
  },
  {
    id: '10',
    name: '音乐人吐槽圈',
    description: '音乐创作和表演的酸甜苦辣，设备、演出、版权',
    memberCount: 320,
    createdAt: '2024-02-18T14:15:00Z',
    isJoined: false
  },
  {
    id: '11',
    name: '读书人吐槽圈',
    description: '阅读体验分享，好书推荐、烂书避雷、书店服务',
    memberCount: 850,
    createdAt: '2024-02-22T10:30:00Z',
    isJoined: true
  },
  {
    id: '12',
    name: '摄影爱好者吐槽圈',
    description: '摄影路上的各种坑，设备、后期、客户要求',
    memberCount: 640,
    createdAt: '2024-02-25T16:45:00Z',
    isJoined: false
  },
  {
    id: '13',
    name: '咖啡控吐槽圈',
    description: '咖啡文化分享，豆子、设备、咖啡店体验',
    memberCount: 480,
    createdAt: '2024-02-28T09:15:00Z',
    isJoined: true
  },
  {
    id: '14',
    name: '科技数码吐槽圈',
    description: '数码产品使用体验，新品发布、系统更新、客服',
    memberCount: 1350,
    createdAt: '2024-03-02T13:20:00Z',
    isJoined: true
  },
  {
    id: '15',
    name: '汽车爱好者吐槽圈',
    description: '汽车相关话题，购车、保养、驾驶体验',
    memberCount: 780,
    createdAt: '2024-03-05T17:30:00Z',
    isJoined: false
  },
  {
    id: '16',
    name: '家居装修吐槽圈',
    description: '装修路上的各种坑，材料、工人、设计',
    memberCount: 420,
    createdAt: '2024-03-08T12:00:00Z',
    isJoined: true
  },
  {
    id: '17',
    name: '育儿经验吐槽圈',
    description: '带娃路上的酸甜苦辣，教育、医疗、生活',
    memberCount: 950,
    createdAt: '2024-03-12T08:45:00Z',
    isJoined: false
  },
  {
    id: '18',
    name: '投资理财吐槽圈',
    description: '投资路上的各种坑，股票、基金、理财产品',
    memberCount: 680,
    createdAt: '2024-03-15T15:30:00Z',
    isJoined: true
  },
  {
    id: '19',
    name: '运动健身吐槽圈',
    description: '各种运动的体验分享，装备、教练、场地',
    memberCount: 720,
    createdAt: '2024-03-18T11:15:00Z',
    isJoined: false
  },
  {
    id: '20',
    name: '二次元吐槽圈',
    description: '动漫、游戏、手办相关话题，新番、活动、周边',
    memberCount: 1200,
    createdAt: '2024-03-22T20:00:00Z',
    isJoined: true
  }
];

// 模拟评论数据
export const mockComments: Comment[] = [
  {
    id: '1',
    murmurId: '1',
    authorId: '2',
    author: mockUsers[1],
    content: '哈哈，这个bug我也遇到过，调试了一整天',
    createdAt: '2024-02-10T10:30:00Z',
    likeCount: 5,
    dislikeCount: 0,
    userReaction: 'like'
  },
  {
    id: '2',
    murmurId: '1',
    authorId: '3',
    author: mockUsers[2],
    content: '建议用try-catch包装一下，避免程序崩溃',
    createdAt: '2024-02-10T11:15:00Z',
    likeCount: 8,
    dislikeCount: 1,
    userReaction: null
  },
  {
    id: '3',
    murmurId: '2',
    authorId: '1',
    author: mockUsers[0],
    content: '同感，现在的作业量确实有点多',
    createdAt: '2024-02-10T14:20:00Z',
    likeCount: 3,
    dislikeCount: 0,
    userReaction: 'like'
  },
  {
    id: '4',
    murmurId: '3',
    authorId: '4',
    author: mockUsers[3],
    content: '这个游戏确实有很多问题，希望官方能修复',
    createdAt: '2024-02-10T16:45:00Z',
    likeCount: 12,
    dislikeCount: 2,
    userReaction: 'like'
  }
];

// 模拟吐槽数据
export const mockMurmurs: Murmur[] = [
  {
    id: '1',
    circleId: '1',
    authorId: '1',
    author: mockUsers[0],
    content: '今天又遇到了一个奇怪的bug，明明代码逻辑没问题，但就是报错。最后发现是数据类型转换的问题，浪费了我两个小时😤',
    createdAt: '2024-02-10T09:30:00Z',
    likeCount: 15,
    dislikeCount: 2,
    commentCount: 2,
    userReaction: 'like',
    comments: mockComments.filter(c => c.murmurId === '1')
  },
  {
    id: '2',
    circleId: '2',
    authorId: '2',
    author: mockUsers[1],
    content: '这学期的作业量真的是太多了，每天都要熬夜到很晚。老师还要求我们每门课都要写5000字的论文，感觉时间完全不够用😭',
    createdAt: '2024-02-10T13:45:00Z',
    likeCount: 28,
    dislikeCount: 1,
    commentCount: 1,
    userReaction: null,
    comments: mockComments.filter(c => c.murmurId === '2')
  },
  {
    id: '3',
    circleId: '4',
    authorId: '3',
    author: mockUsers[2],
    content: '新出的这个游戏平衡性太差了，某些角色强得离谱，完全没法玩。官方什么时候能修复一下？',
    createdAt: '2024-02-10T15:20:00Z',
    likeCount: 42,
    dislikeCount: 5,
    commentCount: 1,
    userReaction: 'dislike',
    comments: mockComments.filter(c => c.murmurId === '3')
  },
  {
    id: '4',
    circleId: '1',
    authorId: '4',
    author: mockUsers[3],
    content: '产品经理又改需求了，说这个功能不够炫酷，要重新设计。我们之前的工作都白做了，又要加班了😫',
    createdAt: '2024-02-10T17:10:00Z',
    likeCount: 33,
    dislikeCount: 3,
    commentCount: 0,
    userReaction: 'like',
    comments: []
  },
  {
    id: '5',
    circleId: '2',
    authorId: '1',
    author: mockUsers[0],
    content: '宿舍的网速真的太慢了，看个视频都要缓冲半天。学校什么时候能升级一下网络设备？',
    createdAt: '2024-02-10T18:30:00Z',
    likeCount: 19,
    dislikeCount: 0,
    commentCount: 0,
    userReaction: null,
    comments: []
  }
];

// 获取用户已加入的圈子
export const getJoinedCircles = (): Circle[] => {
  return mockCircles.filter(circle => circle.isJoined);
};

// 根据ID获取圈子
export const getCircleById = (id: string): Circle | undefined => {
  return mockCircles.find(circle => circle.id === id);
};

// 搜索圈子
export const searchCircles = (query: string): Circle[] => {
  if (!query.trim()) return [];
  
  return mockCircles.filter(circle => 
    circle.name.toLowerCase().includes(query.toLowerCase()) ||
    circle.description?.toLowerCase().includes(query.toLowerCase())
  );
};

// 根据圈子ID获取吐槽列表
export const getMurmursByCircleId = (circleId: string): Murmur[] => {
  return mockMurmurs.filter(murmur => murmur.circleId === circleId);
};

// 根据ID获取吐槽
export const getMurmurById = (id: string): Murmur | undefined => {
  return mockMurmurs.find(murmur => murmur.id === id);
};

// 根据吐槽ID获取评论列表
export const getCommentsByMurmurId = (murmurId: string): Comment[] => {
  return mockComments.filter(comment => comment.murmurId === murmurId);
};
