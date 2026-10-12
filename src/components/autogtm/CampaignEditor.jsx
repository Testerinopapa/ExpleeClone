import React, { useEffect, useRef, useState } from 'react';

export default function CampaignEditor({ campaign, saving, error, onSave, onClose }) {
  const dialog = useRef(null);
  const [draft, setDraft] = useState(() => ({ name: '', target_audience: '', target_industry: '', ideal_customer: '', reasoning: '',
    ...campaign, keywords: (campaign.keywords || []).join('\n'), target_locations: (campaign.target_locations || []).join('\n') }));
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    return () => { dialog.current?.close(); previous?.focus(); };
  }, []);
  const fields = [
    ['name', 'Campaign name', 100, true], ['target_audience', 'Target audience', 160, true],
    ['target_industry', 'Target industry', 100, false], ['ideal_customer', 'Ideal customer', 600, true],
    ['keywords', 'Keywords (one per line, up to 10)', 809, true],
    ['target_locations', 'Target locations (optional, one per line)', 809, false], ['reasoning', 'Reasoning', 600, false],
  ];
  const lines = value => value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
  const [localError, setLocalError] = useState(null);
  return (
    <dialog ref={dialog} aria-labelledby="campaign-editor-title" onCancel={event => { event.preventDefault(); if (!saving) onClose(); }}
      className="w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-6 shadow-md backdrop:bg-black/30">
      <form onSubmit={event => {
        event.preventDefault(); setLocalError(null);
        const keywords = lines(draft.keywords), target_locations = lines(draft.target_locations);
        if ([keywords, target_locations].some(items => items.length > 10 || items.some(item => item.length > 80))) {
          setLocalError('Use up to 10 keywords and locations, each no longer than 80 characters.'); return;
        }
        onSave({ name: draft.name, target_audience: draft.target_audience, target_industry: draft.target_industry,
          ideal_customer: draft.ideal_customer, reasoning: draft.reasoning, keywords, target_locations });
      }} className="space-y-4">
        <h2 id="campaign-editor-title" className="font-semibold text-gray-900">{campaign.isNew ? 'Create campaign' : 'Edit campaign'}</h2>
        {fields.map(([field, label, maxLength, required]) => (
          <label key={field} className="block text-xs font-medium text-gray-700">
            {label}
            {['ideal_customer', 'keywords', 'target_locations', 'reasoning'].includes(field)
              ? <textarea required={required} maxLength={maxLength} value={draft[field]} rows={field === 'ideal_customer' ? 3 : 2}
                  disabled={saving} onChange={event => setDraft({ ...draft, [field]: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-[#f8fafc] p-2 text-sm font-normal" />
              : <input required={required} maxLength={maxLength} value={draft[field]} disabled={saving}
                  onChange={event => setDraft({ ...draft, [field]: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-[#f8fafc] p-2 text-sm font-normal" />}
          </label>
        ))}
        {(localError || error) && <p role="alert" className="text-xs text-gray-600">{localError || error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-black/10 px-3 py-2 text-xs text-gray-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#0d9467] px-3 py-2 text-xs font-semibold text-white">{saving ? 'Saving…' : 'Save campaign'}</button>
        </div>
      </form>
    </dialog>
  );
}
