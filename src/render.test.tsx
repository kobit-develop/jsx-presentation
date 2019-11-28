import React from 'react'
import render, { renderSlide } from './render'
import buildTree, { composeNodeTree } from './buildTree'
import testRenderer from 'react-test-renderer'
import Yoga from 'yoga-layout'
import { Slide, Text, Fragment } from '.'
import { LayoutedTestRendererJSON } from '../lib/render'
import { Presentation } from './components/Presentation'

const logNode = (node: Yoga.Node, level = 0) => {
  const { left, top, width, height } = node.getComputedLayout()
  console.log(`[${level}] `, { left, top, width, height }, node.getChildCount())
  for (let i = 0; i < node.getChildCount(); i++) {
    logNode(node.getChild(i), level + 1)
  }
}

const mm = 36000

describe('render', () => {
  it('has default relationship', () => {
    const json = testRenderer.create(<Slide><Text>aa</Text></Slide>).toJSON()
    const { relationships } = renderSlide(json!, {
      slides: [],
      charts: []
    })
    expect(relationships).toMatchObject([{
      rId: 1, type: 'slideLayout', id: 1
    }])
  })

  it('generate slide json', () => {
    const { slides } = render(<Presentation>
      <Slide>
        <Text>Hello World</Text>
      </Slide>
    </Presentation>)
    expect(slides.length).toBe(1)
    expect(slides[0].relationships.length).toBe(1)
    expect(slides[0].relationships[0].type).toBe('slideLayout')
  })

  it('Compose layout tree', () => {
    const tree = <Slide padding={15}>
      <Text height={30}>a<i>a</i></Text>
      <Fragment flexGrow={1}>
        <chart />
      </Fragment>
      <Text height={20}>aa</Text>
    </Slide>
    const json = testRenderer.create(tree).toJSON()
    const result = buildTree(json, {
      charts: [],
      slides: []
    })
    const node = composeNodeTree(json!)
    node.setWidth(9144000)
    node.setHeight(6858000)
    node.calculateLayout()
    const children = result.children as LayoutedTestRendererJSON[]
    expect(children[0].type).toBe("text")
    expect(children[0].layout.height).toBe(30 * mm)
    expect(children[1].layout.height).toBe(6858000 - 30 * mm - 20 * mm - 15 * 2 * mm)
    expect(children[2].layout.height).toBe(20 * mm)
    expect(children[2].layout.width).toBe(9144000 - 15 * 2 * mm)
  })
})
