const React = require('react')
const ReactDOMServer = require('react-dom/server')
const testRenderer = require('react-test-renderer')
const format = require('xml-formatter');
const convert = require('xml-js')
const h = React.createElement

// input
// jsx to renderer-json
const json = testRenderer.create(
  <slide>
    <text>
      aabbaa
    </text>
  </slide>
).toJSON()

// TODO: Calc layout props

// renderer-json to xml
const renderer = (node) => {
  if (typeof(node) == 'string') return node
  switch(node.type) {
    case 'slide':
      return h('p:sld', {
        'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
      }, [
        h('p:cSld', {},
          h('p:spTree', {}, [
            h('p:nvGrpSpPr', {}, [
              h('p:cNvPr', {id: 1, name: ''}),
              h('p:cNvGrpSpPr'),
              h('p:nvPr')
            ]),
            h('p:grpSpPr', {},
              h('a:xfrm', {} , [
                h('a:off', {x: "1619250", y: "1714500"}),
                h('a:ext', {cx: "7334250", cy: "4572000"}),
                h('a:chOff', {x: "1619250", y: "1714500"}),
                h('a:chExt', {cx: "7334250", cy: "4572000"})
              ]),
            ),
            ...node.children.map(child => renderer(child)),
          ])
        ),
        h('p:clrMapOvr', {}, [
          h('a:masterClrMapping'),
        ]),
      ])
    case 'text':
      return h('p:sp', {},
        [
          h('p:nvSpPr', {},
            [
              h('p:cNvPr', {
                id: 1,
                name: ""
              }),
              h('p:cNvSpPr', {
                txBox: 1
              }),
              h('p:nvPr')
            ]
          ),
          h('p:spPr', {},
            h('a:xfrm', {}, [
              h('a:off', {x: "1619250", y: "1714500"}),
              h('a:ext', {cx: "5715000", cy: "2857500"}),
            ]),
            h('a:prstGeom', {prst: "rect"} , [
              h('a:avLst')
            ]),
            h('a:noFill'),
          ),
          h('p:txBody', {}, [
            h('a:bodyPr', {
              rtlCol: 0,
              bIns: "45720",
              lIns: "91440",
              rIns: "91440",
              tIns: "45720"
            }, h('a:spAutoFit')),
            h('a:lstStyle'),
            h('a:p', {}, [
              h('a:pPr', {
                algn: "l",
                fontAlgn: "base",
                marL: "0",
                marR: "0",
                indent: "0",
                lvl: "0"
              },
                h('a:lnSpc', {},
                  h('a:spcPct', { val: '100%'})
                )
              ),
              h('a:r', {}, [
                h('a:rPr', {
                  lang: 'en-US',
                  b: 1,
                  sz: 6000,
                  spc: 0,
                  u: 'none'
                }, [
                  h('a:solidFill', {},
                    h('a:srgbClr', { val: 'E06B20'},
                      h('a:alpha', { val: '100.00%' })
                    )
                  ),
                  h('a:latin', { typeface: 'Calibri'})
                ]),
                h('a:t', {
                  dangerouslySetInnerHTML: {
                    __html: node.children
                  }
                })
              ])
            ])
          ])
        ]
      )
      // <p>{node.children.map(child => renderer(child))}</p>
    case 'bold':
      return <b dangerouslySetInnerHTML={{__html: ""}}>{node.children}</b>
    default:
      console.log('unknown node: ' + node.type)
      return <img src=""/>
  }
  return null
}

// output: <p:sld><p>$aa<b>bbb</b>aa</pre></p:sld>
const reactXml = ReactDOMServer.renderToString(renderer(json))

// Remove closing tag
const resultXml = convert.js2xml(convert.xml2js(reactXml))

module.exports = format(resultXml)
