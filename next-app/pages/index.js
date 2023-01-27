import styles from '../styles/Home.module.css'
import Script from 'next/script'

const IndexPage = () => {
  return (
    <>
      <Script src="../public/scripts/popup.js"></Script>

      <div id="key_needed">
        <p>To get started, add your OpenAI API Key!</p>
        <div className="form">
          <input id="key_input" />
          <button id="save_key_button">Add</button>
        </div>
        <div className="help">
          <a
            href="https://beta.openai.com/account/api-keys"
            target="_blank"
            rel="noreferrer"
          >
            Get API Key
          </a>
        </div>
      </div>
      <div id="key_entered">
        <div>
          <p className="font-bold">You&apos;re all set!</p>
          <p className="text-xs">You&apos;ve entered your OpenAI API Key.</p>
        </div>
        <button id="change_key_button">Change key</button>
      </div>

      <div className="form">
        <input id="search_input" placeholder="search summaries..." />
        <button id="search_submit">{'>'}</button>
      </div>

      <div id="summaries"></div>
    </>
  )
}

export default IndexPage
