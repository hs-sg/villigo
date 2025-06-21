# 빌드 단계
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test -x check

# 런타임 단계
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "env && java -Xmx768m -Xms384m -jar app.jar"]