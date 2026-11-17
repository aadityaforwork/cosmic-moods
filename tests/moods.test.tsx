import { expect, test } from 'claude-code/testing'

import { moodOfTool, scene } from '../hooks/register'

test('tools map to moods', async () => {
  expect(moodOfTool('Read')).toBe('reading')
  expect(moodOfTool('Edit')).toBe('writing')
  expect(moodOfTool('Bash')).toBe('running')
  expect(moodOfTool('mcp__x__y')).toBe('web')
  expect(moodOfTool('Agent')).toBe('agent')
  expect(moodOfTool('TodoWrite')).toBe('thinking')
})

test('every scene fits the size limit and differs by mood', async () => {
  const idle = scene('idle')
  expect(idle.length < 131072).toBe(true)
  expect(idle.includes('class="comet"')).toBe(false)
  expect(scene('running').includes('class="comet"')).toBe(true)
  expect(scene('error').includes('#b8322a')).toBe(true)
})

test('the status line follows the tool calls', async ($, on) => {
  const seen: string[] = []
  on('ui.status', (_, e) => {
    seen.push(String((e as { text?: unknown }).text))
    return { value: undefined }
  })
  on('theme.set', () => ({ value: { isDrawn: true, requestId: 't' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('tool.call', (_, e) =>
    e.tool === 'Bash' ? { result: {}, isError: true } : { result: {} },
  )

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.tool.call({ tool: 'Read', file_path: '/a' })
  await $.tool.call({ tool: 'Bash', command: 'false' })

  expect(seen).toEqual(['✦ drifting', '✦ reading', '✦ thinking', '✦ running', '✦ disturbance'])
})
