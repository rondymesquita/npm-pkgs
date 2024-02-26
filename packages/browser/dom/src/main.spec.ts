// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'

import { domToJSONML } from './main'

const parser = new DOMParser()

const getDOM = (html: string) => {
  const dom = parser.parseFromString(html, 'text/html')
  return dom.body.querySelectorAll('*')[0]! as HTMLElement
}

describe('main', () => {
  it('should parse tag', () => {
    const html = `
			<div>
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div',])
  })
  it('should parse tag, content', () => {
    const html = `
			<div>
				App
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div', 'App',])
  })
  it('should parse tag, attributes', () => {
    const html = `
			<div id="app">
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div', { id: 'app', },])
  })
  it('should parse tag, attributes and content', () => {
    const html = `
			<div id="app" class="theme--dark" style="color:blue; font-size:46px;">
				App
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));

    expect(jsonml).toEqual([
      'div',
      {
        id: 'app',
        class: 'theme--dark',
        style: 'color:blue; font-size:46px;',
      },
      'App',
    ])
  })
  it('should parse tag, child', () => {
    const html = `
			<div>
				<h1></h1>
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div', ['h1',],])
  })
  it('should parse tag, child and content', () => {
    const html = `
			<div>
				<h1></h1>
				App
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div', ['h1',], 'App',])
  })
  it('should parse tag, child with content', () => {
    const html = `
			<div>
				<h1>App</h1>
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));
    expect(jsonml).toEqual(['div', ['h1', 'App',],])
  })
  it('should parse tag, attributes', () => {
    const html = `
			<div id="app" class="theme--dark" style="color:blue; font-size:46px;">
			</div>
		`
    const jsonml = domToJSONML(getDOM(html));

    expect(jsonml).toEqual([
      'div',
      {
        id: 'app',
        class: 'theme--dark',
        style: 'color:blue; font-size:46px;',
      },
    ])
  })
  it('should parse tag, attributes, childs and content', () => {
    const html = `
    	<div id="app">
    		App
    		<h1>hello world</h1>
    		<section>
    			<h2>subtitle</h2>
    			<p>paragraph</p>
    		</section>
    	</div>
    `
    const jsonml = domToJSONML(getDOM(html));

    expect(jsonml).toEqual([
      'div',
      { id: 'app', },
      ['h1', 'hello world',],
      ['section', ['h2', 'subtitle',], ['p', 'paragraph',],],
      'App',
    ])
  })
  it('should parse tag, attributes, childs', () => {

    const html = `
		<ul>
			<li style="color:red">First Item</li>
			<li title="Some hover text." style="color:green">
				Second Item
			</li>
			<li>
				<span class="code-example-third">Third</span>
				Item
			</li>
		</ul>
    `
    const jsonml = domToJSONML(getDOM(html));

    expect(jsonml).toEqual([
      'ul',
      [
        'li',
        { 'style' : 'color:red', },
        'First Item',
      ],
      [
        'li',
        {
          'title' : 'Some hover text.',
          'style' : 'color:green',
        },
        'Second Item',
      ],
      [
        'li',
        [
          'span',
          { 'class' : 'code-example-third', },
          'Third',
        ],
        'Item',
      ],
    ])
  })
})
