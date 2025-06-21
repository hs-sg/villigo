# 빌드 단계
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean build -x test -x check

# 런타임 단계
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "\
  java -Xmx768m -Xms384m \
  -Dspring.datasource.url=$SUPABASE_URL \
  -Dspring.datasource.username=$SUPABASE_USERNAME \
  -Dspring.datasource.password=$SUPABASE_PASSWORD \
  -Daws.accessKey=$AWS_ACCESS_KEY_ID \
  -Daws.secretKey=$AWS_SECRET_ACCESS_KEY \
  -Daws.region=$AWS_REGION \
  -Daws.s3.bucket=$AWS_BUCKET_NAME \
  -Dkakao.restapi=$KAKAO_RESTAPI_KEY \
  -jar app.jar"]