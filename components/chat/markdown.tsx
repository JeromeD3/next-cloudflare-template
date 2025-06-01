/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const components: Partial<Components> = {
  pre: ({ children, ...props }) => (
    <pre className="black:bg-zinc-800/50 my-1.5 overflow-x-auto rounded-lg bg-zinc-800/50 p-2.5 text-sm" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.HTMLProps<HTMLElement> & { className?: string }) => {
    const match = /language-(\w+)/.exec(className || '')
    const isInline = !match && !className

    if (isInline) {
      return (
        <code
          className="black:bg-zinc-800/50 black:text-zinc-300 rounded-md bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em] text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={cn('block font-mono text-sm', className)} {...props}>
        {children}
      </code>
    )
  },
  ol: ({ node, children, ...props }) => (
    <ol className="my-1.5 ml-4 list-outside list-decimal space-y-0.5" {...props}>
      {children}
    </ol>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="my-1.5 ml-4 list-outside list-disc space-y-0.5" {...props}>
      {children}
    </ul>
  ),
  li: ({ node, children, ...props }) => (
    <li className="leading-normal" {...props}>
      {children}
    </li>
  ),
  p: ({ node, children, ...props }) => (
    <p className="my-1 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ node, children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ node, children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote
      className="black:border-zinc-700 black:text-zinc-400 my-1.5 border-l-2 border-zinc-200 pl-3 text-zinc-600 italic dark:border-zinc-700 dark:text-zinc-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ node, children, ...props }) => (
    // @ts-expect-error error
    <Link
      className="black:text-blue-400 black:hover:text-blue-300 text-blue-500 transition-colors hover:text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </Link>
  ),
  h1: ({ node, children, ...props }) => (
    <h1 className="black:text-zinc-200 mt-3 mb-1.5 text-2xl font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="black:text-zinc-200 mt-2.5 mb-1.5 text-xl font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="black:text-zinc-200 mt-2 mb-1 text-lg font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 className="black:text-zinc-200 mt-2 mb-1 text-base font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }) => (
    <h5 className="black:text-zinc-200 mt-2 mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }) => (
    <h6 className="black:text-zinc-200 mt-2 mb-0.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200" {...props}>
      {children}
    </h6>
  ),
  table: ({ node, children, ...props }) => (
    <div className="my-1.5 overflow-x-auto">
      <table className="black:divide-zinc-700 min-w-full divide-y divide-zinc-200 dark:divide-zinc-700" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ node, children, ...props }) => (
    <thead className="black:bg-zinc-800/50 bg-zinc-50 dark:bg-zinc-800/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ node, children, ...props }) => (
    <tbody
      className="black:divide-zinc-700 black:bg-transparent divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-transparent"
      {...props}
    >
      {children}
    </tbody>
  ),
  tr: ({ node, children, ...props }) => (
    <tr className="black:hover:bg-zinc-800/30 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30" {...props}>
      {children}
    </tr>
  ),
  th: ({ node, children, ...props }) => (
    <th
      className="black:text-zinc-400 px-3 py-1.5 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ node, children, ...props }) => (
    <td className="px-3 py-1.5 text-sm" {...props}>
      {children}
    </td>
  ),
  hr: ({ node, ...props }) => (
    <hr className="black:border-zinc-700 my-1.5 border-zinc-200 dark:border-zinc-700" {...props} />
  )
}

const remarkPlugins = [remarkGfm]

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children)
