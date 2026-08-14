import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { STARTER_NODES } from '../../constants/nodeRegistry';

const CustomNode = memo(({ data, selected }) => {
  const nodeType = data.type || 'input';
  const nodeDef = STARTER_NODES[nodeType] || STARTER_NODES.input;

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: selected ? `2px solid ${nodeDef.color}` : '1px solid var(--border-color)',
        boxShadow: selected ? `0 0 12px ${nodeDef.color}30` : '0 2px 8px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        padding: '12px 16px',
        minWidth: '160px',
        color: 'var(--text-main)',
        fontSize: '13px',
      }}
    >
      {nodeType !== 'input' && <Handle type="target" position={Position.Left} style={{ background: nodeDef.color }} />}
      
      <div style={{ fontWeight: 600, color: nodeDef.color, marginBottom: '4px' }}>
        {data.label || nodeDef.label}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
        Type: {nodeType}
      </div>

      {nodeType !== 'output' && <Handle type="source" position={Position.Right} style={{ background: nodeDef.color }} />}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
export default CustomNode;
