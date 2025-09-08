import { useState } from 'react';
import ResumeInput from '../components/ResumeInput';
import JobDescriptionInput from '../components/JobDescriptionInput';
import ResultsPanel from '../components/ResultsPanel';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTailor = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jd }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error calling AI API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        AI Resume & Interview Coach
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <ResumeInput resume={resume} setResume={setResume} />
        <JobDescriptionInput jd={jd} setJd={setJd} />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleTailor}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Tailoring...' : 'Tailor My Resume'}
        </button>
      </div>

      <ResultsPanel result={result} />
    </div>
  );
}
