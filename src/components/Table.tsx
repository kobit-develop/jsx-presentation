import * as React from 'react'
import { LayoutedTestRendererJSON } from '../render'
const h = React.createElement

const renderTableText = (attrs: any, text: React.ReactNode[]) => {
  return h('a:txBody', {}, [
    h('a:bodyPr', {}),
    h('a:lstStyle', {}),
    h('a:p', {}, [
      h('a:r', {}, [
        h('a:rPr', {
          kumimoji: '1',
          lang: 'en-US',
          altLang: 'ja-JP',
          dirty: '0'
        }),
        h('a:t', {}, text)
      ])
    ])
  ])
}

const renderTableCell = (attrs: any, children: React.ReactNode[]) => {
  const cellProps = [
    attrs.backgroundColor &&
    h('a:solidFill', {}, [
      h('a:srgbClr', { val: attrs.backgroundColor }, [h('a:alpha', { val: '100.00%' })])
    ])
  ].filter(property => property)

  return h('a:tc', {}, [
    ...children,
    h('a:tcPr', {}, cellProps)
  ])
}

const renderTableRow = (attrs: any, children: React.ReactNode[]) => {
  return h('a:tr', { h: attrs.rowHeight }, [
    ...children,
    h(
      'a:extLst',
      {},
      h(
        'a:ext',
        {
          uri: '{0D108BD9-81ED-4DB2-BD59-A6C34878D82A}'
        },
        h('a16:colId', {
          'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
          val: '437548391'
        })
      )
    )
  ])
}

const render = (node: LayoutedTestRendererJSON) => {
  const { width, height, left, top } = node.layout!

  if (!node.children) {
    return null
  }
  // FIXME
  const rows: {
    props: any
    layout: any
    children: any[]
  }[] = node.children as any
  const headerRow = rows[0]
  node.children.forEach(row => {
    if (typeof row !== 'string' && row.type !== 'tr') {
      throw 'invalid child type'
    }
  })


  return h('p:graphicFrame', {}, [
    h('p:nvGraphicFramePr', {}, [
      h(
        'p:cNvPr',
        { id: 5, name: '' },
        h(
          'a:extLst',
          {},
          h(
            'a:ext',
            {
              uri: '{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}'
            },
            h('a16:creationId', {
              'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
              id: '{92AAE84F-803D-E245-98DC-00F487834F90}'
            })
          )
        )
      ),
      h('p:cNvGraphicFramePr', {}, h('a:graphicFrameLocks', { noGrp: 1 })),
      h(
        'p:nvPr',
        {},
        h(
          'p:extLst',
          {},
          h(
            'p:ext',
            { uri: '{D42A27DB-BD31-4B8C-83A1-F6EECF244321}' },
            h('p14:modId', {
              'xmlns:p14': 'http://schemas.microsoft.com/office/powerpoint/2010/main',
              val: '371321172'
            })
          )
        )
      )
    ]),
    h('p:xfrm', {}, [h('a:off', { x: left, y: top }), h('a:ext', { cx: width, cy: height })]),
    h(
      'a:graphic',
      {},
      h(
        'a:graphicData',
        {
          uri: 'http://schemas.openxmlformats.org/drawingml/2006/table'
        },
        h('a:tbl', {}, [
          h(
            'a:tblPr',
            {
              firstRow: 1,
              bandRow: 1
            }
            // NOTE: tableStyles.xml に定義すると使えるようになる。
            // h('a:tableStyleId', {}, '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}')
          ),
          h(
            'a:tblGrid',
            {},
            headerRow.children.map((cell) => {
              return h(
                'a:gridCol',
                { w: cell.layout!.width },
                h(
                  // https://docs.microsoft.com/ja-jp/dotnet/api/documentformat.openxml.drawing.extensionlist?view=openxml-2.8.1
                  'a:extLst',
                  {},
                  h(
                    'a:ext',
                    { uri: '{9D8B030D-6E8A-4147-A177-3AD203B41FA5}' },
                    h('a16:colId', {
                      'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
                      val: '1113064350'
                    })
                  )
                )
              )
            })
          ),
          rows.map(row => {
            return renderTableRow(
              { rowHeight: row.layout.height },
              row.children.map(cell => {
                return renderTableCell(cell.props, [renderTableText({}, cell.children)])
              })
            )
          })
        ])
      )
    )
  ])
}

export default render
