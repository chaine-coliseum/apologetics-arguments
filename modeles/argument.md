---
id: identifiant-en-kebab-case        # = nom du fichier, sans accents
titre: Titre de l'argument
type: these                          # these | objection | reponse | dilemme
camp: christianisme                  # christianisme | islam | atheisme
resume: L'argument en une ou deux phrases.
themes: [paraclet]                   # ids de data/themes/
repond_a: []                         # obligatoire si type = reponse
appuie: []                           # arguments que celui-ci soutient
voir_aussi: []
contredit:                           # facultatif : argument du même camp incompatible avec celui-ci
  - argument: id-d-un-autre-argument # déclaré d'un seul côté, l'export ajoute l'inverse
    explication: Pourquoi on ne peut pas soutenir les deux.
passages: [jean-14-26]               # ids de data/passages/
sources:
  - id: id-de-la-source              # id de data/sources/
    localisation: p. 12
premisses:                           # facultatif
  - enonce: Première prémisse.
    argument: id-d-un-argument-qui-la-demontre   # facultatif
    passages: []
conclusion: Conclusion du raisonnement.
dilemme:                             # obligatoire si type = dilemme
  question: La question posée à l'interlocuteur.
  options:
    - si: Première réponse possible.
      alors: Conséquence.
    - si: Deuxième réponse possible.
      alors: Conséquence.
points_faibles:
  - Limite honnête de l'argument, ou réponse adverse attendue.
statut: ebauche                      # ebauche | en-relecture | valide
origine: [PUBLIC/Nom du document.pdf]
---

Développement libre en Markdown. Lien vers un autre argument : [titre](autre-argument.md).
