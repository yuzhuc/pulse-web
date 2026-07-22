"use client";

import { type ReactNode, createElement, Fragment } from "react";

/** Rich text component mapping */
export type TransComponents = Record<string, ReactNode | ((children: ReactNode) => ReactNode)>;

interface TransProps {
	text: string;
	components?: TransComponents;
	vars?: Record<string, string | number>;
}

/** Parse text with <component>content</component> syntax */
function parseRichText(text: string, components: TransComponents, vars?: Record<string, string | number>): ReactNode {
	// First interpolate variables
	let processed = text;
	if (vars) {
		for (const [key, value] of Object.entries(vars)) {
			processed = processed.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
		}
	}

	// Match <tag>content</tag> patterns
	const tagPattern = /<(\w+)>(.*?)<\/\1>|<(\w+)(\s*\/)>/g;
	const parts: ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	let key = 0;

	while ((match = tagPattern.exec(processed)) !== null) {
		// Add text before match
		if (match.index > lastIndex) {
			parts.push(processed.slice(lastIndex, match.index));
		}

		const tagName = match[1] || match[3];
		const isSelfClosing = !!match[4];
		const content = isSelfClosing ? null : match[2];

		const component = components[tagName];
		if (component) {
			if (typeof component === "function") {
				parts.push(createElement(Fragment, { key: key++ }, component(content)));
			} else {
				parts.push(
					createElement(
						Fragment,
						{ key: key++ },
						isSelfClosing ? component : <>{component}{content}</>,
					),
				);
			}
		} else {
			// Unknown tag, render as-is
			parts.push(match[0]);
		}

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text
	if (lastIndex < processed.length) {
		parts.push(processed.slice(lastIndex));
	}

	return parts.length > 1 ? parts : parts[0] ?? processed;
}

/** Render translation with rich text components */
export function Trans({ text, components, vars }: TransProps): ReactNode {
	if (!components) {
		// No components, just interpolate
		let result = text;
		if (vars) {
			for (const [key, value] of Object.entries(vars)) {
				result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
			}
		}
		return result;
	}

	return <>{parseRichText(text, components, vars)}</>;
}

/** Create a trans function for rich text translations */
export function createTrans(components: TransComponents) {
	return function trans(text: string, vars?: Record<string, string | number>) {
		return parseRichText(text, components, vars);
	};
}
