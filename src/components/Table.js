const React = require('react')
const h = React.createElement

const render = node => {
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
    h('p:xfrm', {}, [
      h('a:off', { x: 1028147, y: 2200598 }),
      h('a:ext', { cx: 8128000, cy: 741680 })
    ]),
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
          h('a:tblGrid', {}, [
            h(
              'a:gridCol',
              { w: 4064000 },
              h(
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
            ),
            h(
              'a:gridCol',
              { w: 4064000 },
              h(
                'a:extLst',
                {},
                h(
                  'a:ext',
                  { uri: '{9D8B030D-6E8A-4147-A177-3AD203B41FA5}' },
                  h('a16:colId', {
                    'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
                    val: '1904549289'
                  })
                )
              )
            )
          ]),
          h('a:tr', { h: 370840 }, [
            h('a:tc', {}, [
              h('a:txBody', {}, [
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
                    h('a:t', {}, 1)
                  ]),
                  h('a:endParaRPr', {
                    kumimoji: '1',
                    lang: 'ja-JP',
                    altLang: 'en-US'
                  })
                ])
              ]),
              h('a:tcPr', {})
            ]),
            h('a:tc', {}, [
              h('a:txBody', {}, [
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
                    h('a:t', {}, 2)
                  ]),
                  h('a:endParaRPr', {
                    kumimoji: '1',
                    lang: 'ja-JP',
                    altLang: 'en-US'
                  })
                ])
              ]),
              h('a:tcPr', {})
            ]),
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
          ]),
          h(
            'a:tr',
            {
              h: '370840'
            },
            [
              h('a:tc', {}, [
                h('a:txBody', {}, [
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
                      h('a:t', {}, 3)
                    ]),
                    h('a:endParaRPr', {
                      kumimoji: '1',
                      lang: 'ja-JP',
                      altLang: 'en-US'
                    })
                  ])
                ]),
                h('a:tcPr', {})
              ]),
              h('a:tc', {}, [
                h('a:txBody', {}, [
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
                      h('a:t', {}, 4)
                    ]),
                    h('a:endParaRPr', {
                      kumimoji: '1',
                      lang: 'ja-JP',
                      altLang: 'en-US'
                    })
                  ])
                ]),
                h('a:tcPr', {})
              ]),
              h(
                'a:extLst',
                {},
                h(
                  'a:ext',
                  {
                    uri: '{0D108BD9-81ED-4DB2-BD59-A6C34878D82A}'
                  },
                  h('a16:rowId', {
                    'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
                    val: '1621802109'
                  })
                )
              )
            ]
          )
        ])
      )
    )
  ])
}

module.exports = render

console.log(render())
