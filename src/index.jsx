const React = require('react')
const generate = require('./generate')

const data = [
  ['Date', 'PV'],
  ['7/24', '123123'],
  ['7/25', '98329'],
  ['7/25', '98329'],
]

const tree = (
  <presentation>
    <slide padding={300000}>
      <text color="ff0000" height={1714500}>react-pptx</text>
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
    </slide>
    <slide>
      <text color="F96332" height={1714500}>react-pptx</text>
      <text color="004480" height={1714500}>react-pptx</text>
    </slide>
  </presentation>
)

generate(tree)
