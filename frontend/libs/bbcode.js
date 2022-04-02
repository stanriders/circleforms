import { createPreset } from '@bbob/preset'
import { getUniqAttr, isStringNode, isTagNode } from '@bbob/plugin-helper'
import TagNode from '@bbob/plugin-helper/lib/TagNode'

const isStartsWith = (node, type) => (node[0] === type)

const styleMap = {
  color: (val) => `color:${val}`,
  size: (val) => `font-size:${val}`,
}

const getStyleFromAttrs = (attrs) => Object
  .keys(attrs)
  .reduce((acc, key) => (styleMap[key] ? acc.concat(styleMap[key](attrs[key])) : acc), [])
  .join(' ')

const asListItems = (content) => {
  let listIdx = 0
  const listItems = []

  const createItemNode = () => TagNode.create('li')
  const ensureListItem = (val) => {
    listItems[listIdx] = listItems[listIdx] || val
  }
  const addItem = (val) => {
    if (listItems[listIdx] && listItems[listIdx].content) {
      listItems[listIdx].content = listItems[listIdx].content.concat(val)
    } else {
      listItems[listIdx] = listItems[listIdx].concat(val)
    }
  }

  content.forEach((el) => {
    if (isStringNode(el) && isStartsWith(el, '*')) {
      if (listItems[listIdx]) {
        listIdx++
      }
      ensureListItem(createItemNode())
      addItem(el.substr(1))
    } else if (isTagNode(el) && TagNode.isOf(el, '*')) {
      if (listItems[listIdx]) {
        listIdx++
      }
      ensureListItem(createItemNode())
    } else if (!isTagNode(listItems[listIdx])) {
      listIdx++
      ensureListItem(el)
    } else if (listItems[listIdx]) {
      addItem(el)
    } else {
      ensureListItem(el)
    }
  })

  return [].concat(listItems)
}

const renderUrl = (node, render) => (getUniqAttr(node.attrs)
  ? getUniqAttr(node.attrs)
  : render(node.content))

const toNode = (tag, attrs, content) => ({
  tag,
  attrs,
  content,
})

const toStyle = (style) => ({ style })

export default createPreset({
  b: (node) => toNode('span', toStyle('font-weight: bold'), node.content),
  i: (node) => toNode('span', toStyle('font-style: italic'), node.content),
  u: (node) => toNode('span', toStyle('text-decoration: underline'), node.content),
  s: (node) => toNode('span', toStyle('text-decoration: line-through'), node.content),
  url: (node, { render }, options) => toNode('a', {
    href: renderUrl(node, render, options),
  }, node.content),
  img: (node, { render }) => toNode('img', {
    src: render(node.content),
  }, null),
  quote: (node) => toNode('blockquote', {}, [toNode('p', {}, node.content)]),
  code: (node) => toNode('pre', {}, node.content),
  style: (node) => toNode('span', toStyle(getStyleFromAttrs(node.attrs)), node.content),
  list: (node) => {
    const type = getUniqAttr(node.attrs)
    console.log(type)
    const types = {
      1: 'decimal',
      a: 'lower-alpha',
      A: 'upper-alpha',
      i: 'lower-roman',
      I: 'upper-roman'
    }

    return toNode('ol', {
      style: `list-style-type: ${types[type] || 'decimal'}`
    }, asListItems(node.content))
  },
  centre: (node) => ({
    tag: 'center',
    attrs: node.attrs,
    content: [{
      tag: 'p',
      attrs: {},
      content: node.content
    }]
  }),
  color: (node) => ({
    tag: 'span',
    attrs: {
      style: `color: ${Object.keys(node.attrs)[0]};`
    },
    content: node.content
  }),
  size: (node) => ({
    tag: 'span',
    attrs: {
      style: `font-size: ${Object.keys(node.attrs)[0]}px;`
    },
    content: node.content
  }),
  spoilerbox: (node) => ({
    tag: 'span',
    attrs: {
      style: `background-color: #FFFFFF;`
    },
    content: node.content
  }),
  heading: (node) => ({
    tag: 'h3',
    content: node.content
  }),
  notice: (node) => ({
    tag: 'div',
    attrs: {
      class: 'notice'
    },
    content: node.content
  }),
})

/**
 * Unsupported osu! BBCode (https://osu.ppy.sh/wiki/en/BBCode)
 * - [box=NAME]text[/box]
 * - [profile=userid]username[/profile]
 * - [youtube]VIDEO_ID[/youtube]
 * - [audio]URL[/audio]
 */