chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    console.log('Received email content: ' + request.text)
    generateCompletionAction(request.text, request.info, request.tab)
  }
})

// Create the context menu (right-click on page) which execute generation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'gpt-email-summariser',
    title: 'Generate email summary',
    contexts: ['all'],
    documentUrlPatterns: ['*://mail.google.com/*'],
  })
})

// Add listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    generateCompletionAction(info.selectionText, info, tab)
  } else {
    chrome.tabs.sendMessage(tab.id, { message: 'get email' }, (response) => {
      console.log('response received from get email request!', response)
      generateCompletionAction(response.text, info, tab)
    })
  }
})

// Utilities
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

async function getKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key'])
        resolve(decodedKey)
      }
    })
  })
}

async function sendInjectionMessage(content, tab) {
  const targetTab = tab || getCurrentTab()

  console.log('sending injection message to:', targetTab)

  chrome.tabs.sendMessage(
    targetTab.id,
    { message: 'inject', content },
    (response) => {
      if (response.status === 'failed') {
        console.log('injection failed.')
      }
    }
  )
}

async function generate(prompt) {
  // Get your API key from storage
  const key = await getKey()
  const url = 'https://api.openai.com/v1/completions'

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0,
    }),
  })

  // Select the top choice and send back
  const completion = await completionResponse.json()

  console.log('openai replied:', completion)

  return completion.choices.pop()
}

async function generateCompletionAction(text, info, tab) {
  try {
    // Send mesage with generating text (this will be like a loading indicator)

    const activeTab = tab
    sendInjectionMessage('generating...', activeTab)

    const basePromptPrefix = `Rewrite this for brevity, in outline form and in html: `

    const summaryCompletion = await generate(`${basePromptPrefix}${text}`)

    console.log(summaryCompletion)

    // Send the output when we're all done
    sendInjectionMessage(summaryCompletion.text, activeTab)
  } catch (error) {
    console.log(error)

    // Add this here as well to see if we run into any errors!
    sendInjectionMessage(error.toString(), activeTab)
  }
}
