const React = require('react')
const h = React.createElement

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

const chart = (data: ChartData) => {
  const { labels, datasets } = data
  return h('c:chart', {},
    h('c:autoTitleDeleted', { val: 1 }),
    h('c:view3D', {},
      h('c:rotX', { val: '30' }),
      h('c:hPercent', { val: '100' }),
      h('c:rotY', { val: '0' }),
      h('c:depthPercent', { val: '100' }),
      h('c:rAngAx', { val: '1' }),
      h('c:perspective', { val: '30' })
    ),
    h('c:plotArea', {},
      h(
        'c:layout',
        {},
        h('c:manualLayout', {},
          h('c:xMode', { val: 'edge' }),
          h('c:yMode', { val: 'edge' })
        )
      ),
      // c:areaChart
      h('c:lineChart', {},
        h('c:grouping', { val: 'standard' }),
        // series
        ...datasets.map((dataset, index) => {
          return h('c:ser', {},
            h('c:idx', { val: index }),
            h('c:order', { val: index }),
            h('c:tx', {}, h('c:v', {}, 'PV')),
            // data labels
            h('c:dLbls', {},
              h('c:showVal', { val: '0' }),
              h('c:showCatName', { val: '0' }),
              h('c:showSerName', { val: '0' }),
              h('c:showPercent', { val: '0' })
            ),
            h(
              'c:cat',
              {},
              h('c:strLit', {},
                h('c:ptCount', { val: labels.length }),
                ...labels.map((label, i) => {
                  return h('c:pt', { idx: i, key: i }, h('c:v', {}, label))
                })
              )
            ),
            h(
              'c:val',
              {},
              h('c:numLit', {},
                h('c:ptCount', { val: dataset.data.length }),
                ...dataset.data.map((value, i) => {
                  return h('c:pt', { idx: i, key: i }, h('c:v', {}, value))
                })
              )
            )
          )
        }),
        h('c:axId', { val: '52743552' }),
        h('c:axId', { val: '52749440' })
      ),
      h('c:catAx', {},
        h('c:axId', { val: '52743552' }),
        h('c:scaling', {}, h('c:orientation', { val: 'minMax' })),
        h('c:delete', { val: '0' }),
        h('c:axPos', { val: 'b' }),
        h(
          'c:title',
          {},
          h(
            'c:tx',
            {},
            h('c:rich', {},
              h('a:bodyPr', {}),
              h('a:lstStyle', {}),
              h('a:p', {},
                h(
                  'a:pPr',
                  {},
                  // Default Text Run Properties
                  h(
                    'a:defRPr',
                    {
                      b: 'false',
                      i: 'false',
                      strike: 'noStrike',
                      sz: '1000',
                      u: 'none'
                    },
                    h(
                      'a:solidFill',
                      {},
                      h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '100.00%' }))
                    ),
                    h('a:latin', { typeface: 'Calibri' })
                  )
                ),
                h('a:r', {},
                  h('a:rPr', {
                    lang: 'en-US',
                    dirty: '0'
                  }),
                  h('a:t', {}, 'Axis X')
                ),
                h('a:endParaRPr', { lang: 'en-US', dirty: '0' })
              )
            )
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
      ),
      h('c:valAx', {},
        h('c:axId', { val: '52749440' }),
        h('c:scaling', {}, h('c:orientation', { val: 'minMax' })),
        h('c:delete', { val: '0' }),
        h('c:axPos', { val: 'l' }),
        h(
          'c:title',
          {},
          h(
            'c:tx',
            {},
            h('c:rich', {},
              h('a:bodyPr', {}),
              h('a:lstStyle', {}),
              h('a:p', {},
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
                    h(
                      'a:solidFill',
                      {},
                      h('a:srgbClr', { val: '000000' }, h('a:alpha', { val: '100.00%' }))
                    ),
                    h('a:latin', { typeface: 'Calibri' })
                  )
                ),
                h('a:r', {}, h('a:rPr', { lang: 'en-US', dirty: '0' }), h('a:t', {}, 'Axis Y')),
                h('a:endParaRPr', { lang: 'en-US', dirty: '0' })
              )
            )
          )
        ),
        h(
          'c:majorGridlines',
          {},
          h(
            'c:spPr',
            {},
            h(
              'a:ln',
              { w: '0' },
              h(
                'a:solidFill',
                {},
                h('a:srgbClr', { val: '878787' }, h('a:alpha', { val: '100000' }))
              )
            )
          )
        ),
        h('c:numFmt', { formatCode: '', sourceLinked: '1' }),
        h('c:majorTickMark', { val: 'none' }),
        h('c:minorTickMark', { val: 'none' }),
        h('c:tickLblPos', { val: 'nextTo' }),
        h('c:spPr', {}, h('a:ln', { w: '0' }, h('a:noFill', {}))),
        h('c:crossAx', { val: '52743552' }),
        h('c:crosses', { val: 'autoZero' }),
        h('c:crossBetween', { val: 'midCat' })
      )
    )
  )
}

export const render = (data: ChartData) => {
  return h(
    'c:chartSpace',
    {
      'xmlns:c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    },
    h('c:date1904', { val: '1' }),
    h('c:lang', { val: 'en-US' }),
    chart(data),
    // Shape Properties
    h('c:spPr', {}, h('a:noFill'))
  )
}

export default {
  render
}
