// Copyright 2022 Meta Mind AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import minimist from 'minimist';

const STAMP_INTERFACE = `\
export interface BuildStamp {
  commit: string;
  branch: string;
  timestamp: string;
  github_repo: string;
  github_org: string;
}
`;

const UNKNOWN_COMMIT_INFO = { commit: '-unknown-', branch: '-unknown-' };

async function getGitBranchName() {
  let { stdout, stderr } = await promisify(exec)(`git branch --show-current`);
  console.error(stderr);
  if (!!stderr) {
    return '-unknown-';
  }
  return stdout.trim();
}

async function getGitCommitHash() {
  let { stdout, stderr } = await promisify(exec)(`git rev-parse HEAD`);
  console.error(stderr);
  if (!!stderr) {
    throw new Error('could not get git commit hash');
  }
  return stdout.trim();
}

async function getGitCommitInfo() {
  try {
    const commit = await getGitCommitHash();
    const branch = await getGitBranchName();
    return { commit, branch };
  } catch (e) {
    console.error(`Could not get git commit info from git commands: ${e}`);
  }
  return UNKNOWN_COMMIT_INFO;
}

async function stampBuildInfo({ outputPath, outputFormat }) {
  console.info(`Getting build stamp info...`);

  try {
    const buildTimestamp = new Date();

    const { commit, branch } = await getGitCommitInfo();

    const info = {
      commit,
      branch,
      timestamp: buildTimestamp.toISOString(),
      github_repo: 'business-carbon-calculator',
      github_org: 'normative-io',
    };

    const stampStr = JSON.stringify(info, null, '  ');
    console.info(`Build info: ${stampStr}`);

    let fileContent;
    switch (outputFormat) {
      case 'json':
        fileContent = stampStr + '\n';
        break;
      case 'typescript':
        fileContent = `${STAMP_INTERFACE}\nexport const BUILD_STAMP: BuildStamp = (${stampStr});\n`;
        break;
    }

    await fs.writeFile(outputPath, fileContent);
  } catch (e) {
    console.error(e);
    return { success: false };
  }

  return { success: true };
}

const args = minimist(process.argv.slice(2), {
  string: ['outputPath'],
  unknown: (param) => {
    console.error(`unknown arg: ${param}`);
    process.exit(1);
  },
});

if (!args.outputPath) {
  console.error('must specify --outputPath arg');
  process.exit(1);
}

const EXT_TO_OUTPUT_FORMAT = {
  '.json': 'json',
  '.ts': 'typescript',
};

stampBuildInfo({
  outputPath: args.outputPath,
  outputFormat: EXT_TO_OUTPUT_FORMAT[path.extname(args.outputPath)],
})
  .then((x) => {})
  .catch((e) => {
    process.exit(1);
  });
