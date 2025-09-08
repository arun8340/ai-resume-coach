// Textarea for Job Description

import React from 'react';

interface JobDescriptionInputProps {
  jd: string;
  setJd: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ jd, setJd }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold">Paste Job Description</label>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={12}
        className="p-3 border rounded resize-none"
        placeholder="Paste the job description here..."
      />
    </div>
  );
};

export default JobDescriptionInput;