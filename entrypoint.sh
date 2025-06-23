#!/bin/sh

echo "==== ENV CHECK ===="
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_USERNAME: $SUPABASE_USERNAME"
echo "SUPABASE_PASSWORD: $SUPABASE_PASSWORD"
echo "===================="

exec java -Xmx768m -Xms384m -jar app.jar
