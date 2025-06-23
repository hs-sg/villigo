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

# 포트 설정
EXPOSE 8080

# 환경변수는 Railway에서 설정, Spring Boot가 직접 참조
CMD ["java", "-jar", "app.jar"]