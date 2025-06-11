FROM gradle:8.7.0-jdk21 AS builder

WORKDIR /app
COPY . .

RUN gradle clean build -x test -x check

FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar
@139
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx768m", "-Xms384m", "-jar", "app.jar"]
