const React = require('react')
const generate = require('./generate')

const data = [
  ['Date', 'PV'],
  ['7/24', '123123'],
  ['7/25', '98329'],
  ['7/25', '98329'],
]

const PageHeader = ({ title, description }) => {
  return <>
    <text color="333333" fontSize={16} bold height={320000}>{title}</text>
    <text color="666666" fontSize={12} height={714500}>{description}</text>
  </>
}

const tree = (
  <presentation>
    <slide padding={300000}>
      <PageHeader title="タイトル" description="説明文" />
      <table flexGrow={1}>
        {data.map(function(row, rowIndex) {
          return (
            <tr flexGrow={1}>
              {row.map(function(cell) {
                return <td flexGrow={1} backgroundColor={rowIndex === 0 ? 'aabbcc' : 'ffffff'}>{cell}</td>
              })}
            </tr>
          )
        })}
      </table>
      <text color="666666" fontSize={12} height={320000}>ページの説明文がきます。</text>
    </slide>
    <slide>
      <PageHeader title="ページごとにタイトルを変えたいことってあるよね" description="説明文も書ける" />
    </slide>
  </presentation>
)

generate(tree)
