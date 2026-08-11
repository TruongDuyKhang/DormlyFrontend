#!/bin/sh
set -e

# Install openssl if not present
if ! command -v openssl > /dev/null 2>&1; then
    apk add --no-cache openssl > /dev/null 2>&1
fi

# Generate SSL certificate if not exists
if [ ! -f /etc/nginx/ssl/cert.pem ] || [ ! -f /etc/nginx/ssl/key.pem ]; then
    echo "==> Generating SSL self-signed certificates for HTTPS..."
    mkdir -p /etc/nginx/ssl
    
    # Try with SAN extension, fallback to simple subj if older openssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/key.pem \
        -out /etc/nginx/ssl/cert.pem \
        -subj "/C=VN/ST=HCM/L=HCM/O=Dormly/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:26.153.167.228,IP:127.0.0.1" 2>/dev/null || \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/key.pem \
        -out /etc/nginx/ssl/cert.pem \
        -subj "/C=VN/ST=HCM/L=HCM/O=Dormly/CN=localhost"
        
    echo "==> SSL Certificate created successfully at /etc/nginx/ssl/cert.pem"
fi

# Start Nginx in foreground
echo "==> Starting Nginx on HTTPS port 443..."
exec nginx -g "daemon off;"
