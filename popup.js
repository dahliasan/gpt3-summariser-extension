const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M280 64h40c35.3 0 64 28.7 64 64v320c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128c0-35.3 28.7-64 64-64h49.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64h9.6zM64 112c-8.8 0-16 7.2-16 16v320c0 8.8 7.2 16 16 16h256c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16h-16v24c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24v-24H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>`

const clipboardSuccessIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M243.8 339.8c-10.9 10.9-28.7 10.9-39.6 0l-64-64c-10.9-10.9-10.9-28.7 0-39.6 10.9-10.9 28.7-10.9 39.6 0l44.2 44.2 108.2-108.2c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6l-128 128zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"/></svg>`

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M160 400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm-2.5-375.06L354.2 80H424c13.3 0 24 10.75 24 24 0 13.3-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.18 0-80-35.8-80-80V128h-8c-13.25 0-24-10.7-24-24 0-13.25 10.75-24 24-24h69.82l36.68-55.06C140.9 9.357 158.4 0 177.1 0h93.8c18.7 0 36.2 9.358 46.6 24.94zM151.5 80h145l-19-28.44c-1.5-2.22-4-3.56-6.6-3.56h-93.8c-2.6 0-6 1.34-6.6 3.56L151.5 80zM80 432c0 17.7 14.33 32 32 32h224c17.7 0 32-14.3 32-32V128H80v304z"/></svg>`

const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key'])
    })
  })
}

const encode = (input) => {
  return btoa(input)
}

const saveKey = () => {
  const input = document.getElementById('key_input')

  if (input) {
    const { value } = input

    // Encode String
    const encodedValue = encode(value)

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none'
      document.getElementById('key_entered').style.display = 'block'
    })
  }
}

const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block'
  document.getElementById('key_entered').style.display = 'none'
}

document.getElementById('save_key_button').addEventListener('click', saveKey)
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey)

checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none'
    document.getElementById('key_entered').style.display = 'block'
  }
})

// Search summaries
const initSearchFunction = () => {
  const searchInput = document.getElementById('search_input')
  const searchSubmitBtn = document.getElementById('search_submit')

  // event listener on enter keystroke from input field
  searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      // get value from input field
      const searchValue = event.target.value

      // send search input to background.js
      chrome.runtime.sendMessage({ searchValue })
    }
  })

  // add event listener on search submit button
  searchSubmitBtn.addEventListener('click', (event) => {
    // get value from input field
    const searchValue = searchInput.value

    // send search input to background.js
    chrome.runtime.sendMessage({ searchValue })
  })
}

// listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'search_results') {
    console.log('search results received by popup: ', request)

    const { searchResults: results } = request

    // filter search results from response with similarity score > 0.5
    const filteredResults = results.filter((result) => {
      return result.similarity > 0.5
    })

    // Create new summary component of search results
    document.getElementById('summaries').innerHTML = ''

    filteredResults.forEach((result) => {
      const summaryDiv = createSummaryComponent(result, `summary-${result.id}`)

      // Add the summary div to the popup
      document.getElementById('summaries').appendChild(summaryDiv)
    })

    // Create view all summaries button with id view_all_summaries
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
})

initSearchFunction()

// Fetch all the summaries from local storage
function fetchSummaries() {
  //Retrieve all summaries from local storage
  chrome.storage.local.get(null, (items) => {
    //Iterate through all the summaries
    for (let key in items) {
      // if key includes summary

      if (key.includes('summary') && !key.includes('summaryIndex')) {
        console.log(items[key])

        // Create a new div to display the summary
        const summaryDiv = createSummaryComponent(items[key], key)

        //Add the summary div to the popup
        document.getElementById('summaries').appendChild(summaryDiv)
      }
    }
  })
}

fetchSummaries()

function createSummaryComponent(summaryObj, key) {
  const summaryDiv = document.createElement('div')
  summaryDiv.className = 'summary'

  // Create a new div to display the summary text
  const summaryTextDiv = document.createElement('div')
  const summaryText = summaryObj['content']
  summaryTextDiv.innerHTML = summaryText
  summaryTextDiv.className = 'summary-text'

  // Create a new button to copy the summary
  const copyButton = document.createElement('button')
  copyButton.innerHTML = clipboardIcon
  copyButton.className = 'copy-button'
  copyButton.onclick = function () {
    //Copy the summary to the clipboard
    navigator.clipboard.writeText(summaryText)
    copyButton.innerHTML = clipboardSuccessIcon

    setTimeout(() => {
      copyButton.innerHTML = clipboardIcon
    }, 1000)
  }

  // Create a new button to delete the summary
  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = deleteIcon
  deleteButton.className = 'delete-button'
  deleteButton.onclick = function () {
    //Delete the summary from local storage
    chrome.storage.local.remove(key)
    // Remove the summary div from the popup
    summaryDiv.remove()
  }

  //Add the copy and delete buttons to the summary div
  summaryDiv.appendChild(summaryTextDiv)
  summaryDiv.appendChild(copyButton)
  summaryDiv.appendChild(deleteButton)

  // Add event listener to the summary text div
  summaryTextDiv.addEventListener('click', (e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: 'inject',
          message: summaryObj,
        },
        (response) => {
          console.log(response)
        }
      )
    })
  })
  return summaryDiv
}
