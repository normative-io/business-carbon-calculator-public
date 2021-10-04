export interface BuildStamp {
  commit: string;
  branch: string;
  timestamp: string;
  github_repo: string;
  github_org: string;
}

export const BUILD_STAMP: BuildStamp = {
  commit: '-local-',
  branch: '-local-',
  timestamp: '-now-',
  github_repo: 'business-carbon-calculator',
  github_org: 'normative-io',
};
