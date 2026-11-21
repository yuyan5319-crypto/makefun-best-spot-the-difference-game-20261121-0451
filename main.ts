// main.ts — Double Take's hand-in program (Node 22, standard library only).
//
// The grader runs this file twice in a fresh container with no network,
// a read-only copy of this repository at /bot and a writable /output.
// It must produce the same bytes both times, so it does nothing but copy
// and summarise: game/ and screenshots/ go to the output directory as
// they are, and dossier.json is written by the kit's buildDossier from
// vendor/makefun-game.ts. Outside the grader, MAKEFUN_OUTPUT_DIR stands
// in for /output, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyTree(name: string): void {
  const source = join(repoRoot, name);
  if (!existsSync(source)) return;
  cpSync(source, join(outputDir, name), { recursive: true });
}

function countGameEntries(): number {
  // A sanity check mirroring the gate's game cap, so a local run fails
  // loudly instead of handing in an entry the scorer would refuse.
  let count = 0;
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      count += 1;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
    }
  };
  walk(join(repoRoot, 'game'));
  return count;
}

function main(): void {
  mkdirSync(outputDir, { recursive: true });
  copyTree('game');
  copyTree('screenshots');

  const entries = countGameEntries();
  if (entries > 993) {
    throw new Error(`game/ holds ${entries} files and directories, over the gate cap of 993`);
  }

  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

main();
