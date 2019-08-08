const React = require('react')
const ReactDOM = require('react-dom/server')
const testRenderer = require('react-test-renderer')
const h = React.createElement

// input
// jsx to renderer-json
const json = testRenderer.create(
  <slide>
    <text>
      aa<bold>bbb</bold>aa
    </text>
  </slide>
).toJSON()

// TODO: Calc layout props

// renderer-json to xml
const renderer = (node) => {
  if (typeof(node) == 'string') return node
  switch(node.type) {
    case 'slide':
      return h('p:sld', {}, node.children.map(child => renderer(child)))
    case 'text':
      return <p>{node.children.map(child => renderer(child))}</p>
    case 'bold':
      return <b>{node.children}</b>
    default:
      console.log('unknown node: ' + node.type)
      return null
  }
  return null
}

console.log(JSON.stringify(json, null ,2))

// output: <p:sld><p>$aa<b>bbb</b>aa</p></p:sld>
console.log(
  ReactDOM.renderToStaticMarkup(renderer(json))
)
