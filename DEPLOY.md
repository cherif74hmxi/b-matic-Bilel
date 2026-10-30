# Mise en ligne de B MATIC sur le VPS

| | |
|---|---|
| **Site** | https://bmatic-pare-brise.com |
| **VPS** | `51.75.126.171` (Ubuntu) |
| **Dossier** | `/var/www/bmatic` |
| **Serveur** | Node + Express (pm2), derrière nginx (HTTPS) |

> Ce guide se suit **une seule fois**. Ensuite, chaque `git push` sur `main`
> redéploie le site tout seul (GitHub Actions → SSH → build → reload).

Toutes les commandes se lancent **sur le VPS** (en SSH), sauf la partie 6 (secrets GitHub).

---

## 0. Pré-requis

Tu héberges déjà des sites, donc nginx / certbot sont sûrement là. Vérifie / installe :

```bash
node -v          # doit être 20+ (idéalement 22). Sinon :
# curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs

command -v pm2 || sudo npm install -g pm2
command -v nginx || sudo apt-get install -y nginx
command -v certbot || sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 1. DNS (déjà fait)

```
A   bmatic-pare-brise.com       ->  51.75.126.171   ✅
A   www.bmatic-pare-brise.com   ->  51.75.126.171   (recommandé)
```

---

## 2. Récupérer le code sur le VPS

**Repo privé** → crée une clé de déploiement en lecture seule :

```bash
ssh-keygen -t ed25519 -C "vps-bmatic-deploy" -f ~/.ssh/bmatic_deploy -N ""
cat ~/.ssh/bmatic_deploy.pub
```

Copie cette clé dans GitHub : **repo → Settings → Deploy keys → Add deploy key**
(laisse « Allow write access » décoché). Puis :

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com-bmatic
  HostName github.com
  User git
  IdentityFile ~/.ssh/bmatic_deploy
EOF

sudo mkdir -p /var/www && sudo chown -R $USER:$USER /var/www
git clone git@github.com-bmatic:cherif74hmxi/b-matic-Bilel.git /var/www/bmatic
cd /var/www/bmatic
```

> Si le repo est **public**, saute la clé et clone simplement :
> `git clone https://github.com/cherif74hmxi/b-matic-Bilel.git /var/www/bmatic`

---

## 3. Le fichier `.env`

```bash
cd /var/www/bmatic
cat > .env <<'EOF'
VITE_SUPABASE_URL=https://tmwrojupzotevaugrxii.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtd3JvanVwem90ZXZhdWdyeGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTI4MTYsImV4cCI6MjEwODE2ODgxNn0.X4o-xwwj-PkydadTSPFfcbRsGvo7wGR8puEONZBfIaY
VITE_SITE_URL=https://bmatic-pare-brise.com
VITE_AI_ENABLED=true
PORT=3000
EOF
```

> La clé `ANON` est **publique** (elle est déjà dans le site livré au navigateur, protégée
> par les règles RLS de Supabase). Ce n'est pas un secret. `.env` est ignoré par git.

---

## 4. Build + démarrage

```bash
cd /var/www/bmatic
npm ci
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup        # exécute la commande affichée (une fois) -> démarrage au boot
```

Test rapide en local sur le VPS :

```bash
curl -I http://127.0.0.1:3000/        # doit répondre HTTP 200
```

---

## 5. nginx + HTTPS

```bash
sudo cp /var/www/bmatic/deploy/nginx-bmatic.conf /etc/nginx/sites-available/bmatic
sudo ln -sf /etc/nginx/sites-available/bmatic /etc/nginx/sites-enabled/bmatic
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d bmatic-pare-brise.com -d www.bmatic-pare-brise.com
```

certbot ajoute le HTTPS et la redirection 80 → 443. Le site est en ligne :
**https://bmatic-pare-brise.com** 🎉

---

## 6. Auto-déploiement (GitHub Actions)

Pour que chaque `push` sur `main` redéploie tout seul.

