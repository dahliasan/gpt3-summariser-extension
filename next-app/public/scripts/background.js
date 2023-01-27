console.log('hello this is the background script!')

const APIS = {
  detailed:
    'https://www.everyprompt.com/api/v0/calls/personal-17/detailed-summary-and-advice-pZMlOa',
  short: '',
  longer: '',
}

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
    url: 'https://fxhd.notion.site/TLDR-Summariser-Chrome-Extension-317ba7f2f1c5443cbc99a220c5d073b0',
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
    chrome.tabs.sendMessage(tab.id, { message: 'get_email' }, (response) => {
      console.log('Entire email content received: ', response)
      generateCompletionAction(response.text, info, tab)
    })
  }
})

// On startup
chrome.runtime.onStartup.addListener(() => {
  checkSummariesFormat()
})

// Functions
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
      max_tokens: 1000,
      temperature: 0,
    }),
  })

  // Select the top choice and send back
  const completion = await completionResponse.json()

  console.log('openai replied:', completion)

  if (completion.error) {
    // throw error message
    throw completion.error.message
  }

  return completion.choices.pop()
}

// async function to generate completions using different api

async function generateFromEveryPrompt(prompt, apiUrl) {
  const userId = await getUniqueUserId()
  const completionResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer wVcIxPHJadXQotPGPgjR5',
    },
    body: JSON.stringify({
      variables: {
        text: prompt,
      },
      user: userId,
    }),
  })
  const completion = await completionResponse.json()
  console.log('API replied:', completion)
  if (completion.object === 'error') {
    throw completion.message
  }
  return completion.choices.pop()
}

async function generateCompletionAction(text, info, tab) {
  try {
    // Send mesage with generating text (this will be like a loading indicator)

    sendInjectionMessage({ content: 'generating...' }, tab)

    //     const summaryCompletion = await generate(
    //       `${text}\n\nDetailed summary of article. Followed by any actionable advice/wisdom in bullet points:
    // `
    //     )

    const summaryCompletion = await generateFromEveryPrompt(text, APIS.detailed)

    // Save new summary to local storage
    let summaryObject = {
      date: Date.now(),
      title: tab.title,
      url: tab.url,
      content: summaryCompletion.text,
    }

    // Send the output when we're all done
    sendInjectionMessage(summaryObject, tab)

    // get embedding of summary
    const summaryEmbedding = await getEmbeddings(
      `${summaryCompletion.text} \n\n ${summaryObject.title} \n\n ${summaryObject.url}`
    )

    let id = await getNextId()

    console.log(`this summary's id is: `, id)

    summaryObject = { ...summaryObject, id: id, embedding: summaryEmbedding }

    // save summary to local storage
    chrome.storage.local.set(
      {
        [`summary-${id}`]: summaryObject,
      },
      function () {
        console.log('Summary saved to local storage', summaryObject)
      }
    )
  } catch (error) {
    console.log(error)
    sendInjectionMessage(error)
  }
}

async function getNextId() {
  let result = await new Promise((resolve) =>
    chrome.storage.local.get(['summaryIndex'], resolve)
  )
  let id = result['summaryIndex'] ? result['summaryIndex'] + 1 : 1

  await new Promise((resolve) =>
    chrome.storage.local.set({ ['summaryIndex']: id }, resolve)
  )
  return id
}

async function getEmbeddings(input) {
  // Get your API key from storage
  const key = await getKey()
  const url = 'https://api.openai.com/v1/embeddings'
  const model = 'text-embedding-ada-002'

  // Call embeddings endpoint
  const embeddingsResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: model,
      input: input,
    }),
  })

  const embeddings = await embeddingsResponse.json()

  console.log('embeddings response: ', embeddings)

  if (embeddings.error) {
    // throw error message
    throw embeddings.error.message
  }

  return embeddings.data[0].embedding
}

