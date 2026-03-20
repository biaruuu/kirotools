export type ToolClass = 'g' | 'k'

export type Tool = {
  name: string
  desc: string
  url: string
  cls: ToolClass
  iconType: 'check-uid' | 'search' | 'message-square' | 'file-text'
}

export const TOOLS: Tool[] = [
  {
    name: 'Check Live UID Facebook',
    desc: 'Verify if Facebook UIDs are live or dead',
    url: '/check-live-uid',
    cls: 'g',
    iconType: 'check-uid',
  },
  {
    name: 'Find Facebook ID',
    desc: 'Find Facebook numeric IDs from any URL',
    url: '/find-facebook-id',
    cls: 'k',
    iconType: 'search',
  },
  {
    name: 'Find Facebook Post ID',
    desc: 'Extract numeric Post IDs from any Facebook post URL',
    url: '/find-post-id',
    cls: 'k',
    iconType: 'message-square',
  },
  {
    name: 'API Documentation',
    desc: 'Full API reference for KiroTools',
    url: '/documentation',
    cls: 'k',
    iconType: 'file-text',
  },
]

export const BREADCRUMBS: Record<string, { parent?: string; current: string }> = {
  '/': { current: 'All Tools' },
  '/check-live-uid': { parent: 'Facebook Tools', current: 'Check Live UID' },
  '/find-facebook-id': { parent: 'Facebook Tools', current: 'Find Facebook ID' },
  '/find-post-id': { parent: 'Facebook Tools', current: 'Find Facebook Post ID' },
  '/documentation': { parent: 'KiroTools', current: 'API Docs' },
}
