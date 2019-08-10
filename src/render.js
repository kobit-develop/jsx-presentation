const React = require('react')
const ReactDOMServer = require('react-dom/server')
const testRenderer = require('react-test-renderer')
const format = require('xml-formatter')
const convert = require('xml-js')
const yoga = require('yoga-layout')
const h = React.createElement

const Table = require('./components/Table')

// renderer-json to xml
const renderer = node => {
  if (typeof node == 'string') return node
  const { layout } = node
  switch (node.type) {
    case 'slide':
      return h(
        'p:sld',
        {
          'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
          'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
          'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
        },
        [
          h(
            'p:cSld',
            {},
            h('p:spTree', {}, [
              h('p:nvGrpSpPr', {}, [
                h('p:cNvPr', { id: 1, name: '' }),
                h('p:cNvGrpSpPr'),
                h('p:nvPr')
              ]),
              h(
                'p:grpSpPr',
                {},
                h('a:xfrm', {}, [
                  h('a:off', { x: '0', y: '0' }),
                  h('a:ext', { cx: '0', cy: '0' }),
                  h('a:chOff', { x: '0', y: '0' }),
                  h('a:chExt', { cx: '0', cy: '0' })
                ])
              ),
              ...node.children.map(child => renderer(child))
            ])
          ),
          h(
            'p:extLst',
            {},
            h(
              'p:ext',
              {
                uri: '{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}'
              },
              h('p14:creationId', {
                'xmlns:p14': 'http://schemas.microsoft.com/office/powerpoint/2010/main',
                val: '732554432'
              })
            )
          ),
          h('p:clrMapOvr', {}, [h('a:masterClrMapping')])
        ]
      )
    case 'table':
      return Table(node)
    case 'text':
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
            h('a:off', { x: layout.left, y: layout.top }),
            h('a:ext', { cx: layout.width, cy: layout.height })
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
    // <p>{node.children.map(child => renderer(child))}</p>
    case 'bold':
      return <b dangerouslySetInnerHTML={{ __html: '' }}>{node.children}</b>
    default:
      console.log('unknown node: ' + node.type)
      return <img src="" />
  }
  return null
}

const calcLayout = tree => {
  const slideWidth = 9144000
  const slideHeight = 6858000

  const root = yoga.Node.create()
  root.setWidth(slideWidth)
  root.setHeight(slideHeight)

  const nodes = tree.children.map((child, index) => {
    const node = yoga.Node.create()
    const {height, flexGrow} = child.props
    // console.log(child.props)
    if (height) {
      node.setHeight(height)
    }
    if (flexGrow) {
      node.setFlexGrow(flexGrow)
    }
    root.insertChild(node, index)
    child.layout = {
      _node: node
    }
    return node
  })

  root.calculateLayout(slideWidth, slideHeight)

  // console.log(root.getComputedLayout())

  tree.children.map(child => {
    child.layout = child.layout._node.getComputedLayout()
    // console.log(child)
  })
}

const render = tree => {
  // jsx to renderer-json
  const json = testRenderer.create(tree).toJSON()
  const layoutedJson = calcLayout(json)
  // TODO: Calc layout props
  // output: <p:sld><p>$aa<b>bbb</b>aa</pre></p:sld>
  const reactXml = ReactDOMServer.renderToString(renderer(json))
  // console.log(JSON.stringify(reactXml, null , 2))
  // Remove closing tag
  const xmlStructure = convert.xml2js(reactXml)
  delete xmlStructure.elements[0].attributes['data-reactroot']
  const result = convert.js2xml(xmlStructure)
  // console.log(result)
  return result
}

module.exports = render
