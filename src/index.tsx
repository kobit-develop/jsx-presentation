import React from 'react'
import generate from './generate'
import { Text } from './components/Text'
import { Chart } from './components/Chart'
import { Table, TableRow, TableCell } from './components/Table'
import { LayoutProps } from './render'

const data = [['Date', 'PV'], ['7/24', '123123'], ['7/25', '98329'], ['7/25', '98329']]

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <Text color="333333" fontSize={16} bold height={320000}>
        {title}
      </Text>
      <Text color="666666" fontSize={12} height={714500}>
        {description}
      </Text>
    </>
  )
}

const Slide: React.FC<LayoutProps> = ({ children, ...props }) => <slide {...props}>{children}</slide>

const tree = (
  <presentation>
    <Slide padding={600000}>
      <PageHeader title="グラフに対応しました" description="説明文も書ける" />
      <Table flexGrow={1}>
        {data.map((row, rowIndex) => {
          return (
            <TableRow flexGrow={1}>
              {row.map(function (cell) {
                return (
                  <TableCell flexGrow={1} backgroundColor={rowIndex === 0 ? 'aabbcc' : 'ffffff'}>
                    {cell}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </Table>
    </Slide>
    <Slide padding={300000}>
      <PageHeader title="グラフに対応しました" description="説明文も書ける" />
      <Chart
        data={{
          labels: ['Mon', 'Tue', 'Wed'],
          datasets: [
            {
              label: 'PC',
              data: [30, 23, 28]
            },
            {
              label: 'SP',
              data: [23, 21, 25]
            },
            {
              label: 'tablet',
              data: [5, 6, 9]
            },
            {
              label: 'aafeofkoef',
              data: [1, 2, 3]
            }
          ]
        }}
        flexGrow={1}
      />
    </Slide>
  </presentation>
)

generate(tree, {
  dryRun: false
})