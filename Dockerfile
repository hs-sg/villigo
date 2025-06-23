# ---- Build Stage ----
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew && ./gradlew clean build -x test -x check

# ---- Runtime Stage ----
FROM eclipse-temurin:21-jdk
WORKDIR /app

# 복사된 JAR 실행 파일
COPY --from=builder /app/build/libs/*.jar app.jar

# entrypoint와 설정 템플릿 복사
COPY entrypoint.sh .
COPY config/application-template.properties .

# 실행 스크립트에 실행 권한 부여
RUN chmod +x entrypoint.sh

# 엔트리포인트 실행
ENTRYPOINT ["./entrypoint.sh"]