# Arguments apologétiques

Base de données collaborative d'apologétique chrétienne, centrée sur le débat islamo-chrétien : thèses et objections musulmanes, réponses chrétiennes, dilemmes, questions à poser en débat, passages cités et sources.

Le dépôt s'en tient au christianisme commun (ce que partagent catholiques, protestants et orthodoxes). Quand une réponse dépend d'une confession, la fiche le signale sans trancher.

Les données sont faites pour être servies par une API (NestJS) et affichées par un front (Nuxt), développés à part.

## Organisation

```
data/
├── arguments/   Un fichier .md par argument : en-tête YAML + développement Markdown
├── questions/   Questions de débat, avec réponses probables et relances (.yaml)
├── passages/    Versets, hadiths, textes juifs et patristiques cités (.yaml)
├── sources/     Bibliographie (.yaml)
├── themes/      Thèmes hiérarchiques (.yaml)
└── termes/      Glossaire (.yaml)
schemas/         Schémas JSON de validation, un par collection
scripts/build.mjs  Validation + export
modeles/         Modèles de fichiers à copier
```

## Le modèle de données

Tout est relié par identifiant (kebab-case, sans accents, identique au nom du fichier).

| Collection | Rôle | Relations |
| --- | --- | --- |
| `arguments` | Une thèse, une objection, une réponse ou un dilemme, d'un camp donné (`christianisme`, `islam`, `atheisme`) | `repond_a`, `appuie`, `voir_aussi` → arguments ; `contredit[]` → argument du même camp incompatible ; `premisses[].argument` → argument qui démontre une prémisse partagée ; `passages`, `sources`, `themes` |
| `questions` | Une question à poser en débat | `arguments`, `passages`, `themes` ; `reponses_possibles[]` avec relance et `suite` → question suivante |
| `passages` | Un texte cité (Bible, Coran, hadith, Talmud, Pères…) | `liens[]` → autres passages (`parallele`, `tension`, `cite`, `commente`, `abroge`) ; `themes` |
| `sources` | Un livre, un article, une vidéo ou un document interne | — |
| `themes` | Une catégorie (hiérarchie par `parent`) | `parent` |
| `termes` | Une entrée du glossaire | `voir_aussi` ; `arguments`, `passages` |

Exemple de chaîne : la thèse `muhammad-est-le-paraclet` (camp islam) reçoit plusieurs `reponse` chrétiennes et neuf `dilemme`. Ceux-ci partagent les prémisses `paraclet-rappelle-les-paroles-de-jesus` et `paroles-de-jesus-ne-passent-pas`, et chaque dilemme a une question d'entrée dans `data/questions/`.

Trois usages en débat :

- **`contredit`** relève les positions qu'un même camp ne peut pas tenir ensemble : « la Bible est falsifiée » et « Dt 18,18 annonce Muhammad ».
- **`suite`** fait des questions un arbre : selon la réponse obtenue, on passe à telle question.
- **`liens`** relie les passages entre eux, y compris les tensions qu'un argument exploite (Coran 15,9 et le verset des allaitements de Muslim 1452a).

Les relations symétriques (`contredit`, `parallele`, `tension`) se déclarent d'un seul côté : l'export ajoute l'autre.

## Valider et exporter

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run validate   # schémas + intégrité des références + liens Markdown internes
npm run build      # écrit dist/db.json
```

`dist/db.json` contient toutes les collections, les relations inverses calculées (`repondu_par`, `appuye_par`, `questions`, `termes` et `contredit` réciproque sur les arguments ; `liens` réciproques, `utilise_par` et `termes` sur les passages ; `utilisee_par` sur les sources ; `precedee_par` sur les questions) et une liste `relations` (`de`, `champ`, `vers`), prête pour une table de jointure SQL. L'API pourra charger ce fichier tel quel, ou l'importer dans PostgreSQL.

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md).
