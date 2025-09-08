import React from 'react';
import { copyToClipboard, downloadTextFile } from '../utils/fileHelpers';

interface ResultsPanelProps {
  result: {
    ok: boolean;
    parsed?: {
      tailored_resume?: string;
      cover_letter?: string;
    };
    raw?: string;
  } | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  if (!result) return <div className="text-gray-500">Results will appear here.</div>;
  if (!result.parsed) return <pre className="whitespace-pre-wrap">{result.raw}</pre>;

  const { tailored_resume, cover_letter } = result.parsed;

  return (
    <div className="space-y-6">
      {/* Tailored Resume Section */}
      {tailored_resume && (
        <div>
          <h2 className="text-xl font-bold mb-2">Tailored Resume</h2>
          <div className="flex gap-2 mb-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => copyToClipboard(tailored_resume)}
            >
              Copy
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => downloadTextFile('tailored_resume.txt', tailored_resume)}
            >
              Download
            </button>
          </div>
          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{tailored_resume}</pre>
        </div>
      )}

      {/* Cover Letter Section */}
      {cover_letter && (
        <div>
          <h2 className="text-xl font-bold mb-2">Cover Letter</h2>
          <div className="flex gap-2 mb-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => copyToClipboard(cover_letter)}
            >
              Copy
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => downloadTextFile('cover_letter.txt', cover_letter)}
            >
              Download
            </button>
          </div>
          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{cover_letter}</pre>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
