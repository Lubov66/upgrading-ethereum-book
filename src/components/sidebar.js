import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import PageList from "./pagelist"
import "../css/sidebar.css"

const Sidebar = (props) => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: {frontmatter: {sequence: ASC}}
        filter: {frontmatter: {index: {ne: null}}}
    ) {
        edges {
          node {
            frontmatter {
              hide
              path
              titles
              index
              sequence
            }
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const pages = data.allMarkdownRemark.edges

  // List only parts and chapters and immediate children in the sidebar
  const index = props.index !== null ? props.index : []
  const filteredPages = index.length < 2
        ? pages.filter(p => p.node.frontmatter.index.length <= 2)
        : pages.filter(p => p.node.frontmatter.index.length <= 2
                       || (p.node.frontmatter.index.length === 3
                           && p.node.frontmatter.index[0] === index[0]
                           && p.node.frontmatter.index[1] === index[1]
                          )
                      )

  // console.log(JSON.stringify(filteredPages, undefined, 2))
  
  return (
    <nav className="sidebar scrollable">
      <div className="sidebar-title">
        <Link
          to="/"
        >
          {data.site.siteMetadata.title}
        </Link>
      </div>
      <div id="index">
        <PageList pages={filteredPages} depth={0} />
      </div>
    </nav>
  )
}

export default Sidebar
