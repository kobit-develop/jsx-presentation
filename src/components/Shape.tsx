import * as React from 'react'
import { LayoutedTestRendererJSON } from '../render'
import { LayoutProps } from '../buildTree'
const h = React.createElement

export const Shape: React.FC<Partial<ShapeProps> & LayoutProps> = ({ children, ...props }) => {
  return <shape {...props}>{children}</shape>
}

// TODO: gradient
type FillType = string

export interface ShapeProps {
  fill: FillType
}

const renderFill = (fill?: FillType) => {
  if (!fill) {
    return h('a:noFill')
  }

  return h('a:solidFill', {},
    h('a:srgbClr', { val: fill }, h('a:alpha', { val: '100%' }))
  )
}

export const ShapeXML: React.FC<Partial<ShapeProps> & {
  width: number
  height: number
  top: number
  left: number
}> = (props) => {
  const { fill } = props
  const { width, height, left, top } = props

  return h('p:sp', {},
    // Non-Visual Properties for a Shape
    h('p:nvSpPr', {},
      h('p:cNvPr', {
        id: 4,
        name: ''
      }),
      h('p:cNvSpPr', {
        txBox: 1
      }),
      h('p:nvPr')
    ),
    h(
      'p:spPr',
      {},
      h('a:xfrm', {},
        h('a:off', { x: left, y: top }),
        h('a:ext', { cx: width, cy: height })
      ),
      // Preset geometry
      h('a:prstGeom', { prst: 'rect' }, h('a:avLst')),
      renderFill(fill)
    ),
    props.children
  )
}

export const buildXML = (node: LayoutedTestRendererJSON) => {
  const shapeProps = (node.props as Partial<ShapeProps>)
  return <ShapeXML {...shapeProps} {...node.layout!} />
}