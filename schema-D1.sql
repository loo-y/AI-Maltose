-- 检查是否存在 usersinfo 表，如果不存在则创建
CREATE TABLE IF NOT EXISTS usersinfo (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00
);

-- 插入一些示例数据
-- 首先检查是否已经有数据存在
INSERT INTO usersinfo (username, password, email, balance)
SELECT 'user1', 'password1', 'user1@example.com', 10.00
WHERE NOT EXISTS (SELECT 1 FROM usersinfo WHERE email = 'user1@example.com');

INSERT INTO usersinfo (username, password, email, balance)
SELECT 'user2', 'password2', 'user2@example.com', 20.00
WHERE NOT EXISTS (SELECT 1 FROM usersinfo WHERE email = 'user2@example.com');

INSERT INTO usersinfo (username, password, email, balance)
SELECT 'user3', 'password3', 'user3@example.com', 30.00
WHERE NOT EXISTS (SELECT 1 FROM usersinfo WHERE email = 'user3@example.com');


-- 创建 conversations 表
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    cleared_message_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usersinfo(user_id)
);

-- 插入 conversations 表的示例数据
INSERT INTO conversations (user_id)
SELECT user_id FROM usersinfo WHERE username = 'user1';

-- 创建 messages 表
CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
    sender_id INTEGER,
    content TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

-- 插入 messages 表的示例数据
INSERT INTO messages (conversation_id, sender_type, sender_id, content, content_type)
VALUES
(1, 'user', 1, 'Hello, world!', 'text'),
(1, 'user', 1, 'http://example.com/image1.jpg', 'image'),
(1, 'user', 1, 'http://example.com/image2.jpg', 'image');



-- 创建 ai_bots 表
CREATE TABLE IF NOT EXISTS ai_bots (
    ai_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    api_url TEXT,
    is_custom BOOLEAN DEFAULT FALSE
);

-- 插入 ai_bots 表的示例数据
INSERT INTO ai_bots (name, api_url, is_custom) VALUES
('AI Bot 1', 'http://example.com/api1', FALSE),
('AI Bot 2', 'http://example.com/api2', FALSE);

-- 创建 conversation_ai 表
CREATE TABLE IF NOT EXISTS conversation_ai (
    conversation_ai_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER,
    ai_id INTEGER,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (ai_id) REFERENCES ai_bots(ai_id)
);

-- 插入 conversation_ai 表的示例数据
INSERT INTO conversation_ai (conversation_id, ai_id)
SELECT conversation_id, ai_id FROM conversations, ai_bots
WHERE conversations.user_id = (SELECT user_id FROM usersinfo WHERE username = 'user1')
AND ai_bots.name = 'AI Bot 1';

-- 创建 recharge_records 表
CREATE TABLE IF NOT EXISTS recharge_records (
    recharge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usersinfo(user_id)
);

-- 插入 recharge_records 表的示例数据
INSERT INTO recharge_records (user_id, amount)
SELECT user_id, 50.00 FROM usersinfo WHERE username = 'user1';

-- 创建 consumption_records 表
CREATE TABLE IF NOT EXISTS consumption_records (
    consumption_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ai_id INTEGER,
    conversation_id INTEGER,
    points DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usersinfo(user_id),
    FOREIGN KEY (ai_id) REFERENCES ai_bots(ai_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

-- 插入 consumption_records 表的示例数据
INSERT INTO consumption_records (user_id, ai_id, conversation_id, points)
SELECT u.user_id, a.ai_id, c.conversation_id, 5.00
FROM usersinfo u
JOIN conversations c ON u.user_id = c.user_id
JOIN ai_bots a ON a.name = 'AI Bot 1'
WHERE u.username = 'user1';