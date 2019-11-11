import React from 'react'
import render, { renderSlide } from './render'
import { composeLayoutedTree, composeNodeTree } from './buildTree'
import testRenderer from 'react-test-renderer'
import Yoga from 'yoga-layout'

const logNode = (node: Yoga.Node, level = 0) => {
  const { left, top, width, height } = node.getComputedLayout()
  console.log(`[${level}] `, { left, top, width, height }, node.getChildCount())
  for (let i = 0; i < node.getChildCount(); i++) {
    logNode(node.getChild(i), level + 1)
  }
}

describe('render', () => {
  it('has default relationship', () => {
    const json = testRenderer.create(<slide><text>aa</text></slide>).toJSON()
    const { relationships } = renderSlide(json!, {
      slides: [],
      charts: []
    })
    console.log(relationships)
    expect(relationships).toMatchObject([{
      rId: 1, type: 'slideLayout', id: 1
    }])
  })

  it('generate slide json', () => {
    const { slides } = render(<presentation>
      <slide><text>Hello World</text></slide>
    </presentation>)
    expect(slides.length).toBe(1)
    expect(slides[0].relationships.length).toBe(1)
  })

  it('Compose layout tree', () => {
    const tree = <slide padding={30000}>
      <text height={100000}>a<i>a</i></text>
      <div flexGrow={1}><chart /></div>
      <text height={200000}>aa</text>
    </slide>
    const json = testRenderer.create(tree).toJSON()
    const node = composeNodeTree(json!)
    node.setWidth(9144000)
    node.setHeight(6858000)
    node.calculateLayout()
    // logNode(node)
    const layoutJSON = composeLayoutedTree(json!, node)
    expect(layoutJSON.children[0].type).toBe("text")
    expect(layoutJSON.children[0].layout.height).toBe(100000)
    expect(layoutJSON.children[1].layout.height).toBe(6858000 - 100000 - 200000 - 60000)
    expect(layoutJSON.children[2].layout.height).toBe(200000)
    expect(layoutJSON.children[2].layout.width).toBe(9144000 - 60000)
  })
})
