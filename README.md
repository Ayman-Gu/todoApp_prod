# toDo-App

## 🛠️ Technologies utilisées

- Node.js  
- Electron  
- React  

## 🚀 Fonctionnalités actuelles

### Gestion des tâches

- Affichage des tâches avec leur date de création
- Ajout d'une tâche avec une description
- Modification ou suppression d'une tâche
- Validation d'une tâche (déplacement de la tâche validée vers la page d'historique)
- Sur la page historique : gestion des tâches et affichage de la date de validation
  
NB : j'ai utiliser les sockets io pour eviter l'actualisation du page pendant chaque action

## 🗃️ Base de données

Deux triggers sont définis dans la base de données :

1. Un trigger pour que `id_task = id` (afin de respecter les bonnes pratiques, notamment en cas de relations entre tables dans le futur).
2. Un trigger pour ajouter +1 heure à la date (car phpMyAdmin ne prend pas correctement l'heure actuelle, notamment au Maroc).

📁 La base de données se trouve dans le dossier : `backend/DB_backup`

## ⚙️ Exécution du projet

### Installation des dépendances (obligatoire avant toute exécution)

```bash
# Backend
cd backend
npm install

# Frontend
- npm install
# En mode dev
- npm run dev
# En mode prod
- npm run build
- npm run start




