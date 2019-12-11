import React from 'react'
import { LayoutProps, LayoutedTestRendererJSON } from "../render"

const h = React.createElement

export const Slide: React.FC<LayoutProps> = ({ children, ...props }) => <slide {...props}>{children}</slide>

export const buildXML = (node: LayoutedTestRendererJSON, children: React.DOMElement<any, any>[]) => {
  return h(
    'p:sld',
    {
      'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
    },
    h(
      'p:cSld',
      {},
      h('p:spTree', {},
        h('p:nvGrpSpPr', {},
          h('p:cNvPr', { id: 1, name: '' }),
          h('p:cNvGrpSpPr'),
          h('p:nvPr')
        ),
        h(
          'p:grpSpPr',
          {},
          h('a:xfrm', {},
            h('a:off', { x: '0', y: '0' }),
            h('a:ext', { cx: '0', cy: '0' }),
            h('a:chOff', { x: '0', y: '0' }),
            h('a:chExt', { cx: '0', cy: '0' })
          )
        ),
        ...children
      )
    ),
    h('p:clrMapOvr', {}, h('a:masterClrMapping'))
  )
}