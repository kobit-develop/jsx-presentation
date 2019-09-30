import { Relationship, LayoutedTestRendererJSON } from '../render'

const React = require('react')
const h = React.createElement

const render = (node: LayoutedTestRendererJSON, relationship: Relationship) => {
  const { width, height, left, top } = node.layout!
  const { rId } = relationship

  return h('p:graphicFrame', {}, [
    h('p:nvGraphicFramePr', {}, [
      h('p:cNvPr', {
        id: '2',
        name: 'Sample Chart',
        descr: ''
      }),
      h('p:cNvGraphicFramePr', {}),
      h('p:nvPr', {})
    ]),
    h('p:xfrm', {}, [h('a:off', { x: left, y: top }), h('a:ext', { cx: width, cy: height })]),
    h(
      'a:graphic',
      {},
      h(
        'a:graphicData',
        {
          uri: 'http://schemas.openxmlformats.org/drawingml/2006/chart'
        },
        h('c:chart', {
          'xmlns:c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
          'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
          'r:id': `rId${rId}`
        })
      )
    )
  ])
}

export default render
