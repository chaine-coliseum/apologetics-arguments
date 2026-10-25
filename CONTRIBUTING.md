# Guide de contribution

## Créer une fiche

1. Choisissez le bon type (`argument`, `objection` ou `debat`), puis copiez le modèle qui correspond depuis [`modeles/`](modeles/).
2. Placez la fiche dans le bon dossier sous `docs/`.
3. Remplissez l'en-tête YAML (voir plus bas) et laissez `statut: ebauche`.
4. Ajoutez un lien vers la fiche dans le fichier `index.md` de son dossier.
5. Ouvrez une branche puis une *pull request* : une autre personne de l'équipe relit avant la fusion.

## Conventions de nommage

- Noms de fichiers et de dossiers en **kebab-case**, **sans accents** ni majuscules : `argument-cosmologique-kalam.md`.
- Un fichier par argument, objection ou question de débat.
- Chaque dossier contient un `index.md` qui présente le thème et liste les fiches.

## En-tête YAML

Chaque fiche commence par :

```yaml
---
title: Argument cosmologique du kalam
description: Tout ce qui commence d'exister a une cause ; l'univers a commencé d'exister.
type: argument            # argument | objection | debat
statut: ebauche           # ebauche | en-relecture | valide
tags:
  - existence de Dieu
  - cosmologie
mise_a_jour: 2026-10-25
---
```

Statuts :

- `ebauche` : en cours de rédaction, pas encore fiable.
- `en-relecture` : complète, en attente de relecture.
- `valide` : relue et sourcée, utilisable telle quelle.

## Règles éditoriales

1. **Honnêteté intellectuelle.** Présentez chaque objection sous sa forme la plus forte (*steelman*), jamais sous forme caricaturale. Une fiche signale aussi les limites et les points faibles de l'argument qu'elle défend.
2. **Sourçage.** Toute affirmation factuelle (historique, scientifique, textuelle) renvoie à une source vérifiable : auteur, titre, année, page ou chapitre si possible. Privilégiez les sources primaires et les travaux universitaires plutôt que les blogs.
3. **Citations.** Les citations sont exactes, entre guillemets, et suivies de leur référence. Précisez qui a traduit une citation traduite par nos soins.
4. **Références bibliques.** Notation française : `Jn 3,16`, `1 Co 15,3-8`. Indiquez la traduction quand elle compte (`BJ`, `TOB`, `NBS`, `Segond 21`…).
5. **Périmètre.** Le dépôt couvre le christianisme commun. Quand une réponse dépend d'une confession, le texte le signale au lieu de trancher.
6. **Ton.** Respectueux envers les interlocuteurs et les autres traditions : nous argumentons, nous ne polémiquons pas.

## Liens entre fiches

Utilisez des liens Markdown relatifs avec l'extension `.md`, par exemple `[le problème du mal](../objections/probleme-du-mal.md)`. Ces liens fonctionnent à la fois sur GitHub, dans Obsidian et sur le site MkDocs.

## Bibliographie

Un ouvrage cité dans plusieurs fiches s'ajoute aussi à [`docs/sources/index.md`](docs/sources/index.md).

## Vérifier avant d'envoyer

```bash
mkdocs build --strict
```

Avec `--strict`, la commande échoue dès qu'un lien interne est cassé.
