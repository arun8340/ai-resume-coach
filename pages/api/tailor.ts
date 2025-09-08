import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TailorResponse = {
  ok: boolean;
  parsed?: any;
  raw?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TailorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, raw: 'Method not allowed' });
  }

  const { resume, jd } = req.body;

  if (!resume || !jd) {
    return res.status(400).json({ ok: false, raw: 'Resume or Job Description missing' });
  }

  try {
    // Step 1: Tailored Resume
    const resumePrompt = `
You are an expert resume writer. You will receive a candidate's full resume and a job description.

Instructions:
1. Keep the candidate's Name, Contact Info (Email, Phone), and Education exactly as-is.
2. Keep all sections (Experience, Skills, Education, etc.) in the same order.
3. Tailor the Experience and Skills sections to match the job description. Highlight relevant achievements.
4. Do NOT remove any personal details.
5. Output the resume in the same format as the input, with proper headings and bullet points.

Resume:
${resume}

Job Description:
${jd}
`;

    const tailoredResumeResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional resume writer.' },
        { role: 'user', content: resumePrompt },
      ],
      temperature: 0.7,
    });

    const tailored_resume = tailoredResumeResp.choices[0].message?.content?.trim() || '';

    // Step 2: Cover Letter
    const coverLetterPrompt = `
You are an expert cover letter writer. Use the candidate's resume and the job description.

Instructions:
1. Use the candidate's Name, Email, and Phone from the resume.
2. Highlight relevant experience and skills that match the job description.
3. Keep the cover letter concise, personalized, and professional.
4. Return the cover letter as plain text.

Resume:
${resume}

Job Description:
${jd}
`;

    const coverLetterResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional cover letter writer.' },
        { role: 'user', content: coverLetterPrompt },
      ],
      temperature: 0.7,
    });

    const cover_letter = coverLetterResp.choices[0].message?.content?.trim() || '';

    // Return result
    res.status(200).json({
      ok: true,
      parsed: {
        tailored_resume,
        cover_letter,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, raw: err.message });
  }
}
