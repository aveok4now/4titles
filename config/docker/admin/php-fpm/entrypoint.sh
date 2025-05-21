#!/bin/bash
set -e

for dir in /var/www/admin/storage/logs /var/www/admin/storage/framework /var/www/admin/bootstrap/cache; do
    if [ -d "$dir" ]; then
        if [ ! -w "$dir" ]; then
            echo "Directory $dir is not writable. Changing permissions..."
            sudo chmod -R 775 "$dir"
        fi
    fi
done

if [ ! -d "/var/www/admin/vendor" ] || [ ! "$(ls -A /var/www/admin/vendor)" ]; then
    echo "Installing dependencies..."
    composer install --no-interaction --no-plugins --no-scripts
fi

if [ ! -f "/var/www/admin/.env" ] || [ -z "$(grep -E '^APP_KEY=[a-zA-Z0-9:+=/]{1,}' /var/www/admin/.env)" ]; then
    echo "Generating application key..."
    php artisan key:generate
fi

php artisan optimize:clear

if [[ "$MIGRATE_ON_START" == "true" ]]; then
    echo "Running migrations..."
    php artisan migrate
fi

exec "$@"