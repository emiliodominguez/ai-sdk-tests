"use client";

import { useEffect, useRef, useState } from "react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import markedCodeFormat from "marked-code-format";

interface MarkdownRendererProps {
	content: string;
}

/**
 * Renders the markdown content
 */
export function MarkdownRenderer(props: MarkdownRendererProps) {
	const [html, setHtml] = useState<string>("");
	const marked = useRef(
		new Marked({ async: true }).use(
			markedCodeFormat(),
			markedHighlight({
				emptyLangClass: "hljs",
				langPrefix: "hljs language-",
				highlight(code, lang) {
					return hljs.highlight(code, { language: hljs.getLanguage(lang) ? lang : "plaintext" }).value;
				},
			}),
		),
	);

	useEffect(() => {
		(marked.current.parse(props.content) as Promise<string>).then(setHtml).catch(console.error);
	}, [props.content]);

	return <div className="marked" dangerouslySetInnerHTML={{ __html: html }} />;
}
