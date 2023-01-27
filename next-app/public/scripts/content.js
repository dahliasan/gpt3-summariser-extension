console.log('hello from content script in next.js!')

//Include Readability in your project
import { Readability } from '@mozilla/readability'

function readable(doc) {
  const reader = new Readability(doc)
  const article = reader.parse()
  return article
}
let cloneDoc = document.cloneNode(true)
let parsed = readable(cloneDoc)

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

  // If message requests the entire email content
  if (request.type === 'get_email') {
    const emailText = document.querySelector('.gs .ii.gt')?.innerText || ''

    console.log('Requested to get entire email, sending:', emailText)

    sendResponse({ text: emailText })
  }

  // If message requests the selected text
  if (request.type === 'get_selection') {
    // Get the selected text
    const selectedText = window.getSelection().toString()
    // Send the selected text as a response
    sendResponse({ text: selectedText })
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

  // On success return true
  return true
}

// Drag element function
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  if ('ontouchstart' in document.documentElement) {
    var pos1touch = 0,
      pos2touch = 0,
      pos3touch = 0,
      pos4touch = 0
  }
  if (document.getElementById(elmnt.id + 'header')) {
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
    document.getElementById(elmnt.id + 'header').ontouchstart = dragMouseDown
  }

  function dragMouseDown(e) {
    if (!'ontouchstart' in document.documentElement) {
      e.preventDefault()
    }
    pos3 = e.clientX
    pos4 = e.clientY
    if ('ontouchstart' in document.documentElement) {
      try {
        pos3touch = e.touches[0].clientX
        pos4touch = e.touches[0].clientY
      } catch (error) {}
    }
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
    document.ontouchend = closeDragElement
    document.ontouchmove = elementDrag
  }

  function elementDrag(e) {
    e.preventDefault()
    if ('ontouchstart' in document.documentElement) {
      pos1touch = pos3touch - e.touches[0].clientX
      pos2touch = pos4touch - e.touches[0].clientY
      pos3touch = e.touches[0].clientX
      pos4touch = e.touches[0].clientY
      elmnt.style.top = elmnt.offsetTop - pos2touch + 'px'
      elmnt.style.left = elmnt.offsetLeft - pos1touch + 'px'
    } else {
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
    }
  }

  function closeDragElement() {
    document.onmouseup = null
    document.onmousemove = null
    document.ontouchend = null
    document.ontouchmove = null
  }
}
