const createPopupWindow = () => {
  // Now, create a pop-up window with the message
  let popup = document.createElement('div')
  popup.setAttribute('id', 'window1')
  popup.className = 'window summary-wrapper'
  document.body.appendChild(popup)

  // Add top bar wrapper for buttons
  let topBar = document.createElement('div')
  topBar.className = 'top-bar'
  popup.appendChild(topBar)

  // Add a handle button to the pop-up
  let handleButton = document.createElement('div')
  handleButton.setAttribute('id', 'window1header')
  handleButton.className = 'handle-btn'
  topBar.appendChild(handleButton)

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

const insert = async (content, tabId) => {
  // Find the section on the page to insert our summary div
  const element = document.querySelector('div.nH.V8djrc.byY')

  if (!element) return

  let summaryElement = document.getElementById('summary-content')

  if (!summaryElement) {
    // If popup element doesn't exist, create one and inject message
    summaryElement = createPopupWindow()
    summaryElement.innerHTML = content
  } else {
    // If popup element exists, inject new message
    summaryElement.innerHTML = content
  }

  // On success return true
  return true
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // If messages contains content to inject into page
  if (request.message === 'inject') {
    const { content } = request

    // Call this insert function
    const result = insert(content)

    // If something went wrong, send a failed status
    if (!result) {
      sendResponse({ status: 'failed' })
    }

    sendResponse({ status: 'success' })
  }

  // If message requests the entire email content
  if (request.message === 'get email') {
    const emailText = document.querySelector('.gs .ii.gt')?.innerText || ''

    console.log('get email request received, sending:', emailText)

    sendResponse({ text: emailText })
  }
})

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
