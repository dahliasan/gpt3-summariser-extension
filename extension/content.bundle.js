(()=>{var e={893:e=>{var t={unlikelyCandidates:/-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,okMaybeItsACandidate:/and|article|body|column|content|main|shadow/i};function i(e){return(!e.style||"none"!=e.style.display)&&!e.hasAttribute("hidden")&&(!e.hasAttribute("aria-hidden")||"true"!=e.getAttribute("aria-hidden")||e.className&&e.className.indexOf&&-1!==e.className.indexOf("fallback-image"))}e.exports=function(e,n={}){"function"==typeof n&&(n={visibilityChecker:n});var a={minScore:20,minContentLength:140,visibilityChecker:i};n=Object.assign(a,n);var r=e.querySelectorAll("p, pre, article"),s=e.querySelectorAll("div > br");if(s.length){var o=new Set(r);[].forEach.call(s,(function(e){o.add(e.parentNode)})),r=Array.from(o)}var l=0;return[].some.call(r,(function(e){if(!n.visibilityChecker(e))return!1;var i=e.className+" "+e.id;if(t.unlikelyCandidates.test(i)&&!t.okMaybeItsACandidate.test(i))return!1;if(e.matches("li p"))return!1;var a=e.textContent.trim().length;return!(a<n.minContentLength)&&(l+=Math.sqrt(a-n.minContentLength))>n.minScore}))}},174:e=>{function t(e,t){if(t&&t.documentElement)e=t,t=arguments[2];else if(!e||!e.documentElement)throw new Error("First argument to Readability constructor should be a document object.");if(t=t||{},this._doc=e,this._docJSDOMParser=this._doc.firstChild.__JSDOMParser__,this._articleTitle=null,this._articleByline=null,this._articleDir=null,this._articleSiteName=null,this._attempts=[],this._debug=!!t.debug,this._maxElemsToParse=t.maxElemsToParse||this.DEFAULT_MAX_ELEMS_TO_PARSE,this._nbTopCandidates=t.nbTopCandidates||this.DEFAULT_N_TOP_CANDIDATES,this._charThreshold=t.charThreshold||this.DEFAULT_CHAR_THRESHOLD,this._classesToPreserve=this.CLASSES_TO_PRESERVE.concat(t.classesToPreserve||[]),this._keepClasses=!!t.keepClasses,this._serializer=t.serializer||function(e){return e.innerHTML},this._disableJSONLD=!!t.disableJSONLD,this._flags=this.FLAG_STRIP_UNLIKELYS|this.FLAG_WEIGHT_CLASSES|this.FLAG_CLEAN_CONDITIONALLY,this._debug){let e=function(e){if(e.nodeType==e.TEXT_NODE)return`${e.nodeName} ("${e.textContent}")`;let t=Array.from(e.attributes||[],(function(e){return`${e.name}="${e.value}"`})).join(" ");return`<${e.localName} ${t}>`};this.log=function(){if("undefined"!=typeof dump){var t=Array.prototype.map.call(arguments,(function(t){return t&&t.nodeName?e(t):t})).join(" ");dump("Reader: (Readability) "+t+"\n")}else if("undefined"!=typeof console){let t=Array.from(arguments,(t=>t&&t.nodeType==this.ELEMENT_NODE?e(t):t));t.unshift("Reader: (Readability)"),console.log.apply(console,t)}}}else this.log=function(){}}t.prototype={FLAG_STRIP_UNLIKELYS:1,FLAG_WEIGHT_CLASSES:2,FLAG_CLEAN_CONDITIONALLY:4,ELEMENT_NODE:1,TEXT_NODE:3,DEFAULT_MAX_ELEMS_TO_PARSE:0,DEFAULT_N_TOP_CANDIDATES:5,DEFAULT_TAGS_TO_SCORE:"section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),DEFAULT_CHAR_THRESHOLD:500,REGEXPS:{unlikelyCandidates:/-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,okMaybeItsACandidate:/and|article|body|column|content|main|shadow/i,positive:/article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,negative:/-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,extraneous:/print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,byline:/byline|author|dateline|writtenby|p-author/i,replaceFonts:/<(\/?)font[^>]*>/gi,normalize:/\s{2,}/g,videos:/\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,shareElements:/(\b|_)(share|sharedaddy)(\b|_)/i,nextLink:/(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,prevLink:/(prev|earl|old|new|<|«)/i,tokenize:/\W+/g,whitespace:/^\s*$/,hasContent:/\S$/,hashUrl:/^#.+/,srcsetUrl:/(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,b64DataUrl:/^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,jsonLdArticleTypes:/^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/},UNLIKELY_ROLES:["menu","menubar","complementary","navigation","alert","alertdialog","dialog"],DIV_TO_P_ELEMS:new Set(["BLOCKQUOTE","DL","DIV","IMG","OL","P","PRE","TABLE","UL"]),ALTER_TO_DIV_EXCEPTIONS:["DIV","ARTICLE","SECTION","P"],PRESENTATIONAL_ATTRIBUTES:["align","background","bgcolor","border","cellpadding","cellspacing","frame","hspace","rules","style","valign","vspace"],DEPRECATED_SIZE_ATTRIBUTE_ELEMS:["TABLE","TH","TD","HR","PRE"],PHRASING_ELEMS:["ABBR","AUDIO","B","BDO","BR","BUTTON","CITE","CODE","DATA","DATALIST","DFN","EM","EMBED","I","IMG","INPUT","KBD","LABEL","MARK","MATH","METER","NOSCRIPT","OBJECT","OUTPUT","PROGRESS","Q","RUBY","SAMP","SCRIPT","SELECT","SMALL","SPAN","STRONG","SUB","SUP","TEXTAREA","TIME","VAR","WBR"],CLASSES_TO_PRESERVE:["page"],HTML_ESCAPE_MAP:{lt:"<",gt:">",amp:"&",quot:'"',apos:"'"},_postProcessContent:function(e){this._fixRelativeUris(e),this._simplifyNestedElements(e),this._keepClasses||this._cleanClasses(e)},_removeNodes:function(e,t){if(this._docJSDOMParser&&e._isLiveNodeList)throw new Error("Do not pass live node lists to _removeNodes");for(var i=e.length-1;i>=0;i--){var n=e[i],a=n.parentNode;a&&(t&&!t.call(this,n,i,e)||a.removeChild(n))}},_replaceNodeTags:function(e,t){if(this._docJSDOMParser&&e._isLiveNodeList)throw new Error("Do not pass live node lists to _replaceNodeTags");for(const i of e)this._setNodeTag(i,t)},_forEachNode:function(e,t){Array.prototype.forEach.call(e,t,this)},_findNode:function(e,t){return Array.prototype.find.call(e,t,this)},_someNode:function(e,t){return Array.prototype.some.call(e,t,this)},_everyNode:function(e,t){return Array.prototype.every.call(e,t,this)},_concatNodeLists:function(){var e=Array.prototype.slice,t=e.call(arguments),i=t.map((function(t){return e.call(t)}));return Array.prototype.concat.apply([],i)},_getAllNodesWithTag:function(e,t){return e.querySelectorAll?e.querySelectorAll(t.join(",")):[].concat.apply([],t.map((function(t){var i=e.getElementsByTagName(t);return Array.isArray(i)?i:Array.from(i)})))},_cleanClasses:function(e){var t=this._classesToPreserve,i=(e.getAttribute("class")||"").split(/\s+/).filter((function(e){return-1!=t.indexOf(e)})).join(" ");for(i?e.setAttribute("class",i):e.removeAttribute("class"),e=e.firstElementChild;e;e=e.nextElementSibling)this._cleanClasses(e)},_fixRelativeUris:function(e){var t=this._doc.baseURI,i=this._doc.documentURI;function n(e){if(t==i&&"#"==e.charAt(0))return e;try{return new URL(e,t).href}catch(e){}return e}var a=this._getAllNodesWithTag(e,["a"]);this._forEachNode(a,(function(e){var t=e.getAttribute("href");if(t)if(0===t.indexOf("javascript:"))if(1===e.childNodes.length&&e.childNodes[0].nodeType===this.TEXT_NODE){var i=this._doc.createTextNode(e.textContent);e.parentNode.replaceChild(i,e)}else{for(var a=this._doc.createElement("span");e.firstChild;)a.appendChild(e.firstChild);e.parentNode.replaceChild(a,e)}else e.setAttribute("href",n(t))}));var r=this._getAllNodesWithTag(e,["img","picture","figure","video","audio","source"]);this._forEachNode(r,(function(e){var t=e.getAttribute("src"),i=e.getAttribute("poster"),a=e.getAttribute("srcset");if(t&&e.setAttribute("src",n(t)),i&&e.setAttribute("poster",n(i)),a){var r=a.replace(this.REGEXPS.srcsetUrl,(function(e,t,i,a){return n(t)+(i||"")+a}));e.setAttribute("srcset",r)}}))},_simplifyNestedElements:function(e){for(var t=e;t;){if(t.parentNode&&["DIV","SECTION"].includes(t.tagName)&&(!t.id||!t.id.startsWith("readability"))){if(this._isElementWithoutContent(t)){t=this._removeAndGetNext(t);continue}if(this._hasSingleTagInsideElement(t,"DIV")||this._hasSingleTagInsideElement(t,"SECTION")){for(var i=t.children[0],n=0;n<t.attributes.length;n++)i.setAttribute(t.attributes[n].name,t.attributes[n].value);t.parentNode.replaceChild(i,t),t=i;continue}}t=this._getNextNode(t)}},_getArticleTitle:function(){var e=this._doc,t="",i="";try{"string"!=typeof(t=i=e.title.trim())&&(t=i=this._getInnerText(e.getElementsByTagName("title")[0]))}catch(e){}var n=!1;function a(e){return e.split(/\s+/).length}if(/ [\|\-\\\/>»] /.test(t))n=/ [\\\/>»] /.test(t),a(t=i.replace(/(.*)[\|\-\\\/>»] .*/gi,"$1"))<3&&(t=i.replace(/[^\|\-\\\/>»]*[\|\-\\\/>»](.*)/gi,"$1"));else if(-1!==t.indexOf(": ")){var r=this._concatNodeLists(e.getElementsByTagName("h1"),e.getElementsByTagName("h2")),s=t.trim();this._someNode(r,(function(e){return e.textContent.trim()===s}))||(a(t=i.substring(i.lastIndexOf(":")+1))<3?t=i.substring(i.indexOf(":")+1):a(i.substr(0,i.indexOf(":")))>5&&(t=i))}else if(t.length>150||t.length<15){var o=e.getElementsByTagName("h1");1===o.length&&(t=this._getInnerText(o[0]))}var l=a(t=t.trim().replace(this.REGEXPS.normalize," "));return l<=4&&(!n||l!=a(i.replace(/[\|\-\\\/>»]+/g,""))-1)&&(t=i),t},_prepDocument:function(){var e=this._doc;this._removeNodes(this._getAllNodesWithTag(e,["style"])),e.body&&this._replaceBrs(e.body),this._replaceNodeTags(this._getAllNodesWithTag(e,["font"]),"SPAN")},_nextNode:function(e){for(var t=e;t&&t.nodeType!=this.ELEMENT_NODE&&this.REGEXPS.whitespace.test(t.textContent);)t=t.nextSibling;return t},_replaceBrs:function(e){this._forEachNode(this._getAllNodesWithTag(e,["br"]),(function(e){for(var t=e.nextSibling,i=!1;(t=this._nextNode(t))&&"BR"==t.tagName;){i=!0;var n=t.nextSibling;t.parentNode.removeChild(t),t=n}if(i){var a=this._doc.createElement("p");for(e.parentNode.replaceChild(a,e),t=a.nextSibling;t;){if("BR"==t.tagName){var r=this._nextNode(t.nextSibling);if(r&&"BR"==r.tagName)break}if(!this._isPhrasingContent(t))break;var s=t.nextSibling;a.appendChild(t),t=s}for(;a.lastChild&&this._isWhitespace(a.lastChild);)a.removeChild(a.lastChild);"P"===a.parentNode.tagName&&this._setNodeTag(a.parentNode,"DIV")}}))},_setNodeTag:function(e,t){if(this.log("_setNodeTag",e,t),this._docJSDOMParser)return e.localName=t.toLowerCase(),e.tagName=t.toUpperCase(),e;for(var i=e.ownerDocument.createElement(t);e.firstChild;)i.appendChild(e.firstChild);e.parentNode.replaceChild(i,e),e.readability&&(i.readability=e.readability);for(var n=0;n<e.attributes.length;n++)try{i.setAttribute(e.attributes[n].name,e.attributes[n].value)}catch(e){}return i},_prepArticle:function(e){this._cleanStyles(e),this._markDataTables(e),this._fixLazyImages(e),this._cleanConditionally(e,"form"),this._cleanConditionally(e,"fieldset"),this._clean(e,"object"),this._clean(e,"embed"),this._clean(e,"footer"),this._clean(e,"link"),this._clean(e,"aside");var t=this.DEFAULT_CHAR_THRESHOLD;this._forEachNode(e.children,(function(e){this._cleanMatchedNodes(e,(function(e,i){return this.REGEXPS.shareElements.test(i)&&e.textContent.length<t}))})),this._clean(e,"iframe"),this._clean(e,"input"),this._clean(e,"textarea"),this._clean(e,"select"),this._clean(e,"button"),this._cleanHeaders(e),this._cleanConditionally(e,"table"),this._cleanConditionally(e,"ul"),this._cleanConditionally(e,"div"),this._replaceNodeTags(this._getAllNodesWithTag(e,["h1"]),"h2"),this._removeNodes(this._getAllNodesWithTag(e,["p"]),(function(e){return 0===e.getElementsByTagName("img").length+e.getElementsByTagName("embed").length+e.getElementsByTagName("object").length+e.getElementsByTagName("iframe").length&&!this._getInnerText(e,!1)})),this._forEachNode(this._getAllNodesWithTag(e,["br"]),(function(e){var t=this._nextNode(e.nextSibling);t&&"P"==t.tagName&&e.parentNode.removeChild(e)})),this._forEachNode(this._getAllNodesWithTag(e,["table"]),(function(e){var t=this._hasSingleTagInsideElement(e,"TBODY")?e.firstElementChild:e;if(this._hasSingleTagInsideElement(t,"TR")){var i=t.firstElementChild;if(this._hasSingleTagInsideElement(i,"TD")){var n=i.firstElementChild;n=this._setNodeTag(n,this._everyNode(n.childNodes,this._isPhrasingContent)?"P":"DIV"),e.parentNode.replaceChild(n,e)}}}))},_initializeNode:function(e){switch(e.readability={contentScore:0},e.tagName){case"DIV":e.readability.contentScore+=5;break;case"PRE":case"TD":case"BLOCKQUOTE":e.readability.contentScore+=3;break;case"ADDRESS":case"OL":case"UL":case"DL":case"DD":case"DT":case"LI":case"FORM":e.readability.contentScore-=3;break;case"H1":case"H2":case"H3":case"H4":case"H5":case"H6":case"TH":e.readability.contentScore-=5}e.readability.contentScore+=this._getClassWeight(e)},_removeAndGetNext:function(e){var t=this._getNextNode(e,!0);return e.parentNode.removeChild(e),t},_getNextNode:function(e,t){if(!t&&e.firstElementChild)return e.firstElementChild;if(e.nextElementSibling)return e.nextElementSibling;do{e=e.parentNode}while(e&&!e.nextElementSibling);return e&&e.nextElementSibling},_textSimilarity:function(e,t){var i=e.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean),n=t.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);return i.length&&n.length?1-n.filter((e=>!i.includes(e))).join(" ").length/n.join(" ").length:0},_checkByline:function(e,t){if(this._articleByline)return!1;if(void 0!==e.getAttribute)var i=e.getAttribute("rel"),n=e.getAttribute("itemprop");return!(!("author"===i||n&&-1!==n.indexOf("author")||this.REGEXPS.byline.test(t))||!this._isValidByline(e.textContent)||(this._articleByline=e.textContent.trim(),0))},_getNodeAncestors:function(e,t){t=t||0;for(var i=0,n=[];e.parentNode&&(n.push(e.parentNode),!t||++i!==t);)e=e.parentNode;return n},_grabArticle:function(e){this.log("**** grabArticle ****");var t=this._doc,i=null!==e;if(!(e=e||this._doc.body))return this.log("No body found in document. Abort."),null;for(var n=e.innerHTML;;){this.log("Starting grabArticle loop");var a=this._flagIsActive(this.FLAG_STRIP_UNLIKELYS),r=[],s=this._doc.documentElement;let V=!0;for(;s;){"HTML"===s.tagName&&(this._articleLang=s.getAttribute("lang"));var o=s.className+" "+s.id;if(this._isProbablyVisible(s))if(this._checkByline(s,o))s=this._removeAndGetNext(s);else if(V&&this._headerDuplicatesTitle(s))this.log("Removing header: ",s.textContent.trim(),this._articleTitle.trim()),V=!1,s=this._removeAndGetNext(s);else{if(a){if(this.REGEXPS.unlikelyCandidates.test(o)&&!this.REGEXPS.okMaybeItsACandidate.test(o)&&!this._hasAncestorTag(s,"table")&&!this._hasAncestorTag(s,"code")&&"BODY"!==s.tagName&&"A"!==s.tagName){this.log("Removing unlikely candidate - "+o),s=this._removeAndGetNext(s);continue}if(this.UNLIKELY_ROLES.includes(s.getAttribute("role"))){this.log("Removing content with role "+s.getAttribute("role")+" - "+o),s=this._removeAndGetNext(s);continue}}if("DIV"!==s.tagName&&"SECTION"!==s.tagName&&"HEADER"!==s.tagName&&"H1"!==s.tagName&&"H2"!==s.tagName&&"H3"!==s.tagName&&"H4"!==s.tagName&&"H5"!==s.tagName&&"H6"!==s.tagName||!this._isElementWithoutContent(s)){if(-1!==this.DEFAULT_TAGS_TO_SCORE.indexOf(s.tagName)&&r.push(s),"DIV"===s.tagName){for(var l=null,h=s.firstChild;h;){var c=h.nextSibling;if(this._isPhrasingContent(h))null!==l?l.appendChild(h):this._isWhitespace(h)||(l=t.createElement("p"),s.replaceChild(l,h),l.appendChild(h));else if(null!==l){for(;l.lastChild&&this._isWhitespace(l.lastChild);)l.removeChild(l.lastChild);l=null}h=c}if(this._hasSingleTagInsideElement(s,"P")&&this._getLinkDensity(s)<.25){var d=s.children[0];s.parentNode.replaceChild(d,s),s=d,r.push(s)}else this._hasChildBlockElement(s)||(s=this._setNodeTag(s,"P"),r.push(s))}s=this._getNextNode(s)}else s=this._removeAndGetNext(s)}else this.log("Removing hidden node - "+o),s=this._removeAndGetNext(s)}var g=[];this._forEachNode(r,(function(e){if(e.parentNode&&void 0!==e.parentNode.tagName){var t=this._getInnerText(e);if(!(t.length<25)){var i=this._getNodeAncestors(e,5);if(0!==i.length){var n=0;n+=1,n+=t.split(",").length,n+=Math.min(Math.floor(t.length/100),3),this._forEachNode(i,(function(e,t){if(e.tagName&&e.parentNode&&void 0!==e.parentNode.tagName){if(void 0===e.readability&&(this._initializeNode(e),g.push(e)),0===t)var i=1;else i=1===t?2:3*t;e.readability.contentScore+=n/i}}))}}}}));for(var u=[],m=0,f=g.length;m<f;m+=1){var _=g[m],p=_.readability.contentScore*(1-this._getLinkDensity(_));_.readability.contentScore=p,this.log("Candidate:",_,"with score "+p);for(var N=0;N<this._nbTopCandidates;N++){var E=u[N];if(!E||p>E.readability.contentScore){u.splice(N,0,_),u.length>this._nbTopCandidates&&u.pop();break}}}var b,T=u[0]||null,v=!1;if(null===T||"BODY"===T.tagName){for(T=t.createElement("DIV"),v=!0;e.firstChild;)this.log("Moving child out:",e.firstChild),T.appendChild(e.firstChild);e.appendChild(T),this._initializeNode(T)}else if(T){for(var y=[],A=1;A<u.length;A++)u[A].readability.contentScore/T.readability.contentScore>=.75&&y.push(this._getNodeAncestors(u[A]));if(y.length>=3)for(b=T.parentNode;"BODY"!==b.tagName;){for(var S=0,C=0;C<y.length&&S<3;C++)S+=Number(y[C].includes(b));if(S>=3){T=b;break}b=b.parentNode}T.readability||this._initializeNode(T),b=T.parentNode;for(var L=T.readability.contentScore,x=L/3;"BODY"!==b.tagName;)if(b.readability){var I=b.readability.contentScore;if(I<x)break;if(I>L){T=b;break}L=b.readability.contentScore,b=b.parentNode}else b=b.parentNode;for(b=T.parentNode;"BODY"!=b.tagName&&1==b.children.length;)b=(T=b).parentNode;T.readability||this._initializeNode(T)}var D=t.createElement("DIV");i&&(D.id="readability-content");for(var R=Math.max(10,.2*T.readability.contentScore),O=(b=T.parentNode).children,P=0,w=O.length;P<w;P++){var B=O[P],M=!1;if(this.log("Looking at sibling node:",B,B.readability?"with score "+B.readability.contentScore:""),this.log("Sibling has score",B.readability?B.readability.contentScore:"Unknown"),B===T)M=!0;else{var G=0;if(B.className===T.className&&""!==T.className&&(G+=.2*T.readability.contentScore),B.readability&&B.readability.contentScore+G>=R)M=!0;else if("P"===B.nodeName){var H=this._getLinkDensity(B),k=this._getInnerText(B),U=k.length;(U>80&&H<.25||U<80&&U>0&&0===H&&-1!==k.search(/\.( |$)/))&&(M=!0)}}M&&(this.log("Appending node:",B),-1===this.ALTER_TO_DIV_EXCEPTIONS.indexOf(B.nodeName)&&(this.log("Altering sibling:",B,"to div."),B=this._setNodeTag(B,"DIV")),D.appendChild(B),O=b.children,P-=1,w-=1)}if(this._debug&&this.log("Article content pre-prep: "+D.innerHTML),this._prepArticle(D),this._debug&&this.log("Article content post-prep: "+D.innerHTML),v)T.id="readability-page-1",T.className="page";else{var W=t.createElement("DIV");for(W.id="readability-page-1",W.className="page";D.firstChild;)W.appendChild(D.firstChild);D.appendChild(W)}this._debug&&this.log("Article content after paging: "+D.innerHTML);var X=!0,j=this._getInnerText(D,!0).length;if(j<this._charThreshold)if(X=!1,e.innerHTML=n,this._flagIsActive(this.FLAG_STRIP_UNLIKELYS))this._removeFlag(this.FLAG_STRIP_UNLIKELYS),this._attempts.push({articleContent:D,textLength:j});else if(this._flagIsActive(this.FLAG_WEIGHT_CLASSES))this._removeFlag(this.FLAG_WEIGHT_CLASSES),this._attempts.push({articleContent:D,textLength:j});else if(this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY),this._attempts.push({articleContent:D,textLength:j});else{if(this._attempts.push({articleContent:D,textLength:j}),this._attempts.sort((function(e,t){return t.textLength-e.textLength})),!this._attempts[0].textLength)return null;D=this._attempts[0].articleContent,X=!0}if(X){var F=[b,T].concat(this._getNodeAncestors(b));return this._someNode(F,(function(e){if(!e.tagName)return!1;var t=e.getAttribute("dir");return!!t&&(this._articleDir=t,!0)})),D}}},_isValidByline:function(e){return("string"==typeof e||e instanceof String)&&(e=e.trim()).length>0&&e.length<100},_unescapeHtmlEntities:function(e){if(!e)return e;var t=this.HTML_ESCAPE_MAP;return e.replace(/&(quot|amp|apos|lt|gt);/g,(function(e,i){return t[i]})).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi,(function(e,t,i){var n=parseInt(t||i,t?16:10);return String.fromCharCode(n)}))},_getJSONLD:function(e){var t,i=this._getAllNodesWithTag(e,["script"]);return this._forEachNode(i,(function(e){if(!t&&"application/ld+json"===e.getAttribute("type"))try{var i=e.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g,""),n=JSON.parse(i);if(!n["@context"]||!n["@context"].match(/^https?\:\/\/schema\.org$/))return;if(!n["@type"]&&Array.isArray(n["@graph"])&&(n=n["@graph"].find((function(e){return(e["@type"]||"").match(this.REGEXPS.jsonLdArticleTypes)}))),!n||!n["@type"]||!n["@type"].match(this.REGEXPS.jsonLdArticleTypes))return;if(t={},"string"==typeof n.name&&"string"==typeof n.headline&&n.name!==n.headline){var a=this._getArticleTitle(),r=this._textSimilarity(n.name,a)>.75,s=this._textSimilarity(n.headline,a)>.75;t.title=s&&!r?n.headline:n.name}else"string"==typeof n.name?t.title=n.name.trim():"string"==typeof n.headline&&(t.title=n.headline.trim());return n.author&&("string"==typeof n.author.name?t.byline=n.author.name.trim():Array.isArray(n.author)&&n.author[0]&&"string"==typeof n.author[0].name&&(t.byline=n.author.filter((function(e){return e&&"string"==typeof e.name})).map((function(e){return e.name.trim()})).join(", "))),"string"==typeof n.description&&(t.excerpt=n.description.trim()),void(n.publisher&&"string"==typeof n.publisher.name&&(t.siteName=n.publisher.name.trim()))}catch(e){this.log(e.message)}})),t||{}},_getArticleMetadata:function(e){var t={},i={},n=this._doc.getElementsByTagName("meta"),a=/\s*(dc|dcterm|og|twitter)\s*:\s*(author|creator|description|title|site_name)\s*/gi,r=/^\s*(?:(dc|dcterm|og|twitter|weibo:(article|webpage))\s*[\.:]\s*)?(author|creator|description|title|site_name)\s*$/i;return this._forEachNode(n,(function(e){var t=e.getAttribute("name"),n=e.getAttribute("property"),s=e.getAttribute("content");if(s){var o=null,l=null;n&&(o=n.match(a))&&(l=o[0].toLowerCase().replace(/\s/g,""),i[l]=s.trim()),!o&&t&&r.test(t)&&(l=t,s&&(l=l.toLowerCase().replace(/\s/g,"").replace(/\./g,":"),i[l]=s.trim()))}})),t.title=e.title||i["dc:title"]||i["dcterm:title"]||i["og:title"]||i["weibo:article:title"]||i["weibo:webpage:title"]||i.title||i["twitter:title"],t.title||(t.title=this._getArticleTitle()),t.byline=e.byline||i["dc:creator"]||i["dcterm:creator"]||i.author,t.excerpt=e.excerpt||i["dc:description"]||i["dcterm:description"]||i["og:description"]||i["weibo:article:description"]||i["weibo:webpage:description"]||i.description||i["twitter:description"],t.siteName=e.siteName||i["og:site_name"],t.title=this._unescapeHtmlEntities(t.title),t.byline=this._unescapeHtmlEntities(t.byline),t.excerpt=this._unescapeHtmlEntities(t.excerpt),t.siteName=this._unescapeHtmlEntities(t.siteName),t},_isSingleImage:function(e){return"IMG"===e.tagName||1===e.children.length&&""===e.textContent.trim()&&this._isSingleImage(e.children[0])},_unwrapNoscriptImages:function(e){var t=Array.from(e.getElementsByTagName("img"));this._forEachNode(t,(function(e){for(var t=0;t<e.attributes.length;t++){var i=e.attributes[t];switch(i.name){case"src":case"srcset":case"data-src":case"data-srcset":return}if(/\.(jpg|jpeg|png|webp)/i.test(i.value))return}e.parentNode.removeChild(e)}));var i=Array.from(e.getElementsByTagName("noscript"));this._forEachNode(i,(function(t){var i=e.createElement("div");if(i.innerHTML=t.innerHTML,this._isSingleImage(i)){var n=t.previousElementSibling;if(n&&this._isSingleImage(n)){var a=n;"IMG"!==a.tagName&&(a=n.getElementsByTagName("img")[0]);for(var r=i.getElementsByTagName("img")[0],s=0;s<a.attributes.length;s++){var o=a.attributes[s];if(""!==o.value&&("src"===o.name||"srcset"===o.name||/\.(jpg|jpeg|png|webp)/i.test(o.value))){if(r.getAttribute(o.name)===o.value)continue;var l=o.name;r.hasAttribute(l)&&(l="data-old-"+l),r.setAttribute(l,o.value)}}t.parentNode.replaceChild(i.firstElementChild,n)}}}))},_removeScripts:function(e){this._removeNodes(this._getAllNodesWithTag(e,["script"]),(function(e){return e.nodeValue="",e.removeAttribute("src"),!0})),this._removeNodes(this._getAllNodesWithTag(e,["noscript"]))},_hasSingleTagInsideElement:function(e,t){return 1==e.children.length&&e.children[0].tagName===t&&!this._someNode(e.childNodes,(function(e){return e.nodeType===this.TEXT_NODE&&this.REGEXPS.hasContent.test(e.textContent)}))},_isElementWithoutContent:function(e){return e.nodeType===this.ELEMENT_NODE&&0==e.textContent.trim().length&&(0==e.children.length||e.children.length==e.getElementsByTagName("br").length+e.getElementsByTagName("hr").length)},_hasChildBlockElement:function(e){return this._someNode(e.childNodes,(function(e){return this.DIV_TO_P_ELEMS.has(e.tagName)||this._hasChildBlockElement(e)}))},_isPhrasingContent:function(e){return e.nodeType===this.TEXT_NODE||-1!==this.PHRASING_ELEMS.indexOf(e.tagName)||("A"===e.tagName||"DEL"===e.tagName||"INS"===e.tagName)&&this._everyNode(e.childNodes,this._isPhrasingContent)},_isWhitespace:function(e){return e.nodeType===this.TEXT_NODE&&0===e.textContent.trim().length||e.nodeType===this.ELEMENT_NODE&&"BR"===e.tagName},_getInnerText:function(e,t){t=void 0===t||t;var i=e.textContent.trim();return t?i.replace(this.REGEXPS.normalize," "):i},_getCharCount:function(e,t){return t=t||",",this._getInnerText(e).split(t).length-1},_cleanStyles:function(e){if(e&&"svg"!==e.tagName.toLowerCase()){for(var t=0;t<this.PRESENTATIONAL_ATTRIBUTES.length;t++)e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[t]);-1!==this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.indexOf(e.tagName)&&(e.removeAttribute("width"),e.removeAttribute("height"));for(var i=e.firstElementChild;null!==i;)this._cleanStyles(i),i=i.nextElementSibling}},_getLinkDensity:function(e){var t=this._getInnerText(e).length;if(0===t)return 0;var i=0;return this._forEachNode(e.getElementsByTagName("a"),(function(e){var t=e.getAttribute("href"),n=t&&this.REGEXPS.hashUrl.test(t)?.3:1;i+=this._getInnerText(e).length*n})),i/t},_getClassWeight:function(e){if(!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))return 0;var t=0;return"string"==typeof e.className&&""!==e.className&&(this.REGEXPS.negative.test(e.className)&&(t-=25),this.REGEXPS.positive.test(e.className)&&(t+=25)),"string"==typeof e.id&&""!==e.id&&(this.REGEXPS.negative.test(e.id)&&(t-=25),this.REGEXPS.positive.test(e.id)&&(t+=25)),t},_clean:function(e,t){var i=-1!==["object","embed","iframe"].indexOf(t);this._removeNodes(this._getAllNodesWithTag(e,[t]),(function(e){if(i){for(var t=0;t<e.attributes.length;t++)if(this.REGEXPS.videos.test(e.attributes[t].value))return!1;if("object"===e.tagName&&this.REGEXPS.videos.test(e.innerHTML))return!1}return!0}))},_hasAncestorTag:function(e,t,i,n){i=i||3,t=t.toUpperCase();for(var a=0;e.parentNode;){if(i>0&&a>i)return!1;if(e.parentNode.tagName===t&&(!n||n(e.parentNode)))return!0;e=e.parentNode,a++}return!1},_getRowAndColumnCount:function(e){for(var t=0,i=0,n=e.getElementsByTagName("tr"),a=0;a<n.length;a++){var r=n[a].getAttribute("rowspan")||0;r&&(r=parseInt(r,10)),t+=r||1;for(var s=0,o=n[a].getElementsByTagName("td"),l=0;l<o.length;l++){var h=o[l].getAttribute("colspan")||0;h&&(h=parseInt(h,10)),s+=h||1}i=Math.max(i,s)}return{rows:t,columns:i}},_markDataTables:function(e){for(var t=e.getElementsByTagName("table"),i=0;i<t.length;i++){var n=t[i];if("presentation"!=n.getAttribute("role"))if("0"!=n.getAttribute("datatable"))if(n.getAttribute("summary"))n._readabilityDataTable=!0;else{var a=n.getElementsByTagName("caption")[0];if(a&&a.childNodes.length>0)n._readabilityDataTable=!0;else if(["col","colgroup","tfoot","thead","th"].some((function(e){return!!n.getElementsByTagName(e)[0]})))this.log("Data table because found data-y descendant"),n._readabilityDataTable=!0;else if(n.getElementsByTagName("table")[0])n._readabilityDataTable=!1;else{var r=this._getRowAndColumnCount(n);r.rows>=10||r.columns>4?n._readabilityDataTable=!0:n._readabilityDataTable=r.rows*r.columns>10}}else n._readabilityDataTable=!1;else n._readabilityDataTable=!1}},_fixLazyImages:function(e){this._forEachNode(this._getAllNodesWithTag(e,["img","picture","figure"]),(function(e){if(e.src&&this.REGEXPS.b64DataUrl.test(e.src)){if("image/svg+xml"===this.REGEXPS.b64DataUrl.exec(e.src)[1])return;for(var t=!1,i=0;i<e.attributes.length;i++){var n=e.attributes[i];if("src"!==n.name&&/\.(jpg|jpeg|png|webp)/i.test(n.value)){t=!0;break}}if(t){var a=e.src.search(/base64\s*/i)+7;e.src.length-a<133&&e.removeAttribute("src")}}if(!(e.src||e.srcset&&"null"!=e.srcset)||-1!==e.className.toLowerCase().indexOf("lazy"))for(var r=0;r<e.attributes.length;r++)if("src"!==(n=e.attributes[r]).name&&"srcset"!==n.name&&"alt"!==n.name){var s=null;if(/\.(jpg|jpeg|png|webp)\s+\d/.test(n.value)?s="srcset":/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(n.value)&&(s="src"),s)if("IMG"===e.tagName||"PICTURE"===e.tagName)e.setAttribute(s,n.value);else if("FIGURE"===e.tagName&&!this._getAllNodesWithTag(e,["img","picture"]).length){var o=this._doc.createElement("img");o.setAttribute(s,n.value),e.appendChild(o)}}}))},_getTextDensity:function(e,t){var i=this._getInnerText(e,!0).length;if(0===i)return 0;var n=0,a=this._getAllNodesWithTag(e,t);return this._forEachNode(a,(e=>n+=this._getInnerText(e,!0).length)),n/i},_cleanConditionally:function(e,t){this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)&&this._removeNodes(this._getAllNodesWithTag(e,[t]),(function(e){var i=function(e){return e._readabilityDataTable},n="ul"===t||"ol"===t;if(!n){var a=0,r=this._getAllNodesWithTag(e,["ul","ol"]);this._forEachNode(r,(e=>a+=this._getInnerText(e).length)),n=a/this._getInnerText(e).length>.9}if("table"===t&&i(e))return!1;if(this._hasAncestorTag(e,"table",-1,i))return!1;if(this._hasAncestorTag(e,"code"))return!1;var s=this._getClassWeight(e);if(this.log("Cleaning Conditionally",e),s+0<0)return!0;if(this._getCharCount(e,",")<10){for(var o=e.getElementsByTagName("p").length,l=e.getElementsByTagName("img").length,h=e.getElementsByTagName("li").length-100,c=e.getElementsByTagName("input").length,d=this._getTextDensity(e,["h1","h2","h3","h4","h5","h6"]),g=0,u=this._getAllNodesWithTag(e,["object","embed","iframe"]),m=0;m<u.length;m++){for(var f=0;f<u[m].attributes.length;f++)if(this.REGEXPS.videos.test(u[m].attributes[f].value))return!1;if("object"===u[m].tagName&&this.REGEXPS.videos.test(u[m].innerHTML))return!1;g++}var _=this._getLinkDensity(e),p=this._getInnerText(e).length;return l>1&&o/l<.5&&!this._hasAncestorTag(e,"figure")||!n&&h>o||c>Math.floor(o/3)||!n&&d<.9&&p<25&&(0===l||l>2)&&!this._hasAncestorTag(e,"figure")||!n&&s<25&&_>.2||s>=25&&_>.5||1===g&&p<75||g>1}return!1}))},_cleanMatchedNodes:function(e,t){for(var i=this._getNextNode(e,!0),n=this._getNextNode(e);n&&n!=i;)n=t.call(this,n,n.className+" "+n.id)?this._removeAndGetNext(n):this._getNextNode(n)},_cleanHeaders:function(e){let t=this._getAllNodesWithTag(e,["h1","h2"]);this._removeNodes(t,(function(e){let t=this._getClassWeight(e)<0;return t&&this.log("Removing header with low class weight:",e),t}))},_headerDuplicatesTitle:function(e){if("H1"!=e.tagName&&"H2"!=e.tagName)return!1;var t=this._getInnerText(e,!1);return this.log("Evaluating similarity of header:",t,this._articleTitle),this._textSimilarity(this._articleTitle,t)>.75},_flagIsActive:function(e){return(this._flags&e)>0},_removeFlag:function(e){this._flags=this._flags&~e},_isProbablyVisible:function(e){return(!e.style||"none"!=e.style.display)&&!e.hasAttribute("hidden")&&(!e.hasAttribute("aria-hidden")||"true"!=e.getAttribute("aria-hidden")||e.className&&e.className.indexOf&&-1!==e.className.indexOf("fallback-image"))},parse:function(){if(this._maxElemsToParse>0){var e=this._doc.getElementsByTagName("*").length;if(e>this._maxElemsToParse)throw new Error("Aborting parsing document; "+e+" elements found")}this._unwrapNoscriptImages(this._doc);var t=this._disableJSONLD?{}:this._getJSONLD(this._doc);this._removeScripts(this._doc),this._prepDocument();var i=this._getArticleMetadata(t);this._articleTitle=i.title;var n=this._grabArticle();if(!n)return null;if(this.log("Grabbed: "+n.innerHTML),this._postProcessContent(n),!i.excerpt){var a=n.getElementsByTagName("p");a.length>0&&(i.excerpt=a[0].textContent.trim())}var r=n.textContent;return{title:this._articleTitle,byline:i.byline||this._articleByline,dir:this._articleDir,lang:this._articleLang,content:this._serializer(n),textContent:r,length:r.length,excerpt:i.excerpt,siteName:i.siteName||this._articleSiteName}}},e.exports=t},107:(e,t,i)=>{var n=i(174),a=i(893);e.exports={Readability:n,isProbablyReaderable:a}}},t={};function i(n){var a=t[n];if(void 0!==a)return a.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=i(107);console.log("hello from content script in next.js!"),chrome.runtime.onMessage.addListener(((t,i,n)=>{if("inject"===t.type){const{message:e}=t,i=async function(e,t){const{content:i,title:n,url:a}=e;let r=i.split("\n").map((e=>{if(""===e)return"";if(e.startsWith("-")){const t=document.createElement("li");return t.innerText=e.replace("-",""),t.innerText=t.innerText.trim(),t.outerHTML}if(e.startsWith("•")){const t=document.createElement("li");return t.innerText=e.replace("•",""),t.innerText=t.innerText.trim(),t.outerHTML}const t=document.createElement("p");return t.innerText=e,t.outerHTML})).join("");const s=r.match(/<li>.*?<\/li>/g);if(s){const e=document.createElement("ul");e.innerHTML=s.join(""),r=r.replace(e.innerHTML,e.outerHTML)}a&&n&&(r=`<p style='font-weight: bold;'><a href="${a}">${n}</a></p>${r}`);let o=document.getElementById("summary-content");return o||(o=function(){let e=document.createElement("div");e.setAttribute("id","window1"),e.className="window summary-wrapper",document.body.appendChild(e);let t=document.createElement("div");t.setAttribute("id","window1header"),t.className="top-bar",e.appendChild(t);let i=document.createElement("div");i.className="close-btn",t.appendChild(i);let n=document.createElement("div");return n.setAttribute("id","summary-content"),e.appendChild(n),i.addEventListener("click",(function(t){document.body.removeChild(e)})),function(e){var t=0,i=0,n=0,a=0;if("ontouchstart"in document.documentElement)var r=0,s=0,o=0,l=0;function h(e){if(!1 in document.documentElement&&e.preventDefault(),n=e.clientX,a=e.clientY,"ontouchstart"in document.documentElement)try{o=e.touches[0].clientX,l=e.touches[0].clientY}catch(e){}document.onmouseup=d,document.onmousemove=c,document.ontouchend=d,document.ontouchmove=c}function c(h){h.preventDefault(),"ontouchstart"in document.documentElement?(r=o-h.touches[0].clientX,s=l-h.touches[0].clientY,o=h.touches[0].clientX,l=h.touches[0].clientY,e.style.top=e.offsetTop-s+"px",e.style.left=e.offsetLeft-r+"px"):(t=n-h.clientX,i=a-h.clientY,n=h.clientX,a=h.clientY,e.style.top=e.offsetTop-i+"px",e.style.left=e.offsetLeft-t+"px")}function d(){document.onmouseup=null,document.onmousemove=null,document.ontouchend=null,document.ontouchmove=null}document.getElementById(e.id+"header")&&(document.getElementById(e.id+"header").onmousedown=h,document.getElementById(e.id+"header").ontouchstart=h)}(e),document.getElementById("summary-content")}()),o.innerHTML=r,!0}(e);i||n({status:"failed"}),n({status:"success"})}if("get_webpage"===t.type){let t=(a=document.cloneNode(!0),new e.Readability(a).parse());console.log("main content extracted:",t),n({text:t})}var a}))})()})();