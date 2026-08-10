CREATE TABLE recordings (
    id               BIGSERIAL    PRIMARY KEY,
    user_id          BIGINT       NOT NULL,
    drive_file_id    VARCHAR(256),
    drive_url        VARCHAR(1024),
    duration_seconds DOUBLE PRECISION NOT NULL,
    width            INTEGER      NOT NULL,
    height           INTEGER      NOT NULL,
    size_bytes       BIGINT       NOT NULL,
    mime_type        VARCHAR(128) NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recordings_user ON recordings (user_id, created_at DESC);
