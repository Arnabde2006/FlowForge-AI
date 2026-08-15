import React from 'react';
import { STARTER_NODES } from '../../constants/nodeRegistry';

export default function NodeInspector({ selectedNode, updateNodeParams, deleteNode }) {
  if (!selectedNode) {
    return (
      <div
        style={{
          width: '260px',
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
  const params = selectedNode.data?.params || {};

  return (
    <div
      style={{
        width: '260px',
        height: '100%',
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border-color)',
        padding: '16px',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: nodeDef.color }}>
          {selectedNode.data?.label || nodeDef.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          ID: {selectedNode.id}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-muted)' }}>
          Node Label
        </label>
        <input
          type="text"
          value={selectedNode.data?.label || ''}
          onChange={(e) => updateNodeParams(selectedNode.id, { ...params, label: e.target.value })}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'var(--text-main)',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => deleteNode(selectedNode.id)}
        style={{
          background: '#ef444415',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '8px',
          borderRadius: '4px',
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
