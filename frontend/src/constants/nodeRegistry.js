/**
 * Basic Node Definitions for Initial FlowForge AI MVP
 */

export const STARTER_NODES = {
  input: {
    type: 'input',
    label: 'Input Node',
    description: 'Receives input text or prompt query.',
    color: '#3b82f6',
    defaultParams: { query: '' },
  },
  prompt: {
    type: 'prompt',
    label: 'Prompt Template',
    description: 'Formats query into a structured prompt.',
    color: '#10b981',
    defaultParams: { template: 'User question: {query}' },
  },
  llm: {
    type: 'llm',
    label: 'LLM Node',
    description: 'Calls language model to generate response.',
    color: '#6366f1',
    defaultParams: { provider: 'gemini', model: 'gemini-2.0-flash', temperature: 0.7, max_tokens: 2048 },
    modelOptions: {
      gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    },
  },
  output: {
    type: 'output',
    label: 'Output Node',
    description: 'Displays the final generated response.',
    color: '#f59e0b',
    defaultParams: {},
  },
};
