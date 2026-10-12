import { useEffect, useRef, useState } from 'react';
import { campaignRequest } from '../lib/companyResearch';

export default function useCampaigns(jobId, projectId, userId, enabled) {
  const key = `${userId || ''}:${projectId || ''}:${jobId || ''}`;
  const currentKey = useRef(key);
  currentKey.current = key;
  const [snapshot, setSnapshot] = useState(null);
  const [failure, setFailure] = useState(null);
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [revision, setRevision] = useState(0);
  const accept = (result) => {
    if (result?.job_id !== jobId || result?.project_id !== projectId || !Array.isArray(result?.plan?.campaigns) ||
        !Array.isArray(result?.plan?.selected_ids) || !Array.isArray(result?.targets)) {
      throw new Error('The saved campaigns do not match this project.');
    }
    if (currentKey.current === key) setSnapshot(previous => previous?.key === key && previous.plan.version > result.plan.version ? previous : { key, ...result });
  };
  useEffect(() => {
    if (!enabled || !jobId || !userId) return;
    let active = true;
    const controller = new AbortController();
    setFailure(null);
    campaignRequest(jobId, 'load', {}, controller.signal).then(result => {
      if (active) accept(result);
    }).catch(error => {
      if (active && error.name !== 'AbortError') setFailure({ key, error });
    });
    return () => { active = false; controller.abort(); };
  }, [key, enabled, revision]);
  const mutate = async (action, values) => {
    if (saving.current || !snapshot || snapshot.key !== key) return false;
    saving.current = true; setBusy(true); setFailure(null);
    try {
      const result = await campaignRequest(jobId, action, { ...values, version: snapshot.plan.version });
      accept(result);
      return true;
    } catch (error) {
      // Reads only: never replay a create/update/delete after an ambiguous response.
      try { accept(await campaignRequest(jobId)); } catch { /* Keep the last saved view and original error. */ }
      if (currentKey.current === key) setFailure({ key, error });
      return false;
    } finally { saving.current = false; if (currentKey.current === key) setBusy(false); }
  };
  return {
    plan: snapshot && snapshot.key === key ? snapshot.plan : null,
    targets: snapshot && snapshot.key === key ? snapshot.targets : [],
    error: failure && failure.key === key ? failure.error : null,
    busy, mutate, retry: () => setRevision(value => value + 1),
  };
}
