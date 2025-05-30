#!/bin/bash
set -e

cd /var/www/admin

git config --global --add safe.directory /var/www/admin 2>/dev/null || true

for dir in storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache; do
    mkdir -p "/var/www/admin/$dir"
done

mkdir -p /var/www/admin/vendor

if [ -f "/var/www/admin/composer.json" ]; then
    if [ ! -f "/var/www/admin/vendor/autoload.php" ]; then
        echo "Installing dependencies..."
        composer install --no-interaction --optimize-autoloader --no-dev --no-scripts
        
        if [ -f "/var/www/admin/vendor/autoload.php" ]; then
            composer dump-autoload --optimize --no-dev
        fi
    fi
else
    echo "Warning: composer.json not found. Skipping dependency installation."
fi

if [ ! -f "/var/www/admin/.env" ] || [ -z "$(grep -E '^APP_KEY=[a-zA-Z0-9:+=/]{1,}' /var/www/admin/.env)" ]; then
    if [ -f "/var/www/admin/artisan" ]; then
        echo "Generating application key..."
        php artisan key:generate --force
    fi
fi

if [ -f "/var/www/admin/artisan" ]; then
    php artisan optimize:clear
fi

if [[ "$MIGRATE_ON_START" == "true" ]] && [ -f "/var/www/admin/artisan" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

exec "$@"