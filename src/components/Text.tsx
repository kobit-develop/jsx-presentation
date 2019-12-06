import * as React from 'react'
import { LayoutedTestRendererJSON, LayoutProps } from '../render'
const h = React.createElement

interface TextProps {
  color?: string,
  bold?: boolean,
  fontSize?: number
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

// TODO: gradient
type FillType = string

interface ShapeProps {
  fill: FillType
}

export const Text: React.FC<TextProps & Partial<ShapeProps> & LayoutProps> = ({ children, ...props }) => {
  return <text {...props}>{children}</text>
}

const renderFill = (fill?: FillType) => {
  if (!fill) {
    return h('a:noFill')
  }

  return h('a:solidFill', {},
    h('a:srgbClr', { val: fill }, h('a:alpha', { val: '100%' }))
  )
}

const renderParagraph = (node: LayoutedTestRendererJSON) => {
  const { fontSize, color, bold } = (node.props as TextProps)
  if (!node.children) { return }
  const paragraph = (node.children.map((child, key) => {
    if (typeof child === 'string') {
      return h('a:r', { key },
        h(
          'a:rPr',
          {
            lang: 'en-US',
            b: bold ? 1 : 0,
            // TODO: default font size
            sz: (fontSize || 12) * 100,
            spc: 0,
            u: 'none'
          },
          h(
            'a:solidFill',
            {},
            h('a:srgbClr', { val: color }, h('a:alpha', { val: '100.00%' }))
          ),
          h('a:latin', { typeface: 'Calibri' })
        ),
        h('a:t', {}, child)
      )
    }
    if (child.type === 'br') {
      return h('a:br', { key })
    }
  }))
  return h('a:p', {}, [
    h(
      'a:pPr',
      {
        algn: 'l',
        fontAlgn: 'base',
        marL: '0',
        marR: '0',
        indent: '0',
        lvl: '0'
      },
      h('a:lnSpc', {}, h('a:spcPct', { val: '100%' }))
    ),
    ...paragraph,
  ])
}

const render = (node: LayoutedTestRendererJSON) => {
  const { fontSize, color, bold, verticalAlign } = (node.props as TextProps)
  const { fill } = (node.props as Partial<ShapeProps>)
  const { width, height, left, top } = node.layout!

  const anchor = !!verticalAlign ? {
    'top': 't',
    'middle': 'ctr',
    'bottom': 'b',
  }[verticalAlign] : 't'
  return h('p:sp', {}, [
    // Non-Visual Properties for a Shape
    h('p:nvSpPr', {}, [
      h('p:cNvPr', {
        id: 4,
        name: ''
      }),
      h('p:cNvSpPr', {
        txBox: 1
      }),
      h('p:nvPr')
    ]),
    h(
      'p:spPr',
      {},
      h('a:xfrm', {}, [
        h('a:off', { x: left, y: top }),
        h('a:ext', { cx: width, cy: height })
      ]),
      // Preset geometry
      h('a:prstGeom', { prst: 'rect' }, [h('a:avLst')]),
      renderFill(fill)
    ),
    h('p:txBody', {}, [
      h(
        'a:bodyPr',
        {
          rtlCol: 0,
          bIns: '45720',
          lIns: '91440',
          rIns: '91440',
          tIns: '45720',
          anchor,
          anchorCtr: "0"
        },
        h('a:spAutoFit')
      ),
      h('a:lstStyle'),
      renderParagraph(node)
    ])
  ])
}

export default render
