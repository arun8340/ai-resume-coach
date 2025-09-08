import React from 'react';
import { copyToClipboard, downloadTextFile } from '../utils/fileHelpers';

interface ResultsPanelProps {
  result: {
    ok: boolean;
    parsed?: {
      tailored_resume?: string;
      cover_letter?: string;
      missing_keywords?: string[];
      ats_score_out_of_100?: number;
    };
    raw?: string;
  } | null;
}

const parseResumeSections = (resumeText: string): Record<string, string> => {
  const sections: Record<string, string> = {};
  const lines = resumeText.split('\n');

  let currentSection = 'Header';
  let content: string[] = [];

  lines.forEach((line) => {
    if (line.trim() === '') return;
    if (/^[A-Z][A-Za-z\s]+:$/.test(line.trim())) {
      if (content.length > 0) sections[currentSection] = content.join('\n');
      currentSection = line.replace(':', '').trim();
      content = [];
    } else {
      content.push(line);
    }
  });

  if (content.length > 0) sections[currentSection] = content.join('\n');

  return sections;
};

// Highlight missing keywords in text
const highlightKeywords = (text: string, keywords: string[] = []) => {
  if (!keywords || keywords.length === 0) return text;

  let highlighted = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(
      regex,
      '<span class="bg-red-200 text-red-800 font-semibold">$1</span>'
    );
  });
  return highlighted;
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  if (!result) return <div className="text-gray-500">Results will appear here.</div>;
  if (!result.parsed) return <pre className="whitespace-pre-wrap">{result.raw}</pre>;

  const { tailored_resume, cover_letter, missing_keywords, ats_score_out_of_100 } = result.parsed;
  const sections = tailored_resume ? parseResumeSections(tailored_resume) : {};

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto">
      {/* ATS Score */}
      {ats_score_out_of_100 !== undefined && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">ATS Score</h2>
          <div className="w-full bg-gray-200 h-4 rounded">
            <div
              className={`h-4 rounded ${
                ats_score_out_of_100 >= 80
                  ? 'bg-green-500'
                  : ats_score_out_of_100 >= 50
                  ? 'bg-yellow-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${ats_score_out_of_100}%` }}
            ></div>
          </div>
          <p className="text-gray-700 mt-1">{ats_score_out_of_100}/100</p>
        </div>
      )}

      {/* Tailored Resume */}
      {tailored_resume && (
        <div className="p-4 border rounded bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tailored Resume</h2>
            <div className="flex gap-2">
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
          </div>

          {Object.entries(sections).map(([sectionName, text]) => {
            if (sectionName === 'Header') {
              const lines = text.split('\n');
              const name = lines[0] || '';
              const contact = lines.slice(1).join(' | ');
              return (
                <div key={sectionName} className="mb-4 border-b pb-2">
                  <h1 className="text-2xl font-extrabold">{name}</h1>
                  <p className="text-gray-600 mt-1">{contact}</p>
                </div>
              );
            }

            return (
              <div key={sectionName} className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{sectionName}</h3>
                <pre
                  className="whitespace-pre-wrap bg-white p-3 rounded border"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(text, missing_keywords),
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Cover Letter */}
      {cover_letter && (
        <div className="p-4 border rounded bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Cover Letter</h2>
            <div className="flex gap-2">
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
          </div>
          <pre
            className="whitespace-pre-wrap bg-white p-3 rounded border"
            dangerouslySetInnerHTML={{
              __html: highlightKeywords(cover_letter, missing_keywords),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
