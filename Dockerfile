# 빌드 단계
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test -x check

# 런타임 단계
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Railway에서 전달할 환경변수들을 명시적으로 ARG로 선언
ARG SUPABASE_URL
ARG SUPABASE_USERNAME
ARG SUPABASE_PASSWORD

# ENV로 변환
ENV SPRING_DATASOURCE_URL=$SUPABASE_URL
ENV SPRING_DATASOURCE_USERNAME=$SUPABASE_USERNAME
ENV SPRING_DATASOURCE_PASSWORD=$SUPABASE_PASSWORD

COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "\
  echo '==== ENV CHECK ====' && \
  echo $SUPABASE_URL && \
  java -Xmx768m -Xms384m \
  -Dspring.datasource.url=$SUPABASE_URL \
  -Dspring.datasource.username=$SUPABASE_USERNAME \
  -Dspring.datasource.password=$SUPABASE_PASSWORD \
  -jar app.jar"]