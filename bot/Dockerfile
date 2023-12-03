FROM node:lts-slim

RUN apt-get update && \
  apt-get install -y fontconfig fonts-noto && \
  apt-get clean && \
  apt-get autoremove --yes && \
  rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app

CMD ["bash", "-c", "bash ./init.sh && node /app"]
