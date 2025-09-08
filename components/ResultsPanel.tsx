import React from 'react';
import { copyToClipboard, downloadTextFile } from '../utils/fileHelpers';

interface ResultsPanelProps {
  result: {
    ok: boolean;
    parsed?: {
      tailored_resume?: string;
      cover_letter?: string;
      ats_score?: number;
      interview_questions?: { question: string; why_asked: string; model_answer: string }[];
      missing_keywords?: string[];
    };
    raw?: string;
  } | null;
}

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

  const { tailored_resume, cover_letter, ats_score, interview_questions, missing_keywords } = result.parsed;
  const resumeContent = tailored_resume ? highlightKeywords(tailored_resume, missing_keywords) : '';

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* ATS Score */}
      {typeof ats_score === 'number' && (
        <div className="p-4 border rounded bg-yellow-50 shadow-sm text-center">
          <h2 className="text-xl font-bold">ATS Score</h2>
          <p className="text-2xl font-extrabold text-yellow-800 mt-1">{ats_score}%</p>
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

          <pre
            className="whitespace-pre-wrap bg-white p-3 rounded border"
            dangerouslySetInnerHTML={{ __html: resumeContent }}
          />
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
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">{cover_letter}</pre>
        </div>
      )}

      {/* Interview Questions */}
      {interview_questions && interview_questions.length > 0 && (
        <div className="p-4 border rounded bg-blue-50 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Potential Interview Questions</h2>
          <ul className="list-disc list-inside space-y-3">
            {interview_questions.map((q, idx) => (
              <li key={idx} className="text-gray-700">
                <p className="font-semibold">Q: {q.question}</p>
                <p className="italic text-gray-600">Why it is asked: {q.why_asked}</p>
                <p className="text-gray-800">Model answer: {q.model_answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
