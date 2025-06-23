#!/bin/sh

echo "==== ENV CHECK ===="
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_USERNAME: $SUPABASE_USERNAME"
echo "SUPABASE_PASSWORD: $SUPABASE_PASSWORD"

exec java -Xmx768m -Xms384m \
  -Dspring.datasource.url=$SUPABASE_URL \
  -Dspring.datasource.username=$SUPABASE_USERNAME \
  -Dspring.datasource.password=$SUPABASE_PASSWORD \
  -jar app.jar
