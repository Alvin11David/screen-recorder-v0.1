# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM gradle:8.13-jdk21 AS build
WORKDIR /home/gradle/app

COPY --chown=gradle:gradle . .

RUN gradle bootJar --no-daemon -x test -Dorg.gradle.console=plain

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy
LABEL org.opencontainers.image.source="https://github.com/Alvin11David/screen-recorder-v0.1"

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom -Dspring.jmx.enabled=false"
ENV PORT=8080

RUN groupadd --system app && useradd --system --gid app --home-dir /app app

WORKDIR /app
RUN mkdir -p /app/data && chown -R app:app /app
COPY --from=build --chown=app:app /home/gradle/app/build/libs/*.jar app.jar

USER app
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=40s --retries=3 \
    CMD bash -c 'exec 3<>/dev/tcp/127.0.0.1/8080 && printf "GET /actuator/health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n" >&3 && cat <&3 >/dev/null'

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
