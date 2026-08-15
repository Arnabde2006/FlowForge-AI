import React from 'react';
import { STARTER_NODES } from '../../constants/nodeRegistry';

export default function NodePalette({ onAddNode }) {
  const nodeList = Object.values(STARTER_NODES);

  return (
    <div
      style={{
        width: '220px',
        height: '100%',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-color)',
        padding: '16px',
        userSelect: 'none',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-main)' }}>
        Add Node
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {nodeList.map((node) => (
          <button
            key={node.type}
            type="button"
            onClick={() => onAddNode(node.type)}
            style={{
              background: 'var(--bg-main)',
              border: `1px solid var(--border-color)`,
              borderRadius: '6px',
              padding: '10px 12px',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 500,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{node.label}</span>
            <span style={{ color: node.color, fontWeight: 'bold' }}>+</span>
          </button>
        ))}
      </div>
    </div>
  );
}
