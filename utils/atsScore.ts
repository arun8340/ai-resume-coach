export const computeATSSCore = (resumeText: string, jobDesc: string, topN = 20) => {
  if (!resumeText || !jobDesc) return { score: 0, matched: [], total: 0 };

  const jdKeywords = Array.from(
    new Set(
      jobDesc
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 2)
        .slice(0, topN)
    )
  );

  const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/));
  const matched = jdKeywords.filter((kw) => resumeWords.has(kw));
  const score = Math.round((matched.length / jdKeywords.length) * 100);

  return { score, matched, total: jdKeywords.length };
};
