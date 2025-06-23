#!/bin/sh

echo "==== ENV CHECK ===="
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_USERNAME: $SUPABASE_USERNAME"
echo "SUPABASE_PASSWORD: $SUPABASE_PASSWORD"
echo "===================="

exec java -Xmx768m -Xms384m -jar app.jar \
  --spring.datasource.url="$SUPABASE_URL" \
  --spring.datasource.username="$SUPABASE_USERNAME" \
  --spring.datasource.password="$SUPABASE_PASSWORD" \
  --aws.accessKey="$AWS_ACCESS_KEY_ID" \
  --aws.secretKey="$AWS_SECRET_ACCESS_KEY" \
  --aws.region="$AWS_REGION" \
  --aws.s3.bucket="$AWS_BUCKET_NAME" \
  --spring.security.oauth2.client.registration.google.client-id="$OAuth_GOOGLE_CLIENT_ID" \
  --spring.security.oauth2.client.registration.google.client-secret="$OAuth_GOOGLE_CLIENT_SECRET" \
  --spring.security.oauth2.client.registration.google.scope="$OAuth_GOOGLE_SCOPE" \
  --spring.security.oauth2.client.registration.google.redirect-uri="$OAuth_GOOGLE_REDIRECT_URI" \
  --kakao.restapi="$KAKAO_RESTAPI_KEY"
