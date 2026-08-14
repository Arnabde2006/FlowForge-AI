import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { STARTER_NODES } from '../../constants/nodeRegistry';

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeClick,
  onReconnect,
  onNodeClick,
  onPaneClick,
}) {
  const nodeTypes = useMemo(() => {
    const types = {};
    Object.keys(STARTER_NODES).forEach((key) => {
      types[key] = CustomNode;
    });
    return types;
  }, []);

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onReconnect={onReconnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background color="var(--dots-color)" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
