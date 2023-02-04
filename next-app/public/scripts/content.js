console.log('summarizooor content script is running')
import { Readability } from '@mozilla/readability'
import { createCopyBtn } from '../../lib/summaries'
import { dragElement } from '../../lib/utils'

// Load fonts
const font1Url = chrome.runtime.getURL('fonts/Sora-Regular.woff2')
const font2Url = chrome.runtime.getURL('fonts/Sora-Bold.woff2')

const fontStyleSheet = document.createElement('style')

fontStyleSheet.textContent = `
@font-face {
  font-family: 'Sora';
  src: url('${font1Url}') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Sora';
  src: url('${font2Url}') format('woff2');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
`

document.head.appendChild(fontStyleSheet)

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
  popup.className = 'window summary__popup'
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

  return summaryContent
}

// Insert content into page
async function insert(message, tabId) {
  // Split content by \n
  let contentHtml = createContentHtml(message)

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

  if (message.content === 'generating') {
    // add class 'loading' to summary element
    summaryElement.classList.add('loading')
  } else {
    // remove class 'loading' from summary element
    summaryElement.classList.remove('loading')
  }

  if (message.url) {
    // Add a copy button to top bar
    if (document.querySelector('.copy-button')) {
      document.querySelector('.copy-button').remove()
    }

    const copyButton = createCopyBtn(message.content)
    document
      .querySelector('.top-bar')
      .insertBefore(copyButton, document.querySelector('.close-btn'))
  }

  // On success return true
  return true
}

function createContentHtml({ content, url, title, timeSaved }) {
  const splitContent = content.split('\n')

  // Format content
  let contentHtml = splitContent
    .map((content) => {
      let li
      switch (true) {
        case content === '':
          return ''
        case content.startsWith('-'):
          li = document.createElement('li')
          li.innerText = content.replace('-', '')
          li.innerText = li.innerText.trim()
          return li.outerHTML
        case content.startsWith('•'):
          li = document.createElement('li')
          li.innerText = content.replace('•', '')
          li.innerText = li.innerText.trim()
          return li.outerHTML
        default:
          const p = document.createElement('p')
          p.innerText = content
          return p.outerHTML
      }
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
    contentHtml = `<p style='font-weight: bold;'><a href="${url}">${title}</a></p><p class='time-saved'>Reading time saved: ${Math.round(
      timeSaved
    )} mins</p>${contentHtml}`
  }
  return contentHtml
}

function readable(doc) {
  const reader = new Readability(doc)
  const article = reader.parse()
  return article
}
