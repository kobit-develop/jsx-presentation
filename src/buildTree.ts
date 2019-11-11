import React from 'react'
import { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import yoga, { YogaNode } from 'yoga-layout'

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

export interface LayoutProps {
  padding?: number
  width?: number
  height?: number
  flexGrow?: number
  flexDirection?: 'row' | 'column'
}

const composeYogaNode = (tree: ReactTestRendererJSON) => {
  const node = yoga.Node.create()

  if (tree.type === 'tr') {
    node.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  }

  const { flexGrow, flexDirection, height, width, padding } = tree.props as LayoutProps

  if (flexDirection) {
    node.setFlexDirection({
      row: yoga.FLEX_DIRECTION_ROW,
      column: yoga.FLEX_DIRECTION_COLUMN
    }[flexDirection])
  }
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

export const composeNodeTree = (tree: ReactTestRendererJSON, depth = 0) => {
  const { node, stop } = composeYogaNode(tree)
  console.log('  '.repeat(depth), depth, tree.type, stop, tree.props)
  const { children } = tree
  if (children && children.length > 0) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (typeof child !== 'string' && !stop) {
        const childNode = composeNodeTree(child, depth + 1)
        node.insertChild(childNode, index)
      }
    }
  }
  return node
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

export const composeLayoutedTree = (tree: ReactTestRendererJSON, node: YogaNode) => {
  const { type, children } = tree
  let composedChildren: ReactTestRendererNode[] = []

  if (type === 'text') {
    composedChildren = children || []
  } else if (children) {
    // console.log(children)
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

const convertRelativeToAbsolute = (tree: any, position: {
  top: number,
  left: number
} = {
    top: 0,
    left: 0
  }) => {
  console.log(tree)
  tree.layout.left += position.left
  tree.layout.top += position.top
  const { left, top } = tree.layout
  if (!tree.layout || !tree.children) { return }
  tree.children.forEach(child => {
    if (typeof (child) === 'string') { return }
    convertRelativeToAbsolute(child, {
      top, left
    })
  })
}

const buildTree = (tree: ReactTestRendererJSON, store: Store) => {
  const nodeTree = composeNodeTree(tree)
  nodeTree.setWidth(9144000)
  nodeTree.setHeight(6858000)
  nodeTree.calculateLayout()
  const layoutJSON = composeLayoutedTree(tree, nodeTree)
  convertRelativeToAbsolute(layoutJSON)
  // logNode(nodeTree)
  return layoutJSON
}

export default buildTree

