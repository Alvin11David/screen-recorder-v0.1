CREATE TABLE user_drive_connections (
    id               BIGSERIAL    PRIMARY KEY,
    user_id          BIGINT       NOT NULL UNIQUE,
    provider         VARCHAR(32)  NOT NULL,
    refresh_token    VARCHAR(2048) NOT NULL,
    access_token     VARCHAR(4096),
    token_expires_at TIMESTAMP WITH TIME ZONE,
    drive_email      VARCHAR(512),
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_drive_connections_user ON user_drive_connections (user_id);
