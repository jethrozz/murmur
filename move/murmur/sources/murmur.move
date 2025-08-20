/// Module: murmur
/// 基于Sui链的匿名吐槽墙项目
/// 主要功能：
/// 1. 创建吐槽圈子
/// 2. 发布匿名吐槽
/// 3. 通过NFT控制圈子访问权限
/// 4. 为Web2服务提供数据接口
module murmur::murmur {
    use sui::object;
    use sui::transfer;
    use sui::tx_context;
    use sui::event;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use std::string;
    use std::vector;
    use std::option::{Self, Option};


    // ========== 错误码 ==========
    const EInvalidContent: u64 = 1;
    const EInvalidCircleName: u64 = 2;

    const EUnauthorized: u64 = 6;
    const ECircleNotFound: u64 = 7;
    const EUserAlreadyHasAccess: u64 = 8;
    const EInvalidCapability: u64 = 9;

    // ========== 数据结构 ==========
    
    /// 超管权限能力
    public struct AdminCap has key, store {
        id: object::UID,
        admin: address,
    }

    /// 圈子创建权限能力
    public struct CircleCreatorCap has key, store {
        id: object::UID,
        creator: address,
        circle_id: address,
    }

    /// 吐槽圈子
    public struct MurmurCircle has key, store {
        id: object::UID,
        name: string::String,                    // 圈子名称
        description: string::String,             // 圈子描述
        created_at: u64,                        // 创建时间
        creator: address,                        // 创建者地址
        murmur_count: u64,                      // 吐槽数量
        is_active: bool,                         // 是否活跃
        total_members: u64,                     // 总成员数
    }

    /// 用户吐槽
    public struct Murmur has key, store {
        id: object::UID,
        circle_id: address,                      // 所属圈子ID
        content: string::String,                 // 吐槽内容
        created_at: u64,                        // 发布时间
        author: address,                         // 发布者地址（匿名）
        likes: u64,                             // 点赞数
        dislikes: u64,                          // 点踩数
    }

    /// 圈子访问门票
    public struct MurmurCircleTicket has key, store {
        id: object::UID,
        circle_id: address,                     // 对应的圈子ID
        owner: address,                         // 门票持有者
        issued_at: u64,                        // 发放时间
        expires_at: Option<u64>,                // 过期时间（可选）
    }

    // ========== 事件 ==========
    
    /// 圈子创建事件
    public struct CircleCreatedEvent has copy, drop {
        circle_id: address,
        name: string::String,
        creator: address,
        created_at: u64,
    }

    /// 吐槽发布事件
    public struct MurmurPublishedEvent has copy, drop {
        murmur_id: address,
        circle_id: address,
        author: address,
        created_at: u64,
        content: string::String,
    }

    /// 圈子访问门票发放事件
    public struct CircleTicketGrantedEvent has copy, drop {
        ticket_id: address,
        circle_id: address,
        user: address,
        issued_at: u64,
    }

    /// 圈子更新事件
    public struct CircleUpdatedEvent has copy, drop {
        circle_id: address,
        updated_at: u64,
        field_name: string::String,
        old_value: string::String,
        new_value: string::String,
    }

    // ========== 初始化函数 ==========

    /// 在合约发布时自动创建超管cap并转移给合约发布者
    fun init(ctx: &mut tx_context::TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
        };
        
        // 转移超管cap给合约发布者
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // ========== 公共函数 ==========

    /// 创建新的吐槽圈子（需要超管权限）
    public fun create_circle(
        admin_cap: &mut AdminCap,
        name: vector<u8>,
        description: vector<u8>,
        ctx: &mut tx_context::TxContext
    ): address {
        // 验证超管权限
        assert!(admin_cap.admin == tx_context::sender(ctx), EUnauthorized);
        
        // 验证输入
        assert!(vector::length(&name) > 0, EInvalidCircleName);
        assert!(vector::length(&description) > 0, EInvalidCircleName);

        let name_str = string::utf8(name);
        let desc_str = string::utf8(description);

        let circle = MurmurCircle {
            id: object::new(ctx),
            name: name_str,
            description: desc_str,
            created_at: tx_context::epoch(ctx),
            creator: tx_context::sender(ctx),
            murmur_count: 0,
            is_active: true,
            total_members: 0,
        };

        let circle_id = object::uid_to_address(&circle.id);
        
        // 发出事件
        event::emit(CircleCreatedEvent {
            circle_id,
            name: name_str,
            creator: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        });

        // 转移圈子对象给创建者
        transfer::share_object(circle);
        circle_id
    }

