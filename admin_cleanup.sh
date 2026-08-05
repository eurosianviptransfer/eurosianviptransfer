#!/usr/bin/env bash
set -euo pipefail

# admin_cleanup.sh [branch-name] [remote]
# Example: ./admin_cleanup.sh admin/cleanup-parallel-routes-20260805 origin

BRANCH_NAME="${1:-}"
REMOTE_NAME="${2:-origin}"

TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
DEFAULT_BRANCH="admin/cleanup-parallel-routes-${TIMESTAMP}"
BRANCH_NAME="${BRANCH_NAME:-$DEFAULT_BRANCH}"

SRC_DIR="src/app/admin"
BACKUP_DIR="src/app/admin-deprecated-legacy-${TIMESTAMP}"

commit_message() {
cat <<EOF
chore(admin): move legacy /src/app/admin -> /${BACKUP_DIR} to avoid Turbopack parallel-route conflicts

Temporarily moving legacy admin pages to avoid Next.js/Turbopack "two parallel pages" build errors
(e.g. /admin/(cms)/content vs /admin/content). Backup preserved to ${BACKUP_DIR}.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
EOF
}

# 1) ensure we're in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Hata: Bu dizin bir git deposu değil. Lütfen repo kökünde çalıştır veya yerel klonunda çalıştır."
  exit 1
fi

# 2) show current branch and check cleanliness
CURRENT_BRANCH="$(git branch --show-current || echo 'unknown')"
echo "Mevcut branch: ${CURRENT_BRANCH}"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Uyarı: Çalışma ağacında kaydedilmemiş değişiklikler var:"
  git status --porcelain
  read -p "Devam etmek istiyor musunuz? (y/N): " CONF
  # bash 3 uyumlu onay kontrolü (case kullanılıyor)
  case "${CONF}" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "İşlem iptal edildi. Lütfen önce değişiklikleri commit/ stash edin veya script'i tekrar çalıştırın."; exit 1;;
  esac
fi

# 3) create branch
echo "Yeni branch oluşturuluyor: ${BRANCH_NAME}"
git checkout -b "${BRANCH_NAME}"

# 4) ensure src dir exists
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "Hata: ${SRC_DIR} bulunamadı. Script sonlandırılıyor."
  exit 1
fi

# 5) move the folder (preserve permissions)
echo "Taşıma: ${SRC_DIR} -> ${BACKUP_DIR}"
mkdir -p "$(dirname "${BACKUP_DIR}")"
git mv "${SRC_DIR}" "${BACKUP_DIR}"

# 6) add and commit
git add -A
TMPMSG="$(mktemp)"
commit_message > "${TMPMSG}"
git commit -F "${TMPMSG}"
rm -f "${TMPMSG}"

# 7) push
echo "Branch'i push'luyorum: ${REMOTE_NAME}/${BRANCH_NAME}"
git push -u "${REMOTE_NAME}" "${BRANCH_NAME}"

echo "Tamamlandı."
echo "Backup folder: ${BACKUP_DIR}"
echo "Yeni branch: ${BRANCH_NAME}"
echo ""
echo "Sonraki adımlar:"
echo "1) Lokal build testi: npm ci && npm run build"
echo "2) (Opsiyonel) npm run dev ile http://localhost:3000/admin-revamp ve yedeklenmiş admin dosyalarını kontrol et."
echo "3) Vercel preview deploy log'larını kontrol et; eğer başka paralel route hataları varsa bana log'u paylaş."

exit 0