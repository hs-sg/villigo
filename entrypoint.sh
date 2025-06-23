#!/bin/sh

echo "==== ENV CHECK ===="
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_USERNAME: $SUPABASE_USERNAME"
echo "SUPABASE_PASSWORD: $SUPABASE_PASSWORD"
echo "===================="

# 환경변수로 application.properties 생성
envsubst < /app/application-template.properties > /app/application.properties

# 실행
exec java -Xmx768m -Xms384m -jar app.jar
