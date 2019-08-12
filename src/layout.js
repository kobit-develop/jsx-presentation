const yoga = require('yoga-layout')

const tree = {
  "type": "slide",
  "props": {},
  "children": [
    {
      "type": "text",
      "props": {
        "color": "ff0000",
      },
      "children": [
        "sample"
      ]
    },
    {
      "type": "text",
      "props": {
        "color": "ff0000",
      },
      "children": [
        "sample"
      ]
    },
    {
      "type": "text",
      "props": {
        "color": "ff0000",
      },
      "children": [
        "sample"
      ]
    },
    {
      "type": "table",
      "props": {
      },
      "children": [
        {
          "type": "tr",
          "props": {},
          "children": [
            {
              "type": "td",
              "props": {
                "backgroundColor": "aabbcc"
              },
              "children": [
                "Date"
              ]
            },
            {
              "type": "td",
              "props": {
                "backgroundColor": "aabbcc"
              },
              "children": [
                "PV"
              ]
            }
          ]
        },
        {
          "type": "tr",
          "props": {},
          "children": [
            {
              "type": "td",
              "props": {
                "backgroundColor": "aabbcc"
              },
              "children": [
                "7/24"
              ]
            },
            {
              "type": "td",
              "props": {
                "backgroundColor": "aabbcc"
              },
              "children": [
                "123123"
              ]
            }
          ]
        }
      ]
    }
  ]
}

const slideWidth = 9144000
const slideHeight = 68581

const root = yoga.Node.create()

root.setWidth(slideWidth)
root.setHeight(slideHeight)

// tree.children.map(child => {
//   console.log(child)
// })

console.log(tree)

const nodes = tree.children.map((child, index) => {
  const node = yoga.Node.create()
  const {height, flexGrow} = child.props
  if (height) {
    node.setHeight(height)
  }
  if (flexGrow) {
    node.setFlexGrow(flexGrow)
  }
  root.insertChild(node, index)
  child.layout = {
    _node: node
  }
  return node
})

root.calculateLayout(slideWidth, slideHeight)


const layout = root.getComputedLayout()

console.log(layout.left)

console.log(root.getComputedLayout())
// console.log(nodes.map(node => node.getComputedLayout()))

tree.children.map(child => {
  child.layout = child.layout._node.getComputedLayout()
  console.log(child)
})