# 빌드 단계
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test -x check

# 런타임 단계
FROM eclipse-temurin:21-jdk
WORKDIR /app

# 환경변수를 받을 준비
ENV SUPABASE_URL=""
ENV SUPABASE_USERNAME=""
ENV SUPABASE_PASSWORD=""

# JAR 및 entrypoint.sh 복사
COPY --from=builder /app/build/libs/*.jar app.jar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080

# entrypoint를 스크립트로 설정
ENTRYPOINT ["./entrypoint.sh"]