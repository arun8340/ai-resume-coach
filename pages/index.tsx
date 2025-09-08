'use client';

import React, { useState, useMemo } from 'react';
import ResultsPanel from '../components/ResultsPanel';
import { computeATSSCore } from '../utils/atsScore';

const MAX_INPUT_LENGTH = 5000;

const HomePage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Compute client-side ATS
  const ats = useMemo(() => computeATSSCore(resumeText, jobDesc), [resumeText, jobDesc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setResumeText((event.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || !jobDesc) {
      alert('Please provide both resume and job description');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, job_description: jobDesc }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ ok: false, raw: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_INPUT_LENGTH) {
      alert(`Input too long! Please keep it under ${MAX_INPUT_LENGTH} characters.`);
      setter(e.target.value.slice(0, MAX_INPUT_LENGTH));
    } else {
      setter(e.target.value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">AI Resume & Interview Coach</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Upload Resume (TXT) or Paste Text</label>
          <input type="file" accept=".txt" onChange={handleFileUpload} className="mb-2" />
          <textarea
            value={resumeText}
            onChange={handleTextChange(setResumeText)}
            rows={6}
            placeholder="Paste your resume here..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Job Description</label>
          <textarea
            value={jobDesc}
            onChange={handleTextChange(setJobDesc)}
            rows={6}
            placeholder="Paste the job description here..."
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Client-side ATS preview */}
        {resumeText && jobDesc && (
          <div className="my-2">
            <p className="text-sm text-gray-600">
              Client-side ATS preview: {ats.score}/100 ({ats.matched.length}/{ats.total} JD keywords matched)
            </p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div className="h-2 rounded bg-blue-500" style={{ width: `${ats.score}%` }}></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`px-6 py-2 rounded text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Tailor Resume'}
        </button>

        {/* Privacy note */}
        <p className="text-xs text-gray-500 mt-2">
          🔒 We don’t store your resume — requests are processed on demand.
        </p>
      </form>

      {loading && (
        <div className="text-center mt-4">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">AI is generating your tailored resume & cover letter...</p>
        </div>
      )}

      {result && !loading && <ResultsPanel result={result} />}
    </div>
  );
};

export default HomePage;
