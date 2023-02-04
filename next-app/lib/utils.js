const APIS = {
  detailed:
    'https://www.everyprompt.com/api/v0/calls/personal-17/detailed-summary-and-advice-pZMlOa',
  short: '',
  longer: '',
}

export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export async function sendInjectionMessage(message, tab) {
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

export async function generateFromEveryPrompt(prompt, apiUrl) {
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

export async function generateCompletionAction(text, info, tab) {
  try {
    // Send mesage with generating text (this will be like a loading indicator)

    sendInjectionMessage({ content: 'generating' }, tab)

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
    console.log('error message received: ', error)

    if (error.includes('consider using fewer tokens')) {
      sendInjectionMessage(
        {
          content:
            '😢 your text is too long, try selecting a smaller section of text.',
        },
        tab
      )
    } else {
      sendInjectionMessage({ content: error }, tab)
    }
  }
}

export async function getNextId() {
  let result = await new Promise((resolve) =>
    chrome.storage.local.get(['summaryIndex'], resolve)
  )
  let id = result['summaryIndex'] ? result['summaryIndex'] + 1 : 1

  await new Promise((resolve) =>
    chrome.storage.local.set({ ['summaryIndex']: id }, resolve)
  )
  return id
}

export async function getEmbeddings(input) {
  const url = 'https://summarizooor-server.vercel.app/api/embeddings'

  // Call embeddings endpoint
  const embeddingsResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: input,
    }),
  })

  const embeddings = await embeddingsResponse.json()

  console.log('embeddings response: ', embeddings)

  if (embeddings.error) {
    // throw error message
    throw embeddings.error.message
  }

  return embeddings.data.embedding
}

export async function searchSummaries(query) {
  try {
    console.log('searching summarries...')
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
          console.log(
            'query already exists - no need to fetch embeddings again...'
          )
          // delete that query from local storage
          chrome.storage.local.remove(key)
          // save embedding to searchInputEmbedding
          searchInputEmbedding = searchQuery.embedding
          break
        }
      }
    }

    if (!searchInputEmbedding) {
      console.log('query does not exist - fetching embeddings...')
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
      console.log('sending search results...', searchResults)

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

export function cosineSimilarity(vecA, vecB) {
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

export function checkSummariesFormat() {
  console.log('checking if summaries are in correct format')
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

export function getUniqueUserId() {
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

export function generateLongText(input) {
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

  // Combine chunks into a blob

  // Summarize the blob

  // Return the summary`
}

// Drag element function
export function dragElement(elmnt) {
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
