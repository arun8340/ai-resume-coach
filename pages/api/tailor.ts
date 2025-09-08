import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface InterviewQuestion {
  question: string;
  why_asked: string;
  model_answer: string;
}

interface TailorResponse {
  ok: boolean;
  parsed?: {
    tailored_resume: string;
    cover_letter: string;
    ats_score: number;
    interview_questions: InterviewQuestion[];
  };
  raw?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TailorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, raw: 'Method not allowed' });
  }

  const { resume, job_description } = req.body;
  if (!resume || !job_description) {
    return res.status(400).json({ ok: false, raw: 'Resume or Job Description missing' });
  }

  try {
    // 1️⃣ Tailored Resume
    const tailoredResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional resume writer.' },
        {
          role: 'user',
          content: `
Tailor this resume to the job description.
Keep Name, Contact Info, Education intact.
Highlight relevant achievements and skills.
Resume:
${resume}
Job Description:
${job_description}`,
        },
      ],
      temperature: 0.7,
    });
    const tailored_resume = tailoredResp.choices[0].message?.content?.trim() || '';

    // 2️⃣ Cover Letter
    const coverResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional cover letter writer.' },
        {
          role: 'user',
          content: `
Write a concise, personalized cover letter using this resume for the job description.
Resume:
${resume}
Job Description:
${job_description}`,
        },
      ],
      temperature: 0.7,
    });
    const cover_letter = coverResp.choices[0].message?.content?.trim() || '';

    // 3️⃣ ATS Score
    const atsResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an ATS analyzer.' },
        {
          role: 'user',
          content: `
Evaluate this resume against the job description and provide a score from 0 to 100 representing the match.
Return only the number.
Resume:
${tailored_resume}
Job Description:
${job_description}`,
        },
      ],
      temperature: 0,
    });
    const ats_score_text = atsResp.choices[0].message?.content?.trim() || '0';
    const ats_score = parseInt(ats_score_text.replace(/\D/g, ''), 10) || 0;

    // 4️⃣ Interview Questions
    const interviewResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an HR expert generating interview questions with answers.',
        },
        {
          role: 'user',
          content: `
Based on the resume and job description below, generate 3–5 interview questions.
For each question, provide:
1. question
2. why_asked
3. model_answer

Output **only valid JSON** as an array of objects like this:

[
  {
    "question": "...",
    "why_asked": "...",
    "model_answer": "..."
  }
]

Resume:
${tailored_resume}

Job Description:
${job_description}`,
        },
      ],
      temperature: 0.7,
    });

    // Parse interview questions safely
    let interview_questions: InterviewQuestion[] = [];
    try {
      const text = interviewResp.choices[0].message?.content?.trim() || '';
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.slice(jsonStart, jsonEnd);
      interview_questions = JSON.parse(jsonString);
    } catch (_err) {
      interview_questions = [];
    }

    res.status(200).json({
      ok: true,
      parsed: { tailored_resume, cover_letter, ats_score, interview_questions },
    });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ ok: false, raw: message });
  }
}
