import { h } from 'snabbdom/build/package/h'
import { VNode } from 'snabbdom/build/package/vnode'
import { subscribe } from '../store/state'
import { render } from '../lib/render'

const view = (): VNode =>
  h('div.hack', {
    style: {
      position: 'relative',
      height: '250px',
      fontFamily: 'Sans-Serif',
      color: '#fff'
    }
  }, [
    h('div.hack__title', 'Warning, stream hacking in progress...')
  ])

export const route = (): void => {
  subscribe(() => {
    render(view())
  })
  render(view())
}
