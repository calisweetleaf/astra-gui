# Context Snapshot

Date: ${DATE}

Goal
- Extract reusable components and a color/token system from Somnus HTMLs and apply them to a browser-like Oracle Lobby/dashboard (no AI logic yet).

What exists
- Tokens: styles/somnus-tokens.css, styles/somnus-components.css
- Tokens Studio JSON: design-tokens/somnus.tokens.json
- Ripper CLI: tools/rip_somnus_ui.py + selector maps in tools/maps/
- Extracted component sets: extracted/[somnus_main_ui, artifact_subsytem, projects_subsytem, multi_agent_collab_ui, research_v3]
- Oracle React shell: oracle-dashboard/App.tsx + components/ui/* + styles/globals.css
- Oracle static prototype: oracle-dashboard/prototype/oracle_lobby.html
- Oracle docs: Oracle_Browser.md; PyQt main_window.py (splitter-based columns)

Key decisions
- Keep AI features out (phase 2).
- Use extracted HTML/CSS purely as visual components.
- Present a “Lobby” (video-game style) as the initial screen with protocol tiles.

Integration ideas (pending)
- PyQt LobbyWidget: QWebEngineView loads prototype/oracle_lobby.html on startup, later transition to columns.
- React OracleDashboard.tsx: compose extracted markup into TSX, import per-component CSS.