**a)** Sur le VPS, crée une clé SSH dédiée à GitHub Actions :

```bash
ssh-keygen -t ed25519 -C "github-actions-bmatic" -f ~/.ssh/gha_bmatic -N ""
cat ~/.ssh/gha_bmatic.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/gha_bmatic      # <- ceci est la clé PRIVÉE, copie TOUT le contenu
```

**b)** Dans GitHub : **repo → Settings → Secrets and variables → Actions → New repository secret**, crée les 3 secrets :

| Nom | Valeur |
|---|---|
| `VPS_HOST` | `51.75.126.171` |
| `VPS_USER` | ton utilisateur SSH (ex. `ubuntu`, `debian`…) |
| `VPS_SSH_KEY` | tout le contenu de `~/.ssh/gha_bmatic` (clé privée) |

C'est tout. Le workflow `.github/workflows/deploy.yml` fait le reste.

---

## 7. Tester l'auto-déploiement

Fais un petit changement, pousse sur `main`, puis regarde l'onglet **Actions** du repo :
le job « Déploiement VPS » doit passer au vert, et le changement apparaît en ligne.

Tu peux aussi le lancer à la main : onglet **Actions → Déploiement VPS → Run workflow**.

---

## 8. Email de confirmation au client (Brevo)

Quand un client laisse son email dans le formulaire `/rendez-vous`, le serveur lui envoie
une confirmation (route `POST /api/confirmation-rdv`, fichier `server/confirmation.ts`).
Tant que la clé n'est pas renseignée, rien n'est envoyé et le formulaire marche normalement.

**a) Compte et domaine** (une seule fois) :

1. Crée un compte gratuit sur [brevo.com](https://www.brevo.com) (300 emails/jour).
2. Dans Brevo, menu **Expéditeurs, domaines et IP dédiées → Domaines** : ajoute
   `bmatic-pare-brise.com`. Brevo affiche des enregistrements DNS (code de vérification
   Brevo, DKIM, DMARC) : ajoute-les **tels quels** chez ton registrar, à côté des
   enregistrements `A` de la partie 1, puis clique sur **Vérifier** (la propagation peut
   prendre de quelques minutes à quelques heures).
3. Menu **Expéditeurs** : ajoute `contact@bmatic-pare-brise.com`, nom « B MATIC ».
4. Menu **SMTP & API → Clés API** : génère une clé et copie-la.

**b) Sur le VPS**, complète le `.env` puis relance :

```bash
cd /var/www/bmatic
cat >> .env <<'EOF2'
BREVO_API_KEY=xkeysib-...ta-clé...
MAIL_FROM=contact@bmatic-pare-brise.com
MAIL_REPLY_TO=bmatic63s@gmail.com
EOF2
pm2 reload bmatic --update-env
```

`MAIL_REPLY_TO` : si le client répond à l'email, la réponse arrive dans cette boîte.

**c) Tester** : remplis le formulaire sur le site avec ton email. L'écran final doit
afficher « Un e-mail de confirmation vient de vous être envoyé… ». Sinon :
`pm2 logs bmatic --lines 50` (les erreurs Brevo y sont notées).

Anti-abus intégré : 5 envois max par heure et par connexion, 3 par jour et par adresse,
200 par jour au total (`LIMITES` dans `server/confirmation.ts`).

---

## Dépannage

```bash
pm2 logs bmatic --lines 50     # logs du serveur Node
pm2 restart bmatic             # relancer à la main
sudo tail -f /var/log/nginx/error.log
```

- **502 Bad Gateway** → le serveur Node est tombé : `pm2 logs bmatic` puis `pm2 restart bmatic`.
- **Page blanche** → vérifie le `.env` (URL + clé Supabase) puis `npm run build && pm2 reload bmatic`.
- **Le déploiement GitHub échoue** → vérifie les 3 secrets, et que la clé publique `gha_bmatic.pub`
  est bien dans `~/.ssh/authorized_keys` du bon utilisateur.
