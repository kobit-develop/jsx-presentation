import { ReactTestRendererJSON } from 'react-test-renderer'
import { flattenText, renderParagraph } from './Text'
import react2xml from 'react2xml'

const tree = {
  type: 'text',
  props: { fontSize: 12 },
  children: [
    {
      type: 'text',
      props: { color: 'ff0000' },
      children: [
        'Hello',
        {
          type: 'br',
          props: {},
        },
        'World'
      ]
    },
    {
      type: 'br',
      props: {}
    },
    'everyone'
  ]
} as ReactTestRendererJSON

describe('flattenText', () => {
  it('make a flat array', () => {
    const result = flattenText(tree)
    expect(result).toHaveLength(5)
    expect(result[0].text).toBe('Hello')
    expect(result[1].type).toBe('br')
    expect(result[2].text).toBe('World')
    expect(result[3].type).toBe('br')
    expect(result[4].text).toBe('everyone')
  })

  it('make text nodes with inherited props', () => {
    const result = flattenText(tree)
    expect(result).toHaveLength(5)
    expect(result[0].props.fontSize).toBe(12)
    expect(result[2].props.fontSize).toBe(12)
    expect(result[4].props.fontSize).toBe(12)
    expect(result[0].props.color).toBe('ff0000')
    expect(result[2].props.color).toBe('ff0000')
    expect(result[4].props.color).not.toBe('ff0000')
  })
})

describe('renderParagraph', () => {
  it('generate xmlNode with text', () => {
    const xmlNode = renderParagraph(tree)
    const xml = react2xml(xmlNode)

    expect(xml.includes('a:r')).toBe(true)
    expect(xml.includes('a:br')).toBe(true)
    expect(xml.includes('Hello')).toBe(true)
    expect(xml.includes('World')).toBe(true)
    expect(xml.includes('everyone')).toBe(true)
  })
})