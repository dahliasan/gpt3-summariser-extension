(()=>{"use strict";const e="https://summarizooor-server.vercel.app/api/summary-edge";async function t(e,t){t||(t=await async function(){let[e]=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});return console.log("current tab requested:",e),e}()),console.log("sending injection message to:",t),chrome.tabs.sendMessage(t.id?t.id:t,{type:"inject",message:e},(e=>{"failed"===e.status&&console.log("injection failed.")}))}async function o(e,t){try{const o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:c(e)})}),n=await o.json();return console.log("API replied:",n),console.log(o.status),n.error?[null,n.error]:[n,null]}catch(e){return console.error("Error:",e),[null,e]}}async function n(n,a,i){try{let a,m,g,d,h,y=Date.now();t({content:"generating"},i);let[f,w]=await o(n,e);if(w){if(console.log("API replied with an error:",w),"context_length_exceeded"!==w.code)throw w;{t({content:"😱 wowza! that's alot of text... gotta bring in the big guns for this one. hang tight!"},i);const s=await async function(n){const s=(e,t)=>{let o=e.split("\n");1===o.length&&(o=e.split(".")),1===o.length&&(o=e.split(" "));let n=[],s=[];return o.forEach((e=>{s.reduce(((e,t)=>e+t.length),0)+e.length>t&&(n.push(s.join("\n\n")),s=[]),s.push(e)})),s.length>0&&n.push(s.join("\n\n")),n},r=async e=>{try{return Promise.all(e.map((async e=>{const[t,o]=await async function(e,t){try{const o=await new Promise((e=>{chrome.storage.local.get(["uniqueUserId"],(t=>{if(t.uniqueUserId)e(t.uniqueUserId);else{const t=Date.now().toString()+Math.random().toString(36).substring(2,15);chrome.storage.local.set({uniqueUserId:t},(()=>{e(t)}))}}))})),n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer wVcIxPHJadXQotPGPgjR5"},body:JSON.stringify({variables:{text:c(e)},user:o})}),s=await n.json();return console.log("API replied:",s),console.log(n.status),200!==n.status?[null,s]:[s,null]}catch(e){return console.error("Error:",e),[null,e]}}(e,"https://www.everyprompt.com/api/v0/calls/personal-17/short-summary-sSJ6Zi");if(o){if(o.message.includes("consider using fewer tokens")){const t=s(e,2e3),o=await r(t);return await a(o)}throw o}return t.completions.pop().text.trim()})))}catch(e){console.log("error received in catch block from summarizeChunks",e)}},a=async e=>e.join("\n"),i=async t=>{const[n,s]=await o(t,e);if(s)throw s;return n},l=s(n,4e3),u=await r(l),m=await a(u);t({content:"🫡 ok, not long now... one summary coming right up!"});try{return[await i(m),{blob:m}]}catch(e){throw e}}(n);f=s[0],h=s[1]}}d=f.choices[0].message,a={date:Date.now(),title:i.title,url:i.url,content:d.content,timeSaved:(l=n,u=d.content,(l.split(" ").length-u.split(" ").length)/250),timeTaken:Date.now()-y},h&&(a={...a,...h}),t(a,i),m=await r(`${d.content} \n\n ${a.title} \n\n ${a.url} \n\n date: ${a.date}`),g=await s(),a={...a,id:g,embedding:m},chrome.storage.local.set({[`summary-${g}`]:a},(function(){console.log("Summary saved to local storage",a)}))}catch(e){console.log(e),t({content:e.message},i)}var l,u}async function s(){let e=await new Promise((e=>chrome.storage.local.get(["summaryIndex"],e))),t=e.summaryIndex?e.summaryIndex+1:1;return await new Promise((e=>chrome.storage.local.set({summaryIndex:t},e))),t}async function r(e){const t=await fetch("https://summarizooor-server.vercel.app/api/embeddings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:e})}),o=await t.json();if(console.log("embeddings response: ",o),o.error)throw o.error.message;return o.data.embedding}function a(e,t){if(!e||!t)throw console.log("vecA: ",e),console.log("vecB: ",t),new Error("Input vectors are not defined");const o=e=>{let t=0;for(let o=0;o<e.length;o++)t+=e[o]*e[o];return Math.sqrt(t)};return((e,t)=>{let o=0;for(let n=0;n<e.length;n++)o+=e[n]*t[n];return o})(e,t)/(o(e)*o(t))}function i(){console.log("checking if summaries are in correct format"),chrome.storage.local.get(null,(async e=>{for(const t in e)if(t.includes("summary")&&!t.includes("summaryIndex")){const o=e[t];if(!o.embedding||!o.id){console.log("summary missing embedding or id",o);const e=await s(),n={...o,id:e,embedding:r(`${o.content} \n\n ${o.title} \n\n ${o.url} `)};chrome.storage.local.remove(t),chrome.storage.local.set({[`summary-${n.id}`]:n})}}console.log(e)}))}function c(e){const t=e.toLowerCase(),o=new Set(["is","a","and","with","the"]),n=t.split(" ").filter((e=>e.length>0&&!o.has(e))).join(" ").trim().split("\n").filter((e=>e.trim().length>0)).join("\n");return console.log("PROCESSED WORDS:\n",n),n}console.log("hello this is the background script!"),chrome.runtime.onMessage.addListener(((e,t,o)=>{e.text&&(console.log("Received input: "+e.text),n(e.text,e.info,e.tab)),e.searchValue&&async function(e){try{console.log("searching summarries...");const t=await new Promise((e=>{chrome.storage.local.get(null,(t=>{e(t)}))}));let o;for(const n in t)if(n.includes("searchQuery")){const s=t[n];if(s.query===e){console.log("query already exists - no need to fetch embeddings again..."),chrome.storage.local.remove(n),o=s.embedding;break}}o||(console.log("query does not exist - fetching embeddings..."),o=await r(e));let n={date:Date.now(),query:e,embedding:o};chrome.storage.local.get(null,(e=>{let t=[];for(const n in e)if(n.includes("summary")&&!n.includes("summaryIndex")){const s=e[n];console.log(s);const r=a(o,s.embedding);t.push({...s,similarity:r})}t.sort(((e,t)=>t.similarity-e.similarity)),n={...n,results:t},chrome.storage.local.set({[`searchQuery-${Date.now()}`]:n},(function(){console.log("Search query and results saved to local storage",n)})),console.log("sending search results...",t),chrome.runtime.sendMessage({type:"search_results",searchResults:t})}))}catch(e){console.log(e)}}(e.searchValue)})),chrome.runtime.onInstalled.addListener((()=>{chrome.contextMenus.create({id:"gpt-summarise",title:"Generate summary",contexts:["all"]}),chrome.tabs.create({url:"https://fxhd.notion.site/summarizooor-chrome-extension-317ba7f2f1c5443cbc99a220c5d073b0"}),i();const e=Date.now().toString()+Math.random().toString(36).substring(2,15);chrome.storage.local.set({uniqueUserId:e},(()=>{console.log("Unique user ID stored in chrome.storage.local: "+e)}))})),chrome.contextMenus.onClicked.addListener(((e,t)=>{e.selectionText?n(e.selectionText,0,t):chrome.tabs.sendMessage(t.id,{type:"get_webpage"},(e=>{console.log("webpage content received: ",e),n(e.text,0,t)}))})),chrome.runtime.onStartup.addListener((()=>{i()})),chrome.runtime.setUninstallURL("https://forms.gle/a7gvUaSBdi8gfyUKA")})();