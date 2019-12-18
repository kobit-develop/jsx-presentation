import * as React from 'react'
import { LayoutedTestRendererJSON } from '../render'
import { LayoutProps } from '../buildTree'
import { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import { ShapeProps, ShapeXML } from './Shape'

const h = React.createElement

interface TextProps {
  color?: string,
  bold?: boolean,
  fontSize?: number
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

export const Text: React.FC<TextProps & Partial<ShapeProps> & LayoutProps> = ({ children, ...props }) => {
  return <text {...props}>{children}</text>
}

export const renderParagraph = (node: LayoutedTestRendererJSON) => {
  if (!node.children) { throw new Error('Invalid Text. Text must have children') }
  const flattenNodes = flattenText(node)
  const paragraph = (flattenNodes.map((node, key) => {
    const { fontSize, color, bold } = (node.props as TextProps)
    if (node.type === 'plain') {
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
        h('a:t', {}, node.text)
      )
    }
    if (node.type === 'br') {
      return h('a:br', { key })
    }
  }))
  return h('a:p', {},
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
  )
}

export const flattenText = (tree: ReactTestRendererJSON) => {
  return [].concat.apply([], walkText(tree)) as {
    type: 'plain' | 'br'
    props: any,
    text?: string
  }[]
}

const walkText = (node: ReactTestRendererNode, inheritedProps: any = {}): any => {
  if (typeof node === 'string') {
    return { type: 'plain', props: inheritedProps, text: node }
  }

  const { type, props, children } = node

  if (type === 'br') {
    return node
  }

  if (type === 'text' && children) {
    return children.map(child => {
      return walkText(child, { ...inheritedProps, ...props, })
    })
  }
}

export const buildXML = (node: LayoutedTestRendererJSON) => {
  const shapeProps = (node.props as Partial<ShapeProps>)
  const { verticalAlign } = (node.props as TextProps)
  const anchor = !!verticalAlign ? {
    'top': 't',
    'middle': 'ctr',
    'bottom': 'b',
  }[verticalAlign] : 't'

  return h(ShapeXML, {...shapeProps, ...node.layout!},
    h('p:txBody', {},
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
    )
  )
}