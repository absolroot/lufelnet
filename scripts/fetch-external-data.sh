#!/usr/bin/env bash

# Shared external data fetcher for GitHub Actions.
# Modes:
#   core      -> gacha/guildboss/sos/sandbox
#   character -> character/{region}/{codename}.json
#   weapon    -> weapon/{region}/{codename}.json
#   all       -> all of the above

# Keep the same resilience behavior as the previous inline workflow script.
set +e
set +o pipefail
set -u

ROOT_DIR="${ROOT_DIR:-data/external}"
BASE_URL="${BASE_URL:-https://iant.kr:5000/data}"
FETCH_MODE="${FETCH_MODE:-all}"

ENDPOINTS=("gacha" "guildboss" "sos" "sandbox")
REGIONS=("kr" "en" "cn" "tw" "jp" "sea")
CODENAME_FILE="${ROOT_DIR}/character/codename.json"

log() {
  echo "$1"
}

clean_json() {
  python3 -c 'import sys, re; s = sys.stdin.read(); sys.stdout.write(re.sub(r"([:\[,]\s*)0+([1-9])", r"\1\2", s))'
}

urlencode_segment() {
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' "$1"
}

fetch_and_write() {
  local endpoint="$1"
  local region="$2"
  local url="${BASE_URL}/${endpoint}/${region}?source=lufelnet"
  local out="${ROOT_DIR}/${endpoint}/${region}.json"
  local backup_dir="${ROOT_DIR}/before/${endpoint}"
  local timestamp
  timestamp="$(date +"%Y%m%d_%H%M%S")"
  local backup_file="${backup_dir}/${region}_${timestamp}.json"

  log "Fetching: ${url}"

  local tmp_raw
  local tmp_clean
  tmp_raw="$(mktemp)"
  tmp_clean="$(mktemp)"

  curl -sS "$url" -o "$tmp_raw"
  if [ $? -ne 0 ]; then
    log "  Download failed. Skip ${endpoint}/${region}."
    return
  fi

  cat "$tmp_raw" | clean_json > "$tmp_clean"
  jq . "$tmp_clean" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    log "  Invalid JSON for ${endpoint}/${region}. Skip update."
    log "  Broken snippet:"
    head -c 120 "$tmp_clean"
    echo
    return
  fi

  jq -S . "$tmp_clean" > "${tmp_clean}.sorted"
  mkdir -p "$(dirname "$out")" "$backup_dir"

  if [ -f "$out" ]; then
    local tmp_old
    tmp_old="$(mktemp)"
    jq -S . "$out" > "$tmp_old"
    if diff -q "$tmp_old" "${tmp_clean}.sorted" > /dev/null; then
      log "  No change: ${endpoint}/${region}.json"
    else
      cp "$out" "$backup_file"
      cp "${tmp_clean}.sorted" "$out"
      log "  Updated: ${endpoint}/${region}.json"
    fi
  else
    cp "${tmp_clean}.sorted" "$out"
    log "  Created: ${endpoint}/${region}.json"
  fi
}

fetch_and_write_character() {
  local region="$1"
  local api_codename="$2"
  local local_codename="$3"
  local encoded_codename
  encoded_codename="$(urlencode_segment "$api_codename")"
  local url="${BASE_URL}/character/${region}/${encoded_codename}?source=lufelnet"
  local out="${ROOT_DIR}/character/${region}/${local_codename}.json"
  local backup_dir="${ROOT_DIR}/before/character/${region}"
  local timestamp
  timestamp="$(date +"%Y%m%d_%H%M%S")"
  local backup_file="${backup_dir}/${local_codename}_${timestamp}.json"

  log "Fetching: ${url}"

  local tmp_raw
  local tmp_clean
  tmp_raw="$(mktemp)"
  tmp_clean="$(mktemp)"

  curl -sS "$url" -o "$tmp_raw"
  if [ $? -ne 0 ]; then
    log "  Download failed. Skip character/${region}/${local_codename}."
    return
  fi

  cat "$tmp_raw" | clean_json > "$tmp_clean"
  jq . "$tmp_clean" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    if grep -q '"status": 100' "$tmp_clean" || grep -q '"status":100' "$tmp_clean"; then
      log "  Character not found (status 100): ${region}/${local_codename}"
    else
      log "  Invalid JSON. Skip character/${region}/${local_codename}."
    fi
    return
  fi

  if jq -e '.status == 100 and .data == null' "$tmp_clean" > /dev/null 2>&1; then
    log "  Data is null. Skip character/${region}/${local_codename}."
    return
  fi

  jq -S . "$tmp_clean" > "${tmp_clean}.sorted"
  mkdir -p "$(dirname "$out")" "$backup_dir"

  if [ -f "$out" ]; then
    local tmp_old
    tmp_old="$(mktemp)"
    jq -S . "$out" > "$tmp_old"
    if diff -q "$tmp_old" "${tmp_clean}.sorted" > /dev/null; then
      log "  No change: character/${region}/${local_codename}.json"
    else
      cp "$out" "$backup_file"
      cp "${tmp_clean}.sorted" "$out"
      log "  Updated: character/${region}/${local_codename}.json"
    fi
  else
    cp "${tmp_clean}.sorted" "$out"
    log "  Created: character/${region}/${local_codename}.json"
  fi
}

