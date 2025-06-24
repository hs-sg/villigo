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
EXPOSE 8080

# shell form 사용
CMD ["/bin/sh", "-c", "java -jar app.jar"]