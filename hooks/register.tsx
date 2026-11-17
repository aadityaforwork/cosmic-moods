import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import type { Mood } from '../types'
import { makeColors } from './make-colors.js'

type Palette = {
  label: string
  core: string
  halo: string
  dust: string
  star: string
  pulse: number
  drift: number
  hasComet: boolean
}

const MOODS: Record<Mood, Palette> = {
  idle: { label: 'drifting', core: '#3b2a6b', halo: '#1d2b5c', dust: '#5a3f8f', star: '#e8e4ff', pulse: 9, drift: 90, hasComet: false },
  thinking: { label: 'thinking', core: '#5b3fd1', halo: '#2a1f7a', dust: '#9a7cff', star: '#f1ecff', pulse: 4, drift: 50, hasComet: false },
  reading: { label: 'reading', core: '#1f8a8a', halo: '#123d5c', dust: '#4fd1c5', star: '#dffcff', pulse: 6, drift: 70, hasComet: false },
  writing: { label: 'writing', core: '#c48a2a', halo: '#5c2f1a', dust: '#ffcf6b', star: '#fff6e0', pulse: 5, drift: 60, hasComet: false },
  running: { label: 'running', core: '#c23a8a', halo: '#3d1a5c', dust: '#ff7ac8', star: '#ffe8f6', pulse: 3, drift: 35, hasComet: true },
  web: { label: 'reaching out', core: '#2a6fd1', halo: '#14205c', dust: '#6fc3ff', star: '#e6f4ff', pulse: 5, drift: 45, hasComet: true },
  agent: { label: 'delegating', core: '#2f9a5a', halo: '#123d33', dust: '#7ce0a0', star: '#e6ffef', pulse: 5, drift: 55, hasComet: false },
  error: { label: 'disturbance', core: '#b8322a', halo: '#3d0f1a', dust: '#ff6b5a', star: '#ffe6e0', pulse: 2.5, drift: 30, hasComet: false },
}

export const moodOfTool = (tool: string): Mood => {
  if (/^(Read|Grep|Glob|LS|NotebookRead)$/.test(tool)) return 'reading'
  if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool)) return 'writing'
  if (/^(Bash|BashOutput|KillShell)$/.test(tool)) return 'running'
  if (/^(WebFetch|WebSearch)$/.test(tool) || tool.startsWith('mcp__')) return 'web'
  if (/^(Agent|Task)$/.test(tool)) return 'agent'
  return 'thinking'
}

const STARS = (() => {
  let seed = 7
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: 140 }, (_, i) => ({
    x: Math.round(rand() * 1600),
    y: Math.round(rand() * 1000),
    r: (0.5 + rand() * 1.6).toFixed(2),
    group: i % 3,
    delay: (rand() * 6).toFixed(2),
  }))
})()