fetch_and_write_weapon() {
  local region="$1"
  local api_codename="$2"
  local local_codename="$3"
  local encoded_codename
  encoded_codename="$(urlencode_segment "$api_codename")"
  local url="${BASE_URL}/weapon/${region}/${encoded_codename}?source=lufelnet"
  local out="${ROOT_DIR}/weapon/${region}/${local_codename}.json"
  local backup_dir="${ROOT_DIR}/before/weapon/${region}"
  local timestamp
  timestamp="$(date +"%Y%m%d_%H%M%S")"
  local backup_file="${backup_dir}/${local_codename}_${timestamp}.json"

  log "Fetching: ${url}"

  local tmp_raw
  local tmp_clean
  tmp_raw="$(mktemp)"
  tmp_clean="$(mktemp)"

  curl -sS "$url" -o "$tmp_raw"
  if [ $? -ne 0 ]; then
    log "  Download failed. Skip weapon/${region}/${local_codename}."
    return
  fi

  cat "$tmp_raw" | clean_json > "$tmp_clean"
  jq . "$tmp_clean" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    log "  Invalid JSON. Skip weapon/${region}/${local_codename}."
    return
  fi

  if jq -e 'has("error")' "$tmp_clean" > /dev/null 2>&1; then
    log "  Weapon not found. Skip weapon/${region}/${local_codename}."
    return
  fi

  jq -S . "$tmp_clean" > "${tmp_clean}.sorted"
  mkdir -p "$(dirname "$out")" "$backup_dir"

  if [ -f "$out" ]; then
    local tmp_old
    tmp_old="$(mktemp)"
    jq -S . "$out" > "$tmp_old"
    if diff -q "$tmp_old" "${tmp_clean}.sorted" > /dev/null; then
      log "  No change: weapon/${region}/${local_codename}.json"
    else
      cp "$out" "$backup_file"
      cp "${tmp_clean}.sorted" "$out"
      log "  Updated: weapon/${region}/${local_codename}.json"
    fi
  else
    cp "${tmp_clean}.sorted" "$out"
    log "  Created: weapon/${region}/${local_codename}.json"
  fi
}

RUN_CORE=0
RUN_CHARACTER=0
RUN_WEAPON=0

case "$FETCH_MODE" in
  core)
    RUN_CORE=1
    ;;
  character|characters)
    RUN_CHARACTER=1
    ;;
  weapon|weapons)
    RUN_WEAPON=1
    ;;
  all)
    RUN_CORE=1
    RUN_CHARACTER=1
    RUN_WEAPON=1
    ;;
  *)
    log "Unknown FETCH_MODE='${FETCH_MODE}'. Allowed: core, character, weapon, all"
    exit 0
    ;;
esac

log "Start fetch-external-data mode=${FETCH_MODE}"

mkdir -p "$ROOT_DIR/before"

if [ "$RUN_CORE" -eq 1 ]; then
  for ep in "${ENDPOINTS[@]}"; do
    for rg in "${REGIONS[@]}"; do
      fetch_and_write "$ep" "$rg"
    done
  done
fi

if [ "$RUN_CHARACTER" -eq 1 ] || [ "$RUN_WEAPON" -eq 1 ]; then
  if [ ! -f "$CODENAME_FILE" ]; then
    log "Codename file not found: ${CODENAME_FILE}. Skip character/weapon mode."
    exit 0
  fi

  mapfile -t CN_API < <(jq -r '.[].api' "$CODENAME_FILE" || echo "")
  mapfile -t CN_LOCAL < <(jq -r '.[].local' "$CODENAME_FILE" || echo "")

  if [ "${#CN_API[@]}" -eq 0 ]; then
    log "Codename list is empty or invalid. Skip character/weapon mode."
    exit 0
  fi

  for rg in "${REGIONS[@]}"; do
    if [ "$RUN_CHARACTER" -eq 1 ]; then
      mkdir -p "$ROOT_DIR/character/$rg" "$ROOT_DIR/before/character/$rg"
    fi
    if [ "$RUN_WEAPON" -eq 1 ]; then
      mkdir -p "$ROOT_DIR/weapon/$rg" "$ROOT_DIR/before/weapon/$rg"
    fi

    for i in "${!CN_API[@]}"; do
      api_code="${CN_API[$i]}"
      local_code="${CN_LOCAL[$i]}"
      if [ -z "$api_code" ]; then
        continue
      fi
      if [ -z "$local_code" ]; then
        local_code="$api_code"
      fi

      if [ "$RUN_CHARACTER" -eq 1 ]; then
        fetch_and_write_character "$rg" "$api_code" "$local_code"
      fi
      if [ "$RUN_WEAPON" -eq 1 ]; then
        fetch_and_write_weapon "$rg" "$api_code" "$local_code"
      fi
    done
  done
fi

log "fetch-external-data completed."
exit 0
