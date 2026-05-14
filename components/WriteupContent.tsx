'use client'

// Simple markdown renderer without external deps
export default function WriteupContent({ content }: { content: string }) {
  const html = parseMarkdown(content)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML first
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`
  )
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%;border:1px solid var(--border);margin:1rem 0;display:block;" />'
  )
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // HR
  html = html.replace(/^---$/gm, '<hr/>')
  // H3
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  // H2
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  // H1
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
  // Unordered list items
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
  // Ordered list
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  // Paragraphs — double newlines
  html = html.replace(/\n\n(?!<[uo]l|<pre|<h|<block|<hr)/g, '</p><p>')
  html = '<p>' + html + '</p>'
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<pre>)/g, '$1')
  html = html.replace(/(<\/pre>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<hr\/>)/g, '$1')
  html = html.replace(/<p>(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
  html = html.replace(/<p>(<img)/g, '$1')
  html = html.replace(/(\/?>)<\/p>/g, '$1')

  return html
}
