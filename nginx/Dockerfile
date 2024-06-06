FROM nginx:stable-alpine-perl
RUN mkdir /etc/nginx/templates
COPY default.conf.template /etc/nginx/templates
# CMD /bin/sh -c "X=\$ envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf | cat /etc/nginx/nginx.conf && cat /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
CMD /bin/sh -c "X=\$ envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"