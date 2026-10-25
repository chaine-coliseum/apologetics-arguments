// Valide data/ (schémas + intégrité des références) puis exporte dist/db.json.
// Usage : node scripts/build.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import YAML from 'yaml';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

// collection -> { schéma, extension }
const COLLECTIONS = {
  themes: { schema: 'theme', ext: '.yaml' },
  arguments: { schema: 'argument', ext: '.md' },
  questions: { schema: 'question', ext: '.yaml' },
  passages: { schema: 'passage', ext: '.yaml' },
  sources: { schema: 'source', ext: '.yaml' },
  termes: { schema: 'terme', ext: '.yaml' },
};

// Champs qui référencent une autre collection.
const REFS = {
  themes: { parent: 'themes' },
  arguments: {
    themes: 'themes', repond_a: 'arguments', appuie: 'arguments', voir_aussi: 'arguments',
    'contredit[].argument': 'arguments', passages: 'passages', 'sources[].id': 'sources',
    'premisses[].argument': 'arguments', 'premisses[].passages': 'passages',
  },
  questions: {
    themes: 'themes', arguments: 'arguments', passages: 'passages',
    'reponses_possibles[].arguments': 'arguments', 'reponses_possibles[].suite': 'questions',
  },
  passages: { themes: 'themes', 'liens[].passage': 'passages', 'liens[].argument': 'arguments' },
  termes: { voir_aussi: 'termes', arguments: 'arguments', passages: 'passages' },
};

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
for (const f of fs.readdirSync(path.join(root, 'schemas'))) {
  ajv.addSchema(JSON.parse(fs.readFileSync(path.join(root, 'schemas', f), 'utf8')));
}

const errors = [];
const db = {};

for (const [name, { schema, ext }] of Object.entries(COLLECTIONS)) {
  const dir = path.join(root, 'data', name);
  db[name] = [];
  if (!fs.existsSync(dir)) continue;
  const validate = ajv.getSchema(schema);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(ext)).sort()) {
    const rel = `data/${name}/${file}`;
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    let entity;
    try {
      if (ext === '.md') {
        const { data, content } = matter(raw);
        entity = { ...data };
        if (!validate(entity)) report(rel, validate.errors);
        entity.contenu = content.trim();
      } else {
        entity = YAML.parse(raw);
        if (!validate(entity)) report(rel, validate.errors);
      }
    } catch (e) {
      errors.push(`${rel} : ${e.message}`);
      continue;
    }
    if (entity.id !== path.basename(file, ext)) {
      errors.push(`${rel} : l'id « ${entity.id} » doit correspondre au nom du fichier`);
    }
    db[name].push(entity);
  }
}

const index = Object.fromEntries(
  Object.entries(db).map(([name, items]) => [name, new Map(items.map((e) => [e.id, e]))]),
);

// Intégrité référentielle + liste d'arêtes (utile pour une table de jointure SQL).
const relations = [];
for (const [name, fields] of Object.entries(REFS)) {
  for (const entity of db[name]) {
    for (const [field, target] of Object.entries(fields)) {
      for (const id of collect(entity, field)) {
        if (!index[target].has(id)) {
          errors.push(`${name}/${entity.id} : ${field} → « ${id} » introuvable dans ${target}`);
        } else {
          relations.push({ de: `${name}/${entity.id}`, champ: field.replace('[].', '.'), vers: `${target}/${id}` });
        }
      }
    }
  }
}

// Liens Markdown entre arguments dans le corps : [texte](autre-argument.md)
for (const a of db.arguments) {
  for (const [, target] of a.contenu.matchAll(/\]\(([a-z0-9-]+)\.md\)/g)) {
    if (!index.arguments.has(target)) errors.push(`arguments/${a.id} : lien vers « ${target}.md » introuvable`);
  }
}

