import fetch from 'node-fetch';

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'digitaldiina';
const REPO_NAME = 'docs-next';
const GITHUB_TOKEN = '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';

export async function getLastUpdatedFromGitHub(filePath) {
  const url = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${filePath}&per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();
    if (data && data[0] && data[0].commit && data[0].commit.committer) {
      const lastUpdated = new Date(data[0].commit.committer.date).toLocaleDateString();
      return lastUpdated;
    }
    return null;
  } catch (error) {
    console.error('Error fetching last updated date from GitHub:', error);
    return null;
  }
}
