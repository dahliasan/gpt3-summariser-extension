const APIS = {
  detailed:
    'https://www.everyprompt.com/api/v0/calls/personal-17/detailed-summary-and-advice-pZMlOa',
  short:
    'https://www.everyprompt.com/api/v0/calls/personal-17/short-summary-sSJ6Zi',
  short2:
    'https://www.everyprompt.com/api/v0/calls/personal-17/short-summary-copy-YAhgjj',
  detailedV2: 'https://summarizooor-server.vercel.app/api/summary-edge',
}

export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  console.log('current tab requested:', tab)
  return tab
}

export async function sendInjectionMessage(message, tab = undefined) {
  if (!tab) {
    tab = await getCurrentTab()
  }

  console.log('sending injection message to:', tab)

  chrome.tabs.sendMessage(
    tab.id ? tab.id : tab,
    { type: 'inject', message },
    (response) => {
      if (response.status === 'failed') {
        console.log('injection failed.')
      }
    }
  )
}

export async function generateFromEveryPrompt(prompt, apiUrl) {
  try {
    const userId = await getUniqueUserId()
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer wVcIxPHJadXQotPGPgjR5',
      },
      body: JSON.stringify({
        variables: {
          text: preprocessText(prompt),
        },
        user: userId,
      }),
    })

    const data = await response.json()
    console.log('API replied:', data)
    console.log(response.status)

    if (response.status !== 200) {
      return [null, data]
    }

    return [data, null]
  } catch (error) {
    console.error('Error:', error)
    return [null, error]
  }
}

export async function generateSummary(textInput, apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: preprocessText(textInput),
      }),
    })

    const data = await response.json()

    console.log('API replied:', data)
    console.log(response.status)

    if (data.error) {
      return [null, data.error]
    }

    return [data, null]
  } catch (error) {
    console.error('Error:', error)
    return [null, error]
  }
}

export async function generateCompletionAction(text, info, tab) {
  try {
    let startTime = Date.now()

    sendInjectionMessage({ content: 'generating' }, tab)

    let summaryObject
    let summaryEmbedding
    let id
    let summaryCompletion
    let metadata

    let [response, error] = await generateSummary(text, APIS.detailedV2)

    if (error) {
      console.log('API replied with an error:', error)

      if (error.code === 'context_length_exceeded') {
        sendInjectionMessage(
          {
            content:
              "😱 wowza! that's alot of text... gotta bring in the big guns for this one. hang tight!",
          },
          tab
        )

        const longTextSummaryResponse = await generateLongText(text)
        response = longTextSummaryResponse[0]
        metadata = longTextSummaryResponse[1]
      } else {
        throw error
      }
    }

    summaryCompletion = response.choices[0].message

    summaryObject = {
      date: Date.now(),
      title: tab.title,
      url: tab.url,
      content: summaryCompletion.content,
      timeSaved: readingTimeSaved(text, summaryCompletion.content),
      timeTaken: Date.now() - startTime,
    }

    if (metadata) {
      summaryObject = { ...summaryObject, ...metadata }
    }

    sendInjectionMessage(summaryObject, tab)

    summaryEmbedding = await generateEmbeddings(
      `${summaryCompletion.content} \n\n ${summaryObject.title} \n\n ${summaryObject.url} \n\n date: ${summaryObject.date}`
    )

    // Save summary object to local storage
    id = await getNextId()

    summaryObject = { ...summaryObject, id: id, embedding: summaryEmbedding }

    chrome.storage.local.set({ [`summary-${id}`]: summaryObject }, function () {
      console.log('Summary saved to local storage', summaryObject)
    })
  } catch (error) {
    console.log(error)
    sendInjectionMessage({ content: error.message }, tab)
  }
}

export async function generateLongText(input) {
  const CHUNK_SIZE = 4000

  const splitIntoChunks = (input, chunkSize) => {
    let paragraphs = input.split('\n')

    // if no paragraphs, split by sentences
    if (paragraphs.length === 1) {
      paragraphs = input.split('.')
    }

    // if no sentences split by words
    if (paragraphs.length === 1) {
      paragraphs = input.split(' ')
    }

    let chunks = []
    let currentChunk = []
    paragraphs.forEach((paragraph) => {
      if (
        currentChunk.reduce((sum, str) => sum + str.length, 0) +
          paragraph.length >
        chunkSize
      ) {
        chunks.push(currentChunk.join('\n\n'))
        currentChunk = []
      }
      currentChunk.push(paragraph)
    })
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'))
    }
    return chunks
  }

  const summarizeChunks = async (chunks) => {
    try {
      // generate summaries for each chunk

      return Promise.all(
        chunks.map(async (chunk) => {
          const [data, error] = await generateFromEveryPrompt(chunk, APIS.short)

          if (error) {
            if (error.message.includes('consider using fewer tokens')) {
              const SMALLER_CHUNK_SIZE = CHUNK_SIZE / 2

              const chunks = splitIntoChunks(chunk, SMALLER_CHUNK_SIZE)
              const summaries = await summarizeChunks(chunks)
              const blob = await combineSummariesIntoBlob(summaries)
              return blob // return blob instead of summary
            } else {
              throw error
            }
          }

          return data.completions.pop().text.trim()
        })
      )
    } catch (error) {
      console.log('error received in catch block from summarizeChunks', error)
    }
  }

  const combineSummariesIntoBlob = async (summaries) => {
    return summaries.join('\n')
  }

  const getSummaryOfBlob = async (blob) => {
    const [data, error] = await generateSummary(blob, APIS.detailedV2)

    if (error) {
      throw error
    }

    return data
  }

  const chunks = splitIntoChunks(input, CHUNK_SIZE)
  const summaries = await summarizeChunks(chunks)
  const blob = await combineSummariesIntoBlob(summaries)
  sendInjectionMessage({
    content: '🫡 ok, not long now... one summary coming right up!',
  })

  try {
    const finalSummaryData = await getSummaryOfBlob(blob)
    return [finalSummaryData, { blob }]
  } catch (error) {
    throw error
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

export async function generateEmbeddings(input) {
  const url = 'https://summarizooor-server.vercel.app/api/embeddings'

  // Call embeddings endpoint
  const embeddingsResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input,
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
      searchInputEmbedding = await generateEmbeddings(query)
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
            embedding: generateEmbeddings(
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

export function preprocessText(input) {
  // Lowercase text
  const lowercaseText = input.toLowerCase()

  // Remove punctuation except full stops and preserve contraction words
  // const filteredText = lowercaseText.replace(/([^\w\s.'])/gi, '')
  const filteredText = lowercaseText

  // Remove stopwords
  const stopwords = new Set(['is', 'a', 'and', 'with', 'the'])
  const processedWords = filteredText
    .split(' ')
    .filter((word) => word.length > 0 && !stopwords.has(word))
    .join(' ')
    .trim()

  // Split into lines and filter out any lines that are only whitespace
  const lines = processedWords
    .split('\n')
    .filter((line) => line.trim().length > 0)

  // Join filtered lines back together with a single \n character
  const filteredLines = lines.join('\n')

  console.log('PROCESSED WORDS:\n', filteredLines)
  return filteredLines
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

export function readingTimeSaved(string1, string2) {
  let words1 = string1.split(' ').length
  let words2 = string2.split(' ').length
  let wordsSaved = words1 - words2
  let timeSaved = wordsSaved / 250

  return timeSaved
}
