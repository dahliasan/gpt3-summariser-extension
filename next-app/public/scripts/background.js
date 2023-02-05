console.log('hello this is the background script!')
import {
  generateCompletionAction,
  checkSummariesFormat,
  searchSummaries,
} from '../../lib/utils'

// Create message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    console.log('Received input: ' + request.text)

    // Send a message to the content script to inject the summary
    generateCompletionAction(request.text, request.info, request.tab)
  }

  if (request.searchValue) {
    searchSummaries(request.searchValue)
  }
})

// On extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Create the context menu
  chrome.contextMenus.create({
    id: 'gpt-summarise',
    title: 'Generate summary',
    contexts: ['all'],
  })

  // Create new tab to landing page
  chrome.tabs.create({
    url: 'https://fxhd.notion.site/summarizooor-chrome-extension-317ba7f2f1c5443cbc99a220c5d073b0',
  })

  checkSummariesFormat()

  // Create unique user id for api calls
  const uniqueUserId =
    Date.now().toString() + Math.random().toString(36).substring(2, 15)
  // store the unique user ID in chrome.storage.local
  chrome.storage.local.set({ uniqueUserId }, () => {
    console.log(
      'Unique user ID stored in chrome.storage.local: ' + uniqueUserId
    )
  })
})

// Add listener to context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    generateCompletionAction(info.selectionText, info, tab)
  } else {
    // Get main content of webpage
    chrome.tabs.sendMessage(tab.id, { type: 'get_webpage' }, (response) => {
      console.log('webpage content received: ', response)
      generateCompletionAction(response.text, info, tab)
    })
  }
})

// On startup listener
chrome.runtime.onStartup.addListener(() => {
  checkSummariesFormat()
})
