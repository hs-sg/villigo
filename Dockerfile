# 빌드 단계
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test -x check

# 런타임 단계
FROM eclipse-temurin:21-jdk
WORKDIR /app

# 환경변수 명시 (이건 주입을 강제하지 않음)
ENV SUPABASE_URL=""
ENV SUPABASE_USERNAME=""
ENV SUPABASE_PASSWORD=""

COPY --from=builder /app/build/libs/*.jar app.jar
COPY entrypoint.sh .
COPY application.properties .

# 실행 권한 부여
RUN chmod +x entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "./entrypoint.sh"]