#!/usr/bin/env bash
set -euo pipefail

# =============================================
#  JustinView 部署脚本
#  Usage:
#    ./deploy.sh                    # 本地 Docker 构建&启动
#    ./deploy.sh --build-only       # 仅构建镜像
#    ./deploy.sh --remote <host>    # 构建并部署到远程服务器
# =============================================

IMAGE_NAME="justinview"
CONTAINER_NAME="justinview"
PORT="${PORT:-3000}"

# ---- Functions ----

log()   { echo -e "\n\033[1;34m[deploy]\033[0m $*"; }
ok()    { echo -e "\033[1;32m  ✓\033[0m $*"; }
err()   { echo -e "\033[1;31m  ✗ $*\033[0m"; exit 1; }

build_image() {
  log "Building Docker image: ${IMAGE_NAME}..."
  docker build --pull -t "${IMAGE_NAME}" . || err "Build failed"
  ok "Image built: ${IMAGE_NAME}"
}

run_local() {
  log "Starting container locally..."
  # Stop and remove existing container if any
  docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

  docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p "127.0.0.1:${PORT}:3000" \
    --env-file .env.production \
    "${IMAGE_NAME}" || err "Failed to start container"

  ok "Container running: http://localhost:${PORT}"
}

deploy_remote() {
  local host="$1"
  log "Deploying to remote server: ${host}..."

  # Save image to tar and transfer
  docker save "${IMAGE_NAME}" | gzip | ssh "${host}" "
    gunzip | docker load &&
    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true &&
    docker run -d \
      --name ${CONTAINER_NAME} \
      --restart unless-stopped \
      -p 127.0.0.1:${PORT}:3000 \
      --env-file .env.production \
      ${IMAGE_NAME}
  " || err "Remote deployment failed"

  ok "Deployed to ${host}: https://your-domain"
}

# ---- Main ----

MODE="${1:-local}"
REMOTE_HOST=""

case "${MODE}" in
  --build-only)
    build_image
    ok "Build complete. Image ready: ${IMAGE_NAME}"
    ;;

  --remote)
    REMOTE_HOST="${2:-}"
    if [[ -z "${REMOTE_HOST}" ]]; then
      err "Usage: ./deploy.sh --remote <user@server-ip>"
    fi
    build_image
    deploy_remote "${REMOTE_HOST}"
    ;;

  local|"")
    if [[ ! -f ".env.production" ]]; then
      err "Missing .env.production file. Create one first:
  ACTIVITY_MONITOR_TOKEN=<your-random-token>
  ACTIVITY_MONITOR_URL=https://your-domain"
    fi
    build_image
    run_local
    ;;

  *)
    err "Unknown mode: ${MODE}\nUsage: ./deploy.sh [--build-only | --remote <host>]"
    ;;
esac

log "Done."
