# 🚀 Guide de Déploiement - Tarot Français

Ce guide vous aidera à déployer votre application Tarot Français en production.

## Table des Matières
- [Déploiement sur Vercel (Recommandé)](#vercel)
- [Déploiement avec Docker](#docker)
- [Déploiement Manuel](#manuel)
- [Configuration](#configuration)
- [Vérifications Pré-Déploiement](#verifications)

---

## 🎯 Vercel (Recommandé) {#vercel}

Vercel est la solution la plus simple pour déployer une app Next.js.

### Étapes

1. **Push ton code sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Créer un compte Vercel**
   - Va sur [vercel.com](https://vercel.com)
   - Connecte-toi avec ton compte GitHub

3. **Importer le projet**
   - Cliquez sur "New Project"
   - Sélectionnez votre repository GitHub
   - Vercel détectera automatiquement Next.js

4. **Configurer le projet**
   - **Framework Preset** : Next.js (auto-détecté)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

5. **Deploy !**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - 🎉 Votre app est en ligne !

### Après le déploiement

- Vercel vous donnera une URL : `https://votre-app.vercel.app`
- Chaque push sur `main` déclenchera un nouveau déploiement automatique
- Les branches créent des preview deployments

### Configuration Vercel

Dans les settings du projet :
- **Node.js Version** : 18.x (ou supérieur)
- **Environment Variables** : Aucune requise pour le fonctionnement de base

---

## 🐳 Docker {#docker}

Déploiement avec Docker pour plus de contrôle.

### Dockerfile

Créez un `Dockerfile` à la racine :

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires depuis builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Démarrer l'application
CMD ["npm", "start"]
```

### .dockerignore

Créez un `.dockerignore` :

```
node_modules
.next
.git
*.md
.env*.local
```

### Build et Run

```bash
# Build l'image
docker build -t tarot-francais .

# Run le container
docker run -p 3000:3000 tarot-francais

# Ou avec docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  tarot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

---

## 🔧 Déploiement Manuel {#manuel}

Sur un VPS (DigitalOcean, AWS EC2, etc.)

### 1. Prérequis sur le serveur

```bash
# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

### 2. Déployer l'application

```bash
# Cloner le repo
git clone <your-repo-url> /var/www/tarot
cd /var/www/tarot

# Installer les dépendances
npm ci --production

# Build l'application
npm run build

# Démarrer avec PM2
pm2 start npm --name "tarot" -- start

# Sauvegarder la config PM2
pm2 save
pm2 startup
```

### 3. Configuration Nginx (optionnel)

Si vous voulez un nom de domaine :

```nginx
server {
    listen 80;
    server_name tarot.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Support WebSocket pour Socket.io
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4. SSL avec Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tarot.votredomaine.com
```

---

## ⚙️ Configuration {#configuration}

### Variables d'Environnement

Pour l'instant, aucune variable d'environnement n'est strictement nécessaire.

Si vous voulez personnaliser :

```bash
# .env.local (optionnel)
NODE_ENV=production
PORT=3000
```

### Configuration Socket.io

Socket.io fonctionne automatiquement avec Next.js.

**Important** : Assurez-vous que votre hébergeur supporte :
- WebSockets
- API Routes Next.js
- Server-Side Rendering

Vercel supporte tout ça nativement ✅

---

## ✅ Vérifications Pré-Déploiement {#verifications}

Avant de déployer, vérifiez :

### 1. Build local réussit

```bash
npm run build
```

Doit terminer sans erreurs TypeScript.

### 2. Démarrage production local

```bash
npm run build
npm start
```

Testez sur `http://localhost:3000`

### 3. Tests fonctionnels

- [ ] Page d'accueil s'affiche correctement
- [ ] Peut créer une room multiplayer
- [ ] Code de room fonctionne
- [ ] Peut joindre une room
- [ ] Socket.io se connecte
- [ ] Jeu fonctionne de bout en bout

### 4. Checklist

- [ ] `package.json` à jour
- [ ] Pas de secrets dans le code
- [ ] Build passe sans warnings critiques
- [ ] Tests manuels OK
- [ ] README à jour

---

## 🔍 Monitoring Post-Déploiement

### Vercel

Vercel fournit :
- Analytics intégré
- Logs en temps réel
- Monitoring de performance

### PM2 (déploiement manuel)

```bash
# Voir les logs
pm2 logs tarot

# Monitorer en temps réel
pm2 monit

# Status
pm2 status
```

### Commandes utiles

```bash
# Redémarrer l'app
pm2 restart tarot

# Arrêter l'app
pm2 stop tarot

# Voir les métriques
pm2 show tarot
```

---

## 🐛 Troubleshooting

### Socket.io ne fonctionne pas en production

**Problème** : Les connexions WebSocket échouent

**Solutions** :
1. Vérifiez que votre hébergeur supporte WebSockets
2. Si derrière un proxy, configurez le forwarding WebSocket
3. Vérifiez les CORS si nécessaire

### Build échoue sur Vercel

**Problème** : Erreur TypeScript au build

**Solutions** :
1. Lancez `npm run build` localement
2. Corrigez les erreurs TypeScript
3. Push les corrections

### L'app est lente

**Solutions** :
1. Vérifiez la région du déploiement (proche de vos utilisateurs)
2. Activez le caching
3. Optimisez les images si ajoutées

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les [logs de déploiement](#monitoring-post-déploiement)
2. Consultez la [documentation Next.js](https://nextjs.org/docs/deployment)
3. Consultez la [documentation Vercel](https://vercel.com/docs)
4. Ouvrez une issue sur GitHub

---

## 🎉 Félicitations !

Votre application Tarot Français est maintenant en ligne ! 🃏✨

Partagez le lien avec vos amis et profitez du jeu !

---

**Bon déploiement !** 🚀
