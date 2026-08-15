import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge, reconnectEdge } from '@xyflow/react';
import { STARTER_NODES } from '../constants/nodeRegistry';

const INITIAL_NODES = [
  {
    id: 'node-1',
    type: 'input',
    position: { x: 150, y: 180 },
    data: { label: 'Input Node', type: 'input', params: { ...STARTER_NODES.input.defaultParams } },
  },
  {
    id: 'node-2',
    type: 'llm',
    position: { x: 450, y: 180 },
    data: { label: 'LLM Node', type: 'llm', params: { ...STARTER_NODES.llm.defaultParams } },
  },
  {
    id: 'node-3',
    type: 'output',
    position: { x: 750, y: 180 },
    data: { label: 'Output Node', type: 'output', params: { ...STARTER_NODES.output.defaultParams } },
  },
];

const INITIAL_EDGES = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
  { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
];

export function useWorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Click edge line directly to remove/delete the link
  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  // Reconnect or drag link off handle to remove it
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_, node) => setSelectedNode(node), []);
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const updateNodeParams = useCallback(
    (nodeId, newParams) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const updated = { ...node, data: { ...node.data, params: newParams } };
            setSelectedNode(updated);
            return updated;
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const addNode = useCallback(
    (type) => {
      const def = STARTER_NODES[type];
      if (!def) return;
      const id = `node_${type}_${Date.now()}`;
      const newNode = {
        id,
        type,
        position: { x: 300 + nodes.length * 30, y: 200 + nodes.length * 20 },
        data: { label: def.label, type, params: { ...def.defaultParams } },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
    },
    [nodes.length, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const updateExecutionResults = useCallback(
    (outputResult) => {
      const outputText =
        typeof outputResult === 'object'
          ? outputResult.result || JSON.stringify(outputResult)
          : String(outputResult);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === 'output') {
            const updated = {
              ...node,
              data: {
                ...node.data,
                output: outputText,
                params: {
                  ...node.data?.params,
                  output: outputText,
                },
              },
            };
            setSelectedNode((curr) => (curr?.id === node.id ? updated : curr));
            return updated;
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeClick,
    onReconnect,
    onNodeClick,
    onPaneClick,
    updateNodeParams,
    updateExecutionResults,
    addNode,
    deleteNode,
  };
}
