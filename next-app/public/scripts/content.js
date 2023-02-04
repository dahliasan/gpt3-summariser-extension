console.log('summarizooor content script is running')

import { Readability } from '@mozilla/readability'
import { dragElement } from '../../lib/utils'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // If messages contains content to inject into page
  if (request.type === 'inject') {
    const { message } = request

    // Call  insert function

    const result = insert(message)

    // If something went wrong, send a failed status
    if (!result) {
      sendResponse({ status: 'failed' })
    }

    sendResponse({ status: 'success' })
  }

  // If message requests the entire webpage content
  if (request.type === 'get_webpage') {
    let cloneDoc = document.cloneNode(true)
    let parsed = readable(cloneDoc)

    console.log('main content extracted:', parsed)

    sendResponse({ text: parsed.textContent })
  }
})
// Create pop-up window
function createPopupWindow() {
  // Now, create a pop-up window with the message
  let popup = document.createElement('div')
  popup.setAttribute('id', 'window1')
  popup.className = 'window summary-wrapper'
  document.body.appendChild(popup)

  // Add top bar wrapper for buttons
  let topBar = document.createElement('div')
  topBar.setAttribute('id', 'window1header')
  topBar.className = 'top-bar'
  popup.appendChild(topBar)

  // Add a close button to the pop-up
  let closeButton = document.createElement('div')
  closeButton.className = 'close-btn'
  topBar.appendChild(closeButton)

  // Add the content box to the popup
  let summaryContent = document.createElement('div')
  summaryContent.setAttribute('id', 'summary-content')
  popup.appendChild(summaryContent)

  // Add an event listener to the close button to remove the pop-up when clicked
  closeButton.addEventListener('click', function (event) {
    document.body.removeChild(popup)
  })

  // Make pop-up window draggable
  dragElement(popup)

  return document.getElementById('summary-content')
}

// Insert content into page
async function insert(message, tabId) {
  const { content, title, url } = message

  // Split content by \n
  let contentHtml = createContentHtml(content, url, title)

  // Find the section on the page to insert our summary div
  let summaryElement = document.getElementById('summary-content')

  if (!summaryElement) {
    // If popup element doesn't exist, create one and inject message
    summaryElement = createPopupWindow()
    summaryElement.innerHTML = contentHtml
  } else {
    // If popup element exists, inject new message
    summaryElement.innerHTML = contentHtml
  }

  if (content === 'generating') {
    // add class 'loading' to summary element
    summaryElement.classList.add('loading')
  } else {
    // remove class 'loading' from summary element
    summaryElement.classList.remove('loading')
  }

  // On success return true
  return true
}

function createContentHtml(content, url, title) {
  const splitContent = content.split('\n')

  // Format content
  let contentHtml = splitContent
    .map((content) => {
      if (content === '') {
        return ''
      }

      if (content.startsWith('-')) {
        const li = document.createElement('li')
        li.innerText = content.replace('-', '')
        li.innerText = li.innerText.trim()
        return li.outerHTML
      }

      if (content.startsWith('•')) {
        const li = document.createElement('li')
        li.innerText = content.replace('•', '')
        li.innerText = li.innerText.trim()
        return li.outerHTML
      }

      const p = document.createElement('p')
      p.innerText = content
      return p.outerHTML
    })
    .join('')

  // Find sequenece of li in contentHtml
  const liRegex = /<li>.*?<\/li>/g
  const liMatches = contentHtml.match(liRegex)

  // If there are li matches, replace them with a ul
  if (liMatches) {
    const ul = document.createElement('ul')
    ul.innerHTML = liMatches.join('')

    contentHtml = contentHtml.replace(ul.innerHTML, ul.outerHTML)
  }

  // Add title and url to contentHtml
  if (url && title) {
    contentHtml = `<p style='font-weight: bold;'><a href="${url}">${title}</a></p>${contentHtml}`
  }
  return contentHtml
}

function readable(doc) {
  const reader = new Readability(doc)
  const article = reader.parse()
  return article
}
