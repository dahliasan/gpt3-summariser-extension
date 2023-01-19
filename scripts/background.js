// Create message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    console.log('Received input: ' + request.text)

    // Inject CSS
    const tab = getCurrentTab()
    const css = 'body { background-color: red; }'

    chrome.scripting
      .insertCSS({
        target: { tabId: tab.id },
        css: css,
      })
      .then(() => console.log('CSS injected'))

    // Send a message to the content script to inject the summary
    generateCompletionAction(request.text, request.info, request.tab)
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
  //  chrome.tabs.create({ url: '' })
})

// Add listener to commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'open_chatgpt') {
    console.log('open_chatgpt command used')
    chrome.tabs.create({ url: 'https://chat.openai.com/chat' })
  }

  if (command === 'generate_summary') {
    console.log('generate_summary command used')
    // Send a message to the content script of the active tab
    chrome.tabs.sendMessage(
      tab.id,
      { message: 'get_selection' },
      (response) => {
        // Do something with the selected text
        console.log('selected text received: ', response.text)
        generateCompletionAction(response.text, info, tab)
      }
    )
  }
})

// Add listener to context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    generateCompletionAction(info.selectionText, info, tab)
  } else {
    chrome.tabs.sendMessage(tab.id, { message: 'get_email' }, (response) => {
      console.log('Entire email content received: ', response)
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

async function sendInjectionMessage(message, tab) {
  const targetTab = tab || getCurrentTab()

  console.log('sending injection message to:', targetTab)

  chrome.tabs.sendMessage(
    targetTab.id,
    { type: 'inject', message },
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
      max_tokens: 256,
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
    sendInjectionMessage({ content: 'generating...' }, activeTab)

    const summaryCompletion = await generate(
      `Article:\n${text}\n\nArticle summary followed by actionable advice or wisdom in bullet points:`
    )

    console.log(summaryCompletion)

    // Save new summary to local storage
    const summaryObject = {
      title: activeTab.title,
      url: activeTab.url,
      content: summaryCompletion.text,
    }

    chrome.storage.local.set(
      {
        [`summary${Date.now()}`]: summaryObject,
      },
      function () {
        console.log('Summary saved to local storage')
      }
    )

    // Send the output when we're all done
    sendInjectionMessage(summaryObject, activeTab)
  } catch (error) {
    console.log(error)

    // Add this here as well to see if we run into any errors!
    sendInjectionMessage(error.toString(), activeTab)
  }
}