async function searchSummaries(query) {
  try {
    // Get embedding of query
    // Check if query already exists in local storage

    const items = await new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => {
        resolve(items)
      })
    })

    let searchInputEmbedding

    for (const key in items) {
      if (key.includes('searchQuery')) {
        const searchQuery = items[key]
        if (searchQuery.query === query) {
          // If query already exists use that embedding
          console.log('query already exists')
          // delete that query from local storage
          chrome.storage.local.remove(key)
          // save embedding to searchInputEmbedding
          searchInputEmbedding = searchQuery.embedding
          break
        }
      }
    }

    console.log(searchInputEmbedding)

    if (!searchInputEmbedding) {
      console.log('running getEmbeddings')
      searchInputEmbedding = await getEmbeddings(query)
    }

    let searchQueryObject = {
      date: Date.now(),
      query: query,
      embedding: searchInputEmbedding,
    }

    // Calculate similarity between query and all summaries
    chrome.storage.local.get(null, (items) => {
      let searchResults = []

      for (const key in items) {
        if (key.includes('summary') && !key.includes('summaryIndex')) {
          const summary = items[key]

          console.log(summary)
          const similarity = cosineSimilarity(
            searchInputEmbedding,
            summary.embedding
          )
          searchResults.push({ ...summary, similarity })
        }
      }

      // Sort search results by similarity
      searchResults.sort((a, b) => b.similarity - a.similarity)

      // Store query and its embedding in local storage
      searchQueryObject = { ...searchQueryObject, results: searchResults }

      chrome.storage.local.set(
        {
          [`searchQuery-${Date.now()}`]: searchQueryObject,
        },
        function () {
          console.log(
            'Search query and results saved to local storage',
            searchQueryObject
          )
        }
      )
      console.log(searchResults)

      // Send search results back to popup
      chrome.runtime.sendMessage({
        type: 'search_results',
        searchResults: searchResults,
      })
    })
  } catch (error) {
    console.log(error)
  }
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB) {
    console.log('vecA: ', vecA)
    console.log('vecB: ', vecB)
    throw new Error('Input vectors are not defined')
  }

  const dotProduct = (vecA, vecB) => {
    let product = 0
    for (let i = 0; i < vecA.length; i++) {
      product += vecA[i] * vecB[i]
    }
    return product
  }

  const magnitude = (vec) => {
    let sum = 0
    for (let i = 0; i < vec.length; i++) {
      sum += vec[i] * vec[i]
    }
    return Math.sqrt(sum)
  }

  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
}

function checkSummariesFormat() {
  chrome.storage.local.get(null, async (items) => {
    for (const key in items) {
      if (key.includes('summary') && !key.includes('summaryIndex')) {
        const summary = items[key]

        // check if summary contains embedding and id property
        if (!summary.embedding || !summary.id) {
          console.log('summary missing embedding or id', summary)

          const id = await getNextId()

          // create new summary object with id and embedding
          const newSummary = {
            ...summary,
            id: id,
            embedding: getEmbeddings(
              `${summary.content} \n\n ${summary.title} \n\n ${summary.url} `
            ),
          }

          // delete old summary object from local storage
          chrome.storage.local.remove(key)

          // save new summary object to local storage
          chrome.storage.local.set({
            [`summary-${newSummary.id}`]: newSummary,
          })
        }
      }
    }

    console.log(items)
  })
}

function getUniqueUserId() {
  return new Promise((resolve) => {
    // check if the unique user ID is already stored in chrome.storage.local
    chrome.storage.local.get(['uniqueUserId'], (result) => {
      if (result.uniqueUserId) {
        // return the unique user ID if it exists
        resolve(result.uniqueUserId)
      } else {
        // generate a new unique user ID
        const newUniqueUserId =
          Date.now().toString() + Math.random().toString(36).substring(2, 15)
        // store the new unique user ID in chrome.storage.local
        chrome.storage.local.set({ uniqueUserId: newUniqueUserId }, () => {
          // return the new unique user ID
          resolve(newUniqueUserId)
        })
      }
    })
  })
}

function generateLongText(input) {
  const splitChunks = (input) => {
    // Split the content at the paragram level in chunks smaller than 4k characters.
    const CHUNK_SIZE = 4000
    let paragraphs = input.split('\n\n')
    let splits = []
    let current = []
    paragraphs.forEach((p) => {
      if (
        current.reduce((tot, str) => tot + str.length, 0) + p.length >
        CHUNK_SIZE
      ) {
        splits.push(current.join('\n\n'))
        current = []
      }
      current.push(p)
    })
    if (current.length > 0) {
      splits.push(current.join('\n\n'))
    }
    return splits
  }

  const chunks = splitChunks(input)

  // Summarize the paragraphs above in under 512 characters.
  const MAX_SUMMARY_LENGTH = 512
}
