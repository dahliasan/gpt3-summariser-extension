console.log('hi from popup.js')

import { initSearchFunction, fetchSummaries } from '../../lib/summaries'
// Initialize the search function
initSearchFunction()

// Fetch all the summaries from local storage
fetchSummaries()

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'search_results') {
    console.log('search results received by popup: ', request)

    const { searchResults: results } = request

    // filter search results from response with similarity score > than average score

    // get average similarity score
    const averageScore =
      results.reduce((acc, curr) => {
        return acc + curr.similarity
      }, 0) / results.length

    console.log('average score: ', averageScore)

    // filter results
    const filteredResults = results.filter((result) => {
      return result.similarity > averageScore
    })

    // Create new summary component of search results
    document.getElementById('summaries').innerHTML = ''

    filteredResults.forEach((result) => {
      const summaryDiv = createSummaryComponent(result, `summary-${result.id}`)

      // Add the summary div to the popup
      document.getElementById('summaries').appendChild(summaryDiv)
    })

    // Create view all summaries button with id view_all_summaries
    if (!document.getElementById('view_all_summaries')) {
      const viewAllButton = document.createElement('button')
      viewAllButton.id = 'view_all_summaries'
      viewAllButton.innerHTML = 'View All Summaries'

      // append as sibling
      const searchForm = document.querySelector('.form:has(#search_input)')
      searchForm.parentNode.insertBefore(viewAllButton, searchForm.nextSibling)
      viewAllButton.style.display = 'block'

      // event listener on view all summaries button
      viewAllButton.addEventListener('click', (e) => {
        document.getElementById('summaries').innerHTML = ''
        console.log(document.getElementById('summaries'))
        fetchSummaries()

        // remove view all summaries button
        viewAllButton.remove()

        // clear search input field
        document.getElementById('search_input').value = ''
      })
    }
  }
})
