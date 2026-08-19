# WinsWi Super App1 — architecture consolidée

Cette version consolide le socle 5.0.2 avec les deux spécifications fournies : Intelligence Engine multi-univers, agrégation d'opportunités autorisée et Social Ecosystem.

## Moteurs communs
- WinsWi AI / agents
- recherche texte, conversationnelle et vocale
- matching bidirectionnel et recommandations
- Global Opportunity Engine
- normalisation / déduplication / enrichissement IA
- Price Intelligence
- Trust & Safety + Reputation
- CRM + Business Analytics
- Social Distribution + Social AI
- paiements par adaptateurs locaux/internationaux
- préférences, langue et expérience adaptative

## Règle d'intégration externe
Les sources externes ne sont pas scrapées arbitrairement. L'architecture accepte : API officielles, accords partenaires, flux fournis par les vendeurs, données sous licence et référencement par lien lorsque permis. Chaque source porte un niveau d'autorisation et `canRepublish`.

## Réseaux sociaux
Les connecteurs sont préparés sans fausses clés ni contournement d'API. Une connexion réelle nécessite OAuth, application enregistrée, permissions/scopes et éventuelle approbation de la plateforme.

## IA
Gemini est appelé uniquement côté serveur. Sans `GEMINI_API_KEY`, WinsWi utilise un fallback local déterministe et reste démarrable.

## Paiements
Aucun secret n'est inclus dans Git. Les fournisseurs sont des adaptateurs ; leur activation dépend du contrat marchand, du pays, des webhooks et des règles locales.

## Santé et emploi
HealthWin reste informatif/orientation/rendez-vous. JobWin peut recommander des correspondances mais ne prend pas automatiquement une décision importante de recrutement.
