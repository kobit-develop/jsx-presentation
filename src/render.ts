import fs from 'fs'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import testRenderer, { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import { YogaNode } from 'yoga-layout'

import Table from './components/Table'
import Text from './components/Text'
import Chart from './components/Chart'

import { render as renderChart } from './charts'
import buildTree from './buildTree'

export interface LayoutedTestRendererJSON extends ReactTestRendererJSON {
  layout?: {
    width: number
    height: number
    left: number
    top: number
  }
}

const h = React.createElement

export interface Store {
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
    case 'fragment':
      if (!node.children) throw 'Framgent must have children'
      return node.children.map(child => renderer(child))
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

export interface LayoutProps {
  padding?: number
  width?: number
  height?: number
  flexGrow?: number
  flexDirection?: 'row' | 'column'
}

const logNode = (node: YogaNode, depth = 0) => {
  const { left, top, width, height } = node.getComputedLayout()
  const flexGrow = node.getFlexGrow()
  console.log('  '.repeat(depth), {
    left, top, width, height, flexGrow
  })

  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i)
    logNode(child, depth + 1)
  }
}

export const renderSlide = (rendererJSON: ReactTestRendererJSON, store: Store) => {
  const tree = buildTree(rendererJSON, store)
  const relationships: Relationship[] = [
    { rId: 1, type: 'slideLayout', id: 1 }
  ]
  store.slides.push({ relationships })
  const resultJSX = renderer(tree, relationships)
  const result = jsxToXml(resultJSX)
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
