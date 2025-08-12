export const githubBaseUrl = 'https://github.com/SuperOfficeDocs/';
export const baseGithubUrl = `${githubBaseUrl}superoffice-docs/blob/main/`;
export const newIssueUrl = `${githubBaseUrl}feedback/issues/new`;

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

export const trimSlash = (s: string) => trim(trim(s, '/'));

export function formatDate(d?: Date) {
  if (!d) {
    return '';
  }

  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function getFeedbackHref(docurl:string, title:string, uid:string) {
  if (!docurl) return '';
  title = 'Feedback for ' + title;
  var body = '%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20docs.superOffice.com%20%E2%9E%9F%20Docs%20Team%20processing.*%0A%0A*%20Content%20Source%3A%20%5B' + encodeURIComponent(uid) + '%5D(' + encodeURIComponent(baseGithubUrl + docurl) + ')';
  return newIssueUrl + '?title=' + title + '&body=' + body;
}

export function getEditHref(docurl?: string | null): string {
  if (!docurl) return '';

  // Construct the full GitHub URL to the file
  return `${baseGithubUrl}${docurl.replace(/^\//, '')}`;
}