    /// 为用户发放圈子访问门票（需要超管权限）
    public fun grant_circle_ticket(
        admin_cap: &mut AdminCap,
        circle_id: address,
        user: address,
        expires_at: Option<u64>,
        ctx: &mut tx_context::TxContext
    ): address {
        // 验证超管权限
        assert!(admin_cap.admin == tx_context::sender(ctx), EUnauthorized);
        
        let ticket = MurmurCircleTicket {
            id: object::new(ctx),
            circle_id,
            owner: user,
            issued_at: tx_context::epoch(ctx),
            expires_at,
        };

        let ticket_id = object::uid_to_address(&ticket.id);
        
        // 发出事件
        event::emit(CircleTicketGrantedEvent {
            ticket_id,
            circle_id,
            user,
            issued_at: tx_context::epoch(ctx),
        });

        // 转移门票给用户
        transfer::share_object(ticket);
        ticket_id
    }

    /// 发布吐槽到指定圈子（需要持有对应的访问门票）
    public fun publish_murmur(
        circle_id: address,
        content: vector<u8>,
        access_ticket: &MurmurCircleTicket,
        ctx: &mut tx_context::TxContext
    ): address {
        // 验证用户是否有权限访问该圈子
        assert!(access_ticket.circle_id == circle_id, EUnauthorized);
        assert!(access_ticket.owner == tx_context::sender(ctx), EUnauthorized);
        
        // 检查门票是否过期
        if (option::is_some(&access_ticket.expires_at)) {
            let expiry = *option::borrow(&access_ticket.expires_at);
            assert!(tx_context::epoch(ctx) < expiry, EUnauthorized);
        };

        // 验证输入
        assert!(vector::length(&content) > 0, EInvalidContent);
        assert!(vector::length(&content) <= 1000, EInvalidContent);

        let content_str = string::utf8(content);
        
        let murmur = Murmur {
            id: object::new(ctx),
            circle_id,
            content: content_str,
            created_at: tx_context::epoch(ctx),
            author: tx_context::sender(ctx),
            likes: 0,
            dislikes: 0,
        };

        let murmur_id = object::uid_to_address(&murmur.id);
        
        // 发出事件
        event::emit(MurmurPublishedEvent {
            murmur_id,
            circle_id,
            author: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            content: content_str,
        });

        // 转移吐槽对象给发布者
        transfer::share_object(murmur);
        murmur_id
    }
    /// 点赞吐槽
    public fun like_murmur(murmur: &mut Murmur) {
        murmur.likes = murmur.likes + 1;
    }

    /// 点踩吐槽
    public fun dislike_murmur(murmur: &mut Murmur) {
        murmur.dislikes = murmur.dislikes + 1;
    }

    /// 更新圈子状态（需要超管权限）
    public fun update_circle_status(
        admin_cap: &mut AdminCap,
        circle: &mut MurmurCircle,
        is_active: bool,
        ctx: &mut tx_context::TxContext
    ) {
        // 验证超管权限
        assert!(admin_cap.admin == tx_context::sender(ctx), EUnauthorized);
        
        let old_status = if (circle.is_active) { b"active" } else { b"inactive" };
        let new_status = if (is_active) { b"active" } else { b"inactive" };
        
        circle.is_active = is_active;
        
        // 发出更新事件
        event::emit(CircleUpdatedEvent {
            circle_id: object::uid_to_address(&circle.id),
            updated_at: tx_context::epoch(ctx),
            field_name: string::utf8(b"is_active"),
            old_value: string::utf8(old_status),
            new_value: string::utf8(new_status),
        });
    }

    /// 检查用户是否有权限访问圈子
    public fun has_circle_access(user: address, circle_id: address, access_ticket: &MurmurCircleTicket): bool {
        access_ticket.owner == user && access_ticket.circle_id == circle_id
    }

}


