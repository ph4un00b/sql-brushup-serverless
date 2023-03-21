import { type PropsWithChildren } from "react";
import Balancer from "react-wrap-balancer";

export function H1({ children }: PropsWithChildren) {
	return (
		<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			{children}
			{/* <Balancer>{children}</Balancer> */}
		</h1>
	);
}

export function H2({ children }: PropsWithChildren) {
	return (
		<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
			{/* {children} */}
			<Balancer>{children}</Balancer>
		</h2>
	);
}

export function InlineCode({ children }: PropsWithChildren) {
	return (
		<code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400">
			{children}
		</code>
	);
}

export function Blockquote({ children }: PropsWithChildren) {
	return (
		<blockquote className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200">
			{children}
		</blockquote>
	);
}
