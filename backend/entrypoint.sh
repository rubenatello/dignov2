#!/usr/bin/env sh

set -e

# Wait for Postgres DB to be ready
echo "Waiting for database to be ready..."
until python -c "import psycopg2; psycopg2.connect('host=db dbname=digno user=digno password=digno123')" 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done
echo "Database is up - continuing"

echo "Running migrations..."
python manage.py migrate --noinput || { echo "Migration failed"; exit 1; }
echo "Migrations completed successfully"

echo "Skipping collectstatic for development..."
# python manage.py collectstatic --noinput || { echo "Collectstatic failed"; exit 1; }
echo "Static files collection skipped"

if [ "$DEBUG" = "1" ] || [ "$DEBUG" = "true" ]; then
  echo "Starting Django dev server..."
  exec python manage.py runserver 0.0.0.0:8000
else
  echo "Starting gunicorn..."
  exec gunicorn digno.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3} --timeout ${GUNICORN_TIMEOUT:-60}
fi
