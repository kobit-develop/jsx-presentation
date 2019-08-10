import * as React from 'react'
import { ReactTestRendererJSON } from 'react-test-renderer'
const h = React.createElement

/** @type {(node: ReactTestRendererJSON) => React.ReactNode} */
const render = node => {
  console.log('[DEBUG]', JSON.stringify(node, null, 2))
  const { width, height, left, top } = node.layout

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
              b: 1,
              sz: 6000,
              spc: 0,
              u: 'none'
            },
            [
              h(
                'a:solidFill',
                {},
                h('a:srgbClr', { val: node.props.color }, h('a:alpha', { val: '100.00%' }))
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

module.exports = render
