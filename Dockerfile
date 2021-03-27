FROM mcr.microsoft.com/playwright:focal

RUN apt-get update && apt-get purge -y --auto-remove nodejs && \
    curl -sL https://deb.nodesource.com/setup_15.x | bash - && \
    apt-get install -y nodejs
