use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::database::{Database, Circle};

/// API响应结构体
#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}

/// 搜索圈子请求参数
#[derive(Deserialize)]
pub struct SearchCirclesQuery {
    pub name: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// 圈子列表响应
#[derive(Serialize)]
pub struct CirclesResponse {
    pub circles: Vec<Circle>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

/// 创建API路由
pub fn create_router(database: Arc<Database>) -> Router {
    Router::new()
        .route("/api/circles/search", get(search_circles))
        .route("/api/circles", get(get_all_circles))
        .route("/api/circles/:id", get(get_circle_by_id))
        .route("/api/health", get(health_check))
        .with_state(database)
}

/// 按名称搜索圈子
async fn search_circles(
    State(database): State<Arc<Database>>,
    Query(params): Query<SearchCirclesQuery>,
) -> Result<Json<ApiResponse<CirclesResponse>>, StatusCode> {
    let name = params.name.unwrap_or_default();
    let limit = params.limit.unwrap_or(20).min(100); // 最多100个结果
    let offset = params.offset.unwrap_or(0);

    if name.is_empty() {
        return Ok(Json(ApiResponse {
            success: false,
            data: None,
            message: Some("搜索名称不能为空".to_string()),
        }));
    }

    match database.search_circles_by_name(&name, limit).await {
        Ok(circles) => {
            let total = database.get_circles_count().await.unwrap_or(0);
            
            let response = CirclesResponse {
                circles,
                total,
                limit,
                offset,
            };

            Ok(Json(ApiResponse {
                success: true,
                data: Some(response),
                message: None,
            }))
        }
        Err(e) => {
            tracing::error!("搜索圈子时出错: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 获取所有圈子
async fn get_all_circles(
    State(database): State<Arc<Database>>,
    Query(params): Query<SearchCirclesQuery>,
) -> Result<Json<ApiResponse<CirclesResponse>>, StatusCode> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    match database.get_all_circles(limit, offset).await {
        Ok(circles) => {
            let total = database.get_circles_count().await.unwrap_or(0);
            
            let response = CirclesResponse {
                circles,
                total,
                limit,
                offset,
            };

            Ok(Json(ApiResponse {
                success: true,
                data: Some(response),
                message: None,
            }))
        }
        Err(e) => {
            tracing::error!("获取圈子列表时出错: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 根据ID获取圈子详情
async fn get_circle_by_id(
    State(database): State<Arc<Database>>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<ApiResponse<Circle>>, StatusCode> {
    match database.get_circle_by_id(&id).await {
        Ok(Some(circle)) => Ok(Json(ApiResponse {
            success: true,
            data: Some(circle),
            message: None,
        })),
        Ok(None) => Ok(Json(ApiResponse {
            success: false,
            data: None,
            message: Some("圈子不存在".to_string()),
        })),
        Err(e) => {
            tracing::error!("获取圈子详情时出错: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 健康检查接口
async fn health_check() -> Json<ApiResponse<String>> {
    Json(ApiResponse {
        success: true,
        data: Some("服务运行正常".to_string()),
        message: None,
    })
}
