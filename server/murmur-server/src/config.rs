use serde::{Deserialize, Serialize};
use std::env;

/// 应用配置
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    /// 服务器配置
    pub server: ServerConfig,
    /// Sui网络配置
    pub sui: SuiConfig,
    /// 数据库配置
    pub database: DatabaseConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuiConfig {
    pub rpc_url: String,
    pub package_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
}

impl Config {
    /// 从环境变量加载配置
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Config {
            server: ServerConfig {
                host: env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
                port: env::var("SERVER_PORT")
                    .unwrap_or_else(|_| "3000".to_string())
                    .parse()
                    .unwrap_or(3000),
            },
            sui: SuiConfig {
                rpc_url: env::var("SUI_RPC_URL")
                    .unwrap_or_else(|_| "https://fullnode.mainnet.sui.io:443".to_string()),
                package_id: env::var("SUI_PACKAGE_ID")
                    .expect("SUI_PACKAGE_ID环境变量必须设置"),
            },
            database: DatabaseConfig {
                url: env::var("DATABASE_URL")
                    .unwrap_or_else(|_| "mysql://root:password@localhost:3306/murmur_db".to_string()),
            },
        })
    }

    /// 获取服务器地址
    pub fn server_addr(&self) -> String {
        format!("{}:{}", self.server.host, self.server.port)
    }
}
