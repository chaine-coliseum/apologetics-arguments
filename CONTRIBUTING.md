# Guide de contribution

## Ajouter une entité

1. Copiez le modèle qui convient depuis [`modeles/`](modeles/) dans le bon dossier de `data/`.
2. Donnez-lui un identifiant en kebab-case, sans accents ni majuscules, identique au nom du fichier (`muhammad-est-le-paraclet.md`, `coran-4-157.yaml`).
3. Reliez-la aux entités existantes par leurs identifiants (`repond_a`, `passages`, `themes`…).
4. Lancez `npm run validate` : la commande échoue si un champ est invalide ou si une référence pointe vers une entité inexistante.
5. Ouvrez une branche puis une *pull request* : une autre personne de l'équipe relit avant la fusion.

## Choisir le type d'un argument

| Type | Quand l'utiliser |
| --- | --- |
| `these` | Un argument positif en faveur de son camp (le Paraclet est le Saint-Esprit ; Muhammad est le Paraclet) |
| `objection` | Une attaque contre l'autre camp (la Bible est falsifiée ; l'abrogation contredit l'immutabilité) |
| `reponse` | Une réponse à un ou plusieurs arguments précis : `repond_a` est obligatoire |
| `dilemme` | Une question qui place l'interlocuteur devant des options toutes problématiques : le champ `dilemme` est obligatoire |

Une prémisse utilisée par plusieurs arguments devient un argument à part entière, référencé dans `premisses[].argument`.

## Identifiants des passages

- Bible : `livre-chapitre-verset` en toutes lettres (`jean-14-26`, `1-corinthiens-15-14`, `deuteronome-18-15-19`).
- Coran : `coran-sourate-verset` (`coran-4-157-158`).
- Hadith : `recueil-numero` (`bukhari-4428`, `muslim-1452a`, `tirmidhi-2653`).
- Textes juifs et patristiques : nom de l'œuvre (`bereshit-rabbah-47-5`, `irenee-contre-heresies-3-1-1`).

## Règles éditoriales

1. **Honnêteté intellectuelle.** Présentez chaque thèse adverse sous sa forme la plus forte. Indiquez dans `points_faibles` les limites de l'argument et la réponse adverse attendue.
2. **Sourçage.** Toute affirmation factuelle renvoie à une source vérifiable (`sources`, avec page). Une référence non vérifiée est signalée en clair, par exemple `(à vérifier)` ou `<!-- à vérifier -->`.
3. **Traductions.** Bible : Segond 1910 par défaut. Coran : Hamidullah (Complexe Roi Fahd). Précisez dans `traduction` toute autre version.
4. **Références dans le texte.** Notation française : `Jn 14,26`, `1 Co 15,3-8`, `Coran 4,157`.
5. **Ton.** Respectueux envers les interlocuteurs. On critique des idées et des textes, jamais des personnes privées.
6. **Traçabilité.** Le champ `origine` indique le document du Drive dont le contenu est tiré.

## Statuts

- `ebauche` : importé ou en cours de rédaction, pas encore relu.
- `en-relecture` : complet, en attente de relecture.
- `valide` : relu, sources vérifiées.

Toutes les fiches importées du Drive sont au statut `ebauche`.
