const process = require('process')
const convert = require('xml-js')

process.stdin.setEncoding('utf8')

const render = node => {
  console.log(JSON.stringify(node, null, 2))
  const { type, name, text, cdata, elements, attributes } = node
  // console.log(node.type, node)
  if (type == 'text') {
    // console.log(text)
    return text
    return "'dummy'"
  }
  if (type == 'cdata') {
    // console.log(cdata)
    return cdata
    return "'dummy'"
  }
  if (type == 'element' || elements) {
    let children
    if (elements) {
      if (elements.length > 1) {
        children =
          '[' +
          elements
            .map(element => {
              console.log(element)
              return render(element)
            })
            .join(',\n') +
          ']'
      } else {
        children = render(elements[0])
      }
      // console.log('children: ', children)
    }
    // console.log(`<${name}>${children}</${name}>`)
    let attrs = ''
    if (attributes) {
      attrs = Object.keys(attributes)
        .map(key => {
          const value = attributes[key]
          return `"${key}"="${value}"`
        })
        .join(' ')
    }
    return name
      ? `h('${name}', ${attributes ? JSON.stringify(attributes, null, 2) : '{}'} ${
          children ? `, ${children}` : ''
        })`
      : children
  }
}

const run = xml => {
  const root = convert.xml2js(xml)
  return render(root)
}

process.stdin.on('readable', () => {
  let chunk
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    process.stdout.write(run(chunk))
  }
})

process.stdin.on('end', () => {})
