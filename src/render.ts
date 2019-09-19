import React from 'react'
import ReactDOMServer from 'react-dom/server'
import testRenderer, { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import convert from 'xml-js'
import yoga, { YogaNode } from 'yoga-layout'

import Table from './components/Table'
import Text from './components/Text'

const h = React.createElement

// renderer-json to xml
const renderer: any = (node: ReactTestRendererJSON | string) => {
  if (typeof node == 'string') return node
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
              ...node.children!.map(child => renderer(child))
            ])
          ),
          h('p:clrMapOvr', {}, [h('a:masterClrMapping')])
        ]
      )
    case 'table':
      return Table(node)
    case 'text':
      return Text(node)
    default:
      console.log('unknown node: ' + node.type)
      return null
  }
}

const rootNode = yoga.Node.create()
rootNode.setWidth(9144000)
rootNode.setHeight(6858000)

const setLayoutProps = (
  node: YogaNode,
  props: {
    [key: string]: any
  }
) => {
  const { width, height, flexGrow, padding } = props
  // console.log(height, flexGrow, padding)
  if (padding) {
    node.setPadding(yoga.EDGE_TOP, padding)
    node.setPadding(yoga.EDGE_RIGHT, padding)
    node.setPadding(yoga.EDGE_BOTTOM, padding)
    node.setPadding(yoga.EDGE_LEFT, padding)
  }
  if (height) {
    node.setHeight(height)
  }
  if (width) {
    node.setWidth(width)
  }
  node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN)
  if (flexGrow) {
    node.setFlexGrow(flexGrow)
  }
  // node.setFlexGrow(1)
}

const calcLayout = (tree: ReactTestRendererNode, node = rootNode) => {
  if (typeof tree === 'string' || !tree.children) {
    return
  }

  setLayoutProps(node, tree.props)
  // TODO: defaultProps的なものを用意する
  if (tree.type === 'tr') {
    node.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  }

  tree.children.map((child: any, index: number) => {
    if (typeof child === 'string') {
      return
    }

    const childNode = yoga.Node.create()
    setLayoutProps(childNode, child.props)
    node.insertChild(childNode, index)
    child.layout = {
      _node: childNode
    }
    return childNode
  })

  node.calculateLayout(node.getWidth().valueOf(), node.getHeight().valueOf())

  tree.children.map((child: any) => {
    if (typeof child === 'string') {
      return
    }
    const node: YogaNode = child.layout._node
    child.layout = {
      ...child.layout,
      ...node.getComputedLayout()
    }
    node.setWidth(child.layout.width)
    node.setHeight(child.layout.height)
    calcLayout(child, node)
  })
}

const render = (tree: JSX.Element) => {
  // jsx to renderer-json
  const json = testRenderer.create(tree).toJSON()!
  // output: <p:sld><p>$aa<b>bbb</b>aa</pre></p:sld>
  const slides = json.children!.map(slide => {
    calcLayout(slide)
    // console.log(JSON.stringify(slide, null, 2))
    const reactXml = ReactDOMServer.renderToString(renderer(slide))
    // console.log(JSON.stringify(reactXml, null , 2))
    // Remove closing tag
    const xmlStructure = convert.xml2js(reactXml)
    delete xmlStructure.elements[0].attributes['data-reactroot']
    const result = convert.js2xml(xmlStructure)
    // console.log(result)
    return result
  })
  // console.log(result)
  return {
    slides
    // config
  }
}

export default render
