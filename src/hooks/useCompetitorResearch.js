import { useEffect, useRef, useState } from 'react';
import { competitorResearch } from '../lib/companyResearch';

// Step 2 data only; its card, skeleton and animation timing remain in the workflow.
export default function useCompetitorResearch(jobId, projectId, userId, enabled) {
  const [snapshot, setSnapshot] = useState(null);
  const [failure, setFailure] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const retryRequest = useRef(null);
  useEffect(() => {
    if (!enabled || !jobId || !userId) return;
    let active = true;
    let timer;
    let failures = 0;
    const controller = new AbortController();
    setFailure(null);
    const poll = async (retry = false) => {
      try {
        const result = await competitorResearch(jobId, retry, controller.signal);
        if (!active) return;
        if (result?.job_id !== jobId || result?.project_id !== projectId || !result?.research || !Array.isArray(result.research.results)) {
          throw Object.assign(new Error('The saved competitors do not match this project.'), { code: 'PROJECT_MISMATCH' });
        }
        const data = result.research;
        setSnapshot({ jobId, userId, data });
        setFailure(data.status === 'failed' ? { jobId, userId, error: Object.assign(new Error(data.error || 'Competitor research could not finish.'), { canRetry: data.can_retry }) } : null);
        failures = 0;
        if (!['completed', 'failed'].includes(data.status)) timer = setTimeout(() => poll(), 5000);
      } catch (error) {
        if (!active || error.name === 'AbortError') return;
        setFailure({ jobId, userId, error });
        if (!['UNAUTHORIZED', 'NOT_FOUND', 'PROJECT_MISMATCH', 'INSUFFICIENT_PROFILE'].includes(error.code) && failures++ < 4) {
          timer = setTimeout(() => poll(), Math.min(30000, 5000 * 2 ** failures));
        }
      }
    };
    const retry = retryRequest.current?.jobId === jobId && retryRequest.current?.userId === userId;
    retryRequest.current = null;
    poll(retry);
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [jobId, projectId, userId, enabled, attempt]);
  return {
    data: snapshot && snapshot.jobId === jobId && snapshot.userId === userId ? snapshot.data : null,
    error: failure && failure.jobId === jobId && failure.userId === userId ? failure.error : null,
    retry: () => { retryRequest.current = { jobId, userId }; setFailure(null); setAttempt(value => value + 1); },
  };
}
