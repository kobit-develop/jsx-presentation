import fs from 'fs'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import testRenderer, { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import convert from 'xml-js'
import yoga, { YogaNode } from 'yoga-layout'

import Table from './components/Table'
import Text from './components/Text'
import Chart from './components/Chart'

import { render as renderChart } from './charts'
import Yoga from 'yoga-layout'

const chart1 = fs.readFileSync('./xml/chart1.xml')

export interface LayoutedTestRendererJSON extends ReactTestRendererJSON {
  layout?: {
    width: number
    height: number
    left: number
    top: number
  }
}

const h = React.createElement

interface Store {
  charts: {
    id: number
    content: string
  }[]
  slides: {
    relationships: Relationship[]
  }[]
}

export interface Relationship {
  rId: number
  id: number
  type: 'chart' | 'media' | 'slideLayout'
}

const store: Store = {
  charts: [],
  slides: []
}

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
    case 'chart':
      const data = node.props.data

      const children = node.children
      let childMap: any = {}
        ; (children || []).forEach(child => {
          if (typeof child === 'string') return
          // chart(data), legend, title
          childMap[child.type] = child
        })

      const newChart = {
        id: store.charts.length + 1,
        content: jsxToXml(renderChart(data))
      }
      store.charts.push(newChart)

      const currentSlide = store.slides[store.slides.length - 1]
      const relationship: Relationship = {
        type: 'chart',
        rId: currentSlide.relationships.length + 1,
        id: newChart.id
      }

      currentSlide.relationships.push(relationship)

      return Chart(node, relationship)
    default:
      console.log('unknown node: ' + node.type)
      return null
  }
}

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

const calcLayout = (tree: ReactTestRendererNode, node?: YogaNode) => {
  if (typeof tree === 'string' || !tree.children) {
    return
  }

  if (!node) {
    node = yoga.Node.create()
    node.setWidth(9144000)
    node.setHeight(6858000)
  }

  console.log(tree.type, node.getWidth(), node.getHeight())

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
    node!.insertChild(childNode, index)
    child.layout = {
      _node: childNode
    }
    return childNode
  })

  node.calculateLayout(node.getWidth().value, node.getHeight().value)

  tree.children.map((child: any) => {
    if (typeof child === 'string') {
      return
    }
    const node: YogaNode = child.layout._node
    console.log(
      child.type,
      // child.props,
      // node.getHeight().value,
      // node.getFlexGrow(),
      node.getComputedLayout(),
    )
    child.layout = {
      ...child.layout,
      ...node.getComputedLayout()
    }

    const direction = node.getFlexDirection()
    if (direction === Yoga.FLEX_DIRECTION_COLUMN) {
      node.setWidth(child.layout.width)
    } else if (direction === Yoga.FLEX_DIRECTION_ROW) {
      node.setHeight(child.layout.height)
    }
    calcLayout(child, node)
  })
}

const jsxToXml = (element: JSX.Element) => {
  const reactXml = ReactDOMServer.renderToString(element)
  const xmlStructure = convert.xml2js(reactXml)
  delete xmlStructure.elements[0].attributes['data-reactroot']
  return convert.js2xml(xmlStructure)
}

const render = (tree: JSX.Element) => {
  // jsx to renderer-json
  const json = testRenderer.create(tree).toJSON()!

  // output: <p:sld><p>$aa<b>bbb</b>aa</pre></p:sld>
  const slides = json.children!.map(slide => {
    calcLayout(slide)
    // console.log(JSON.stringify(slide, null, 2))
    const relationships: Relationship[] = [
      {
        rId: 1,
        type: 'slideLayout',
        id: 1
      }
    ]
    store.slides.push({
      relationships
    })
    const result = jsxToXml(renderer(slide, relationships))
    // console.log(result)
    return {
      content: result,
      relationships: store.slides[store.slides.length - 1].relationships
    }
  })

  // console.log(JSON.stringify(store, null, 2))
  // console.log(result)
  return {
    slides,
    charts: store.charts
    // config
  }
}

export default render
