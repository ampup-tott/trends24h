FROM node:10
RUN mkdir -p /tmp/package
ADD package.json /tmp/package/package.json
ADD package-lock.json /tmp/package/package-lock.json
WORKDIR /tmp/package
RUN npm set progress false && npm ci
ADD entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
EXPOSE 8080
CMD ["/entrypoint.sh"]