import { ToolHeader } from '@/components/tools/tool-header'
import { FileTextIcon, CheckUidIcon, SearchIcon, ClockIcon, InfoIcon } from '@/components/icons'

function PostBadge() {
  return (
    <span className="inline-flex items-center h-5 px-[7px] rounded-md text-[10.5px] font-extrabold tracking-[.04em] bg-[#dcfce7] text-[#15803d] mr-1 flex-shrink-0">
      POST
    </span>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-zinc-100 border border-zinc-200 rounded px-[5px] py-px font-mono text-[11.5px] text-zinc-700">
      {children}
    </code>
  )
}

function DocCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
      {children}
    </div>
  )
}

function DocHdr({ icon, title, badge, endpoint }: { icon: React.ReactNode; title: string; badge?: boolean; endpoint?: string }) {
  return (
    <div className="px-3.5 py-3 border-b border-zinc-200 bg-zinc-50">
      <div className="text-[14px] font-extrabold text-zinc-800 flex items-center gap-[7px]">
        <span className="text-zinc-500 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        {title}
      </div>
      {endpoint && (
        <div className="text-[11.5px] font-mono text-zinc-500 mt-[3px]">
          {badge && <PostBadge />}{endpoint}
        </div>
      )}
    </div>
  )
}

function DocBody({ children }: { children: React.ReactNode }) {
  return <div className="px-3.5 py-3">{children}</div>
}

function DocLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-extrabold uppercase tracking-[.07em] text-zinc-400 mb-1.5 mt-3.5 first:mt-0">
      {children}
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-zinc-900 rounded-md px-3 py-3 overflow-x-auto">
      <pre className="text-[11.5px] text-[#e4e4e7] font-mono leading-[1.75] whitespace-pre m-0">{children}</pre>
    </div>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="text-left px-[9px] py-[7px] bg-zinc-50 font-bold text-zinc-600 text-[11px] border-b border-zinc-100">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-[9px] py-[7px] text-zinc-700 border-b border-zinc-100 last:border-0">
                  {j === 0 ? <Code>{cell}</Code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocumentationPage() {
  return (
    <main className="max-w-[720px] mx-auto px-4 pb-16 pt-5 sm:px-5 sm:pt-6 md:px-7 md:pt-7 lg:max-w-[840px] lg:px-10 lg:pt-8 xl:max-w-[960px] xl:px-14">
      <ToolHeader
        icon={<FileTextIcon />}
        iconClass="k"
        name="API Documentation"
        subtitle="Full reference for the KiroTools API"
      />

      {/* Overview */}
      <DocCard>
        <DocHdr icon={<InfoIcon />} title="Overview" />
        <DocBody>
          <p className="text-[13px] text-zinc-600 mb-2.5 leading-relaxed">
            Base URL: <Code>http://localhost:3000</Code> &nbsp;·&nbsp; All requests use <Code>Content-Type: application/json</Code>
          </p>
          <Table
            headers={['Endpoint', 'Method', 'Description']}
            rows={[
              ['/api/check-uid', 'POST', 'Check live/dead status of Facebook UIDs'],
              ['/api/find-facebook-id', 'POST', 'Find Facebook ID from URL or username'],
              ['/api/find-post-id', 'POST', 'Extract numeric Post ID from a Facebook post URL'],
            ]}
          />
        </DocBody>
      </DocCard>

      {/* Check Live UID */}
      <DocCard>
        <DocHdr
          icon={<CheckUidIcon />}
          title="Check Live UID"
          badge
          endpoint="/api/check-uid"
        />
        <DocBody>
          <DocLabel>Request Body</DocLabel>
          <Table
            headers={['Field', 'Type', 'Required', 'Description']}
            rows={[['uids', 'string[]', 'Yes', 'Array of Facebook UIDs (max 50)']]}
          />
          <DocLabel>Example Request</DocLabel>
          <CodeBlock>{`{ "uids": ["100012345678901", "100023456789012"] }`}</CodeBlock>
          <DocLabel>Example Response</DocLabel>
          <CodeBlock>{`{
  "results": [
    { "uid": "100012345678901", "live": true  },
    { "uid": "100023456789012", "live": false }
  ]
}`}</CodeBlock>
          <p className="text-[12.5px] text-zinc-500 mt-2.5 leading-relaxed">
            The <Code>live</Code> field is a <strong>boolean</strong> — <Code>true</Code> = live account, <Code>false</Code> = dead/deactivated.
          </p>
        </DocBody>
      </DocCard>

      {/* Find Facebook ID */}
      <DocCard>
        <DocHdr
          icon={<SearchIcon />}
          title="Find Facebook ID"
          badge
          endpoint="/api/find-facebook-id"
        />
        <DocBody>
          <DocLabel>Request Body</DocLabel>
          <Table
            headers={['Field', 'Type', 'Required', 'Description']}
            rows={[['url', 'string', 'Yes', 'Facebook URL or username to look up']]}
          />
          <DocLabel>Example Request</DocLabel>
          <CodeBlock>{`{ "url": "https://www.facebook.com/cristiano" }`}</CodeBlock>
          <DocLabel>Example Response</DocLabel>
          <CodeBlock>{`{ "success": true, "uid": "22130498" }`}</CodeBlock>
          <p className="text-[12.5px] text-zinc-500 mt-2.5 leading-relaxed">
            The numeric Facebook ID is in the <Code>uid</Code> field. <Code>success</Code> is <Code>false</Code> when the lookup fails.
          </p>
        </DocBody>
      </DocCard>

      {/* Retry Policy */}
      <DocCard>
        <DocHdr icon={<ClockIcon />} title="Retry Policy" />
        <DocBody>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { val: '3×', lbl: 'Max retries' },
              { val: '2 s', lbl: 'Initial delay' },
              { val: '1.5×', lbl: 'Backoff' },
            ].map(s => (
              <div key={s.lbl} className="bg-white border border-zinc-200 rounded-xl px-2.5 py-3.5 text-center shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                <div className="text-[22px] font-black text-zinc-900 tracking-[-0.5px] leading-none mb-1">{s.val}</div>
                <div className="text-[11px] text-zinc-400 font-semibold">{s.lbl}</div>
              </div>
            ))}
          </div>
          <p className="text-[12.5px] text-zinc-500 leading-relaxed">
            On <Code>429 Rate Limited</Code>, retries automatically: 2 s → 3 s → 4.5 s. Timeout: <strong>30 s</strong> (check-uid) / <strong>15 s</strong> (find-facebook-id).
          </p>
        </DocBody>
      </DocCard>
    </main>
  )
}
