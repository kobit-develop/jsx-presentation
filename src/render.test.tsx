import React from 'react'
import render, { renderSlide } from './render'
import testRenderer from 'react-test-renderer'

describe('render', () => {
  it('has default relationship', () => {
    const json = testRenderer.create(<slide><text>aa</text></slide>).toJSON()
    const { relationships } = renderSlide(json!, {
      slides: [],
      charts: []
    })
    console.log(relationships)
    expect(relationships).toMatchObject([{
      rId: 1, type: 'slideLayout', id: 1
    }])
  })

  it('generate slide json', () => {
    const { slides } = render(<presentation>
      <slide><text>Hello World</text></slide>
    </presentation>)
    expect(slides.length).toBe(1)
    expect(slides[0].relationships.length).toBe(1)
  })
})
