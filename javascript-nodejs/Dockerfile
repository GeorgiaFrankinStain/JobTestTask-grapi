FROM alpine
EXPOSE 8000
COPY . /var/www/localhost/htdocs
RUN apk add nodejs && \
    apk add npm && \
    cd /var/www/localhost/htdocs && \
    rm -rf node_modules && \
    npm install -timeout=6000
CMD ["/bin/sh", "-c", "exec node src/server.js;"]
WORKDIR /var/www/localhost/htdocs
