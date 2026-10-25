# Arguments apologétiques

Base de connaissances collaborative en apologétique chrétienne : arguments, réponses aux objections et fiches de préparation aux débats.

Le dépôt s'en tient au **christianisme commun**, c'est-à-dire ce que partagent catholiques, protestants et orthodoxes (existence de Dieu, Jésus historique, résurrection, fiabilité des Écritures…). Les questions qui divisent les confessions ne relèvent pas de son objet.

## Organisation

```
docs/                      Contenu publié sur le site
├── index.md               Page d'accueil
├── methode/               Approches apologétiques, posture, bonnes pratiques
├── arguments/             Arguments positifs, classés par thème
│   ├── existence-de-dieu/
│   ├── jesus-historique/
│   ├── resurrection/
│   └── fiabilite-de-la-bible/
├── objections/            Objections courantes et réponses détaillées
├── debats/                Fiches express pour le débat (réponses en 30 s / 2 min)
├── sources/               Bibliographie et auteurs de référence
└── glossaire.md           Vocabulaire technique
modeles/                   Modèles de fiches à copier (non publiés)
```

Trois types de fiches :

| Type        | Dossier                   | Contenu                                                      |
| ----------- | ------------------------- | ------------------------------------------------------------ |
| `argument`  | `docs/arguments/<thème>/` | Un argument positif : formulation, défense des prémisses, objections, sources |
| `objection` | `docs/objections/`        | Une objection : formulation la plus forte, réponses possibles, sources |
| `debat`     | `docs/debats/`            | Une question qu'on entend souvent : réponse courte, réponse développée, renvois |

Les fiches d'argument et d'objection contiennent l'analyse de fond. Les fiches de débat sont courtes et renvoient vers ces fiches.

## Consulter le site en local

Prérequis : Python 3.10 ou plus récent.

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
mkdocs serve
```

Le site est alors servi sur <http://127.0.0.1:8000>. Pour générer la version statique, lancez `mkdocs build` : le résultat est écrit dans `site/`.

## Contribuer

Consultez [CONTRIBUTING.md](CONTRIBUTING.md), qui couvre les conventions de nommage, les métadonnées, les règles de sourçage et le processus de relecture.
