import React from 'react';
import { Sun, Moon, Save, Play } from 'lucide-react';
import { saveWorkflow, runWorkflowExecution, serializeWorkflowGraph } from '../../services/api';

export default function HeaderNavbar({ workflowName, setWorkflowName, nodes, edges, theme, toggleTheme }) {
  const handleSave = async () => {
    const data = serializeWorkflowGraph(workflowName, nodes, edges);
    await saveWorkflow(data);
    alert(`Workflow Saved (${nodes.length} nodes, ${edges.length} edges)`);
  };

  const handleRun = async () => {
    const res = await runWorkflowExecution('wf_dev');
    alert(`Execution Status: ${res.status}\nOutput: ${JSON.stringify(res.output)}`);
  };

  return (
    <header
      style={{
        height: '50px',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary)' }}>FlowForge AI</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Theme Toggle Button using Lucide React Icons */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={14} />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun size={14} />
              <span>Light Mode</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSave}
          style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Save size={14} />
          <span>Save Workflow</span>
        </button>

        <button
          type="button"
          onClick={handleRun}
          style={{
            background: 'var(--primary)',
            border: 'none',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Play size={14} fill="#ffffff" />
          <span>Run Workflow</span>
        </button>
      </div>
    </header>
  );
}
