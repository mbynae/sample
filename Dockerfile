FROM nginx AS DEVEL

COPY build-devel/ \
    /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf


FROM nginx AS PROD

COPY build-prod/ \
    /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf