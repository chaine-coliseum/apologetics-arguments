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
    passages: 'passages', 'sources[].id': 'sources',
    'premisses[].argument': 'arguments', 'premisses[].passages': 'passages',
  },
  questions: {
    themes: 'themes', arguments: 'arguments', passages: 'passages',
    'reponses_possibles[].arguments': 'arguments',
  },
  passages: { themes: 'themes' },
  termes: { voir_aussi: 'termes' },
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

if (errors.length) {
  console.error(`✗ ${errors.length} erreur(s) :\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

// Relations inverses, pour que l'API n'ait pas à les recalculer.
for (const a of db.arguments) {
  a.repondu_par = db.arguments.filter((b) => b.repond_a?.includes(a.id)).map((b) => b.id);
  a.appuye_par = db.arguments.filter((b) => b.appuie?.includes(a.id)).map((b) => b.id);
  a.questions = db.questions.filter((q) => q.arguments?.includes(a.id)).map((q) => q.id);
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
