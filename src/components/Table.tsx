import * as React from 'react'
import { LayoutedTestRendererJSON, LayoutProps } from '../render'
import { renderParagraph } from './Text'
const h = React.createElement

export const Table: React.FC<LayoutProps> = ({ children, ...props }) => {
  return <table {...props}>
    {children}
  </table>
}

export const TableRow: React.FC<LayoutProps> = ({ children, ...props }) => {
  return <tr {...props}>
    {children}
  </tr>
}

interface TableCellProps {
  backgroundColor?: string
}

export const TableCell: React.FC<TableCellProps & LayoutProps> = ({ children, ...props }) => {
  return <td {...props}>
    {children}
  </td>
}

const TableTextXML : React.FC<{
  node: LayoutedTestRendererJSON
}> = ({ node }) => {
  return h('a:txBody', {},
    h('a:bodyPr', {}),
    h('a:lstStyle', {}),
    renderParagraph(node)
  )
}

const TableCellXML: React.FC<TableCellProps> = ({backgroundColor, children}) => {
  const cellProps = [
    backgroundColor &&
    h('a:solidFill', {},
      h('a:srgbClr', { val: backgroundColor }, h('a:alpha', { val: '100.00%' }))
    )
  ].filter(property => property)

  return h('a:tc', {},
    children,
    h('a:tcPr', {}, ...cellProps)
  )
}

const TableRowXML: React.FC<{
  rowHeight: number
  columnCount: number
}> = ({rowHeight, columnCount, children}) => {
  return h('a:tr', { h: rowHeight },
    children,
    h(
      'a:extLst',
      { key: columnCount },
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
  )
}

export const buildXML = (node: LayoutedTestRendererJSON) => {
  const { width, height, left, top } = node.layout!

  if (!node.children) {
    throw new Error('Table must have children')
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

  return h('p:graphicFrame', {},
    h('p:nvGraphicFramePr', {},
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
    ),
    h('p:xfrm', {},
      h('a:off', { x: left, y: top }),
      h('a:ext', { cx: width, cy: height })
    ),
    h(
      'a:graphic',
      {},
      h(
        'a:graphicData',
        {
          uri: 'http://schemas.openxmlformats.org/drawingml/2006/table'
        },
        h('a:tbl', {},
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
            headerRow.children.map((cell, key) => {
              return h(
                'a:gridCol',
                { w: cell.layout!.width, key },
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
          rows.map((row, rowIndex) => {
            return <TableRowXML rowHeight={row.layout.height} columnCount={row.children.length} key={rowIndex} >
              {row.children.map((cell, cellIndex) => {
                return <TableCellXML {...cell.props} key={cellIndex}>
                  {(cell.children as LayoutedTestRendererJSON[]).map((child, key) => <TableTextXML node={child} key={key} />)}
                </TableCellXML>
              })}
            </TableRowXML>
          })
        )
      )
    )
  )
}
