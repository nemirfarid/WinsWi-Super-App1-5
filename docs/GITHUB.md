# GitHub — publication du projet WinsWi

1. Créer un dépôt privé ou public nommé `WinsWi`.
2. Copier le contenu de ce dossier dans le dépôt.
3. Ne jamais ajouter `.env`, clés Gemini, clés Firebase ou mots de passe.
4. Ajouter `.env.example` uniquement.
5. Vérifier que `package-lock.json` est généré par `npm install` sur une machine avec accès npm.
6. Exécuter :

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

7. Pousser uniquement après ces validations.

## Google AI Studio
Le dépôt est structuré pour être importé comme projet existant. La clé Gemini doit rester dans les secrets/environnement serveur et ne doit jamais être écrite dans le frontend.
