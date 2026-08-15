import React, { useState, useEffect } from 'react';
import { STARTER_NODES } from '../../constants/nodeRegistry';
import { getGeminiApiKey, setGeminiApiKey, validateTemplateVariables } from '../../services/api';

function renderHighlightedTemplate(templateStr) {
  if (!templateStr) return null;
  // Matches {{input}}, {{question}}, or any {{variable}} or {variable}
  const parts = templateStr.split(/(\{\{[^{}]+\}\}|\{[^{}]+\})/g);

  return parts.map((part, index) => {
    if (/^(\{\{[^{}]+\}\}|\{[^{}]+\})$/.test(part)) {
      return (
        <span
          key={index}
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary, #6366f1)',
            padding: '1px 5px',
            borderRadius: '4px',
            fontWeight: 600,
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            margin: '0 2px',
            display: 'inline-block',
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function NodeInspector({ selectedNode, updateNodeParams, deleteNode }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keySavedMsg, setKeySavedMsg] = useState(false);

  useEffect(() => {
    setApiKeyInput(getGeminiApiKey());
  }, []);

  if (!selectedNode) {
    return (
      <div
        style={{
          width: '280px',
          height: '100%',
          background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--border-color)',
          padding: '16px',
          color: 'var(--text-muted)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        Select a node to view properties
      </div>
    );
  }

  const nodeType = selectedNode.type || 'input';
  const nodeDef = STARTER_NODES[nodeType] || STARTER_NODES.input;
  const params = selectedNode.data?.params || selectedNode.params || {};

  // LLM node options
  const modelOptionsMap = nodeDef.modelOptions || STARTER_NODES.llm.modelOptions || {};
  const currentProvider = params.provider || selectedNode.params?.provider || nodeDef.defaultParams?.provider || 'gemini';
  const modelOptions = modelOptionsMap[currentProvider] || [];
  const currentModel = params.model || selectedNode.params?.model || modelOptions[0] || 'gemini-2.0-flash';

  return (
    <div
      style={{
        width: '280px',
        height: '100%',
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border-color)',
        padding: '16px',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: nodeDef.color }}>
          {selectedNode.data?.label || nodeDef.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Type: {nodeType} | ID: {selectedNode.id}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {/* Node Label */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
            Node Label
          </label>
          <input
            type="text"
            value={selectedNode.data?.label || ''}
            onChange={(e) => updateNodeParams(selectedNode.id, { ...params, label: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-main)',
              fontSize: '12px',
              outline: 'none',
            }}
          />
        </div>

        {/* LLM Node Parameters */}
        {nodeType === 'llm' && (
          <>
            {/* Provider Dropdown */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                Provider
              </label>
              <select
                value={currentProvider}
                onChange={(e) => {
                  const newProvider = e.target.value;
                  const newModels = modelOptionsMap[newProvider] || [];
                  updateNodeParams(selectedNode.id, {
                    ...params,
                    provider: newProvider,
                    model: newModels[0] || '',
                  });
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {Object.keys(modelOptionsMap).map((provKey) => (
                  <option key={provKey} value={provKey}>
                    {provKey.charAt(0).toUpperCase() + provKey.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Dropdown reading options from modelOptions[selectedNode.params.provider] */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                Model
              </label>
              <select
                value={currentModel}
                onChange={(e) => updateNodeParams(selectedNode.id, { ...params, model: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {modelOptions.map((modelName) => (
                  <option key={modelName} value={modelName}>
                    {modelName}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  Temperature
                </label>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>
                  {params.temperature ?? 0.7}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.temperature ?? 0.7}
                onChange={(e) => updateNodeParams(selectedNode.id, { ...params, temperature: parseFloat(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Max Tokens Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="32768"
                step="1"
                value={params.max_tokens ?? params.maxTokens ?? 2048}
                onChange={(e) => updateNodeParams(selectedNode.id, { ...params, max_tokens: parseInt(e.target.value, 10) || 2048 })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Personal Gemini API Key Option */}
            <div style={{ marginBottom: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                Personal Gemini API Key
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter personal Gemini Key..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '0 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setGeminiApiKey(apiKeyInput);
                    setKeySavedMsg(true);
                    setTimeout(() => setKeySavedMsg(false), 2000);
                  }}
                  style={{
                    flex: 1,
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {keySavedMsg ? 'Saved!' : 'Save Key'}
                </button>
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      setGeminiApiKey('');
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Each user can add a personal key stored locally in browser storage.
              </div>
            </div>
          </>
        )}

        {/* Input Node Parameters */}
        {nodeType === 'input' && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Input Query
            </label>
            <textarea
              rows={3}
              value={params.query || ''}
              onChange={(e) => updateNodeParams(selectedNode.id, { ...params, query: e.target.value })}
              placeholder="Enter prompt query..."
              style={{
                width: '100%',
                padding: '8px 10px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '12px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Prompt Node / Prompt Template Parameters */}
        {(nodeType === 'prompt' || nodeType === 'promptTemplate') && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Prompt Template
            </label>
            <textarea
              rows={5}
              value={params.template || ''}
              onChange={(e) => updateNodeParams(selectedNode.id, { ...params, template: e.target.value })}
              placeholder="Context: {{input}}\nQuestion: {{question}}"
              style={{
                width: '100%',
                padding: '8px 10px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '12px',
                outline: 'none',
                resize: 'vertical',
              }}
            />

            {/* Template Variable Validation Warning */}
            {validateTemplateVariables(params.template || '').length > 0 && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 10px',
                  background: '#f59e0b15',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  color: '#f59e0b',
                  fontSize: '11px',
                  lineHeight: '1.4',
                }}
              >
                ⚠️ <strong>Template Warning:</strong> Unknown variable(s){' '}
                <code>{validateTemplateVariables(params.template || '').map((v) => `{{${v}}}`).join(', ')}</code>.
                Expected variables: <code>{"{{input}}"}</code>, <code>{"{{question}}"}</code>.
              </div>
            )}

            {/* Read-only Live Template Preview */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', color: 'var(--text-muted)' }}>
                Live Template Preview
              </label>
              <div
                style={{
                  padding: '10px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                {renderHighlightedTemplate(params.template || '')}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => deleteNode(selectedNode.id)}
        style={{
          background: '#ef444415',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Delete Node
      </button>
    </div>
  );
}

