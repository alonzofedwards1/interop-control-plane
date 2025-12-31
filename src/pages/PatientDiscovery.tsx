import React, { useMemo, useState } from 'react';

import Card from '../components/Card';
import {
  PatientDiscoveryTriggerResponse,
  PatientSearchResponse,
  submitPatientSearch,
  triggerPatientDiscovery,
} from '../api/endpoints';
import { formatJson, parseJsonObject } from '../utils/json';

interface PatientDiscoveryProps {
  activeToken: string | null;
}

const PatientDiscovery: React.FC<PatientDiscoveryProps> = ({ activeToken }) => {
  const [criteriaInput, setCriteriaInput] = useState<string>(JSON.stringify({ criteria: {} }, null, 2));
  const [triggerInput, setTriggerInput] = useState<string>(JSON.stringify({ patient_reference: '' }, null, 2));
  const [searchResult, setSearchResult] = useState<PatientSearchResponse | null>(null);
  const [triggerResult, setTriggerResult] = useState<PatientDiscoveryTriggerResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const canCallPatientApis = useMemo(() => Boolean(activeToken && activeToken.trim() !== ''), [activeToken]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCallPatientApis || searching) {
      return;
    }
    setSearching(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const parsed = parseJsonObject(criteriaInput);
      const payload = parsed.criteria ? parsed : { criteria: parsed };
      const result = await submitPatientSearch({ criteria: payload.criteria });
      setSearchResult(result);
    } catch (searchErr) {
      setSearchError(searchErr instanceof Error ? searchErr.message : 'Unable to trigger patient search');
    } finally {
      setSearching(false);
    }
  };

  const handleTrigger = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCallPatientApis || triggering) {
      return;
    }
    setTriggering(true);
    setTriggerError(null);
    setTriggerResult(null);
    try {
      const payload = parseJsonObject(triggerInput);
      const result = await triggerPatientDiscovery(payload);
      setTriggerResult(result);
    } catch (triggerErr) {
      setTriggerError(triggerErr instanceof Error ? triggerErr.message : 'Unable to trigger patient discovery');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <Card title="Patient Discovery">
      <p>Triggers never return PHI; they only emit orchestration identifiers.</p>
      <div className="stacked-form">
        <form onSubmit={handleSearch} className="stacked-form">
          <label htmlFor="search-criteria">Patient Search Criteria (JSON)</label>
          <textarea
            id="search-criteria"
            value={criteriaInput}
            onChange={(event) => setCriteriaInput(event.target.value)}
            rows={8}
            spellCheck={false}
            disabled={!canCallPatientApis}
          />
          <button type="submit" disabled={!canCallPatientApis || searching}>
            {searching ? 'Submitting…' : 'POST /api/patient/search'}
          </button>
          {!canCallPatientApis && <p className="warning">Issue a token before initiating patient search.</p>}
          {searchError && <p className="error">{searchError}</p>}
          {searchResult && (
            <div>
              <h3>Patient Search Submitted</h3>
              <ul className="status-list">
                <li>
                  <strong>Status:</strong> {searchResult.status}
                </li>
                <li>
                  <strong>Execution ID:</strong> {searchResult.execution_id}
                </li>
              </ul>
              <pre className="code-block">{formatJson(searchResult.criteria)}</pre>
            </div>
          )}
        </form>

        <form onSubmit={handleTrigger} className="stacked-form">
          <label htmlFor="pd-trigger">Patient Discovery Trigger (JSON)</label>
          <textarea
            id="pd-trigger"
            value={triggerInput}
            onChange={(event) => setTriggerInput(event.target.value)}
            rows={6}
            spellCheck={false}
            disabled={!canCallPatientApis}
          />
          <button type="submit" disabled={!canCallPatientApis || triggering}>
            {triggering ? 'Triggering…' : 'POST /api/pd/trigger'}
          </button>
          {!canCallPatientApis && <p className="warning">Tokens are required before orchestrating discovery.</p>}
          {triggerError && <p className="error">{triggerError}</p>}
          {triggerResult && (
            <div>
              <h3>Discovery Triggered</h3>
              <ul className="status-list">
                <li>
                  <strong>Correlation ID:</strong> {triggerResult.correlation_id}
                </li>
                <li>
                  <strong>Forwarded:</strong> {triggerResult.forwarded ? 'yes' : 'no'}
                </li>
                {triggerResult.downstream_status && (
                  <li>
                    <strong>Downstream Status:</strong> {triggerResult.downstream_status}
                  </li>
                )}
                {triggerResult.message && (
                  <li>
                    <strong>Message:</strong> {triggerResult.message}
                  </li>
                )}
              </ul>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

export default PatientDiscovery;
