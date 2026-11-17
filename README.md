# cosmic-moods

A dark deep-space theme for the Claude desktop and mobile apps.
The backdrop is a live starfield whose nebula changes color, pulse and drift with what Claude is doing.

| Mood | When | Nebula |
| --- | --- | --- |
| drifting | idle, turn finished | violet, slow |
| thinking | a turn starts, between tools | indigo, faster pulse |
| reading | Read, Grep, Glob | teal |
| writing | Edit, Write, NotebookEdit | gold |
| running | Bash | magenta, with a comet |
| reaching out | WebFetch, WebSearch, MCP tools | blue, with a comet |
| delegating | Agent | green |
| disturbance | a tool returned an error | red, fast pulse |

The current mood also shows in the status line.
The terminal draws no theme, so there only the status line changes.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install cosmic-moods --marketplace aadityaforwork/cosmic-moods
```

Answer `y` to add the marketplace, then pick a scope (user scope makes it global).

From a shell:

```bash
claude plugin install cosmic-moods --marketplace aadityaforwork/cosmic-moods
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `aadityaforwork/cosmic-moods`, then Add plugin.
