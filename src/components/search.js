import React from 'react'
import { graphql, useStaticQuery, withPrefix } from 'gatsby'

import "../css/search.css"

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const getSearchResults = (query, data) => {

  if (query.searchText.length < 3) {
    return []
  }

  // Match the starts of words only. The "d" flag gives us the matching indices.
  const regex = RegExp('(^|\\W|_)(' + escapeRegExp(query.searchText) + ')',
                       'gd' + (query.isCaseSensitive ? '' : 'i'))

  const result = data.map( ({ node }) => {

    let pageScore = 0
    const matches = []
    for (let i = 0; i < node.chunks?.length; i++) {

      let chunk = node.chunks[i]
      let match
      const indices = []
      while ((match = regex.exec(chunk.text)) !== null) {
        indices.push([match.indices[2][0], match.indices[2][1]])
      }
      if (indices.length > 0) {
        matches.push(
          {
            type: chunk.type,
            label: chunk.label,
            id: chunk.id,
            text: chunk.text,
            indices: indices,
          }
        )
        pageScore += chunk.weight * indices.length
      }
    }

    return matches.length === 0 ? null : {
      url: node.frontmatter.path,
      title: node.frontmatter.titles.filter(x => x).join(' | '),
      matches: matches,
      score: pageScore,
    }
  })

  return result.filter(x => x).sort((a, b) => (b.score - a.score))
}

const Search = () => {

  const queryData = useStaticQuery(graphql`
    query {
      allMySearchData {
        edges {
          node {
            frontmatter {
              path
              titles
            }
            chunks
          }
        }
      }
    }
  `)

  const searchData = queryData.allMySearchData.edges

  const [searchQuery, setQuery] = React.useState({
    searchText: '',
    isCaseSensitive: false,
  })

  const setSearchText = (text) => {
    setQuery(previousState => {
      return { ...previousState, searchText: text }
    });
  }

  const toggleIsCaseSensitive = () => {
    setQuery(previousState => {
      return { ...previousState, isCaseSensitive: !previousState.isCaseSensitive }
    });
  }

  const results = getSearchResults(searchQuery, searchData)

  const pages = results.map((result) => {
    const chunks = result.matches.map((match) => {
      const matches = match.indices.map((indices, i) => {
        return [
          match.text.substring((i === 0) ? 0 : match.indices[i-1][1], indices[0]),
          <span className='match-text' key={indices[0]}>
            {match.text.substring(indices[0], indices[1])}
          </span>,
          (i === match.indices.length - 1) ? match.text.substring(indices[1]) : '',
        ]
      })
      return (
          <li key={result.url + match.id}>
            <a
              href={withPrefix(result.url + '#' + match.id)}
              className="label"
              target="_blank"
              rel="noreferrer"
            >
              {match.label}
            </a>
            <span className={'chunk-text ' + match.type}>
              {matches}
            </span>
          </li>
      )
    })
    return (
        <li key={result.url}>
          <a
            href={withPrefix(result.url)}
            target="_blank"
            rel="noreferrer"
          >
            {result.title}
          </a>
          <ul>
            {chunks}
          </ul>
        </li>
    )
  })

  return (
    <div id="search-page">
      <div id="search-parameters">
        <input
          name="searchText"
          id="search-text"
          value={searchQuery.searchText}
          placeholder="Search"
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onChange={(event) => setSearchText(event.target.value)}
        />
        <span id="checkbox">
          <input
              type="checkbox"
              id="is-case-sensitive"
              checked={searchQuery.isCaseSensitive}
              onChange={toggleIsCaseSensitive}
          />
          <label htmlFor="is-case-sensitive">Case sensitive</label>
        </span>
      </div>
      <div id="search-results">
        {results.length > 0 ? (
          <ul>
            {pages}
          </ul>
        ) : (
          <p>No results</p>
        )}
      </div>
    </div>
  )
}

export default Search
