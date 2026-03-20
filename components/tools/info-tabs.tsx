'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { BookOpenIcon, InfoIcon, HelpCircleIcon, UserCheckIcon } from '@/components/icons'

interface Step {
  title: string
  desc: string
}

interface FaqItem {
  q: string
  a: string
}

interface InfoTabsProps {
  about: React.ReactNode
  steps: Step[]
  faqs: FaqItem[]
}

export function InfoTabs({ about, steps, faqs }: InfoTabsProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.06)]">
      <Tabs defaultValue="guide">
        <TabsList className="w-full flex bg-zinc-100 border-b border-zinc-200 rounded-none p-[3px] gap-[2px] h-auto">
          <TabsTrigger
            value="guide"
            className="flex-1 h-[34px] rounded-md text-[12px] font-semibold text-zinc-500 data-[state=active]:bg-white data-[state=active]:text-zinc-800 data-[state=active]:font-extrabold data-[state=active]:shadow-sm gap-[5px] transition-all"
          >
            <BookOpenIcon className="w-3 h-3 hidden sm:block" />
            Guide
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="flex-1 h-[34px] rounded-md text-[12px] font-semibold text-zinc-500 data-[state=active]:bg-white data-[state=active]:text-zinc-800 data-[state=active]:font-extrabold data-[state=active]:shadow-sm gap-[5px] transition-all"
          >
            <InfoIcon className="w-3 h-3 hidden sm:block" />
            About
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="flex-1 h-[34px] rounded-md text-[12px] font-semibold text-zinc-500 data-[state=active]:bg-white data-[state=active]:text-zinc-800 data-[state=active]:font-extrabold data-[state=active]:shadow-sm gap-[5px] transition-all"
          >
            <HelpCircleIcon className="w-3 h-3 hidden sm:block" />
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="credits"
            className="flex-1 h-[34px] rounded-md text-[12px] font-semibold text-zinc-500 data-[state=active]:bg-white data-[state=active]:text-zinc-800 data-[state=active]:font-extrabold data-[state=active]:shadow-sm gap-[5px] transition-all"
          >
            <UserCheckIcon className="w-3 h-3 hidden sm:block" />
            Credits
          </TabsTrigger>
        </TabsList>

        {/* Guide */}
        <TabsContent value="guide" className="p-4 mt-0">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 pb-[18px] relative last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-[13px] top-[28px] bottom-0 w-[1.5px] bg-zinc-200" />
                )}
                <div className="w-[26px] h-[26px] rounded-full bg-zinc-100 text-zinc-700 border border-zinc-300 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 relative z-10">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[13.5px] font-extrabold text-zinc-800 mb-0.5">{step.title}</div>
                  <div className="text-[12.5px] text-zinc-500 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* About */}
        <TabsContent value="about" className="p-4 mt-0">
          <div className="text-[13px] text-zinc-600 leading-[1.7] [&>p:not(:last-child)]:mb-2.5">
            {about}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="p-0 mt-0">
          <Accordion className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-zinc-200 last:border-0 px-4">
                <AccordionTrigger className="text-[13px] font-bold text-zinc-700 py-[11px] hover:no-underline hover:text-zinc-900">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[12.5px] text-zinc-500 leading-[1.7] pb-[11px]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Credits */}
        <TabsContent value="credits" className="p-4 mt-0">
          <div className="flex items-center gap-3 pb-3.5 border-b border-zinc-100">
            <div className="w-[38px] h-[38px] rounded-full bg-zinc-900 text-white flex items-center justify-center text-[14px] font-black flex-shrink-0 select-none">
              K
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-extrabold text-zinc-800 leading-tight">Kiro Takashi</div>
              <div className="text-[12px] text-zinc-400 font-medium mt-0.5">Developer · KiroTools</div>
            </div>
          </div>
          <div className="pt-3.5">
            <div className="text-[10.5px] font-extrabold tracking-[.08em] uppercase text-zinc-400 mb-2">Why I built this</div>
            <p className="text-[12.5px] text-zinc-500 leading-[1.75]">
              Most existing Facebook tools were slow, loaded with ads, or required sign-ups just to get a simple ID.
              I built KiroTools to be fast, clean, and completely free — no bloat, no friction, just the tools you need.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
