import React from 'react'
import generate from './generate'

const data = [['Date', 'PV'], ['7/24', '123123'], ['7/25', '98329'], ['7/25', '98329']]

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <text color="333333" fontSize={16} bold height={320000}>
        {title}
      </text>
      <text color="666666" fontSize={12} height={714500}>
        {description}
      </text>
    </>
  )
}

const tree = (
  <presentation>
    <slide padding={300000}>
      <PageHeader title="グラフに対応しました" description="説明文も書ける" />
      <chart
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
      ></chart>
    </slide>
  </presentation>
)

generate(tree, {
  dryRun: false
})
