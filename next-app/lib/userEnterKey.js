document.getElementById('save_key_button').addEventListener('click', saveKey)
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey)

checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none'
    document.getElementById('key_entered').style.display = 'block'
  }
})

export const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key'])
    })
  })
}

export const encode = (input) => {
  return btoa(input)
}

export const saveKey = () => {
  const input = document.getElementById('key_input')

  if (input) {
    const { value } = input

    // Encode String
    const encodedValue = encode(value)

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none'
      document.getElementById('key_entered').style.display = 'block'
    })
  }
}

export const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block'
  document.getElementById('key_entered').style.display = 'none'
}

export async function getKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key'])
        resolve(decodedKey)
      }
    })
  })
}

export async function generate(prompt) {
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
