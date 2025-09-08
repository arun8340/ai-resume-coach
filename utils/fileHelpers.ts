// Copy text to clipboard
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};

// Download text as a file
export const downloadTextFile = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Format tailored resume bullets into plain text
export const formatTailoredResume = (tailored_bullets_by_section: { [section: string]: string[] }) => {
  return Object.entries(tailored_bullets_by_section)
    .map(
      ([section, bullets]) =>
        section + '\n' + bullets.map((b) => '- ' + b).join('\n')
    )
    .join('\n\n');
};
