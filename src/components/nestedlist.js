import React from "react"
import { Link } from "gatsby"

function ConditionalLink({to, children, nolink}) {
  const ret = nolink
        ? <>{children}</>
        : <Link to={to} activeClassName="index-active">{children}</Link>
  return (ret) 
}

export default function NestedList({idx, items, level}) {
  var ret = []
  var i = idx
  while (i < items.length) {
    const item = items[i]
    const labelSpan = item.label.length === 0 ? <></ > : <span className="label-string">{item.label}</span>
    if (item.level === level) {
      var foo =  ""
      if (i + 1 < items.length && items[i + 1].level > level) {
        foo = <NestedList key={i + 1} items={items} level={level + 1} idx={i + 1} />
      }
      // See https://github.com/facebook/react/issues/14725#issuecomment-460378418
      ret.push(
          // <li key={i}><ConditionalLink to={item.link} nolink={item.hide}>{labelSpan} {item.title}</ConditionalLink>{foo}</li>
          <li key={i}><ConditionalLink to={item.link} nolink={item.hide}>{labelSpan}{` ${item.title}`}</ConditionalLink>{foo}</li>
      )
      i++
      while (i < items.length && items[i].level > level)
        i++
    } else {
      break
    }
  }
  return (<ul>{ret}</ul>)
}
