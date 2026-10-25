# Notes pour Claude

- Base de données d'apologétique chrétienne en **français**, centrée sur le débat islamo-chrétien. Les données (`data/`) seront servies par une API NestJS et un front Nuxt, développés à part.
- Périmètre : **christianisme commun**. Quand une réponse dépend d'une confession, la signaler sans trancher.
- Le modèle (collections, types d'arguments, relations) est décrit dans `README.md`, les conventions dans `CONTRIBUTING.md`, et les schémas dans `schemas/`.
- Toujours lancer `npm run validate` après une modification de `data/`.
- Ne jamais inventer de source, de citation ou de numéro de page. Signaler toute référence non vérifiée (`à vérifier`).
- Ne jamais intégrer de contenu visant des personnes privées.
- Contenu importé du Google Drive de l'équipe (`G:\Mon Drive\PDF`, surtout le dossier `PUBLIC/`) ; le champ `origine` trace le document source.
