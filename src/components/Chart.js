import * as React from 'react'
import { ReactTestRendererJSON } from 'react-test-renderer'
const h = React.createElement

const graph = () =>
  h('c:chart', {}, [
    h('c:autoTitleDeleted', { val: 1 }),
    h('c:view3D', {}, [
      h('c:rotX', { val: '30' }),
      h('c:hPercent', { val: '100' }),
      h('c:rotY', { val: '0' }),
      h('c:depthPercent', { val: '100' }),
      h('c:rAngAx', { val: '1' }),
      h('c:perspective', { val: '30' })
    ]),
    h('c:plotArea', {}, [
      h(
        'c:layout',
        {},
        h('c:manualLayout', {}, [h('c:xMode', { val: 'edge' }), h('c:yMode', { val: 'edge' })])
      ),
      h('c:areaChart', {}, [
        h('c:grouping', { val: 'standard' }),
        h('c:ser', {}, [
          h('c:idx', { val: '0' }),
          h('c:order', { val: '0' }),
          h('c:tx', {}, h('c:v', {}, 'Downloads')),
          h('c:dLbls', {}, [
            h('c:showVal', { val: '1' }),
            h('c:showCatName', { val: '0' }),
            h('c:showSerName', { val: '1' }),
            h('c:showPercent', { val: '0' })
          ]),
          h(
            'c:cat',
            {},
            h('c:strLit', {}, [
              h('c:ptCount', { val: '7' }),
              h('c:pt', { idx: '0' }, h('c:v', {}, 'Monday')),
              h('c:pt', { idx: '1' }, h('c:v', {}, 'Tuesday')),
              h('c:pt', { idx: '2' }, h('c:v', {}, 'Wednesday')),
              h('c:pt', { idx: '3' }, h('c:v', {}, 'Thursday')),
              h('c:pt', { idx: '4' }, h('c:v', {}, 'Friday')),
              h('c:pt', { idx: '5' }, h('c:v', {}, 'Saturday')),
              h('c:pt', { idx: '6' }, h('c:v', {}, 'Sunday'))
            ])
          ),
          h(
            'c:val',
            {},
            h('c:numLit', {}, [
              h('c:ptCount', { val: '7' }),
              h('c:pt', { idx: '0' }, h('c:v', {}, '12')),
              h('c:pt', { idx: '1' }, h('c:v', {}, '15')),
              h('c:pt', { idx: '2' }, h('c:v', {}, '13')),
              h('c:pt', { idx: '3' }, h('c:v', {}, '17')),
              h('c:pt', { idx: '4' }, h('c:v', {}, '14')),
              h('c:pt', { idx: '5' }, h('c:v', {}, '9')),
              h('c:pt', { idx: '6' }, h('c:v', {}, '7'))
            ])
          )
        ]),
        h('c:axId', { val: '52743552' }),
        h('c:axId', { val: '52749440' })
      ]),
      h('c:catAx', {}, [
        h('c:axId', {
          val: '52743552'
        }),
        h(
          'c:scaling',
          {},
          h('c:orientation', {
            val: 'minMax'
          })
        ),
        h('c:delete', { val: '0' }),
        h('c:axPos', { val: 'b' }),
        h(
          'c:title',
          {},
          h(
            'c:tx',
            {},
            h('c:rich', {}, [
              h('a:bodyPr', {}),
              h('a:lstStyle', {}),
              h('a:p', {}, [
                h(
                  'a:pPr',
                  {},
                  h(
                    'a:defRPr',
                    {
                      b: 'false',
                      i: 'false',
                      strike: 'noStrike',
                      sz: '1000',
                      u: 'none'
                    },
                    [
                      h(
                        'a:solidFill',
                        {},
                        h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '100.00%' }))
                      ),
                      h('a:latin', { typeface: 'Calibri' })
                    ]
                  )
                ),
                h('a:r', {}, [
                  h('a:rPr', {
                    lang: 'en-US',
                    dirty: '0'
                  }),
                  h('a:t', {}, 'Axis X')
                ]),
                h('a:endParaRPr', {
                  lang: 'en-US',
                  dirty: '0'
                })
              ])
            ])
          )
        ),
        h('c:numFmt', { formatCode: '', sourceLinked: '1' }),
        h('c:majorTickMark', { val: 'none' }),
        h('c:minorTickMark', { val: 'none' }),
        h('c:tickLblPos', { val: 'nextTo' }),
        h('c:spPr', {}, h('a:ln', { w: '0' }, h('a:noFill', {}))),
        h('c:crossAx', { val: '52749440' }),
        h('c:crosses', { val: 'autoZero' }),
        h('c:lblAlgn', { val: 'ctr' }),
        h('c:lblOffset', { val: '100' })
      ]),
      h('c:valAx', {}, [
        h('c:axId', { val: '52749440' }),
        h(
          'c:scaling',
          {},
          h('c:orientation', {
            val: 'minMax'
          })
        ),
        h('c:delete', { val: '0' }),
        h('c:axPos', { val: 'l' }),
        h(
          'c:title',
          {},
          h(
            'c:tx',
            {},
            h('c:rich', {}, [
              h('a:bodyPr', {}),
              h('a:lstStyle', {}),
              h('a:p', {}, [
                h(
                  'a:pPr',
                  {},
                  h(
                    'a:defRPr',
                    {
                      b: 'false',
                      i: 'false',
                      strike: 'noStrike',
                      sz: '1000',
                      u: 'none'
                    },
                    [
                      h(
                        'a:solidFill',
                        {},
                        h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '100.00%' }))
                      ),
                      h('a:latin', { typeface: 'Calibri' })
                    ]
                  )
                ),
                h('a:r', {}, [h('a:rPr', { lang: 'en-US', dirty: '0' }), h('a:t', {}, 'Axis Y')]),
                h('a:endParaRPr', { lang: 'en-US', dirty: '0' })
              ])
            ])
          )
        ),
        h('c:numFmt', { formatCode: '', sourceLinked: '1' }),
        h('c:majorTickMark', {
          val: 'none'
        }),
        h('c:minorTickMark', {
          val: 'none'
        }),
        h('c:tickLblPos', {
          val: 'nextTo'
        }),
        h('c:spPr', {}, h('a:ln', { w: '0' }, h('a:noFill', {}))),
        h('c:crossAx', { val: '52743552' }),
        h('c:crosses', { val: 'autoZero' }),
        h('c:crossBetween', { val: 'midCat' })
      ])
    ])
  ])

const render = () => {
  return h(
    'c:chartSpace',
    {
      'xmlns:c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    },
    [
      h('c:date1904', { val: '1' }),
      h('c:lang', { val: 'en-US' }),
      graph(),
      h('c:spPr', {}, [
        h('a:solidFill', {}, h('a:srgbClr', { val: 'E06B20' }, h('a:alpha', { val: '100.00%' }))),
        h(
          'a:ln',
          {
            w: '12700',
            cap: 'flat',
            cmpd: 'sng',
            algn: 'ctr'
          },
          [
            h(
              'a:solidFill',
              {},
              h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '100.00%' }))
            ),
            h('a:prstDash', { val: 'solid' }),
            h('a:round', {}),
            h('a:headEnd', {
              type: 'none',
              w: 'med',
              len: 'med'
            }),
            h('a:tailEnd', {
              type: 'none',
              w: 'med',
              len: 'med'
            })
          ]
        ),
        h(
          'a:effectLst',
          {},
          h(
            'a:outerShdw',
            {
              blurRad: '57150',
              dist: '95250',
              dir: '2700000',
              algn: 'br',
              rotWithShape: '0'
            },
            h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '50%' }))
          )
        )
      ])
    ]
  )
}

console.log(render())
