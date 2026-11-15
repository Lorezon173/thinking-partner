import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const roots = {
  codex: '.agents',
  claude: '.claude',
  dsh: '.dsh',
};
const files = ['SKILL.md', 'references/records.md', 'references/improvement.md'];
const usage = 'Usage: node scripts/install.mjs --agent codex|claude|dsh|all [--project <directory>]';

function stat(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function checkDirectory(path) {
  const entry = stat(path);
  if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) {
    throw new Error(`Expected a real directory: ${path}`);
  }
  return Boolean(entry);
}

function samePath(left, right) {
  return process.platform === 'win32'
    ? left.toLowerCase() === right.toLowerCase()
    : left === right;
}

function matchesBundle(target, contents) {
  if (!checkDirectory(target)) return false;
  const references = join(target, 'references');
  if (checkDirectory(references)
    && readdirSync(target).sort().join('/') === 'SKILL.md/references'
    && readdirSync(references).sort().join('/') === 'improvement.md/records.md'
    && contents.every(([file, bytes]) => {
      const path = join(target, file);
      const entry = stat(path);
      return entry?.isFile() && !entry.isSymbolicLink() && readFileSync(path).equals(bytes);
    })) {
    return true;
  }
  throw new Error(`Existing skill differs; left untouched: ${target}`);
}

function install(directory, target, contents) {
  mkdirSync(directory, { recursive: true });
  const stage = mkdtempSync(join(directory, '.thinking-partner-install-'));
  const written = [];
  let referencesCreated = false;
  try {
    mkdirSync(join(stage, 'references'));
    referencesCreated = true;
    for (const [file, bytes] of contents) {
      const path = join(stage, file);
      written.push(path);
      writeFileSync(path, bytes, { flag: 'wx' });
    }
    if (stat(target)) throw new Error(`Skill appeared during installation: ${target}`);
    renameSync(stage, target);
  } catch (error) {
    // The temporary directory belongs to this invocation.
    for (const path of written) {
      if (stat(path)) unlinkSync(path);
    }
    if (referencesCreated) rmdirSync(join(stage, 'references'));
    rmdirSync(stage);
    throw error;
  }
}

function main() {
  const { values } = parseArgs({
    options: {
      agent: { type: 'string' },
      project: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  if (values.agent !== 'all' && !Object.hasOwn(roots, values.agent)) {
    throw new Error(usage);
  }

  const requested = resolve(values.project ?? process.cwd());
  if (!checkDirectory(requested)) throw new Error(`Project directory is missing: ${requested}`);
  const project = realpathSync(requested);
  if (samePath(project, realpathSync(homedir())) || dirname(project) === project) {
    throw new Error('Choose a project directory rather than a home or filesystem root.');
  }
  if (!stat(join(project, '.git'))) {
    for (let parent = dirname(project); ; parent = dirname(parent)) {
      if (stat(join(parent, '.git'))) throw new Error(`Use the Git project root: ${parent}`);
      if (dirname(parent) === parent) break;
    }
  }

  const contents = files.map((file) => [
    file,
    readFileSync(new URL(`../skills/thinking-partner/${file}`, import.meta.url)),
  ]);
  const agents = values.agent === 'all' ? Object.keys(roots) : [values.agent];
  const targets = agents.map((agent) => {
    const root = join(project, roots[agent]);
    const directory = join(root, 'skills');
    const target = join(directory, 'thinking-partner');
    checkDirectory(root);
    checkDirectory(directory);
    return { agent, directory, target, installed: matchesBundle(target, contents) };
  });
  for (const { agent, directory, target, installed } of targets) {
    if (!installed) install(directory, target, contents);
    console.log(`${agent}: ${installed ? 'already installed' : 'installed'} at ${target}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
