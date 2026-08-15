/**
 * Basic Node Definitions for Initial FlowForge AI MVP
 */

export const STARTER_NODES = {
  input: {
    type: 'input',
    label: 'Input Node',
    category: 'Inputs',
    description: 'Receives input text or prompt query.',
    color: '#3b82f6',
    inputs: [],
    outputs: ['query'],
    defaultParams: { query: '' },
  },
  prompt: {
    type: 'prompt',
    label: 'Prompt Template',
    category: 'AI',
    description: 'Formats query into a structured prompt.',
    color: '#10b981',
    inputs: ['query'],
    outputs: ['prompt'],
    defaultParams: { template: 'User question: {query}' },
  },
  promptTemplate: {
    type: 'promptTemplate',
    label: 'Prompt Template (Context)',
    category: 'AI',
    description: 'Formats context and question into a structured prompt template.',
    color: '#10b981',
    inputs: ['context'],
    outputs: ['prompt'],
    defaultParams: {
      template: 'Context:\n{{input}}\n\nQuestion:\n{{question}}\n\nPlease answer the question based on the provided context.',
    },
  },
  llm: {
    type: 'llm',
    label: 'LLM Node',
    category: 'AI',
    description: 'Calls language model to generate response.',
    color: '#6366f1',
    inputs: ['prompt'],
    outputs: ['response'],
    defaultParams: { provider: 'gemini', model: 'gemini-2.5-flash', temperature: 0.7, max_tokens: 2048 },
    modelOptions: {
      gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-2.0-flash-exp'],
    },
  },
  output: {
    type: 'output',
    label: 'Output Node',
    category: 'Outputs',
    description: 'Displays the final generated response.',
    color: '#f59e0b',
    inputs: ['response'],
    outputs: [],
    defaultParams: {},
  },
};
