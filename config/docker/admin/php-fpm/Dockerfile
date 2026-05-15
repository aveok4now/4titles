FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip intl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} www && \
    useradd -m -u ${UID} -g www -s /bin/bash www

RUN git config --global --add safe.directory /var/www/admin

RUN mkdir -p /var/www/admin && \
    chown -R www:www /var/www/admin

COPY pool.conf /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/admin

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER www

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]