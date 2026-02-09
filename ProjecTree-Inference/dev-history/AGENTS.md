## **Coding Style**

- **Task Handoff:** When handing off tasks to others, always include the required protocols, interfaces, schemas, and naming conventions to ensure consistency.
- **Commit Previews:** When a commit is requested, provide a preview in the form of a Commit Table that includes the Commit Message, Commit Files, and a concise Commit Content Summary.
- **Conversational Transparency:** During the active conversation and within code blocks provided in chat, **do not anonymize identifiers**. Use real domains, URLs, IPs, hostnames, absolute paths, usernames, and project names to ensure technical accuracy and ease of debugging.
- **Secret Masking:** Regardless of the context, **never include secrets** (OAuth/JWT/API keys/tokens). Mask any example secret values in a format-preserving way without keeping any real prefix (use <REDACTED> or synthetic placeholders).
- **Documentation Anonymity:** When documenting finalized outcomes in separate docs or summary reports, **apply anonymization** to all identifiers. Replace real system fingerprints with generic placeholders to ensure the documentation is safe for broader distribution.
- **Learning Mode:** If the phrase 'Activate Learning Mode' is present, please partially leave value names, keywords, and logic blank, provide only comments for important sections, and intentionally implement incorrect logic as needed.
- **Validation First:** Whenever possible, prioritize unit tests to validate the operational status of the environment, tools, model names, and permissions before implementing the core logic.
- **Focused Output:** Focus strictly on the modified sections rather than outputting the entire file unless necessary. Omit unchanged imports and irrelevant logic blocks using placeholders like ... (unchanged imports) ... to keep the response clean.
- **Change Tracking:** After modifying a file, specify the filename and the exact lines modified.
- **Environment:** Normally, use Bash. CMD is the second priority. Only use PowerShell when explicitly requested, as it frequently causes encoding errors.
- **Tone and Comments:** Maintain a professional tone without emojis. Write all code comments in English, adhering to a 'Public Repository' standard. Comments must be objective and understandable based solely on logic, without referencing the current conversation.
- **Structure:** Follow a 'Why, What, How' step-by-step approach for each feature. 'How' refers to actual implementation details like logs, commands, or code. Provide full, working code for the specific feature being modified.
- **Roadmap:** Start with a brief, high-level roadmap. Provide detailed specifications only for the current step. Verify execution and logs before planning the details of the next stage to avoid invalid assumptions.
- **Link Format:** Use the following format for Markdown file links: [filename:start_line-end_line](relative_path#Lstart_line-Lend_line).
- **Value Masking (Format-Preserving):** When showing partial real values (where masking is required), never keep the original first 4 characters. Generate a synthetic 4-character prefix matching the format (e.g., hex -> 1a2b...). Preserve only the type/pattern (numeric/alnum/uuid/email).

