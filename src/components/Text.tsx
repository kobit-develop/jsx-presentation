import * as React from 'react'
import { LayoutedTestRendererJSON, LayoutProps } from '../render'
const h = React.createElement

interface TextProps {
  color?: string,
  bold?: boolean,
  fontSize?: number
}

export const Text: React.FC<TextProps & LayoutProps> = ({ children, ...props }) => {
  return <text {...props}>{children}</text>
}

const render = (node: LayoutedTestRendererJSON) => {
  const { fontSize, color, bold } = (node.props as TextProps)
  const { width, height, left, top } = node.layout!

  return h('p:sp', {}, [
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
      h('a:prstGeom', { prst: 'rect' }, [h('a:avLst')]),
      h('a:noFill')
    ),
    h('p:txBody', {}, [
      h(
        'a:bodyPr',
        {
          rtlCol: 0,
          bIns: '45720',
          lIns: '91440',
          rIns: '91440',
          tIns: '45720'
        },
        h('a:spAutoFit')
      ),
      h('a:lstStyle'),
      h('a:p', {}, [
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
        h('a:r', {}, [
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
            [
              h(
                'a:solidFill',
                {},
                h('a:srgbClr', { val: color }, h('a:alpha', { val: '100.00%' }))
              ),
              h('a:latin', { typeface: 'Calibri' })
            ]
          ),
          h('a:t', {
            dangerouslySetInnerHTML: {
              __html: node.children
            }
          })
        ])
      ])
    ])
  ])

}

export default render
