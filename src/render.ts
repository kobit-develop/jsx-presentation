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

const jsxToXml = (element: JSX.Element) => {
  return ReactDOMServer.renderToStaticMarkup(element)
}

const composeYogaNode = (tree: ReactTestRendererJSON) => {
  const node = yoga.Node.create()

  if (tree.type === 'tr') {
    node.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  }

  const { flexGrow, height, width, padding } = tree.props
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
  if (flexGrow) {
    node.setFlexGrow(flexGrow)
  }
  return { node, stop: tree.type === 'text' }
}

export const composeNodeTree = (tree: ReactTestRendererJSON) => {
  const { node, stop } = composeYogaNode(tree)
  const { children } = tree
  if (children && children.length > 0) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (typeof child !== 'string') {
        if (!stop) {
          const childNode = composeNodeTree(child)
          node.insertChild(childNode, index)
        }
      }
    }
  }
  return node
}

export const composeLayoutedTree = (tree: ReactTestRendererJSON, node: YogaNode) => {
  const { type, children } = tree
  let composedChildren: ReactTestRendererNode[] = []

  if (type === 'text') {
    composedChildren = children || []
  } else if (children) {
    console.log(children)
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (typeof child === 'string') {
        composedChildren.push(child)
        continue
      }
      const childNode = node.getChild(index)
      composedChildren.push(
        composeLayoutedTree(child, childNode)
      )
    }
  }

  return {
    ...tree, layout: {
      ...node.getComputedLayout()
    },
    children: composedChildren
  }

}

export const renderSlide = (tree: ReactTestRendererJSON, store: Store) => {
  const nodeTree = composeNodeTree(tree)
  nodeTree.setWidth(9144000)
  nodeTree.setHeight(6858000)
  nodeTree.calculateLayout()
  const layoutedTree = { ...composeLayoutedTree(tree, nodeTree) }

  const relationships: Relationship[] = [
    { rId: 1, type: 'slideLayout', id: 1 }
  ]
  store.slides.push({ relationships })
  const result = jsxToXml(renderer(layoutedTree, relationships))
  return {
    content: result,
    relationships: store.slides[store.slides.length - 1].relationships
  }
}

const render = (tree: JSX.Element) => {
  const json = testRenderer.create(tree).toJSON()!

  const slides = json.children!
    .filter(filterRendererJSON)
    .map(slide => renderSlide(slide, store))

  return {
    slides,
    charts: store.charts
  }
}

const filterRendererJSON = (slide: ReactTestRendererNode): slide is ReactTestRendererJSON => {
  return typeof slide !== 'string'
}

export default render
