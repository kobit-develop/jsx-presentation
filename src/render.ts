import React, { ReactElement } from 'react'
import testRenderer, { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import { YogaNode } from 'yoga-layout'
import react2xml from 'react2xml'

import { buildXML as buildTableXML } from './components/Table'
import { buildXML as buildTextXML } from './components/Text'
import { buildXML as buildChartXML } from './components/Chart'
import { buildXML as buildSlideXML } from './components/Slide'

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
const renderer = (node: ReactTestRendererJSON | string) : React.ReactElement<any, any> | string => {
  if (typeof node == 'string') return node
  switch (node.type) {
    case 'slide':
      const children = node.children!.map(child => renderer(child)) as React.ReactElement[]
      return buildSlideXML(node, children)
    case 'table':
      return buildTableXML(node)
    case 'text':
      return buildTextXML(node)
    case 'fragment':
      if (!node.children) throw 'Framgent must have children'
      return h(React.Fragment, {}, node.children.map(child => renderer(child)))
    case 'chart':
      const data = node.props.data

      const newChart = {
        id: store.charts.length + 1,
        content: react2xml(renderChart(data))
      }
      store.charts.push(newChart)

      const currentSlide = store.slides[store.slides.length - 1]
      const relationship: Relationship = {
        type: 'chart',
        rId: currentSlide.relationships.length + 1,
        id: newChart.id
      }

      currentSlide.relationships.push(relationship)

      return buildChartXML(node, relationship)
    default:
      throw new Error('Unknown node: ' + node.type)
  }
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
  const resultJSX = renderer(tree) as React.ReactElement
  const result = react2xml(resultJSX)
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
