-- 检查是否存在 users 表，如果不存在则创建
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    userid TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT,
    email TEXT UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00
);

-- 插入一些示例数据
-- 首先检查是否已经有数据存在
INSERT INTO users (userid, username, password, email, balance)
SELECT 'user1id', 'user1', 'password1', 'user1@example.com', 10.00
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user1@example.com');

INSERT INTO users (userid, username, password, email, balance)
SELECT 'user2id', 'user2', 'password2', 'user2@example.com', 20.00
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user2@example.com');


-- 创建 conversations 表
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    userid TEXT,
    topic TEXT,
    cleared_messageid TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid)
);

-- 插入 conversations 表的示例数据
INSERT INTO conversations (userid)
SELECT userid FROM users WHERE username = 'user1';

-- 创建 messages 表
CREATE TABLE IF NOT EXISTS messages (
    message_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    messageid TEXT,
    conversation_id INTEGER,
    userid TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
    sender_id INTEGER, -- 用户或 AI 的 ID
    content TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

-- 插入 messages 表的示例数据
INSERT INTO messages (conversation_id, userid, messageid, sender_type, sender_id, content, content_type)
VALUES
(1, '111','user1', 'user', 1, 'Hello, world!', 'text'),
(1, '111','user1','user', 1, 'http://example.com/image1.jpg', 'image'),
(1, '111','user1','user', 1, 'http://example.com/image2.jpg', 'image');



-- 创建 ai_bots 表
CREATE TABLE IF NOT EXISTS ai_bots (
    ai_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    aiid TEXT UNIQUE NOT NULL,
    ainame TEXT NOT NULL,
    api_url TEXT,
    api_key TEXT,
    api_model_name TEXT,
    api_account TEXT,
    token_price FLOAT, -- 此ai的调用token单价
    query_type TEXT, -- 调用的接口类型
    image_capability BOOLEAN DEFAULT TRUE,
    userid TEXT, -- 属于哪个用户
    is_custom BOOLEAN DEFAULT FALSE
);

-- 插入 ai_bots 表的示例数据
INSERT INTO ai_bots (aiid, ainame, api_url, api_key, userid, is_custom) VALUES
('AI_Bot_1', 'openai', 'http://example.com/api1', 'apikey', NULL, FALSE),
('AI_Bot_2', 'openai_custom_10000', 'http://example.com/api2', 'apikey', 'user1id', TRUE);

-- 创建 conversation_ai 表
CREATE TABLE IF NOT EXISTS conversation_ai (
    conversation_ai_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conversation_id INTEGER,
    aiid TEXT,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (aiid) REFERENCES ai_bots(aiid)
);

-- 插入 conversation_ai 表的示例数据
INSERT INTO conversation_ai (conversation_id, aiid)
SELECT conversation_id, aiid FROM conversations, ai_bots
WHERE conversations.userid = (SELECT userid FROM users WHERE username = 'user1')
AND ai_bots.ainame = 'AI Bot 1';

-- 创建 recharge_records 表
CREATE TABLE IF NOT EXISTS recharge_records (
    recharge_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    userid TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid)
);

-- 插入 recharge_records 表的示例数据
INSERT INTO recharge_records (userid, amount)
SELECT userid, 50.00 FROM users WHERE username = 'user1';

-- 创建 consumption_records 表
CREATE TABLE IF NOT EXISTS consumption_records (
    consumption_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    userid TEXT,
    aiid TEXT,
    conversation_id INTEGER,
    points DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (aiid) REFERENCES ai_bots(aiid),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

-- 插入 consumption_records 表的示例数据
INSERT INTO consumption_records (userid, aiid, conversation_id, points)
SELECT u.userid, a.aiid, c.conversation_id, 5.00
FROM users u
JOIN conversations c ON u.userid = c.userid
JOIN ai_bots a ON a.ainame = 'AI Bot 1'
WHERE u.username = 'user1';