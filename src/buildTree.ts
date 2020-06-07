import { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer'
import yoga, { YogaNode } from 'yoga-layout'
import { LayoutedTestRendererJSON, Store } from './render'

export interface LayoutProps {
  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  margin?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  width?: number
  height?: number
  flexGrow?: number
  flexDirection?: 'row' | 'column'
  position?: 'relative' | 'absolute'
  top?: number
  right?: number
  bottom?: number
  left?: number
}

/**
 * Convert mm to EMUs(English Metric Units)
 * @return {number} converted value
 */
const mmToEmus = (mm: number): number => {
  return Math.round(mm * 36000)
}

const composeYogaNode = (tree: ReactTestRendererJSON) => {
  const node = yoga.Node.create()

  if (tree.type === 'tr') {
    node.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  }

  const { flexGrow, flexDirection, height, width,
    padding, paddingTop, paddingRight, paddingBottom, paddingLeft,
    margin, marginTop, marginRight, marginBottom, marginLeft, position,
    top, right, bottom, left
  } = tree.props as LayoutProps

  if (flexDirection) {
    node.setFlexDirection({
      row: yoga.FLEX_DIRECTION_ROW,
      column: yoga.FLEX_DIRECTION_COLUMN
    }[flexDirection])
  }
  if (padding) node.setPadding(yoga.EDGE_ALL, mmToEmus(padding))
  if (paddingTop) node.setPadding(yoga.EDGE_TOP, mmToEmus(paddingTop))
  if (paddingRight) node.setPadding(yoga.EDGE_RIGHT, mmToEmus(paddingRight))
  if (paddingBottom) node.setPadding(yoga.EDGE_BOTTOM, mmToEmus(paddingBottom))
  if (paddingLeft) node.setPadding(yoga.EDGE_LEFT, mmToEmus(paddingLeft))
  if (margin) node.setMargin(yoga.EDGE_ALL, mmToEmus(margin))
  if (marginTop) node.setMargin(yoga.EDGE_TOP, mmToEmus(marginTop))
  if (marginRight) node.setMargin(yoga.EDGE_RIGHT, mmToEmus(marginRight))
  if (marginBottom) node.setMargin(yoga.EDGE_BOTTOM, mmToEmus(marginBottom))
  if (marginLeft) node.setMargin(yoga.EDGE_LEFT, mmToEmus(marginLeft))
  if (top) node.setPosition(yoga.EDGE_TOP, mmToEmus(top))
  if (right) node.setPosition(yoga.EDGE_TOP, mmToEmus(right))
  if (bottom) node.setPosition(yoga.EDGE_TOP, mmToEmus(bottom))
  if (left) node.setPosition(yoga.EDGE_LEFT, mmToEmus(left))
  if (position) {
    node.setPositionType({
      relative: yoga.POSITION_TYPE_RELATIVE,
      absolute: yoga.POSITION_TYPE_ABSOLUTE
    }[position])
  }

  if (height) {
    node.setHeight(mmToEmus(height))
  }
  if (width) {
    node.setWidth(mmToEmus(width))
  }
  if (flexGrow) {
    node.setFlexGrow(flexGrow)
  }

  return { node, stop: tree.type === 'text' }
}

export const composeNodeTree = (tree: ReactTestRendererJSON, depth = 0) => {
  const { node, stop } = composeYogaNode(tree)
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

const convertRelativeToAbsolute = (tree: LayoutedTestRendererJSON, position: {
  top: number,
  left: number
} = {
    top: 0,
    left: 0
  }) => {
  if (!tree.layout || !tree.children) { return }
  tree.layout.left += position.left
  tree.layout.top += position.top
  const { left, top } = tree.layout
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