export const scene = (mood: Mood): string => {
  const p = MOODS[mood]
  const stars = STARS.map(
    s => `<circle class="s s${s.group}" cx="${s.x}" cy="${s.y}" r="${s.r}" style="animation-delay:-${s.delay}s"/>`,
  ).join('')
  const comet = p.hasComet
    ? `<g class="comet"><line x1="0" y1="0" x2="-160" y2="-60" stroke="url(#tail)" stroke-width="2.4" stroke-linecap="round"/><circle r="3" fill="${p.star}"/></g>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="space" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#0d0a24"/><stop offset="1" stop-color="#03020a"/></radialGradient>
<radialGradient id="core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${p.core}" stop-opacity="0.85"/><stop offset="1" stop-color="${p.core}" stop-opacity="0"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${p.halo}" stop-opacity="0.9"/><stop offset="1" stop-color="${p.halo}" stop-opacity="0"/></radialGradient>
<radialGradient id="dust" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${p.dust}" stop-opacity="0.45"/><stop offset="1" stop-color="${p.dust}" stop-opacity="0"/></radialGradient>
<linearGradient id="tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.star}" stop-opacity="0.9"/><stop offset="1" stop-color="${p.star}" stop-opacity="0"/></linearGradient>
</defs>
<style>
.neb{transform-box:fill-box;transform-origin:center}
.n1{animation:drift ${p.drift}s ease-in-out infinite alternate}
.n2{animation:drift ${p.drift * 1.4}s ease-in-out infinite alternate-reverse}
.n3{animation:breathe ${p.pulse}s ease-in-out infinite}
.s{fill:${p.star};opacity:0.7}
.s0{animation:tw ${p.pulse}s ease-in-out infinite}
.s1{animation:tw ${p.pulse * 1.6}s ease-in-out infinite}
.s2{opacity:0.45}
.comet{opacity:0;animation:fly ${p.pulse * 3}s linear infinite}
@keyframes drift{from{transform:translate(-40px,-20px) scale(1)}to{transform:translate(60px,30px) scale(1.12)}}
@keyframes breathe{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:0.95;transform:scale(1.08)}}
@keyframes tw{0%,100%{opacity:0.25}50%{opacity:0.95}}
@keyframes fly{0%{opacity:0;transform:translate(300px,80px)}8%{opacity:1}30%{opacity:0;transform:translate(1500px,520px)}100%{opacity:0;transform:translate(1500px,520px)}}
</style>
<rect width="1600" height="1000" fill="url(#space)"/>
<ellipse class="neb n2" cx="1220" cy="260" rx="560" ry="360" fill="url(#halo)"/>
<ellipse class="neb n1" cx="360" cy="760" rx="620" ry="380" fill="url(#halo)"/>
<ellipse class="neb n1" cx="1300" cy="820" rx="460" ry="300" fill="url(#core)"/>
<ellipse class="neb n2" cx="280" cy="180" rx="380" ry="260" fill="url(#core)" opacity="0.7"/>
<ellipse class="neb n3" cx="1380" cy="160" rx="240" ry="170" fill="url(#dust)"/>
<ellipse class="neb n3" cx="180" cy="900" rx="260" ry="160" fill="url(#dust)"/>
${stars}
${comet}
</svg>`
}

const mood = atom({ plugin: 'cosmic-moods', key: 'mood' } as const, 'idle' as Mood)

const { theme } = makeColors({
  label: 'Cosmic',
  only: 'dark',
  roles: { accent: '#8b7cff', danger: '#ff6b6b', success: '#5fd4a0', warning: '#f2b94b', pro: '#c58bff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0a1a',
        'surface-1': '#121029',
        'surface-2': '#181535',
        'surface-3': '#1d1a3d',
        'text-primary': '#eeeaff',
        'text-secondary': '#c6c0e8',
        'text-muted': '#9d96c4',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'cosmos', glass: { blur: 18, tint: '#0b0a1a', opacity: 0.55 } },
  overrideColorScheme: 'dark',
}

async function setMood($: EngineInterface, next: Mood): Promise<void> {
  try {
    await update($, mood, () => next)
    $.ui.status(`✦ ${MOODS[next].label}`)
  } catch {
    // A missed mood change is cosmetic; never let it touch the tool call.
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(LOOK)
    if (!set.isDrawn) $.ui.status(`cosmic-moods: ${set.reason}`)
    await setMood($, 'idle')
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) await setMood($, 'thinking')
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    await setMood($, moodOfTool(e.tool))
    const ran = await next(e)
    await setMood($, ran.isError === true ? 'error' : 'thinking')
    return ran
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      const current = await read($, mood)
      await setMood($, current === 'error' ? 'error' : 'idle')
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    if (e.props.plugin !== $.plugin.name) return next(e)
    const { Svg } = $.ui.resolve(e)
    const now = await read($, mood)
    return <Svg source={scene(now)} alt={`A starfield, nebula ${MOODS[now].label}`} isInteractive />
  })
}
