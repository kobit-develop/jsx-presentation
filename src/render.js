const React = require('react')
const ReactDOMServer = require('react-dom/server')
const testRenderer = require('react-test-renderer')
const format = require('xml-formatter')
const convert = require('xml-js')
const yoga = require('yoga-layout')
const h = React.createElement

const Table = require('./components/Table')
const Text = require('./components/Text')

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
      return Text(node)
    case 'bold':
      return <b dangerouslySetInnerHTML={{ __html: '' }}>{node.children}</b>
    default:
      console.log('unknown node: ' + node.type)
      return <img src="" />
  }
  return null
}

const rootNode = yoga.Node.create()
rootNode.setWidth(9144000)
rootNode.setHeight(6858000)

const calcLayout = (tree, node = rootNode) => {
  if (!tree.children) {
    return
  }
  const nodes = tree.children.map((child, index) => {
    if (typeof(child) === 'string') {
      return
    }

    const childNode = yoga.Node.create()
    const {height, flexGrow} = child.props
    // console.log('childprops:', child.props)
    // console.log(child.props)
    if (height) {
      childNode.setHeight(height)
    }
    if (flexGrow) {
      childNode.setFlexGrow(flexGrow)
    }
    node.insertChild(childNode, index)
    child.layout = {
      _node: childNode
    }
    return childNode
  })

  node.calculateLayout(node.getWidth(), node.getHeight())

  tree.children.map(child => {
    if (typeof(child) === 'string') {
      return
    }
    const node = child.layout._node
    child.layout = {
      ...child.layout,
      ...node.getComputedLayout()
    }
    node.setWidth(child.layout.width)
    node.setHeight(child.layout.height)
    calcLayout(child, node)
  })
}

const render = tree => {
  // jsx to renderer-json
  const json = testRenderer.create(tree).toJSON()
  // output: <p:sld><p>$aa<b>bbb</b>aa</pre></p:sld>
  const slides = json.children.map(slide => {
    calcLayout(slide)
    // console.log(JSON.stringify(slide, null, 2))
    const reactXml = ReactDOMServer.renderToString(renderer(slide))
    // console.log(JSON.stringify(reactXml, null , 2))
    // Remove closing tag
    const xmlStructure = convert.xml2js(reactXml)
    delete xmlStructure.elements[0].attributes['data-reactroot']
    const result = convert.js2xml(xmlStructure)
    return result
  })
  // console.log(result)
  return {
    slides
    // config
  }
}

module.exports = render
