# Politique des sources externes

WinsWi ne doit pas être conçu comme un scraper universel.

Priorité :
1. API officielle
2. accord partenaire
3. flux XML/JSON/CSV fourni par le professionnel
4. donnée publique dont la licence autorise la réutilisation
5. simple référencement/lien lorsque la copie n'est pas autorisée
6. scraping non autorisé : exclu

Les objets externes conservent `source`, `sourceUrl`, `sourceId`, `publishedAt` et `lastSeenAt`. Une offre peut être normalisée et dédupliquée sans être republée intégralement lorsque les droits ne le permettent pas.
