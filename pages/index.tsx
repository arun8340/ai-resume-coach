'use client';

import React, { useState } from 'react';
import ResultsPanel from '../components/ResultsPanel';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeText || !jobDescription) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jd: jobDescription }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ ok: false, raw: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">AI Resume & Interview Coach</h1>

      {/* Resume Input */}
      <div>
        <label className="block font-semibold mb-1">Your Resume</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={8}
        />
      </div>

      {/* Job Description Input */}
      <div>
        <label className="block font-semibold mb-1">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={6}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Tailored Resume'}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-4">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">AI is generating your tailored resume & cover letter...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && <ResultsPanel result={result} />}
    </div>
  );
}
