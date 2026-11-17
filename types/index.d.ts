export type Mood = 'idle' | 'thinking' | 'reading' | 'writing' | 'running' | 'web' | 'agent' | 'error'

declare module 'claude-code' {
  interface PluginState {
    'cosmic-moods': { mood: Mood }
  }
}
