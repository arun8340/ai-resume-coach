// Textarea for Resume

import React from 'react';

interface ResumeInputProps {
  resume: string;
  setResume: (value: string) => void;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ resume, setResume }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold">Paste Your Resume</label>
      <textarea
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        rows={12}
        className="p-3 border rounded resize-none"
        placeholder="Paste your resume here..."
      />
    </div>
  );
};

export default ResumeInput;