// Relations entre pairs : pas de boucle, pas de doublon, et contredit reste dans un même camp.
const paires = new Set();
const paire = (col, a, b) => [a, b].sort().join(' ↔ ') + ` (${col})`;
for (const a of db.arguments) {
  for (const { argument: b } of a.contredit ?? []) {
    const cible = index.arguments.get(b);
    if (b === a.id) errors.push(`arguments/${a.id} : contredit pointe vers lui-même`);
    else if (cible && cible.camp !== a.camp) errors.push(`arguments/${a.id} : contredit « ${b} » est d'un autre camp (utiliser repond_a)`);
    const k = paire('contredit', a.id, b);
    if (paires.has(k)) errors.push(`arguments/${a.id} : contredit « ${b} » déclaré deux fois (une seule déclaration suffit)`);
    paires.add(k);
  }
}
for (const p of db.passages) {
  for (const l of p.liens ?? []) {
    if (l.passage === p.id) errors.push(`passages/${p.id} : lien vers lui-même`);
    const k = paire(l.type, p.id, l.passage);
    if (paires.has(k)) errors.push(`passages/${p.id} : lien ${l.type} vers « ${l.passage} » déclaré deux fois`);
    paires.add(k);
  }
}
for (const q of db.questions) {
  for (const r of q.reponses_possibles ?? []) {
    if (r.suite === q.id) errors.push(`questions/${q.id} : suite pointe vers elle-même`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} erreur(s) :\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

// Relations inverses, pour que l'API n'ait pas à les recalculer.
for (const a of db.arguments) {
  a.repondu_par = db.arguments.filter((b) => b.repond_a?.includes(a.id)).map((b) => b.id);
  a.appuye_par = db.arguments.filter((b) => b.appuie?.includes(a.id)).map((b) => b.id);
  a.questions = db.questions.filter((q) => q.arguments?.includes(a.id)).map((q) => q.id);
  a.contredit = [
    ...(a.contredit ?? []),
    ...db.arguments.flatMap((b) => (b.contredit ?? [])
      .filter((c) => c.argument === a.id)
      .map((c) => ({ argument: b.id, explication: c.explication }))),
  ];
  a.termes = db.termes.filter((t) => t.arguments?.includes(a.id)).map((t) => t.id);
}

const INVERSE = { parallele: 'parallele', tension: 'tension', cite: 'cite_par', commente: 'commente_par', abroge: 'abroge_par' };
for (const p of db.passages) {
  p.liens = [
    ...(p.liens ?? []),
    ...db.passages.flatMap((o) => (o.liens ?? [])
      .filter((l) => l.passage === p.id)
      .map(({ passage, type, ...reste }) => ({ passage: o.id, type: INVERSE[type], ...reste }))),
  ];
  p.utilise_par = {
    arguments: db.arguments.filter((a) => a.passages?.includes(p.id) || a.premisses?.some((m) => m.passages?.includes(p.id))).map((a) => a.id),
    questions: db.questions.filter((q) => q.passages?.includes(p.id)).map((q) => q.id),
  };
  p.termes = db.termes.filter((t) => t.passages?.includes(p.id)).map((t) => t.id);
}

for (const s of db.sources) {
  s.utilisee_par = db.arguments.filter((a) => a.sources?.some((r) => r.id === s.id)).map((a) => a.id);
}

for (const q of db.questions) {
  q.precedee_par = db.questions.filter((o) => o.reponses_possibles?.some((r) => r.suite === q.id)).map((o) => o.id);
}

const counts = Object.entries(db).map(([k, v]) => `${v.length} ${k}`).join(', ');
if (checkOnly) {
  console.log(`✓ Données valides : ${counts}, ${relations.length} relations`);
} else {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  const out = { genere_le: new Date().toISOString(), ...db, relations };
  fs.writeFileSync(path.join(root, 'dist', 'db.json'), JSON.stringify(out, null, 2));
  console.log(`✓ dist/db.json : ${counts}, ${relations.length} relations`);
}

function report(file, errs) {
  for (const e of errs) errors.push(`${file} : ${e.instancePath || '/'} ${e.message}`);
}

// Lit un champ, éventuellement imbriqué dans un tableau d'objets (« a[].b »).
function collect(entity, field) {
  const [head, tail] = field.split('[].');
  const value = entity[head];
  if (value == null) return [];
  if (tail) return value.flatMap((item) => [item[tail] ?? []].flat());
  return [value].flat();
}
