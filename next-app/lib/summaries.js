import { clipboardIcon, clipboardSuccessIcon, deleteIcon } from './icons'

export const initSearchFunction = () => {
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

export function fetchSummaries() {
  console.log('fetching summaries...')
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

export function createSummaryComponent(summaryObj, key) {
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
