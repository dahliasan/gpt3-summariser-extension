import { useEffect } from 'react'
import {
  initSearchFunction,
  fetchSummaries,
  listenForMessages,
} from '../lib/summaries'

const IndexPage = () => {
  useEffect(() => {
    initSearchFunction()
    fetchSummaries()
    listenForMessages()
  }, [])

  return (
    <>
      <div className="form">
        <input id="search_input" placeholder="search summaries..." />
        <button id="search_submit">{'>'}</button>
      </div>

      <div id="summaries"></div>
    </>
  )
}

export default IndexPage
