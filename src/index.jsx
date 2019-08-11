const React = require('react')
const generate = require('./generate')

const data = [
  ['Date', 'PV'],
  ['7/24', '123123'],
  ['7/25', '98329'],
]

const tree = (
  <slide>
    <text color="ff0000" height={1714500}>react-pptx</text>
    <table flexGrow={1}>
      {data.map(function(row, rowIndex) {
        return (
          <tr>
            {row.map(function(cell) {
              return <td backgroundColor={rowIndex === 0 ? 'aabbcc' : 'ffffff'}>{cell}</td>
            })}
          </tr>
        )
      })}
    </table>
  </slide>
)

generate(tree)
