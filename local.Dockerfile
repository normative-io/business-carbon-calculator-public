# Copyright 2022 Meta Mind AB
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This Dockerfile is just to containerize the Starter frontend
# to allow launching a "complete" local stack via docker compose.
#
# This is *not* intended for production use.

FROM node:14-bullseye-slim AS builder
WORKDIR /repo
# Install packages first. This is done separately from the actual build
# so that Docker can cache the layer that just contains
# package.json, package-lock.json, and node_modules/
COPY ./package.json ./package-lock.json ./
# Inject an npmrc file which should contain a registry specifier including auth token.
# The file is only available for this command, then it disappears.
RUN --mount=type=secret,id=npm_rc_file,dst=/repo/.npmrc npm ci

# Pull in the source code and build it!
COPY ./ ./
RUN npm run build -- -c development

FROM nginx:stable-alpine
COPY ./nginx-local.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/dist/apps/starter /usr/share/nginx/html
