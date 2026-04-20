(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,629617,e=>{"use strict";let t,i,a;e.i(797002);var r=e.i(671423),n=e.i(246249),s=e.i(631052),o=e.i(120886).default,l="video",d=e=>e===l?"playback":e,u=class e extends Error{constructor(t,i=e.MEDIA_ERR_CUSTOM,a,r){var n;super(t),this.name="MediaError",this.code=i,this.context=r,this.fatal=null!=a?a:i>=e.MEDIA_ERR_NETWORK&&i<=e.MEDIA_ERR_ENCRYPTED,this.message||(this.message=null!=(n=e.defaultMessages[this.code])?n:"")}};u.MEDIA_ERR_ABORTED=1,u.MEDIA_ERR_NETWORK=2,u.MEDIA_ERR_DECODE=3,u.MEDIA_ERR_SRC_NOT_SUPPORTED=4,u.MEDIA_ERR_ENCRYPTED=5,u.MEDIA_ERR_CUSTOM=100,u.defaultMessages={1:"You aborted the media playback",2:"A network error caused the media download to fail.",3:"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.",4:"An unsupported error occurred. The server or network failed, or your browser does not support this format.",5:"The media is encrypted and there are no keys to decrypt it."};var c=(e,t)=>null!=t&&e in t,h={ANY:"any",MUTED:"muted"},m="on-demand",p="live",v="unknown",b="native",g={HEADER:"header",QUERY:"query",NONE:"none"},E=Object.values(g),f={M3U8:"application/vnd.apple.mpegurl",MP4:"video/mp4"},y={HLS:f.M3U8};Object.keys(y),[...Object.values(f)];var A={code:"en"},k=(e,t,i,a,r=e)=>{r.addEventListener(t,i,a),e.addEventListener("teardown",()=>{r.removeEventListener(t,i)},{once:!0})},T=e=>{let t=e.indexOf("?");return t<0?[e]:[e.slice(0,t),e.slice(t)]},w=e=>{let{type:t}=e;if(t){let e=t.toUpperCase();return c(e,y)?y[e]:t}return I(e)},_=e=>"VOD"===e?m:p,C=e=>"EVENT"===e?1/0:"VOD"===e?NaN:0,I=e=>{let{src:t}=e;if(!t)return"";let i="";try{i=new URL(t).pathname}catch{console.error("invalid url")}let a=i.lastIndexOf(".");if(a<0)return R(e)?f.M3U8:"";let r=i.slice(a+1).toUpperCase();return c(r,f)?f[r]:""},S="mux.com",R=({src:e,customDomain:t=S})=>{let i;try{i=new URL(`${e}`)}catch{return!1}let a="https:"===i.protocol,r=i.hostname===`stream.${t}`.toLowerCase(),n=i.pathname.split("/"),s=2===n.length,o=!(null!=n&&n[1].includes("."));return a&&r&&s&&o},M=e=>{let t=(null!=e?e:"").split(".")[1];if(t)try{let e=t.replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(e).split("").map(function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(i)}catch{return}};function L(e,t=!0){var i;return new D(t&&null!=(i=null==A?void 0:A[e])?i:e,t?A.code:"en")}var D=class{constructor(e,t=(e=>null!=(e=A)?e:"en")()){this.message=e,this.locale=t}format(e){return this.message.replace(/\{(\w+)\}/g,(t,i)=>{var a;return null!=(a=e[i])?a:""})}toString(){return this.message}},x=Object.values(h),N=e=>"boolean"==typeof e||"string"==typeof e&&x.includes(e),O=(e,t)=>{if(!t)return;let i=e.muted,a=()=>e.muted=i;switch(t){case h.ANY:e.play().catch(()=>{e.muted=!0,e.play().catch(a)});break;case h.MUTED:e.muted=!0,e.play().catch(a);break;default:e.play().catch(()=>{})}},P=e=>"time"in e?e.time:e.startTime;function U(e,t,i,a,r,n){let s=document.createElement("track");return s.kind=t,s.label=i,a&&(s.srclang=a),r&&(s.id=r),n&&(s.default=!0),s.track.mode=["subtitles","captions"].includes(t)?"disabled":"hidden",s.setAttribute("data-removeondestroy",""),e.append(s),s.track}function $(e,t,i){var a;return null==(a=Array.from(e.querySelectorAll("track")).find(e=>e.track.label===t&&e.track.kind===i))?void 0:a.track}async function W(e,t,i,a){let r=$(e,i,a);return r||((r=U(e,a,i)).mode="hidden",await new Promise(e=>setTimeout(()=>e(void 0),0))),"hidden"!==r.mode&&(r.mode="hidden"),[...t].sort((e,t)=>P(t)-P(e)).forEach(t=>{var i,n;let s=t.value,o=P(t);if("endTime"in t&&null!=t.endTime)null==r||r.addCue(new VTTCue(o,t.endTime,"chapters"===a?s:JSON.stringify(null!=s?s:null)));else{let t=Array.prototype.findIndex.call(null==r?void 0:r.cues,e=>e.startTime>=o),l=null==(i=null==r?void 0:r.cues)?void 0:i[t],d=l?l.startTime:Number.isFinite(e.duration)?e.duration:Number.MAX_SAFE_INTEGER,u=null==(n=null==r?void 0:r.cues)?void 0:n[t-1];u&&(u.endTime=o),null==r||r.addCue(new VTTCue(o,d,"chapters"===a?s:JSON.stringify(null!=s?s:null)))}}),e.textTracks.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),r}var H="cuepoints",B=Object.freeze({label:H});async function V(e,t,i=B){return W(e,t,i.label,"metadata")}var F=e=>({time:e.startTime,value:JSON.parse(e.text)});function Y(e,t={label:H}){var i,a;let r=$(e,t.label,"metadata");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return F(r.activeCues[0]);let{currentTime:n}=e;return F(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function K(e,t=B){return new Promise(i=>{k(e,"loadstart",async()=>{let a=await V(e,[],t);k(e,"cuechange",()=>{let t=Y(e);if(t){let i=new CustomEvent("cuepointchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var G="chapters",q=Object.freeze({label:G}),j=e=>({startTime:e.startTime,endTime:e.endTime,value:e.text});async function Z(e,t,i=q){return W(e,t,i.label,"chapters")}function z(e,t={label:G}){var i,a;let r=$(e,t.label,"chapters");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return j(r.activeCues[0]);let{currentTime:n}=e;return j(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function Q(e,t=q){return new Promise(i=>{k(e,"loadstart",async()=>{let a=await Z(e,[],t);k(e,"cuechange",()=>{let t=z(e);if(t){let i=new CustomEvent("chapterchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var X=(e,t,i,a,r=!1,n=!(e=>null==(e=globalThis.navigator)?void 0:e.onLine)())=>{var s,o,h,v;let b,g;if(n){let i=L("Your device appears to be offline",r),a=u.MEDIA_ERR_NETWORK,n=new u(i,a,!1,void 0);return n.errorCategory=t,n.muxCode=2000002,n.data=e,n}let E="status"in e?e.status:e.code,f=Date.now(),y=u.MEDIA_ERR_NETWORK;if(200===E)return;let A=d(t),k=(b=d(t),g=`${b}Token`,null!=(h=i.tokens)&&h[b]?null==(v=i.tokens)?void 0:v[b]:c(g,i)?i[g]:void 0),w=t===l?"v":"drm"===t?"d":void 0,[_]=T(null!=(s=i.playbackId)?s:"");if(!E||!_)return;let C=M(k);if(k&&!C){let i=new u(L("The {tokenNamePrefix}-token provided is invalid or malformed.",r).format({tokenNamePrefix:A}),y,!0,L("Compact JWT string: {token}",r).format({token:k}));return i.errorCategory=t,i.muxCode=2412202,i.data=e,i}if(E>=500){let e=new u("",y,null==a||a);return e.errorCategory=t,e.muxCode=2e6,e}if(403===E)if(C){if((({exp:e},t=Date.now())=>!e||1e3*e<t)(C,f)){let i={timeStyle:"medium",dateStyle:"medium"},a=new u(L("The video’s secured {tokenNamePrefix}-token has expired.",r).format({tokenNamePrefix:A}),y,!0,L("Expired at: {expiredDate}. Current time: {currentDate}.",r).format({expiredDate:new Intl.DateTimeFormat("en",i).format(null!=(o=C.exp)?o:0),currentDate:new Intl.DateTimeFormat("en",i).format(f)}));return a.errorCategory=t,a.muxCode=2403210,a.data=e,a}if((({sub:e},t)=>e!==t)(C,_)){let i=new u(L("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",r).format({tokenNamePrefix:A}),y,!0,L("Specified playback ID: {playbackId} and the playback ID encoded in the {tokenNamePrefix}-token: {tokenPlaybackId}",r).format({tokenNamePrefix:A,playbackId:_,tokenPlaybackId:C.sub}));return i.errorCategory=t,i.muxCode=2403232,i.data=e,i}if((({aud:e},t)=>!e)(C,0)){let i=new u(L("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:A}),y,!0,L("The {tokenNamePrefix}-token has no aud value. aud value should be {expectedAud}.",r).format({tokenNamePrefix:A,expectedAud:w}));return i.errorCategory=t,i.muxCode=2403221,i.data=e,i}if((({aud:e},t)=>e!==t)(C,w)){let i=new u(L("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:A}),y,!0,L("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.",r).format({tokenNamePrefix:A,expectedAud:w,aud:C.aud}));return i.errorCategory=t,i.muxCode=2403222,i.data=e,i}}else{let i=new u(L("Authorization error trying to access this {category} URL. If this is a signed URL, you might need to provide a {tokenNamePrefix}-token.",r).format({tokenNamePrefix:A,category:t}),y,null==a||a,L("Specified playback ID: {playbackId}",r).format({playbackId:_}));return i.errorCategory=t,i.muxCode=2403201,i.data=e,i}if(412===E){let n=new u(L("This playback-id may belong to a live stream that is not currently active or an asset that is not ready.",r),y,null==a||a,L("Specified playback ID: {playbackId}",r).format({playbackId:_}));return n.errorCategory=t,n.muxCode=2412e3,n.streamType=i.streamType===p?"live":i.streamType===m?"on-demand":"unknown",n.data=e,n}if(404===E){let i=new u(L("This URL or playback-id does not exist. You may have used an Asset ID or an ID from a different resource.",r),y,null==a||a,L("Specified playback ID: {playbackId}",r).format({playbackId:_}));return i.errorCategory=t,i.muxCode=2404e3,i.data=e,i}if(400===E){let i=new u(L("The URL or playback-id was invalid. You may have used an invalid value as a playback-id."),y,null==a||a,L("Specified playback ID: {playbackId}",r).format({playbackId:_}));return i.errorCategory=t,i.muxCode=24e5,i.data=e,i}let I=new u("",y,null==a||a);return I.errorCategory=t,I.muxCode=2e6,I.data=e,I},J=o.DefaultConfig.capLevelController,ee=class e extends J{constructor(e){super(e)}get levels(){var e;return null!=(e=this.hls.levels)?e:[]}getValidLevels(e){return this.levels.filter((t,i)=>this.isLevelAllowed(t)&&i<=e)}getMaxLevel(t){let i=super.getMaxLevel(t),a=this.getValidLevels(t);if(!a[i])return i;let r=Math.min(a[i].width,a[i].height),n=e.minMaxResolution;return r>=n?i:J.getMaxLevelByMediaSize(a,16/9*n,n)}};ee.minMaxResolution=720;var et,ei,ea,er,en,es,eo="fairplay",el=/([A-Z0-9-]+)="?(.*?)"?(?:,|$)/g,ed=async(e,t)=>{if(t===f.MP4)return{streamType:m,targetLiveWindow:NaN,liveEdgeStartOffset:void 0,sessionData:void 0};if(t===f.M3U8){let t=await fetch(e);if(!t.ok)return Promise.reject(t);let i=await t.text(),a=await fetch(i.split(`
`).find((e,t,i)=>t&&i[t-1].startsWith("#EXT-X-STREAM-INF"))).then(e=>200!==e.status?Promise.reject(e):e.text());return{...(e=>{let t=e.split(`
`).filter(e=>e.startsWith("#EXT-X-SESSION-DATA"));if(!t.length)return{};let i={};for(let e of t){let t=Object.fromEntries([...e.matchAll(el)].map(([,e,t])=>[e,t])),a=t["DATA-ID"];a&&(i[a]={...t})}return{sessionData:i}})(i),...(e=>{var t,i,a;let r=e.split(`
`),n=null==(i=(null!=(t=r.find(e=>e.startsWith("#EXT-X-PLAYLIST-TYPE")))?t:"").split(":")[1])?void 0:i.trim(),s=_(n),o=C(n),l;if(s===p){let e=r.find(e=>e.startsWith("#EXT-X-PART-INF"));if(e)l=2*e.split(":")[1].split("=")[1];else{let e=r.find(e=>e.startsWith("#EXT-X-TARGETDURATION")),t=null==(a=null==e?void 0:e.split(":"))?void 0:a[1];l=(null!=t?t:6)*3}}return{streamType:s,targetLiveWindow:o,liveEdgeStartOffset:l}})(a)}}return console.error(`Media type ${t} is an unrecognized or unsupported type for src ${e}.`),{streamType:void 0,targetLiveWindow:void 0,liveEdgeStartOffset:void 0,sessionData:void 0}},eu=async(e,t,i=w({src:e}))=>{var a,r,n,s;let{streamType:o,targetLiveWindow:l,liveEdgeStartOffset:d,sessionData:u}=await ed(e,i),c=null==u?void 0:u["com.apple.hls.chapters"];(null!=c&&c.URI||null!=c&&c.VALUE.toLocaleLowerCase().startsWith("http"))&&ec(null!=(a=c.URI)?a:c.VALUE,t),(null!=(r=ev.get(t))?r:{}).liveEdgeStartOffset=d,(null!=(n=ev.get(t))?n:{}).targetLiveWindow=l,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(s=ev.get(t))?s:{}).streamType=o,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},ec=async(e,t)=>{var i,a;try{let r=await fetch(e);if(!r.ok)throw Error(`Failed to fetch Mux metadata: ${r.status} ${r.statusText}`);let n=await r.json(),s={};if(!(null!=(i=null==n?void 0:n[0])&&i.metadata))return;for(let e of n[0].metadata)e.key&&e.value&&(s[e.key]=e.value);(null!=(a=ev.get(t))?a:{}).metadata=s;let o=new CustomEvent("muxmetadata");t.dispatchEvent(o)}catch(e){console.error(e)}},eh=null!=(ei=null==(et=null==globalThis?void 0:globalThis.navigator)?void 0:et.userAgent)?ei:"",em=null!=(en=null==(er=null==(ea=null==globalThis?void 0:globalThis.navigator)?void 0:ea.userAgentData)?void 0:er.platform)?en:"",ep=eh.toLowerCase().includes("android")||["x11","android"].some(e=>em.toLowerCase().includes(e)),ev=new WeakMap,eb="mux.com",eg=null==(es=o.isSupported)?void 0:es.call(o),eE=()=>s.default.utils.now(),ef=s.default.utils.generateUUID,ey=({playbackId:e,customDomain:t=eb,maxResolution:i,minResolution:a,renditionOrder:r,programStartTime:n,programEndTime:s,assetStartTime:o,assetEndTime:l,playbackToken:d,tokens:{playback:u=d}={},extraSourceParams:c={}}={})=>{if(!e)return;let[h,m=""]=T(e),p=new URL(`https://stream.${t}/${h}.m3u8${m}`);return u||p.searchParams.has("token")?(p.searchParams.forEach((e,t)=>{"token"!=t&&p.searchParams.delete(t)}),u&&p.searchParams.set("token",u)):(i&&p.searchParams.set("max_resolution",i),a&&(p.searchParams.set("min_resolution",a),i&&+i.slice(0,-1)<+a.slice(0,-1)&&console.error("minResolution must be <= maxResolution","minResolution",a,"maxResolution",i)),r&&p.searchParams.set("rendition_order",r),n&&p.searchParams.set("program_start_time",`${n}`),s&&p.searchParams.set("program_end_time",`${s}`),o&&p.searchParams.set("asset_start_time",`${o}`),l&&p.searchParams.set("asset_end_time",`${l}`),Object.entries(c).forEach(([e,t])=>{null!=t&&p.searchParams.set(e,t)})),p.toString()},eA=e=>{if(!e)return;let[t]=e.split("?");return t||void 0},ek=e=>{if(!e||!e.startsWith("https://stream."))return;let[t]=new URL(e).pathname.slice(1).split(/\.m3u8|\//);return t||void 0},eT=e=>{var t;return null==(t=ev.get(e))?void 0:t.error},ew=e=>{var t,i;return null!=(i=null==(t=ev.get(e))?void 0:t.streamType)?i:v},e_=e=>{var t,i;return null!=(i=null==(t=ev.get(e))?void 0:t.seekable)?i:e.seekable},eC=.034,eI=(e,t,i=eC)=>e>t||((e,t,i=eC)=>Math.abs(e-t)<=i)(e,t,i),eS=(e,t)=>{var i,a,r;if(!t||!e.buffered.length)return;if(e.readyState>2)return!1;let n=t.currentLevel>=0?null==(a=null==(i=t.levels)?void 0:i[t.currentLevel])?void 0:a.details:null==(r=t.levels.find(e=>!!e.details))?void 0:r.details;if(!n||n.live)return;let{fragments:s}=n;if(!(null!=s&&s.length))return;if(e.currentTime<e.duration-(n.targetduration+.5))return!1;let o=s[s.length-1];if(e.currentTime<=o.start)return!1;let l=o.start+o.duration/2,d=e.buffered.start(e.buffered.length-1),u=e.buffered.end(e.buffered.length-1);return l>d&&l<u},eR=(e,t)=>e.ended||e.loop?e.ended:!!(t&&eS(e,t))||((e,t=eC)=>e.paused&&eI(e.currentTime,e.duration,t))(e),eM=(e,t,i)=>{let a=null==t?void 0:t.engine;null!=e&&e.mux&&!e.mux.deleted&&(null!=i&&i.muxDataKeepSession?a&&e.mux.removeHLSJS():(e.mux.destroy(),delete e.mux)),a&&(a.detachMedia(),a.destroy()),e&&(e.hasAttribute("src")&&(e.removeAttribute("src"),e.load()),e.removeEventListener("error",eH),e.removeEventListener("error",eV),e.removeEventListener("durationchange",eW),ev.delete(e),e.dispatchEvent(new Event("teardown")))};function eL(e,t){var i;let a=w(e);if(a!==f.M3U8)return!0;let r=!a||null==(i=t.canPlayType(a))||i,{preferPlayback:n}=e;return r&&(n===b||!(eg&&("mse"===n||ep)))}var eD=e=>e===p?{backBufferLength:8}:{},ex=e=>{let{tokens:{drm:t}={},playbackId:i,drmTypeCb:a}=e,r=eA(i);return t&&r?{emeEnabled:!0,drmSystems:{"com.apple.fps":{licenseUrl:eP(e,"fairplay"),serverCertificateUrl:eU(e,"fairplay")},"com.widevine.alpha":{licenseUrl:eP(e,"widevine")},"com.microsoft.playready":{licenseUrl:eP(e,"playready")}},requestMediaKeySystemAccessFunc:(e,t)=>("com.widevine.alpha"===e&&(t=[...t.map(e=>{var t;let i=null==(t=e.videoCapabilities)?void 0:t.map(e=>({...e,robustness:"HW_SECURE_ALL"}));return{...e,videoCapabilities:i}}),...t]),navigator.requestMediaKeySystemAccess(e,t).then(t=>{let i=e.includes("fps")?eo:e.includes("playready")?"playready":e.includes("widevine")?"widevine":void 0;return null==a||a(i),t}))}:{}},eN=async e=>{let t=await fetch(e);return 200!==t.status?Promise.reject(t):await t.arrayBuffer()},eO=async(e,t)=>{let i=await fetch(t,{method:"POST",headers:{"Content-type":"application/octet-stream"},body:e});return 200!==i.status?Promise.reject(i):new Uint8Array(await i.arrayBuffer())},eP=({playbackId:e,tokens:{drm:t}={},customDomain:i=eb},a)=>{let r=eA(e);return`https://license.${i.toLocaleLowerCase().endsWith(eb)?i:eb}/license/${a}/${r}?token=${t}`},eU=({playbackId:e,tokens:{drm:t}={},customDomain:i=eb},a)=>{let r=eA(e);return`https://license.${i.toLocaleLowerCase().endsWith(eb)?i:eb}/appcert/${a}/${r}?token=${t}`},e$=({playbackId:e,src:t,customDomain:i})=>{if(e)return!0;if("string"!=typeof t)return!1;let a=new URL(t,null==window?void 0:window.location.href).hostname.toLocaleLowerCase();return a.includes(eb)||!!i&&a.includes(i.toLocaleLowerCase())};function eW(e){var t;let i=e.target,a=null==(t=ev.get(i))?void 0:t.startTime;if(a&&function(e,t,i){t&&i>t&&(i=t);for(let t=0;t<e.length;t++)if(e.start(t)<=i&&e.end(t)>=i)return!0;return!1}(i.seekable,i.duration,a)){let e="auto"===i.preload;e&&(i.preload="none"),i.currentTime=a,e&&(i.preload="auto")}}async function eH(e){if(!e.isTrusted)return;e.stopImmediatePropagation();let t=e.target;if(!(null!=t&&t.error))return;let{message:i,code:a}=t.error,r=new u(i,a);if(t.src&&a===u.MEDIA_ERR_SRC_NOT_SUPPORTED&&t.readyState===HTMLMediaElement.HAVE_NOTHING)return void setTimeout(()=>{var e;let i=null!=(e=eT(t))?e:t.error;(null==i?void 0:i.code)===u.MEDIA_ERR_SRC_NOT_SUPPORTED&&eB(t,r)},500);if(t.src&&(a!==u.MEDIA_ERR_DECODE||void 0!==a))try{let{status:e}=await fetch(t.src);r.data={response:{code:e}}}catch{}eB(t,r)}function eB(e,t){var i;t.fatal&&((null!=(i=ev.get(e))?i:{}).error=t,e.dispatchEvent(new CustomEvent("error",{detail:t})))}function eV(e){var t,i;if(!(e instanceof CustomEvent)||!(e.detail instanceof u))return;let a=e.target,r=e.detail;r&&r.fatal&&((null!=(t=ev.get(a))?t:{}).error=r,null==(i=a.mux)||i.emit("error",{player_error_code:r.code,player_error_message:r.message,player_error_context:r.context}))}var eF=(e,t)=>{var i,a,r;console.error("getErrorFromHlsErrorData()",e);let n={[o.ErrorTypes.NETWORK_ERROR]:u.MEDIA_ERR_NETWORK,[o.ErrorTypes.MEDIA_ERROR]:u.MEDIA_ERR_DECODE,[o.ErrorTypes.KEY_SYSTEM_ERROR]:u.MEDIA_ERR_ENCRYPTED},s,d=[o.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,o.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED].includes(e.details)?u.MEDIA_ERR_NETWORK:n[e.type];if(d===u.MEDIA_ERR_NETWORK&&e.response){let r=null!=(i=e.type===o.ErrorTypes.KEY_SYSTEM_ERROR?"drm":e.type===o.ErrorTypes.NETWORK_ERROR?l:void 0)?i:l;s=null!=(a=X(e.response,r,t,e.fatal))?a:new u("",d,e.fatal)}else d===u.MEDIA_ERR_ENCRYPTED?e.details===o.ErrorDetails.KEY_SYSTEM_NO_CONFIGURED_LICENSE?((s=new u(L("Attempting to play DRM-protected content without providing a DRM token."),u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000002):e.details===o.ErrorDetails.KEY_SYSTEM_NO_ACCESS?((s=new u(L("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000001):e.details===o.ErrorDetails.KEY_SYSTEM_NO_SESSION?((s=new u(L("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),u.MEDIA_ERR_ENCRYPTED,!0)).errorCategory="drm",s.muxCode=5000002):e.details===o.ErrorDetails.KEY_SYSTEM_SESSION_UPDATE_FAILED?((s=new u(L("Failed to update DRM license. This may be an issue with the player or your protected content."),u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000003):e.details===o.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED?((s=new u(L("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000004):e.details===o.ErrorDetails.KEY_SYSTEM_STATUS_INTERNAL_ERROR?((s=new u(L("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5000005):e.details===o.ErrorDetails.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED?((s=new u(L("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen."),u.MEDIA_ERR_ENCRYPTED,!1)).errorCategory="drm",s.muxCode=5000006):((s=new u(e.error.message,u.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory="drm",s.muxCode=5e6):s=new u("",d,e.fatal);return s.context||(s.context=`${e.url?`url: ${e.url}
`:""}${e.response&&(e.response.code||e.response.text)?`response: ${e.response.code}, ${e.response.text}
`:""}${e.reason?`failure reason: ${e.reason}
`:""}${e.level?`level: ${e.level}
`:""}${e.parent?`parent stream controller: ${e.parent}
`:""}${e.buffer?`buffer length: ${e.buffer}
`:""}${e.error?`error: ${e.error}
`:""}${e.event?`event: ${e.event}
`:""}${e.err?`error message: ${null==(r=e.err)?void 0:r.message}
`:""}`),s.data=e,s};let eY=["abort","canplay","canplaythrough","durationchange","emptied","encrypted","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","waitingforkey","resize","enterpictureinpicture","leavepictureinpicture","webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"],eK=["autopictureinpicture","disablepictureinpicture","disableremoteplayback","autoplay","controls","controlslist","crossorigin","loop","muted","playsinline","poster","preload","src"];function eG(e){return`
    <style>
      :host {
        display: inline-flex;
        line-height: 0;
        flex-direction: column;
        justify-content: end;
      }

      audio {
        width: 100%;
      }
    </style>
    <slot name="media">
      <audio${eZ(e)}></audio>
    </slot>
    <slot></slot>
  `}function eq(e){return`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot name="media">
      <video${eZ(e)}></video>
    </slot>
    <slot></slot>
  `}function ej(e,{tag:t,is:i}){let a=globalThis.document?.createElement?.(t,{is:i}),r=a?function(e){let t=[];for(let i=Object.getPrototypeOf(e);i&&i!==HTMLElement.prototype;i=Object.getPrototypeOf(i)){let e=Object.getOwnPropertyNames(i);t.push(...e)}return t}(a):[];return class n extends e{static getTemplateHTML=t.endsWith("audio")?eG:eq;static shadowRootOptions={mode:"open"};static Events=eY;static #e=!1;static get observedAttributes(){return n.#t(),[...a?.constructor?.observedAttributes??[],...eK]}static #t(){if(this.#e)return;this.#e=!0;let e=new Set(this.observedAttributes);for(let t of(e.delete("muted"),r))if(!(t in this.prototype))if("function"==typeof a[t])this.prototype[t]=function(...e){return this.#i(),(()=>{if(this.call)return this.call(t,...e);let i=this.nativeEl?.[t];return i?.apply(this.nativeEl,e)})()};else{let i={get(){this.#i();let i=t.toLowerCase();if(e.has(i)){let e=this.getAttribute(i);return null!==e&&(""===e||e)}return this.get?.(t)??this.nativeEl?.[t]}};t!==t.toUpperCase()&&(i.set=function(i){this.#i();let a=t.toLowerCase();e.has(a)?!0===i||!1===i||null==i?this.toggleAttribute(a,!!i):this.setAttribute(a,i):this.set?this.set(t,i):this.nativeEl&&(this.nativeEl[t]=i)}),Object.defineProperty(this.prototype,t,i)}}#a=!1;#r=null;#n=new Map;#s;get;set;call;get nativeEl(){return this.#i(),this.#r??this.querySelector(":scope > [slot=media]")??this.querySelector(t)??this.shadowRoot?.querySelector(t)??null}set nativeEl(e){this.#r=e}get defaultMuted(){return this.hasAttribute("muted")}set defaultMuted(e){this.toggleAttribute("muted",e)}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",`${e}`)}get preload(){return this.getAttribute("preload")??this.nativeEl?.preload}set preload(e){this.setAttribute("preload",`${e}`)}#i(){this.#a||(this.#a=!0,this.init())}init(){if(!this.shadowRoot){this.attachShadow({mode:"open"});let e=function(e){let t={};for(let i of e)t[i.name]=i.value;return t}(this.attributes);i&&(e.is=i),t&&(e.part=t),this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}for(let e of(this.nativeEl.muted=this.hasAttribute("muted"),r))this.#o(e);for(let e of(this.#s=new MutationObserver(this.#l.bind(this)),this.shadowRoot.addEventListener("slotchange",()=>this.#d()),this.#d(),this.constructor.Events))this.shadowRoot.addEventListener(e,this,!0)}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{detail:e.detail}))}#d(){let e=new Map(this.#n),t=this.shadowRoot?.querySelector("slot:not([name])");(t?.assignedElements({flatten:!0}).filter(e=>["track","source"].includes(e.localName))).forEach(t=>{e.delete(t);let i=this.#n.get(t);i||(i=t.cloneNode(),this.#n.set(t,i),this.#s?.observe(t,{attributes:!0})),this.nativeEl?.append(i),this.#u(i)}),e.forEach((e,t)=>{e.remove(),this.#n.delete(t)})}#l(e){for(let t of e)if("attributes"===t.type){let{target:e,attributeName:i}=t,a=this.#n.get(e);a&&i&&(a.setAttribute(i,e.getAttribute(i)??""),this.#u(a))}}#u(e){e&&"track"===e.localName&&e.default&&("chapters"===e.kind||"metadata"===e.kind)&&"disabled"===e.track.mode&&(e.track.mode="hidden")}#o(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}}attributeChangedCallback(e,t,i){this.#i(),this.#c(e,t,i)}#c(e,t,i){["id","class"].includes(e)||!n.observedAttributes.includes(e)&&this.constructor.observedAttributes.includes(e)||(null===i?this.nativeEl?.removeAttribute(e):this.nativeEl?.getAttribute(e)!==i&&this.nativeEl?.setAttribute(e,i))}connectedCallback(){this.#i()}}}function eZ(e){let t="";for(let i in e){if(!eK.includes(i))continue;let a=e[i];""===a?t+=` ${i}`:t+=` ${i}="${a}"`}return t}let ez=ej(globalThis.HTMLElement??class{},{tag:"video"});ej(globalThis.HTMLElement??class{},{tag:"audio"});var eQ,eX,eJ,e0,e1,e2,e3,e4,e5,e9,e8,e6,e7=e=>{throw TypeError(e)},te=(e,t,i)=>t.has(e)||e7("Cannot "+i),tt=(e,t,i)=>(te(e,t,"read from private field"),i?i.call(e):t.get(e)),ti=(e,t,i)=>t.has(e)?e7("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),ta=(e,t,i,a)=>(te(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),tr=(e,t,i)=>(te(e,t,"access private method"),i),tn=(()=>{try{return"0.26.1"}catch{}return"UNKNOWN"})(),ts=`
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" part="logo" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 1600 500"><g fill="#fff"><path d="M994.287 93.486c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m0-93.486c-34.509 0-62.484 27.976-62.484 62.486v187.511c0 68.943-56.09 125.033-125.032 125.033s-125.03-56.09-125.03-125.033V62.486C681.741 27.976 653.765 0 619.256 0s-62.484 27.976-62.484 62.486v187.511C556.772 387.85 668.921 500 806.771 500c137.851 0 250.001-112.15 250.001-250.003V62.486c0-34.51-27.976-62.486-62.485-62.486M1537.51 468.511c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m-275.883-218.509-143.33 143.329c-24.402 24.402-24.402 63.966 0 88.368 24.402 24.402 63.967 24.402 88.369 0l143.33-143.329 143.328 143.329c24.402 24.4 63.967 24.402 88.369 0 24.403-24.402 24.403-63.966.001-88.368l-143.33-143.329.001-.004 143.329-143.329c24.402-24.402 24.402-63.965 0-88.367s-63.967-24.402-88.369 0L1349.996 161.63 1206.667 18.302c-24.402-24.401-63.967-24.402-88.369 0s-24.402 63.965 0 88.367l143.329 143.329v.004ZM437.511 468.521c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31M461.426 4.759C438.078-4.913 411.2.432 393.33 18.303L249.999 161.632 106.669 18.303C88.798.432 61.922-4.913 38.573 4.759 15.224 14.43-.001 37.214-.001 62.488v375.026c0 34.51 27.977 62.486 62.487 62.486 34.51 0 62.486-27.976 62.486-62.486V213.341l80.843 80.844c24.404 24.402 63.965 24.402 88.369 0l80.843-80.844v224.173c0 34.51 27.976 62.486 62.486 62.486s62.486-27.976 62.486-62.486V62.488c0-25.274-15.224-48.058-38.573-57.729" style="fill-rule:nonzero"/></g></svg>`,to={BEACON_COLLECTION_DOMAIN:"beacon-collection-domain",CUSTOM_DOMAIN:"custom-domain",DEBUG:"debug",DISABLE_TRACKING:"disable-tracking",DISABLE_COOKIES:"disable-cookies",DRM_TOKEN:"drm-token",PLAYBACK_TOKEN:"playback-token",ENV_KEY:"env-key",MAX_RESOLUTION:"max-resolution",MIN_RESOLUTION:"min-resolution",RENDITION_ORDER:"rendition-order",PROGRAM_START_TIME:"program-start-time",PROGRAM_END_TIME:"program-end-time",ASSET_START_TIME:"asset-start-time",ASSET_END_TIME:"asset-end-time",METADATA_URL:"metadata-url",PLAYBACK_ID:"playback-id",PLAYER_SOFTWARE_NAME:"player-software-name",PLAYER_SOFTWARE_VERSION:"player-software-version",PLAYER_INIT_TIME:"player-init-time",PREFER_CMCD:"prefer-cmcd",PREFER_PLAYBACK:"prefer-playback",START_TIME:"start-time",STREAM_TYPE:"stream-type",TARGET_LIVE_WINDOW:"target-live-window",LIVE_EDGE_OFFSET:"live-edge-offset",TYPE:"type",LOGO:"logo"},tl=Object.values(to),td="mux-video",tu=class extends ez{constructor(){super(),ti(this,e8),ti(this,eQ),ti(this,eX),ti(this,eJ),ti(this,e0,{}),ti(this,e1,{}),ti(this,e2),ti(this,e3),ti(this,e4),ti(this,e5),ti(this,e9,""),ta(this,eJ,eE()),this.nativeEl.addEventListener("muxmetadata",e=>{var t,i,a;let r=(i=this.nativeEl,null==(a=ev.get(i))?void 0:a.metadata),n=null!=(t=this.metadata)?t:{};this.metadata={...r,...n},(null==r?void 0:r["com.mux.video.branding"])==="mux-free-plan"&&(ta(this,e9,"default"),this.updateLogo())})}static get NAME(){return td}static get VERSION(){return tn}static get observedAttributes(){var e;return[...tl,...null!=(e=ez.observedAttributes)?e:[]]}static getLogoHTML(e){return e&&"false"!==e?"default"===e?ts:`<img part="logo" src="${e}" />`:""}static getTemplateHTML(e={}){var t;return`
      ${ez.getTemplateHTML(e)}
      <style>
        :host {
          position: relative;
        }
        slot[name="logo"] {
          display: flex;
          justify-content: end;
          position: absolute;
          top: 1rem;
          right: 1rem;
          opacity: 0;
          transition: opacity 0.25s ease-in-out;
          z-index: 1;
        }
        slot[name="logo"]:has([part="logo"]) {
          opacity: 1;
        }
        slot[name="logo"] [part="logo"] {
          width: 5rem;
          pointer-events: none;
          user-select: none;
        }
      </style>
      <slot name="logo">
        ${this.getLogoHTML(null!=(t=e[to.LOGO])?t:"")}
      </slot>
    `}get preferCmcd(){var e;return null!=(e=this.getAttribute(to.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?E.includes(e)?this.setAttribute(to.PREFER_CMCD,e):console.warn(`Invalid value for preferCmcd. Must be one of ${E.join()}`):this.removeAttribute(to.PREFER_CMCD))}get playerInitTime(){return this.hasAttribute(to.PLAYER_INIT_TIME)?+this.getAttribute(to.PLAYER_INIT_TIME):tt(this,eJ)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(to.PLAYER_INIT_TIME):this.setAttribute(to.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=tt(this,e4))?e:td}set playerSoftwareName(e){ta(this,e4,e)}get playerSoftwareVersion(){var e;return null!=(e=tt(this,e3))?e:tn}set playerSoftwareVersion(e){ta(this,e3,e)}get _hls(){var e;return null==(e=tt(this,eQ))?void 0:e.engine}get mux(){var e;return null==(e=this.nativeEl)?void 0:e.mux}get error(){var e;return null!=(e=eT(this.nativeEl))?e:null}get errorTranslator(){return tt(this,e5)}set errorTranslator(e){ta(this,e5,e)}get src(){return this.getAttribute("src")}set src(e){e!==this.src&&(null==e?this.removeAttribute("src"):this.setAttribute("src",e))}get type(){var e;return null!=(e=this.getAttribute(to.TYPE))?e:void 0}set type(e){e!==this.type&&(e?this.setAttribute(to.TYPE,e):this.removeAttribute(to.TYPE))}get preload(){let e=this.getAttribute("preload");return""===e?"auto":["none","metadata","auto"].includes(e)?e:super.preload}set preload(e){e!=this.getAttribute("preload")&&(["","none","metadata","auto"].includes(e)?this.setAttribute("preload",e):this.removeAttribute("preload"))}get debug(){return null!=this.getAttribute(to.DEBUG)}set debug(e){e!==this.debug&&(e?this.setAttribute(to.DEBUG,""):this.removeAttribute(to.DEBUG))}get disableTracking(){return this.hasAttribute(to.DISABLE_TRACKING)}set disableTracking(e){e!==this.disableTracking&&this.toggleAttribute(to.DISABLE_TRACKING,!!e)}get disableCookies(){return this.hasAttribute(to.DISABLE_COOKIES)}set disableCookies(e){e!==this.disableCookies&&(e?this.setAttribute(to.DISABLE_COOKIES,""):this.removeAttribute(to.DISABLE_COOKIES))}get startTime(){let e=this.getAttribute(to.START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set startTime(e){e!==this.startTime&&(null==e?this.removeAttribute(to.START_TIME):this.setAttribute(to.START_TIME,`${e}`))}get playbackId(){var e;return this.hasAttribute(to.PLAYBACK_ID)?this.getAttribute(to.PLAYBACK_ID):null!=(e=ek(this.src))?e:void 0}set playbackId(e){e!==this.playbackId&&(e?this.setAttribute(to.PLAYBACK_ID,e):this.removeAttribute(to.PLAYBACK_ID))}get maxResolution(){var e;return null!=(e=this.getAttribute(to.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(to.MAX_RESOLUTION,e):this.removeAttribute(to.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(to.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(to.MIN_RESOLUTION,e):this.removeAttribute(to.MIN_RESOLUTION))}get renditionOrder(){var e;return null!=(e=this.getAttribute(to.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(to.RENDITION_ORDER,e):this.removeAttribute(to.RENDITION_ORDER))}get programStartTime(){let e=this.getAttribute(to.PROGRAM_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programStartTime(e){null==e?this.removeAttribute(to.PROGRAM_START_TIME):this.setAttribute(to.PROGRAM_START_TIME,`${e}`)}get programEndTime(){let e=this.getAttribute(to.PROGRAM_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programEndTime(e){null==e?this.removeAttribute(to.PROGRAM_END_TIME):this.setAttribute(to.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){let e=this.getAttribute(to.ASSET_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetStartTime(e){null==e?this.removeAttribute(to.ASSET_START_TIME):this.setAttribute(to.ASSET_START_TIME,`${e}`)}get assetEndTime(){let e=this.getAttribute(to.ASSET_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetEndTime(e){null==e?this.removeAttribute(to.ASSET_END_TIME):this.setAttribute(to.ASSET_END_TIME,`${e}`)}get customDomain(){var e;return null!=(e=this.getAttribute(to.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(to.CUSTOM_DOMAIN,e):this.removeAttribute(to.CUSTOM_DOMAIN))}get drmToken(){var e;return null!=(e=this.getAttribute(to.DRM_TOKEN))?e:void 0}set drmToken(e){e!==this.drmToken&&(e?this.setAttribute(to.DRM_TOKEN,e):this.removeAttribute(to.DRM_TOKEN))}get playbackToken(){var e,t,i,a;if(this.hasAttribute(to.PLAYBACK_TOKEN))return null!=(e=this.getAttribute(to.PLAYBACK_TOKEN))?e:void 0;if(this.hasAttribute(to.PLAYBACK_ID)){let[,e]=T(null!=(t=this.playbackId)?t:"");return null!=(i=new URLSearchParams(e).get("token"))?i:void 0}if(this.src)return null!=(a=new URLSearchParams(this.src).get("token"))?a:void 0}set playbackToken(e){e!==this.playbackToken&&(e?this.setAttribute(to.PLAYBACK_TOKEN,e):this.removeAttribute(to.PLAYBACK_TOKEN))}get tokens(){let e=this.getAttribute(to.PLAYBACK_TOKEN),t=this.getAttribute(to.DRM_TOKEN);return{...tt(this,e1),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{}}}set tokens(e){ta(this,e1,null!=e?e:{})}get ended(){return eR(this.nativeEl,this._hls)}get envKey(){var e;return null!=(e=this.getAttribute(to.ENV_KEY))?e:void 0}set envKey(e){e!==this.envKey&&(e?this.setAttribute(to.ENV_KEY,e):this.removeAttribute(to.ENV_KEY))}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(to.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(to.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(to.BEACON_COLLECTION_DOMAIN))}get streamType(){var e;return null!=(e=this.getAttribute(to.STREAM_TYPE))?e:ew(this.nativeEl)}set streamType(e){e!==this.streamType&&(e?this.setAttribute(to.STREAM_TYPE,e):this.removeAttribute(to.STREAM_TYPE))}get targetLiveWindow(){var e,t,i;return this.hasAttribute(to.TARGET_LIVE_WINDOW)?+this.getAttribute(to.TARGET_LIVE_WINDOW):(e=this.nativeEl,null!=(i=null==(t=ev.get(e))?void 0:t.targetLiveWindow)?i:NaN)}set targetLiveWindow(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(to.TARGET_LIVE_WINDOW):this.setAttribute(to.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e,t;if(this.hasAttribute(to.LIVE_EDGE_OFFSET)){let{liveEdgeOffset:i}=this,a=null!=(e=this.nativeEl.seekable.end(0))?e:0;return Math.max(null!=(t=this.nativeEl.seekable.start(0))?t:0,a-i)}return(e=>{var t;let i=null==(t=ev.get(e))?void 0:t.liveEdgeStartOffset;if("number"!=typeof i)return NaN;let a=e_(e);return a.length?a.end(a.length-1)-i:NaN})(this.nativeEl)}get liveEdgeOffset(){if(this.hasAttribute(to.LIVE_EDGE_OFFSET))return+this.getAttribute(to.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){e!=this.liveEdgeOffset&&(null==e?this.removeAttribute(to.LIVE_EDGE_OFFSET):this.setAttribute(to.LIVE_EDGE_OFFSET,`${+e}`))}get seekable(){return e_(this.nativeEl)}async addCuePoints(e){return V(this.nativeEl,e)}get activeCuePoint(){return Y(this.nativeEl)}get cuePoints(){return function(e,t={label:H}){let i=$(e,t.label,"metadata");return null!=i&&i.cues?Array.from(i.cues,e=>F(e)):[]}(this.nativeEl)}async addChapters(e){return Z(this.nativeEl,e)}get activeChapter(){return z(this.nativeEl)}get chapters(){return function(e,t={label:G}){var i;let a=$(e,t.label,"chapters");return null!=(i=null==a?void 0:a.cues)&&i.length?Array.from(a.cues,e=>j(e)):[]}(this.nativeEl)}getStartDate(){return function(e,t){if(t){let i=t.playingDate;if(null!=i)return new Date(i.getTime()-1e3*e.currentTime)}return"function"==typeof e.getStartDate?e.getStartDate():new Date(NaN)}(this.nativeEl,this._hls)}get currentPdt(){var e,t;return e=this.nativeEl,(t=this._hls)&&t.playingDate?t.playingDate:new Date("function"==typeof e.getStartDate?e.getStartDate().getTime()+1e3*e.currentTime:NaN)}get preferPlayback(){let e=this.getAttribute(to.PREFER_PLAYBACK);if("mse"===e||e===b)return e}set preferPlayback(e){e!==this.preferPlayback&&("mse"===e||e===b?this.setAttribute(to.PREFER_PLAYBACK,e):this.removeAttribute(to.PREFER_PLAYBACK))}get metadata(){return{...this.getAttributeNames().filter(e=>e.startsWith("metadata-")&&![to.METADATA_URL].includes(e)).reduce((e,t)=>{let i=this.getAttribute(t);return null!=i&&(e[t.replace(/^metadata-/,"").replace(/-/g,"_")]=i),e},{}),...tt(this,e0)}}set metadata(e){ta(this,e0,null!=e?e:{}),this.mux&&this.mux.emit("hb",tt(this,e0))}get _hlsConfig(){return tt(this,e2)}set _hlsConfig(e){ta(this,e2,e)}get logo(){var e;return null!=(e=this.getAttribute(to.LOGO))?e:tt(this,e9)}set logo(e){e?this.setAttribute(to.LOGO,e):this.removeAttribute(to.LOGO)}load(){ta(this,eQ,((e,t,i)=>{var a,r,n;eM(t,i,e);let{metadata:d={}}=e,{view_session_id:c=ef()}=d,h=null!=(a=null==e?void 0:e.metadata)&&a.video_id?e.metadata.video_id:e$(e)&&null!=(n=null!=(r=eA(e.playbackId))?r:ek(e.src))?n:e.src;d.view_session_id=c,d.video_id=h,e.metadata=d,e.drmTypeCb=e=>{var i;null==(i=t.mux)||i.emit("hb",{view_drm_type:e})},ev.set(t,{retryCount:0});let m=((e,t)=>{let{debug:i,streamType:a,startTime:r=-1,metadata:n,preferCmcd:s,_hlsConfig:l={}}=e,d=w(e)===f.M3U8,u=eL(e,t);if(d&&!u&&eg){let d=eD(a),u=ex(e),c=new o({debug:i,startPosition:r,cmcd:[g.QUERY,g.HEADER].includes(s)?{useHeaders:s===g.HEADER,sessionId:null==n?void 0:n.view_session_id,contentId:null==n?void 0:n.video_id}:void 0,xhrSetup:(e,t)=>{var i,a;if(s&&s!==g.QUERY)return;let r=new URL(t);if(!r.searchParams.has("CMCD"))return;let n=(null!=(a=null==(i=r.searchParams.get("CMCD"))?void 0:i.split(","))?a:[]).filter(e=>e.startsWith("sid")||e.startsWith("cid")).join(",");r.searchParams.set("CMCD",n),e.open("GET",r)},capLevelController:ee,...{backBufferLength:30,renderTextTracksNatively:!1,liveDurationInfinity:!0,capLevelToPlayerSize:!0,capLevelOnFPSDrop:!0},...d,...u,...l});return c.on(o.Events.MANIFEST_PARSED,async function(e,i){var a,r;let n=null==(a=i.sessionData)?void 0:a["com.apple.hls.chapters"];(null!=n&&n.URI||null!=n&&n.VALUE.toLocaleLowerCase().startsWith("http"))&&ec(null!=(r=null==n?void 0:n.URI)?r:null==n?void 0:n.VALUE,t)}),c}})(e,t),b=(({preload:e,src:t},i,a)=>{let r=e=>{null!=e&&["","none","metadata","auto"].includes(e)?i.setAttribute("preload",e):i.removeAttribute("preload")};if(!a)return r(e),r;let n=!1,s=!1,o=a.config.maxBufferLength,l=a.config.maxBufferSize,d=e=>{r(e);let t=null!=e?e:i.preload;s||"none"===t||("metadata"===t?(a.config.maxBufferLength=1,a.config.maxBufferSize=1):(a.config.maxBufferLength=o,a.config.maxBufferSize=l),u())},u=()=>{!n&&t&&(n=!0,a.loadSource(t))};return k(i,"play",()=>{s=!0,a.config.maxBufferLength=o,a.config.maxBufferSize=l,u()},{once:!0}),d(e),d})(e,t,m);null!=e&&e.muxDataKeepSession&&null!=t&&t.mux&&!t.mux.deleted?m&&t.mux.addHLSJS({hlsjs:m,Hls:m?o:void 0}):((e,t,i)=>{var a;let{envKey:r,disableTracking:n,muxDataSDK:l=s.default,muxDataSDKOptions:d={}}=e,u=e$(e);if(!n&&(r||u)){let{playerInitTime:n,playerSoftwareName:s,playerSoftwareVersion:u,beaconCollectionDomain:c,debug:h,disableCookies:m}=e,p={...e.metadata,video_title:(null==(a=null==e?void 0:e.metadata)?void 0:a.video_title)||void 0};l.monitor(t,{debug:h,beaconCollectionDomain:c,hlsjs:i,Hls:i?o:void 0,automaticErrorTracking:!1,errorTranslator:t=>"string"!=typeof t.player_error_code&&("function"==typeof e.errorTranslator?e.errorTranslator(t):t),disableCookies:m,...d,data:{...r?{env_key:r}:{},player_software_name:s,player_software:s,player_software_version:u,player_init_time:n,...p}})}})(e,t,m),((e,t,i)=>{var a,r;let n=eL(e,t),{src:s,customDomain:d=eb}=e,c=()=>{t.ended||!eR(t,i)||(eS(t,i)?t.currentTime=t.buffered.end(t.buffered.length-1):t.dispatchEvent(new Event("ended")))},h,m,v=()=>{let e=e_(t),i,a;e.length>0&&(i=e.start(0),a=e.end(0)),(m!==a||h!==i)&&t.dispatchEvent(new CustomEvent("seekablechange",{composed:!0})),h=i,m=a};if(k(t,"durationchange",v),t&&n){let i=w(e);if("string"==typeof s){if(s.endsWith(".mp4")&&s.includes(d)){let e=ek(s);ec(new URL(`https://stream.${d}/${e}/metadata.json`).toString(),t)}let n=()=>{if(ew(t)!==p||Number.isFinite(t.duration))return;let e=setInterval(v,1e3);t.addEventListener("teardown",()=>{clearInterval(e)},{once:!0}),k(t,"durationchange",()=>{Number.isFinite(t.duration)&&clearInterval(e)})},o=async()=>eu(s,t,i).then(n).catch(i=>{if(i instanceof Response){let a=X(i,l,e);if(a)return void eB(t,a)}});if("none"===t.preload){let e=()=>{o(),t.removeEventListener("loadedmetadata",i)},i=()=>{o(),t.removeEventListener("play",e)};k(t,"play",e,{once:!0}),k(t,"loadedmetadata",i,{once:!0})}else o();null!=(a=e.tokens)&&a.drm?k(t,"encrypted",async i=>{try{let a=i.initDataType;if("skd"!==a)return void console.error(`Received unexpected initialization data type "${a}"`);if(!t.mediaKeys){let i=await navigator.requestMediaKeySystemAccess("com.apple.fps",[{initDataTypes:[a],videoCapabilities:[{contentType:"application/vnd.apple.mpegurl",robustness:""}],distinctiveIdentifier:"not-allowed",persistentState:"not-allowed",sessionTypes:["temporary"]}]).then(t=>{var i;return null==(i=e.drmTypeCb)||i.call(e,eo),t}).catch(()=>{let e=L("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),i=new u(e,u.MEDIA_ERR_ENCRYPTED,!0);i.errorCategory="drm",i.muxCode=5000001,eB(t,i)});if(!i)return;let r=await i.createMediaKeys();try{let t=await eN(eU(e,"fairplay")).catch(t=>{if(t instanceof Response){let i=X(t,"drm",e);return console.error("mediaError",null==i?void 0:i.message,null==i?void 0:i.context),i?Promise.reject(i):Promise.reject(Error("Unexpected error in app cert request"))}return Promise.reject(t)});await r.setServerCertificate(t).catch(()=>{let e=L("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),t=new u(e,u.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory="drm",t.muxCode=5000004,Promise.reject(t)})}catch(e){eB(t,e);return}await t.setMediaKeys(r)}let r=i.initData;if(null==r)return void console.error(`Could not start encrypted playback due to missing initData in ${i.type} event`);let n=t.mediaKeys.createSession();n.addEventListener("keystatuseschange",()=>{n.keyStatuses.forEach(e=>{let i;if("internal-error"===e){let e=L("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser.");(i=new u(e,u.MEDIA_ERR_ENCRYPTED,!0)).errorCategory="drm",i.muxCode=5000005}else if("output-restricted"===e||"output-downscaled"===e){let e=L("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen.");(i=new u(e,u.MEDIA_ERR_ENCRYPTED,!1)).errorCategory="drm",i.muxCode=5000006}i&&eB(t,i)})});let s=await Promise.all([n.generateRequest(a,r).catch(()=>{let e=L("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),i=new u(e,u.MEDIA_ERR_ENCRYPTED,!0);i.errorCategory="drm",i.muxCode=5000002,eB(t,i)}),new Promise(e=>{n.addEventListener("message",t=>{e(t.message)},{once:!0})})]).then(([,e])=>e),o=await eO(s,eP(e,"fairplay")).catch(t=>{if(t instanceof Response){let i=X(t,"drm",e);return console.error("mediaError",null==i?void 0:i.message,null==i?void 0:i.context),i?Promise.reject(i):Promise.reject(Error("Unexpected error in license key request"))}return Promise.reject(t)});await n.update(o).catch(()=>{let e=L("Failed to update DRM license. This may be an issue with the player or your protected content."),t=new u(e,u.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory="drm",t.muxCode=5000003,Promise.reject(t)})}catch(e){eB(t,e);return}}):k(t,"encrypted",()=>{let e=new u(L("Attempting to play DRM-protected content without providing a DRM token."),u.MEDIA_ERR_ENCRYPTED,!0);e.errorCategory="drm",e.muxCode=5000002,eB(t,e)},{once:!0}),t.setAttribute("src",s),e.startTime&&((null!=(r=ev.get(t))?r:{}).startTime=e.startTime,t.addEventListener("durationchange",eW,{once:!0}))}else t.removeAttribute("src");t.addEventListener("error",eH),t.addEventListener("error",eV),t.addEventListener("emptied",()=>{t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})},{once:!0}),k(t,"pause",c),k(t,"seeked",c),k(t,"play",()=>{t.ended||eI(t.currentTime,t.duration)&&(t.currentTime=t.seekable.length?t.seekable.start(0):0)})}else{let a,r;i&&s?(i.once(o.Events.LEVEL_LOADED,(e,a)=>{((e,t,i)=>{var a,r,n,s,o,l,d,u,c;let h,m,v,b,g,{streamType:E,targetLiveWindow:f,liveEdgeStartOffset:y,lowLatency:A}=(m=_(h=e.type),v=C(h),g=!!(null!=(c=e.partList)&&c.length),m===p&&(b=g?2*e.partTarget:3*e.targetduration),{streamType:m,targetLiveWindow:v,liveEdgeStartOffset:b,lowLatency:g});if(E===p){A?(i.config.backBufferLength=null!=(a=i.userConfig.backBufferLength)?a:4,i.config.maxFragLookUpTolerance=null!=(r=i.userConfig.maxFragLookUpTolerance)?r:.001,i.config.abrBandWidthUpFactor=null!=(n=i.userConfig.abrBandWidthUpFactor)?n:i.config.abrBandWidthFactor):i.config.backBufferLength=null!=(s=i.userConfig.backBufferLength)?s:8;let e=Object.freeze({get length(){return t.seekable.length},start:e=>t.seekable.start(e),end(e){var a;return e>this.length||e<0||Number.isFinite(t.duration)?t.seekable.end(e):null!=(a=i.liveSyncPosition)?a:t.seekable.end(e)}});(null!=(o=ev.get(t))?o:{}).seekable=e}(null!=(l=ev.get(t))?l:{}).liveEdgeStartOffset=y,(null!=(d=ev.get(t))?d:{}).targetLiveWindow=f,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(u=ev.get(t))?u:{}).streamType=E,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))})(a.details,t,i),v(),ew(t)!==p||Number.isFinite(t.duration)||(i.on(o.Events.LEVEL_UPDATED,v),k(t,"durationchange",()=>{Number.isFinite(t.duration)&&i.off(o.Events.LEVELS_UPDATED,v)}))}),i.on(o.Events.ERROR,(a,r)=>{var n,s;let o=eF(r,e);if(2412e3===o.muxCode){let e=null!=(n=ev.get(t))?n:{},a=null!=(s=e.retryCount)?s:0;if(a<6){let n=0===a?5e3:6e4,s=new u(`Retrying in ${n/1e3} seconds...`,o.code,o.fatal);Object.assign(s,o),eB(t,s),setTimeout(()=>{e.retryCount=a+1,"manifestLoadError"===r.details&&r.url&&i.loadSource(r.url)},n);return}{e.retryCount=0;let i=new u('Try again later or <a href="#" onclick="window.location.reload(); return false;" style="color: #4a90e2;">click here to retry</a>',o.code,o.fatal);Object.assign(i,o),eB(t,i);return}}eB(t,o)}),i.on(o.Events.MANIFEST_LOADED,()=>{let e=ev.get(t);e&&e.error&&(e.error=null,e.retryCount=0,t.dispatchEvent(new Event("emptied")),t.dispatchEvent(new Event("loadstart")))}),t.addEventListener("error",eV),k(t,"waiting",c),function(e,t){var i;if(!("videoTracks"in e))return;let a=new WeakMap;t.on(o.Events.MANIFEST_PARSED,function(t,i){n();let r=e.addVideoTrack("main");for(let[e,t]of(r.selected=!0,i.levels.entries())){let i=r.addRendition(t.url[0],t.width,t.height,t.videoCodec,t.bitrate);a.set(t,`${e}`),i.id=`${e}`}}),t.on(o.Events.AUDIO_TRACKS_UPDATED,function(t,i){for(let t of(r(),i.audioTracks)){let i=t.default?"main":"alternative",a=e.addAudioTrack(i,t.name,t.lang);a.id=`${t.id}`,t.default&&(a.enabled=!0)}}),e.audioTracks.addEventListener("change",()=>{var i;let a=+(null==(i=[...e.audioTracks].find(e=>e.enabled))?void 0:i.id),r=t.audioTracks.map(e=>e.id);a!=t.audioTrack&&r.includes(a)&&(t.audioTrack=a)}),t.on(o.Events.LEVELS_UPDATED,function(t,i){var r;let n=e.videoTracks[null!=(r=e.videoTracks.selectedIndex)?r:0];if(!n)return;let s=i.levels.map(e=>a.get(e));for(let t of e.videoRenditions)t.id&&!s.includes(t.id)&&n.removeRendition(t)}),null==(i=e.videoRenditions)||i.addEventListener("change",e=>{let i=e.target.selectedIndex;i!=t.nextLevel&&(t.nextLevel=i)});let r=()=>{for(let t of e.audioTracks)e.removeAudioTrack(t)},n=()=>{(()=>{for(let t of e.videoTracks)e.removeVideoTrack(t)})(),r()};t.once(o.Events.DESTROYING,n)}(e,i),i.on(o.Events.NON_NATIVE_TEXT_TRACKS_FOUND,(e,{tracks:a})=>{a.forEach(e=>{var a,r;let n=null!=(a=e.subtitleTrack)?a:e.closedCaptions,s=i.subtitleTracks.findIndex(({lang:t,name:i,type:a})=>t==(null==n?void 0:n.lang)&&i===e.label&&a.toLowerCase()===e.kind),o=(null!=(r=e._id)?r:e.default)?"default":`${e.kind}${s}`;U(t,e.kind,e.label,null==n?void 0:n.lang,o,e.default)})}),a=()=>{if(!i.subtitleTracks.length)return;let e=Array.from(t.textTracks).find(e=>e.id&&"showing"===e.mode&&["subtitles","captions"].includes(e.kind));if(!e)return;let a=i.subtitleTracks[i.subtitleTrack],r=a?a.default?"default":`${i.subtitleTracks[i.subtitleTrack].type.toLowerCase()}${i.subtitleTrack}`:void 0;if(i.subtitleTrack<0||(null==e?void 0:e.id)!==r){let t=i.subtitleTracks.findIndex(({lang:t,name:i,type:a,default:r})=>"default"===e.id&&r||t==e.language&&i===e.label&&a.toLowerCase()===e.kind);i.subtitleTrack=t}(null==e?void 0:e.id)===r&&e.cues&&Array.from(e.cues).forEach(t=>{e.addCue(t)})},t.textTracks.addEventListener("change",a),i.on(o.Events.CUES_PARSED,(e,{track:i,cues:a})=>{let r=t.textTracks.getTrackById(i);if(!r)return;let n="disabled"===r.mode;n&&(r.mode="hidden"),a.forEach(e=>{var t;null!=(t=r.cues)&&t.getCueById(e.id)||r.addCue(e)}),n&&(r.mode="disabled")}),i.once(o.Events.DESTROYING,()=>{t.textTracks.removeEventListener("change",a),t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})}),r=()=>{Array.from(t.textTracks).forEach(e=>{var i,a;if(!["subtitles","caption"].includes(e.kind)&&("thumbnails"===e.label||"chapters"===e.kind)){if(!(null!=(i=e.cues)&&i.length)){let i="track";e.kind&&(i+=`[kind="${e.kind}"]`),e.label&&(i+=`[label="${e.label}"]`);let r=t.querySelector(i),n=null!=(a=null==r?void 0:r.getAttribute("src"))?a:"";null==r||r.removeAttribute("src"),setTimeout(()=>{null==r||r.setAttribute("src",n)},0)}"hidden"!==e.mode&&(e.mode="hidden")}})},i.once(o.Events.MANIFEST_LOADED,r),i.once(o.Events.MEDIA_ATTACHED,r),i.attachMedia(t)):console.error("It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software.")}})(e,t,m),K(t),Q(t);let E=((e,t,i)=>{let{autoplay:a}=e,r=!1,n=!1,s=N(a)?a:!!a,l=()=>{r||k(t,"playing",()=>{r=!0},{once:!0})};if(l(),k(t,"loadstart",()=>{r=!1,l(),O(t,s)},{once:!0}),k(t,"loadstart",()=>{i||(n=e.streamType&&e.streamType!==v?e.streamType===p:!Number.isFinite(t.duration)),O(t,s)},{once:!0}),i&&i.once(o.Events.LEVEL_LOADED,(t,i)=>{var a;n=e.streamType&&e.streamType!==v?e.streamType===p:null!=(a=i.details.live)&&a}),!s){let a=()=>{!n||Number.isFinite(e.startTime)||(null!=i&&i.liveSyncPosition?t.currentTime=i.liveSyncPosition:Number.isFinite(t.seekable.end(0))&&(t.currentTime=t.seekable.end(0)))};i&&k(t,"play",()=>{"metadata"===t.preload?i.once(o.Events.LEVEL_UPDATED,a):a()},{once:!0})}return e=>{r||O(t,s=N(e)?e:!!e)}})(e,t,m);return{engine:m,setAutoplay:E,setPreload:b}})(this,this.nativeEl,tt(this,eQ)))}unload(){eM(this.nativeEl,tt(this,eQ),this),ta(this,eQ,void 0)}attributeChangedCallback(e,t,i){var a,r;switch(ez.observedAttributes.includes(e)&&!["src","autoplay","preload"].includes(e)&&super.attributeChangedCallback(e,t,i),e){case to.PLAYER_SOFTWARE_NAME:this.playerSoftwareName=null!=i?i:void 0;break;case to.PLAYER_SOFTWARE_VERSION:this.playerSoftwareVersion=null!=i?i:void 0;break;case"src":{let e=!!t,a=!!i;!e&&a?tr(this,e8,e6).call(this):e&&!a?this.unload():e&&a&&(this.unload(),tr(this,e8,e6).call(this));break}case"autoplay":if(i===t)break;null==(a=tt(this,eQ))||a.setAutoplay(this.autoplay);break;case"preload":if(i===t)break;null==(r=tt(this,eQ))||r.setPreload(i);break;case to.PLAYBACK_ID:this.src=ey(this);break;case to.DEBUG:{let e=this.debug;this.mux&&console.info("Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."),this._hls&&(this._hls.config.debug=e);break}case to.METADATA_URL:i&&fetch(i).then(e=>e.json()).then(e=>this.metadata=e).catch(()=>console.error(`Unable to load or parse metadata JSON from metadata-url ${i}!`));break;case to.STREAM_TYPE:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}));break;case to.TARGET_LIVE_WINDOW:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0,detail:this.targetLiveWindow}));break;case to.LOGO:(null==i||i!==t)&&this.updateLogo()}}updateLogo(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector('slot[name="logo"]');e&&(e.innerHTML=this.constructor.getLogoHTML(tt(this,e9)||this.logo))}connectedCallback(){var e;null==(e=super.connectedCallback)||e.call(this),this.nativeEl&&this.src&&!tt(this,eQ)&&tr(this,e8,e6).call(this)}disconnectedCallback(){this.unload()}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{composed:!0,detail:e.detail}))}};eQ=new WeakMap,eX=new WeakMap,eJ=new WeakMap,e0=new WeakMap,e1=new WeakMap,e2=new WeakMap,e3=new WeakMap,e4=new WeakMap,e5=new WeakMap,e9=new WeakMap,e8=new WeakSet,e6=async function(){tt(this,eX)||(await ta(this,eX,Promise.resolve()),ta(this,eX,null),this.load())};let tc=new WeakMap;class th extends Error{}class tm extends Error{}let tp=["application/x-mpegURL","application/vnd.apple.mpegurl","audio/mpegurl"];function tv(){return globalThis.cast?.framework?.CastContext.getInstance()}function tb(){return tv()?.getCurrentSession()}function tg(){return tb()?.getSessionObj().media[0]}function tE(e){return tv().setOptions({...tf(),...e})}function tf(){return{receiverApplicationId:"CC1AD845",autoJoinPolicy:"origin_scoped",androidReceiverCompatible:!1,language:"en-US",resumeSavedSession:!0}}async function ty(e){try{let t=(await fetch(e,{method:"HEAD"})).headers.get("Content-Type");return tp.some(e=>t===e)}catch(e){return console.error("Error while trying to get the Content-Type of the manifest",e),!1}}async function tA(e){try{let i=await (await fetch(e)).text(),a=i,r=function(e){let t=e.split("\n"),i=[];for(let e=0;e<t.length;e++)if(t[e].trim().startsWith("#EXT-X-STREAM-INF")){let a=t[e+1]?t[e+1].trim():"";a&&!a.startsWith("#")&&i.push(a)}return i}(i);if(r.length>0){let t=new URL(r[0],e).toString();a=await (await fetch(t)).text()}var t=a.split("\n").find(e=>!e.trim().startsWith("#")&&""!==e.trim());if(!t)return;let n=t.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);return n?n[1]:null}catch(e){console.error("Error while trying to parse the manifest playlist",e);return}}let tk=new(globalThis.WeakRef?class extends Set{add(e){super.add(new WeakRef(e))}forEach(e){super.forEach(t=>{let i=t.deref();i&&e(i)})}}:Set),tT=new WeakSet;t1=()=>{globalThis.chrome?.cast?.isAvailable?t||(t=cast.framework,tv().addEventListener(t.CastContextEventType.CAST_STATE_CHANGED,e=>{tk.forEach(t=>tc.get(t).onCastStateChanged?.(e))}),tv().addEventListener(t.CastContextEventType.SESSION_STATE_CHANGED,e=>{tk.forEach(t=>tc.get(t).onSessionStateChanged?.(e))}),tk.forEach(e=>tc.get(e).init?.())):console.debug("chrome.cast.isAvailable",globalThis.chrome?.cast?.isAvailable)},globalThis.chrome?.cast?.isAvailable?globalThis.cast?.framework?t1():customElements.whenDefined("google-cast-button").then(t1):globalThis.__onGCastApiAvailable=()=>{customElements.whenDefined("google-cast-button").then(t1)};let tw=0;class t_ extends EventTarget{#h;#a;#m;#p;#v="disconnected";#b=!1;#g=new Set;#E=new WeakMap;constructor(e){super(),this.#h=e,tk.add(this),tc.set(this,{init:()=>this.#i(),onCastStateChanged:()=>this.#f(),onSessionStateChanged:()=>this.#y(),getCastPlayer:()=>this.#A}),this.#i()}get #A(){if(tT.has(this.#h))return this.#m}get state(){return this.#v}async watchAvailability(e){if(this.#h.disableRemotePlayback)throw new th("disableRemotePlayback attribute is present.");return this.#E.set(e,++tw),this.#g.add(e),queueMicrotask(()=>e(this.#k())),tw}async cancelWatchAvailability(e){if(this.#h.disableRemotePlayback)throw new th("disableRemotePlayback attribute is present.");e?this.#g.delete(e):this.#g.clear()}async prompt(){if(this.#h.disableRemotePlayback)throw new th("disableRemotePlayback attribute is present.");if(!globalThis.chrome?.cast?.isAvailable)throw new tm("The RemotePlayback API is disabled on this platform.");let e=tT.has(this.#h);tT.add(this.#h),tE(this.#h.castOptions),Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.addEventListener(e,t)});try{await tv().requestSession()}catch(t){if(e||tT.delete(this.#h),"cancel"===t)return;throw Error(t)}tc.get(this.#h)?.loadOnPrompt?.()}#T(){tT.has(this.#h)&&(Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.removeEventListener(e,t)}),tT.delete(this.#h),this.#h.muted=this.#m.isMuted,this.#h.currentTime=this.#m.savedPlayerState.currentTime,!1===this.#m.savedPlayerState.isPaused&&this.#h.play())}#k(){let e=tv()?.getCastState();return e&&"NO_DEVICES_AVAILABLE"!==e}#f(){let e=tv().getCastState();if(tT.has(this.#h)&&"CONNECTING"===e&&(this.#v="connecting",this.dispatchEvent(new Event("connecting"))),!this.#b&&e?.includes("CONNECT"))for(let e of(this.#b=!0,this.#g))e(!0);else if(this.#b&&(!e||"NO_DEVICES_AVAILABLE"===e))for(let e of(this.#b=!1,this.#g))e(!1)}async #y(){let{SESSION_RESUMED:e}=t.SessionState;if(tv().getSessionState()===e&&this.#h.castSrc===tg()?.media.contentId){tT.add(this.#h),Object.entries(this.#p).forEach(([e,t])=>{this.#m.controller.addEventListener(e,t)});try{var i;await (i=new chrome.cast.media.GetStatusRequest,new Promise((e,t)=>{tg().getStatus(i,e,t)}))}catch(e){console.error(e)}this.#p[t.RemotePlayerEventType.IS_PAUSED_CHANGED](),this.#p[t.RemotePlayerEventType.PLAYER_STATE_CHANGED]()}}#i(){t&&!this.#a&&(this.#a=!0,tE(this.#h.castOptions),this.#h.textTracks.addEventListener("change",()=>this.#w()),this.#f(),this.#m=new t.RemotePlayer,new t.RemotePlayerController(this.#m),this.#p={[t.RemotePlayerEventType.IS_CONNECTED_CHANGED]:({value:e})=>{!0===e?(this.#v="connected",this.dispatchEvent(new Event("connect"))):(this.#T(),this.#v="disconnected",this.dispatchEvent(new Event("disconnect")))},[t.RemotePlayerEventType.DURATION_CHANGED]:()=>{this.#h.dispatchEvent(new Event("durationchange"))},[t.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]:()=>{this.#h.dispatchEvent(new Event("volumechange"))},[t.RemotePlayerEventType.IS_MUTED_CHANGED]:()=>{this.#h.dispatchEvent(new Event("volumechange"))},[t.RemotePlayerEventType.CURRENT_TIME_CHANGED]:()=>{this.#A?.isMediaLoaded&&this.#h.dispatchEvent(new Event("timeupdate"))},[t.RemotePlayerEventType.VIDEO_INFO_CHANGED]:()=>{this.#h.dispatchEvent(new Event("resize"))},[t.RemotePlayerEventType.IS_PAUSED_CHANGED]:()=>{this.#h.dispatchEvent(new Event(this.paused?"pause":"play"))},[t.RemotePlayerEventType.PLAYER_STATE_CHANGED]:()=>{this.#A?.playerState!==chrome.cast.media.PlayerState.PAUSED&&this.#h.dispatchEvent(new Event({[chrome.cast.media.PlayerState.PLAYING]:"playing",[chrome.cast.media.PlayerState.BUFFERING]:"waiting",[chrome.cast.media.PlayerState.IDLE]:"emptied"}[this.#A?.playerState]))},[t.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED]:async()=>{this.#A?.isMediaLoaded&&(await Promise.resolve(),this.#_())}})}#_(){this.#w()}async #w(){let e;if(!this.#A)return;let t=(this.#m.mediaInfo?.tracks??[]).filter(({type:e})=>e===chrome.cast.media.TrackType.TEXT),i=[...this.#h.textTracks].filter(({kind:e})=>"subtitles"===e||"captions"===e),a=t.map(({language:e,name:t,trackId:a})=>{let{mode:r}=i.find(i=>i.language===e&&i.label===t)??{};return!!r&&{mode:r,trackId:a}}).filter(Boolean),r=a.filter(({mode:e})=>"showing"!==e).map(({trackId:e})=>e),n=a.find(({mode:e})=>"showing"===e),s=tb()?.getSessionObj().media[0]?.activeTrackIds??[],o=s;if(s.length&&(o=o.filter(e=>!r.includes(e))),n?.trackId&&(o=[...o,n.trackId]),e=o=[...new Set(o)],!(s.length===e.length&&s.every(t=>e.includes(t))))try{let e=new chrome.cast.media.EditTracksInfoRequest(o);await new Promise((t,i)=>{tg().editTracksInfo(e,t,i)})}catch(e){console.error(e)}}}let tC=e=>class extends e{static observedAttributes=[...e.observedAttributes??[],"cast-src","cast-content-type","cast-stream-type","cast-receiver"];#C={paused:!1};#I=tf();#S;#R;get remote(){return this.#R?this.#R:globalThis.chrome?(this.disableRemotePlayback||function(){let e="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";if(globalThis.chrome?.cast||document.querySelector(`script[src="${e}"]`))return;let t=document.createElement("script");t.src=e,document.head.append(t)}(),tc.set(this,{loadOnPrompt:()=>this.#M()}),this.#R=new t_(this)):super.remote}get #A(){return tc.get(this.remote)?.getCastPlayer?.()}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),"cast-receiver"===e&&i){this.#I.receiverApplicationId=i;return}if(this.#A)switch(e){case"cast-stream-type":case"cast-src":this.load()}}async #M(){this.#C.paused=super.paused,super.pause(),this.muted=super.muted;try{await this.load()}catch(e){console.error(e)}}async load(){if(!this.#A)return super.load();let e=new chrome.cast.media.MediaInfo(this.castSrc,this.castContentType);e.customData=this.castCustomData;let t=[...this.querySelectorAll("track")].filter(({kind:e,src:t})=>t&&("subtitles"===e||"captions"===e)),i=[],a=0;if(t.length&&(e.tracks=t.map(e=>{let t=++a;0===i.length&&"showing"===e.track.mode&&i.push(t);let r=new chrome.cast.media.Track(t,chrome.cast.media.TrackType.TEXT);return r.trackContentId=e.src,r.trackContentType="text/vtt",r.subtype="captions"===e.kind?chrome.cast.media.TextTrackType.CAPTIONS:chrome.cast.media.TextTrackType.SUBTITLES,r.name=e.label,r.language=e.srclang,r})),"live"===this.castStreamType?e.streamType=chrome.cast.media.StreamType.LIVE:e.streamType=chrome.cast.media.StreamType.BUFFERED,e.metadata=new chrome.cast.media.GenericMediaMetadata,e.metadata.title=this.title,e.metadata.images=[{url:this.poster}],ty(this.castSrc)){let t=await tA(this.castSrc);(t?.includes("m4s")||t?.includes("mp4"))&&(e.hlsSegmentFormat=chrome.cast.media.HlsSegmentFormat.FMP4,e.hlsVideoSegmentFormat=chrome.cast.media.HlsVideoSegmentFormat.FMP4)}let r=new chrome.cast.media.LoadRequest(e);r.currentTime=super.currentTime??0,r.autoplay=!this.#C.paused,r.activeTrackIds=i,await tb()?.loadMedia(r),this.dispatchEvent(new Event("volumechange"))}play(){if(this.#A){this.#A.isPaused&&this.#A.controller?.playOrPause();return}return super.play()}pause(){if(this.#A){this.#A.isPaused||this.#A.controller?.playOrPause();return}super.pause()}get castOptions(){return this.#I}get castReceiver(){return this.getAttribute("cast-receiver")??void 0}set castReceiver(e){this.castReceiver!=e&&this.setAttribute("cast-receiver",`${e}`)}get castSrc(){return this.getAttribute("cast-src")??this.querySelector("source")?.src??this.currentSrc}set castSrc(e){this.castSrc!=e&&this.setAttribute("cast-src",`${e}`)}get castContentType(){return this.getAttribute("cast-content-type")??void 0}set castContentType(e){this.setAttribute("cast-content-type",`${e}`)}get castStreamType(){return this.getAttribute("cast-stream-type")??this.streamType??void 0}set castStreamType(e){this.setAttribute("cast-stream-type",`${e}`)}get castCustomData(){return this.#S}set castCustomData(e){let t=typeof e;["object","undefined"].includes(t)?this.#S=e:console.error(`castCustomData must be nullish or an object but value was of type ${t}`)}get readyState(){if(this.#A)switch(this.#A.playerState){case chrome.cast.media.PlayerState.IDLE:return 0;case chrome.cast.media.PlayerState.BUFFERING:return 2;default:return 3}return super.readyState}get paused(){return this.#A?this.#A.isPaused:super.paused}get muted(){return this.#A?this.#A?.isMuted:super.muted}set muted(e){if(this.#A){(e&&!this.#A.isMuted||!e&&this.#A.isMuted)&&this.#A.controller?.muteOrUnmute();return}super.muted=e}get volume(){return this.#A?this.#A?.volumeLevel??1:super.volume}set volume(e){if(this.#A){this.#A.volumeLevel=+e,this.#A.controller?.setVolumeLevel();return}super.volume=e}get duration(){return this.#A&&this.#A?.isMediaLoaded?this.#A?.duration??NaN:super.duration}get currentTime(){return this.#A&&this.#A?.isMediaLoaded?this.#A?.currentTime??0:super.currentTime}set currentTime(e){if(this.#A){this.#A.currentTime=e,this.#A.controller?.seek();return}super.currentTime=e}};class tI extends Event{track;constructor(e,t){super(e),this.track=t.track}}let tS=new WeakMap;function tR(e){var t,i;let a;return tS.get(e)??(t=e,i={},(a=tS.get(t))||tS.set(t,a={}),Object.assign(a,i))}function tM(e,t){let i=e.videoTracks;tR(t).media=e,tR(t).renditionSet||(tR(t).renditionSet=new Set);let a=tR(i).trackSet;a.add(t);let r=a.size-1;r in tD.prototype||Object.defineProperty(tD.prototype,r,{get(){return[...tR(this).trackSet][r]}}),queueMicrotask(()=>{i.dispatchEvent(new tI("addtrack",{track:t}))})}function tL(e){let t=tR(e).media?.videoTracks;t&&(tR(t).trackSet.delete(e),queueMicrotask(()=>{t.dispatchEvent(new tI("removetrack",{track:e}))}))}class tD extends EventTarget{#L;#D;#x;constructor(){super(),tR(this).trackSet=new Set}get #N(){return tR(this).trackSet}[Symbol.iterator](){return this.#N.values()}get length(){return this.#N.size}getTrackById(e){return[...this.#N].find(t=>t.id===e)??null}get selectedIndex(){return[...this.#N].findIndex(e=>e.selected)}get onaddtrack(){return this.#L}set onaddtrack(e){this.#L&&(this.removeEventListener("addtrack",this.#L),this.#L=void 0),"function"==typeof e&&(this.#L=e,this.addEventListener("addtrack",e))}get onremovetrack(){return this.#D}set onremovetrack(e){this.#D&&(this.removeEventListener("removetrack",this.#D),this.#D=void 0),"function"==typeof e&&(this.#D=e,this.addEventListener("removetrack",e))}get onchange(){return this.#x}set onchange(e){this.#x&&(this.removeEventListener("change",this.#x),this.#x=void 0),"function"==typeof e&&(this.#x=e,this.addEventListener("change",e))}}class tx extends Event{rendition;constructor(e,t){super(e),this.rendition=t.rendition}}function tN(e){return[...tR(e).media.videoTracks].filter(e=>e.selected).flatMap(e=>[...tR(e).renditionSet])}class tO extends EventTarget{#O;#P;#x;[Symbol.iterator](){return tN(this).values()}get length(){return tN(this).length}getRenditionById(e){return tN(this).find(t=>`${t.id}`==`${e}`)??null}get selectedIndex(){return tN(this).findIndex(e=>e.selected)}set selectedIndex(e){for(let[t,i]of tN(this).entries())i.selected=t===e}get onaddrendition(){return this.#O}set onaddrendition(e){this.#O&&(this.removeEventListener("addrendition",this.#O),this.#O=void 0),"function"==typeof e&&(this.#O=e,this.addEventListener("addrendition",e))}get onremoverendition(){return this.#P}set onremoverendition(e){this.#P&&(this.removeEventListener("removerendition",this.#P),this.#P=void 0),"function"==typeof e&&(this.#P=e,this.addEventListener("removerendition",e))}get onchange(){return this.#x}set onchange(e){this.#x&&(this.removeEventListener("change",this.#x),this.#x=void 0),"function"==typeof e&&(this.#x=e,this.addEventListener("change",e))}}class tP{src;id;width;height;bitrate;frameRate;codec;#U=!1;get selected(){return this.#U}set selected(e){if(this.#U!==e){var t;let i;this.#U=e,t=this,(i=tR(t).media.videoRenditions)&&!tR(i).changeRequested&&(tR(i).changeRequested=!0,queueMicrotask(()=>{delete tR(i).changeRequested,tR(t).track.selected&&i.dispatchEvent(new Event("change"))}))}}}class tU{id;kind;label="";language="";sourceBuffer;#U=!1;addRendition(e,t,i,a,r,n){var s;let o,l,d,u=new tP;return u.src=e,u.width=t,u.height=i,u.frameRate=n,u.bitrate=r,u.codec=a,s=this,o=tR(s).media.videoRenditions,tR(u).media=tR(s).media,tR(u).track=s,(l=tR(s).renditionSet).add(u),(d=l.size-1)in tO.prototype||Object.defineProperty(tO.prototype,d,{get(){return tN(this)[d]}}),queueMicrotask(()=>{s.selected&&o.dispatchEvent(new tx("addrendition",{rendition:u}))}),u}removeRendition(e){let t,i;t=tR(e).media.videoRenditions,i=tR(e).track,tR(i).renditionSet.delete(e),queueMicrotask(()=>{tR(e).track.selected&&t.dispatchEvent(new tx("removerendition",{rendition:e}))})}get selected(){return this.#U}set selected(e){this.#U===e||(this.#U=e,!0===e&&function(e){let t=tR(e).media.videoTracks??[],i=!1;for(let a of t)a!==e&&(a.selected=!1,i=!0);if(i){if(tR(t).changeRequested)return;tR(t).changeRequested=!0,queueMicrotask(()=>{delete tR(t).changeRequested,t.dispatchEvent(new Event("change"))})}}(this))}}function t$(e){return[...tR(e).media.audioTracks].filter(e=>e.enabled).flatMap(e=>[...tR(e).renditionSet])}class tW extends EventTarget{#O;#P;#x;[Symbol.iterator](){return t$(this).values()}get length(){return t$(this).length}getRenditionById(e){return t$(this).find(t=>`${t.id}`==`${e}`)??null}get selectedIndex(){return t$(this).findIndex(e=>e.selected)}set selectedIndex(e){for(let[t,i]of t$(this).entries())i.selected=t===e}get onaddrendition(){return this.#O}set onaddrendition(e){this.#O&&(this.removeEventListener("addrendition",this.#O),this.#O=void 0),"function"==typeof e&&(this.#O=e,this.addEventListener("addrendition",e))}get onremoverendition(){return this.#P}set onremoverendition(e){this.#P&&(this.removeEventListener("removerendition",this.#P),this.#P=void 0),"function"==typeof e&&(this.#P=e,this.addEventListener("removerendition",e))}get onchange(){return this.#x}set onchange(e){this.#x&&(this.removeEventListener("change",this.#x),this.#x=void 0),"function"==typeof e&&(this.#x=e,this.addEventListener("change",e))}}class tH{src;id;bitrate;codec;#U=!1;get selected(){return this.#U}set selected(e){if(this.#U!==e){var t;let i;this.#U=e,t=this,(i=tR(t).media.audioRenditions)&&!tR(i).changeRequested&&(tR(i).changeRequested=!0,queueMicrotask(()=>{delete tR(i).changeRequested,tR(t).track.enabled&&i.dispatchEvent(new Event("change"))}))}}}function tB(e,t){let i=e.audioTracks;tR(t).media=e,tR(t).renditionSet||(tR(t).renditionSet=new Set);let a=tR(i).trackSet;a.add(t);let r=a.size-1;r in tF.prototype||Object.defineProperty(tF.prototype,r,{get(){return[...tR(this).trackSet][r]}}),queueMicrotask(()=>{i.dispatchEvent(new tI("addtrack",{track:t}))})}function tV(e){let t=tR(e).media?.audioTracks;t&&(tR(t).trackSet.delete(e),queueMicrotask(()=>{t.dispatchEvent(new tI("removetrack",{track:e}))}))}class tF extends EventTarget{#L;#D;#x;constructor(){super(),tR(this).trackSet=new Set}get #N(){return tR(this).trackSet}[Symbol.iterator](){return this.#N.values()}get length(){return this.#N.size}getTrackById(e){return[...this.#N].find(t=>t.id===e)??null}get onaddtrack(){return this.#L}set onaddtrack(e){this.#L&&(this.removeEventListener("addtrack",this.#L),this.#L=void 0),"function"==typeof e&&(this.#L=e,this.addEventListener("addtrack",e))}get onremovetrack(){return this.#D}set onremovetrack(e){this.#D&&(this.removeEventListener("removetrack",this.#D),this.#D=void 0),"function"==typeof e&&(this.#D=e,this.addEventListener("removetrack",e))}get onchange(){return this.#x}set onchange(e){this.#x&&(this.removeEventListener("change",this.#x),this.#x=void 0),"function"==typeof e&&(this.#x=e,this.addEventListener("change",e))}}class tY{id;kind;label="";language="";sourceBuffer;#$=!1;addRendition(e,t,i){var a;let r,n,s,o=new tH;return o.src=e,o.codec=t,o.bitrate=i,a=this,r=tR(a).media.audioRenditions,tR(o).media=tR(a).media,tR(o).track=a,(n=tR(a).renditionSet).add(o),(s=n.size-1)in tW.prototype||Object.defineProperty(tW.prototype,s,{get(){return t$(this)[s]}}),queueMicrotask(()=>{a.enabled&&r.dispatchEvent(new tx("addrendition",{rendition:o}))}),o}removeRendition(e){let t,i;t=tR(e).media.audioRenditions,i=tR(e).track,tR(i).renditionSet.delete(e),queueMicrotask(()=>{tR(e).track.enabled&&t.dispatchEvent(new tx("removerendition",{rendition:e}))})}get enabled(){return this.#$}set enabled(e){if(this.#$!==e){let t;this.#$=e,(t=tR(this).media.audioTracks)&&!tR(t).changeRequested&&(tR(t).changeRequested=!0,queueMicrotask(()=>{delete tR(t).changeRequested,t.dispatchEvent(new Event("change"))}))}}}let tK=tj(globalThis.HTMLMediaElement,"video"),tG=tj(globalThis.HTMLMediaElement,"audio");function tq(e){if(!e?.prototype)return e;let t=tj(e,"video");(!t||`${t}`.includes("[native code]"))&&Object.defineProperty(e.prototype,"videoTracks",{get(){var e=this;let t=tR(e).videoTracks;if(!t&&(t=new tD,tR(e).videoTracks=t,tK)){let i=tK.call(e.nativeEl??e);for(let t of i)tM(e,t);i.addEventListener("change",()=>{t.dispatchEvent(new Event("change"))}),i.addEventListener("addtrack",a=>{if([...t].some(e=>e instanceof tU)){for(let e of i)tL(e);return}tM(e,a.track)}),i.addEventListener("removetrack",e=>{tL(e.track)})}return t}});let i=tj(e,"audio");(!i||`${i}`.includes("[native code]"))&&Object.defineProperty(e.prototype,"audioTracks",{get(){var e=this;let t=tR(e).audioTracks;if(!t&&(t=new tF,tR(e).audioTracks=t,tG)){let i=tG.call(e.nativeEl??e);for(let t of i)tB(e,t);i.addEventListener("change",()=>{t.dispatchEvent(new Event("change"))}),i.addEventListener("addtrack",a=>{if([...t].some(e=>e instanceof tY)){for(let e of i)tV(e);return}tB(e,a.track)}),i.addEventListener("removetrack",e=>{tV(e.track)})}return t}}),"addVideoTrack"in e.prototype||(e.prototype.addVideoTrack=function(e,t="",i=""){let a=new tU;return a.kind=e,a.label=t,a.language=i,tM(this,a),a}),"removeVideoTrack"in e.prototype||(e.prototype.removeVideoTrack=tL),"addAudioTrack"in e.prototype||(e.prototype.addAudioTrack=function(e,t="",i=""){let a=new tY;return a.kind=e,a.label=t,a.language=i,tB(this,a),a}),"removeAudioTrack"in e.prototype||(e.prototype.removeAudioTrack=tV),"videoRenditions"in e.prototype||Object.defineProperty(e.prototype,"videoRenditions",{get(){return a(this)}});let a=e=>{let t=tR(e).videoRenditions;return t||(tR(t=new tO).media=e,tR(e).videoRenditions=t),t};"audioRenditions"in e.prototype||Object.defineProperty(e.prototype,"audioRenditions",{get(){return r(this)}});let r=e=>{let t=tR(e).audioRenditions;return t||(tR(t=new tW).media=e,tR(e).audioRenditions=t),t};return e}function tj(e,t){if(e?.prototype)return Object.getOwnPropertyDescriptor(e.prototype,`${t}Tracks`)?.get}var tZ=e=>{throw TypeError(e)},tz=(e,t,i)=>t.has(e)||tZ("Cannot "+i),tQ=(e,t,i)=>(tz(e,t,"read from private field"),i?i.call(e):t.get(e)),tX=(e,t,i)=>t.has(e)?tZ("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),tJ=(e,t,i,a)=>(tz(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),t0=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends t0{});var t1,t2,t3=class extends t0{},t4=class{constructor(e,t={}){tX(this,t2),tJ(this,t2,null==t?void 0:t.detail)}get detail(){return tQ(this,t2)}initCustomEvent(){}};t2=new WeakMap;var t5={document:{createElement:function(e,t){return new t3}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(t3)},CustomEvent:t4,EventTarget:t0,HTMLElement:t3,HTMLVideoElement:class extends t0{}},t9="u"<typeof window||void 0===globalThis.customElements,t8=t9?t5:globalThis;t9&&t5.document;var t6,t7=class extends tC(tq(tu)){constructor(){super(...arguments),tX(this,t6)}get autoplay(){let e=this.getAttribute("autoplay");return null!==e&&(""===e||e)}set autoplay(e){e!==this.autoplay&&(e?this.setAttribute("autoplay","string"==typeof e?e:""):this.removeAttribute("autoplay"))}get muxCastCustomData(){return{mux:{playbackId:this.playbackId,minResolution:this.minResolution,maxResolution:this.maxResolution,renditionOrder:this.renditionOrder,customDomain:this.customDomain,tokens:{drm:this.drmToken},envKey:this.envKey,metadata:this.metadata,disableCookies:this.disableCookies,disableTracking:this.disableTracking,beaconCollectionDomain:this.beaconCollectionDomain,startTime:this.startTime,preferCmcd:this.preferCmcd}}}get castCustomData(){var e;return null!=(e=tQ(this,t6))?e:this.muxCastCustomData}set castCustomData(e){tJ(this,t6,e)}};t6=new WeakMap,t8.customElements.get("mux-video")||(t8.customElements.define("mux-video",t7),t8.MuxVideoElement=t7);let ie={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},it={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},ii={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_WIDTH:"mediaWidth"},ia=Object.entries(ii),ir=ia.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),is=ia.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"}),io=Object.entries(is).reduce((e,[t,i])=>{let a=ir[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"}),il=Object.entries(ir).reduce((e,[t,i])=>{let a=is[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),id={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"},iu={DISABLED:"disabled",HIDDEN:"hidden",SHOWING:"showing"},ic={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},ih={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},im={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},ip={INLINE:"inline",FULLSCREEN:"fullscreen",PICTURE_IN_PICTURE:"picture-in-picture"};function iv(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function ib(e){if(e){let[t,i,a]=e.split(":");return{id:t,width:+i,height:+a}}}function ig(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function iE(e){if(e){let[t,i,a,r]=e.split(":");return{id:t,kind:i,language:a,label:r}}}function iy(e){return"number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)}function iA(e){return"string"==typeof e&&!isNaN(e)&&!isNaN(parseFloat(e))}e.s(["AttributeToStateChangeEventMap",0,il,"AvailabilityStates",0,ih,"MediaStateChangeEvents",0,is,"MediaStateReceiverAttributes",0,it,"MediaUIAttributes",0,ir,"MediaUIEvents",0,ie,"MediaUIProps",0,ii,"PointerTypes",0,ic,"ReadyStates",0,{HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},"StateChangeEventToAttributeMap",0,io,"StreamTypes",0,im,"TextTrackKinds",0,id,"TextTrackModes",0,iu,"VolumeLevels",0,{HIGH:"high",MEDIUM:"medium",LOW:"low",OFF:"off"},"WebkitPresentationModes",0,ip],395944),e.i(395944);let ik=e=>new Promise(t=>setTimeout(t,e)),iT=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],iw=e=>{if(!iy(e))return"";let t=Math.abs(e),i=t!==e,a=new Date(0,0,0,0,0,t,0),r=[a.getHours(),a.getMinutes(),a.getSeconds()].map((e,t)=>{let i;return e&&(i=1===e?iT[t].singular:iT[t].plural,`${e} ${i}`)}).filter(e=>e).join(", ");return`${r}${i?" remaining":""}`};function i_(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),n=Math.floor(e/3600),s=Math.floor(t/60%60),o=Math.floor(t/3600);return(isNaN(e)||e===1/0)&&(n=r=a="0"),r=(((n=n>0||o>0?n+":":"")||s>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+n+r+(a=a<10?"0"+a:a)}let iC=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});e.s(["emptyTimeRanges",0,iC,"formatAsTimePhrase",0,iw,"formatTime",0,i_,"serializeTimeRanges",0,function(e=iC){return Array.from(e).map((t,i)=>[Number(e.start(i).toFixed(3)),Number(e.end(i).toFixed(3))].join(":")).join(" ")}],198516),e.i(198516);let iI={en:{"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."}},iS=(null==(o6=globalThis.navigator)?void 0:o6.language)||"en",iR=(e,t={})=>(e=>{var t,i,a;let[r]=iS.split("-");return(null==(t=iI[iS])?void 0:t[e])||(null==(i=iI[r])?void 0:i[e])||(null==(a=iI.en)?void 0:a[e])||e})(e).replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):`{${i}}`);class iM{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class iL extends iM{}class iD extends iL{constructor(){super(...arguments),this.role=null}}let ix={createElement:function(){return new iN.HTMLElement},createElementNS:function(){return new iN.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent:e=>!1},iN={ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},document:ix,Node:iL,Element:iD,HTMLElement:class extends iD{constructor(){super(...arguments),this.innerHTML=""}get content(){return new iN.DocumentFragment}},DocumentFragment:class extends iM{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem:e=>null,setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia:e=>({matches:!1,media:e}),DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},iO="u"<typeof window||void 0===window.customElements,iP=Object.keys(iN).every(e=>e in globalThis),iU=iO&&!iP?iN:globalThis,i$=iO&&!iP?ix:globalThis.document,iW=new WeakMap,iH=e=>{let t=iW.get(e);return t||iW.set(e,t=new Set),t},iB=new iU.ResizeObserver(e=>{for(let t of e)for(let e of iH(t.target))e(t)});function iV(e,t){iH(e).add(t),iB.observe(e)}function iF(e,t){let i=iH(e);i.delete(t),i.size||iB.unobserve(e)}function iY(e){let t={};for(let i of e)t[i.name]=i.value;return t}function iK(e){var t;return null!=(t=iG(e))?t:iz(e,"media-controller")}function iG(e){var t;let{MEDIA_CONTROLLER:i}=it,a=e.getAttribute(i);if(a)return null==(t=iX(e))?void 0:t.getElementById(a)}let iq=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},ij=(e,t)=>{let i,a;return(i=`slot[name="${t}"]`,!(a=e.shadowRoot.querySelector(i))?[]:a.children)[0]},iZ=(e,t)=>!!e&&!!t&&(null!=e&&!!e.contains(t)||iZ(e,t.getRootNode().host)),iz=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||iz(e.getRootNode().host,t)};function iQ(e=document){var t;let i=null==e?void 0:e.activeElement;return i?null!=(t=iQ(i.shadowRoot))?t:i:null}function iX(e){var t;let i=null==(t=null==e?void 0:e.getRootNode)?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}function iJ(e,{depth:t=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=e;for(;r&&t>0;){let e=getComputedStyle(r);if(i&&"0"===e.opacity||a&&"hidden"===e.visibility||"none"===e.display)return!1;r=r.parentElement,t--}return!0}function i0(e,t){let i=function(e,t){var i,a;let r;for(r of null!=(i=e.querySelectorAll("style:not([media])"))?i:[]){let e;try{e=null==(a=r.sheet)?void 0:a.cssRules}catch{continue}for(let i of null!=e?e:[])if(t(i.selectorText))return i}}(e,e=>e===t);return i||i1(e,t)}function i1(e,t){var i,a;let r=null!=(i=e.querySelectorAll("style:not([media])"))?i:[],n=null==r?void 0:r[r.length-1];return(null==n?void 0:n.sheet)?(null==n||n.sheet.insertRule(`${t}{}`,n.sheet.cssRules.length),null==(a=n.sheet.cssRules)?void 0:a[n.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function i2(e,t,i=NaN){let a=e.getAttribute(t);return null!=a?+a:i}function i3(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}i2(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function i4(e,t){return e.hasAttribute(t)}function i5(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}i4(e,t)!=i&&e.toggleAttribute(t,i)}function i9(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function i8(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;i9(e,t,void 0)!==a&&e.setAttribute(t,a)}var i6=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},i7=(e,t,i)=>(i6(e,t,"read from private field"),i?i.call(e):t.get(e)),ae=(e,t,i,a)=>(i6(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class at extends iU.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,o7,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[it.MEDIA_CONTROLLER,ir.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===it.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=i7(this,o7))?void 0:a.unassociateElement)||r.call(a,this),ae(this,o7,null)),i&&this.isConnected&&(ae(this,o7,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=i7(this,o7))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i,a,r,n;let s;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),ae(this,o7,(r=this,(s=r.getAttribute(it.MEDIA_CONTROLLER))?null==(n=r.getRootNode())?void 0:n.getElementById(s):iz(r,"media-controller"))),this.getAttribute(it.MEDIA_CONTROLLER)&&(null==(t=null==(e=i7(this,o7))?void 0:e.associateElement)||t.call(e,this)),null==(i=i7(this,o7))||i.addEventListener("pointerdown",this),null==(a=i7(this,o7))||a.addEventListener("click",this)}disconnectedCallback(){var e,t,i,a;this.getAttribute(it.MEDIA_CONTROLLER)&&(null==(t=null==(e=i7(this,o7))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=i7(this,o7))||i.removeEventListener("pointerdown",this),null==(a=i7(this,o7))||a.removeEventListener("click",this),ae(this,o7,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:n,height:s}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>n||l>s||0===n&&0===s)return;let{pointerType:d=this._pointerType}=e;if(this._pointerType=void 0,d===ic.TOUCH)return void this.handleTap(e);if(d===ic.MOUSE)return void this.handleMouseClick(e)}}}get mediaPaused(){return i4(this,ir.MEDIA_PAUSED)}set mediaPaused(e){i5(this,ir.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?ie.MEDIA_PLAY_REQUEST:ie.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new iU.CustomEvent(t,{composed:!0,bubbles:!0}))}}o7=new WeakMap,at.shadowRootOptions={mode:"open"},at.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `},iU.customElements.get("media-gesture-receiver")||iU.customElements.define("media-gesture-receiver",at);var ai=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aa=(e,t,i)=>(ai(e,t,"read from private field"),i?i.call(e):t.get(e)),ar=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},an=(e,t,i,a)=>(ai(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),as=(e,t,i)=>(ai(e,t,"access private method"),i);let ao="audio",al="autohide",ad="breakpoints",au="gesturesdisabled",ac="keyboardcontrol",ah="noautohide",am="userinactive",ap="autohideovercontrols",av=Object.values(ir);function ab(e,t){var i,a,r;if(!e.isConnected)return;let n=Object.fromEntries((null!=(i=e.getAttribute(ad))?i:"sm:384 md:576 lg:768 xl:960").split(/\s+/).map(e=>e.split(":"))),s=(a=n,r=t,Object.keys(a).filter(e=>r>=parseInt(a[e]))),o=!1;if(Object.keys(n).forEach(t=>{if(s.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),o=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),o=!0)}),o){let t=new CustomEvent(is.BREAKPOINTS_CHANGE,{detail:s});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(is.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}class ag extends iU.HTMLElement{constructor(){if(super(),ar(this,ln),ar(this,ld),ar(this,lc),ar(this,lm),ar(this,lv),ar(this,lg),ar(this,le,0),ar(this,lt,null),ar(this,li,null),ar(this,la,void 0),this.breakpointsComputed=!1,ar(this,lr,new MutationObserver(as(this,ln,ls).bind(this))),ar(this,lo,!1),ar(this,ll,e=>{aa(this,lo)||(setTimeout(()=>{ab(e.target,e.contentRect.width),an(this,lo,!1)},0),an(this,lo,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}const e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){aa(this,lt)&&this.mediaUnsetCallback(aa(this,lt));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[al,au].concat(av).filter(e=>![ir.MEDIA_RENDITION_LIST,ir.MEDIA_AUDIO_TRACK_LIST,ir.MEDIA_CHAPTERS_CUES,ir.MEDIA_WIDTH,ir.MEDIA_HEIGHT,ir.MEDIA_ERROR,ir.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==al&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(an(this,lt,e),e.localName.includes("-")&&await iU.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;aa(this,lr).observe(this,{childList:!0,subtree:!0}),iV(this,aa(this,ll));let t=null!=this.getAttribute(ao)?iR("audio player"):iR("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",t),this.handleMediaUpdated(this.media),this.setAttribute(am,""),ab(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),null==(e=iU.window)||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;aa(this,lr).disconnect(),iF(this,aa(this,ll)),this.media&&this.mediaUnsetCallback(this.media),null==(e=iU.window)||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){an(this,lt,null)}handleEvent(e){switch(e.type){case"pointerdown":an(this,le,e.timeStamp);break;case"pointermove":as(this,ld,lu).call(this,e);break;case"pointerup":as(this,lc,lh).call(this,e);break;case"mouseleave":as(this,lm,lp).call(this);break;case"mouseup":this.removeAttribute(ac);break;case"keyup":as(this,lg,lE).call(this),this.setAttribute(ac,"")}}set autohide(e){let t=Number(e);an(this,la,isNaN(t)?0:t)}get autohide(){return(void 0===aa(this,la)?2:aa(this,la)).toString()}get breakpoints(){return i9(this,ad)}set breakpoints(e){i8(this,ad,e)}get audio(){return i4(this,ao)}set audio(e){i5(this,ao,e)}get gesturesDisabled(){return i4(this,au)}set gesturesDisabled(e){i5(this,au,e)}get keyboardControl(){return i4(this,ac)}set keyboardControl(e){i5(this,ac,e)}get noAutohide(){return i4(this,ah)}set noAutohide(e){i5(this,ah,e)}get autohideOverControls(){return i4(this,ap)}set autohideOverControls(e){i5(this,ap,e)}get userInteractive(){return i4(this,am)}set userInteractive(e){i5(this,am,e)}}le=new WeakMap,lt=new WeakMap,li=new WeakMap,la=new WeakMap,lr=new WeakMap,ln=new WeakSet,ls=function(e){let t=this.media;for(let i of e)if("childList"===i.type){for(let e of i.removedNodes){if("media"!=e.slot||i.target!=this)continue;let a=i.previousSibling&&i.previousSibling.previousElementSibling;if(a&&t){let t="media"!==a.slot;for(;null!==(a=a.previousSibling);)"media"==a.slot&&(t=!1);t&&this.mediaUnsetCallback(e)}else this.mediaUnsetCallback(e)}if(t)for(let e of i.addedNodes)e===t&&this.handleMediaUpdated(t)}},lo=new WeakMap,ll=new WeakMap,ld=new WeakSet,lu=function(e){if("mouse"!==e.pointerType&&e.timeStamp-aa(this,le)<250)return;as(this,lv,lb).call(this),clearTimeout(aa(this,li));let t=this.hasAttribute(ap);([this,this.media].includes(e.target)||t)&&as(this,lg,lE).call(this)},lc=new WeakSet,lh=function(e){if("touch"===e.pointerType){let t=!this.hasAttribute(am);[this,this.media].includes(e.target)&&t?as(this,lm,lp).call(this):as(this,lg,lE).call(this)}else e.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(null==e?void 0:e.localName))&&as(this,lg,lE).call(this)},lm=new WeakSet,lp=function(){if(0>aa(this,la)||this.hasAttribute(am))return;this.setAttribute(am,"");let e=new iU.CustomEvent(is.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},lv=new WeakSet,lb=function(){if(!this.hasAttribute(am))return;this.removeAttribute(am);let e=new iU.CustomEvent(is.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},lg=new WeakSet,lE=function(){as(this,lv,lb).call(this),clearTimeout(aa(this,li));let e=parseInt(this.autohide);e<0||an(this,li,setTimeout(()=>{as(this,lm,lp).call(this)},1e3*e))},ag.shadowRootOptions={mode:"open"},ag.getTemplateHTML=function(e){return`
    <style>
      
      :host([${ir.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
      }

      :host(:not([${ao}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${ao}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${ao}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${ao}])[${au}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${ao}])[${au}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${ao}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${ao}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${ao}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${ao}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${ah}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${am}]:not([${ir.MEDIA_PAUSED}]):not([${ir.MEDIA_IS_AIRPLAYING}]):not([${ir.MEDIA_IS_CASTING}]):not([${ao}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${ah}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${am}]:not([${ah}]):not([${ir.MEDIA_PAUSED}]):not([${ir.MEDIA_IS_CASTING}]):not([${ao}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${am}][${ap}]:not([${ah}]):not([${ir.MEDIA_PAUSED}]):not([${ir.MEDIA_IS_CASTING}]):not([${ao}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${ao}])[${ir.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${at.shadowRootOptions.mode}">
          ${at.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `},iU.customElements.get("media-container")||iU.customElements.define("media-container",ag);var aE=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},af=(e,t,i)=>(aE(e,t,"read from private field"),i?i.call(e):t.get(e)),ay=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aA=(e,t,i,a)=>(aE(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ak{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){ay(this,lT),ay(this,lf,void 0),ay(this,ly,void 0),ay(this,lA,void 0),ay(this,lk,new Set),aA(this,lf,e),aA(this,ly,t),aA(this,lA,new Set(i))}[Symbol.iterator](){return af(this,lT,lw).values()}get length(){return af(this,lT,lw).size}get value(){var e;return null!=(e=[...af(this,lT,lw)].join(" "))?e:""}set value(e){var t;e!==this.value&&(aA(this,lk,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...af(this,lT,lw)][e]}values(){return af(this,lT,lw).values()}forEach(e,t){af(this,lT,lw).forEach(e,t)}add(...e){var t,i;e.forEach(e=>af(this,lk).add(e)),(""!==this.value||(null==(t=af(this,lf))?void 0:t.hasAttribute(`${af(this,ly)}`)))&&(null==(i=af(this,lf))||i.setAttribute(`${af(this,ly)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>af(this,lk).delete(e)),null==(t=af(this,lf))||t.setAttribute(`${af(this,ly)}`,`${this.value}`)}contains(e){return af(this,lT,lw).has(e)}toggle(e,t){if(void 0!==t)if(t)return this.add(e),!0;else return this.remove(e),!1;return this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}lf=new WeakMap,ly=new WeakMap,lA=new WeakMap,lk=new WeakMap,lT=new WeakSet,lw=function(){return af(this,lk).size?af(this,lk):af(this,lA)};let aT=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:"cc"===t?id.CAPTIONS:id.SUBTITLES,language:i,label:r}},aw=(e="",t={})=>((e="")=>e.split(/\s+/))(e).map(e=>{let i=aT(e);return{...t,...i}}),a_=e=>e?Array.isArray(e)?e.map(e=>"string"==typeof e?aT(e):e):"string"==typeof e?aw(e):[e]:[],aC=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,aI=(e=[])=>Array.prototype.map.call(e,aC).join(" "),aS=e=>{let t=Object.entries(e).map(([e,t])=>i=>i[e]===t);return e=>t.every(t=>t(e))},aR=(e,t=[],i=[])=>{let a=a_(i).map(aS);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},aM=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:aS(t);return Array.from(e.textTracks).filter(i)},aL=e=>{var t;return!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)||e.hasAttribute(ir.MEDIA_SUBTITLES_SHOWING)},aD="exitFullscreen"in i$?"exitFullscreen":"webkitExitFullscreen"in i$?"webkitExitFullscreen":"webkitCancelFullScreen"in i$?"webkitCancelFullScreen":void 0,ax="fullscreenElement"in i$?"fullscreenElement":"webkitFullscreenElement"in i$?"webkitFullscreenElement":void 0,aN="fullscreenEnabled"in i$?"fullscreenEnabled":"webkitFullscreenEnabled"in i$?"webkitFullscreenEnabled":void 0,aO=()=>{var e;return i||(i=null==(e=null==i$?void 0:i$.createElement)?void 0:e.call(i$,"video"))},aP=async(e=aO())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let i=new AbortController,a=await Promise.race([aU(e,i.signal),a$(e,t)]);return i.abort(),a},aU=(e,t)=>new Promise(i=>{e.addEventListener("volumechange",()=>i(!0),{signal:t})}),a$=async(e,t)=>{for(let i=0;i<10;i++){if(e.volume===t)return!1;await ik(10)}return e.volume!==t},aW=/.*Version\/.*Safari\/.*/.test(iU.navigator.userAgent),aH=(e=aO())=>(!iU.matchMedia("(display-mode: standalone)").matches||!aW)&&"function"==typeof(null==e?void 0:e.requestPictureInPicture),aB=(e=aO())=>(e=>{let{documentElement:t,media:i}=e;return!!(null==t?void 0:t[aN])||i&&"webkitSupportsFullscreen"in i})({documentElement:i$,media:e}),aV=aB(),aF=aH(),aY=!!iU.WebKitPlaybackTargetAvailabilityEvent,aK=!!iU.chrome,aG=e=>aM(e.media,e=>[id.SUBTITLES,id.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),aq=e=>aM(e.media,e=>e.mode===iu.SHOWING&&[id.SUBTITLES,id.CAPTIONS].includes(e.kind)),aj=(e,t)=>{let i=aG(e),a=aq(e),r=!!a.length;if(i.length){if(!1===t||r&&!0!==t)aR(iu.DISABLED,i,a);else if(!0===t||!r&&!1!==t){let t=i[0],{options:r}=e;if(!(null==r?void 0:r.noSubtitlesLangPref)){let e=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),a=e?[e,...globalThis.navigator.languages]:globalThis.navigator.languages,r=i.filter(e=>a.some(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))).sort((e,t)=>a.findIndex(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))-a.findIndex(e=>t.language.toLowerCase().startsWith(e.split("-")[0])));r[0]&&(t=r[0])}let{language:n,label:s,kind:o}=t;aR(iu.DISABLED,i,a),aR(iu.SHOWING,i,[{language:n,label:s,kind:o}])}}},aZ=(e,t)=>e===t||null!=e&&null!=t&&typeof e==typeof t&&(!!("number"==typeof e&&Number.isNaN(e)&&Number.isNaN(t))||"object"==typeof e&&(Array.isArray(e)?az(e,t):Object.entries(e).every(([e,i])=>e in t&&aZ(i,t[e])))),az=(e,t)=>{let i=Array.isArray(e),a=Array.isArray(t);return i===a&&(!i&&!a||e.length===t.length&&e.every((e,i)=>aZ(e,t[i])))},aQ=Object.values(im),aX=aP().then(e=>a=e),aJ=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof iU.HTMLElement))return;let t=e.localName;if(!t.includes("-"))return;let i=iU.customElements.get(t);i&&e instanceof i||(await iU.customElements.whenDefined(t),iU.customElements.upgrade(e))}))},a0=new iU.DOMParser,a1={mediaError:{get(e,t){let{media:i}=e;if((null==t?void 0:t.type)!=="playing")return null==i?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(e,t){var i;let{media:a}=e;if((null==t?void 0:t.type)!=="playing")return null==(i=null==a?void 0:a.error)?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(e,t){var i,a;let{media:r}=e;if((null==t?void 0:t.type)!=="playing")return null!=(a=null==(i=null==r?void 0:r.error)?void 0:i.message)?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoWidth)?t:0},mediaEvents:["resize"]},mediaHeight:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoHeight)?t:0},mediaEvents:["resize"]},mediaPaused:{get(e){var t;let{media:i}=e;return null==(t=null==i?void 0:i.paused)||t},set(e,t){var i;let{media:a}=t;a&&(e?a.pause():null==(i=a.play())||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(e,t){let{media:i}=e;return!!i&&(t?"playing"===t.type:!i.paused)},mediaEvents:["playing","emptied"]},mediaEnded:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.ended)&&t},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.playbackRate)?t:1},set(e,t){let{media:i}=t;!i||Number.isFinite(+e)&&(i.playbackRate=+e)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.muted)&&t},set(e,t){let{media:i}=t;if(i){try{iU.localStorage.setItem("media-chrome-pref-muted",e?"true":"false")}catch(e){console.debug("Error setting muted pref",e)}i.muted=e}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:i}}=t,{media:a}=t;if(a&&!a.muted&&!i)try{let i="true"===iU.localStorage.getItem("media-chrome-pref-muted");a1.mediaMuted.set(i,t),e(i)}catch(e){console.debug("Error getting muted pref",e)}}]},mediaVolume:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.volume)?t:1},set(e,t){let{media:i}=t;if(i){try{null==e?iU.localStorage.removeItem("media-chrome-pref-volume"):iU.localStorage.setItem("media-chrome-pref-volume",e.toString())}catch(e){console.debug("Error setting volume pref",e)}Number.isFinite(+e)&&(i.volume=+e)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:i}}=t;if(!i)try{let{media:i}=t;if(!i)return;let a=iU.localStorage.getItem("media-chrome-pref-volume");if(null==a)return;a1.mediaVolume.set(+a,t),e(+a)}catch(e){console.debug("Error getting volume pref",e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return void 0===(null==t?void 0:t.volume)?"high":t.muted||0===t.volume?"off":t.volume<.5?"low":t.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.currentTime)?t:0},set(e,t){let{media:i}=t;i&&iy(e)&&(i.currentTime=e)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:i}={}}=e;return i&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?i:Number.isFinite(null==t?void 0:t.duration)?t.duration:NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(e){let{media:t}=e;return(null==t?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(e){var t;let{media:i}=e,a=null!=(t=null==i?void 0:i.buffered)?t:[];return Array.from(a).map((e,t)=>[Number(a.start(t).toFixed(3)),Number(a.end(t).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:i}={}}=e,a=[im.LIVE,im.ON_DEMAND].includes(i)?i:void 0;if(!t)return a;let{streamType:r}=t;if(aQ.includes(r))return r===im.UNKNOWN?a:r;let n=t.duration;return n===1/0?im.LIVE:Number.isFinite(n)?im.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return NaN;let{targetLiveWindow:i}=t,a=a1.mediaStreamType.get(e);return(null==i||Number.isNaN(i))&&a===im.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:i=10}={}}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;if(a1.mediaStreamType.get(e)!==im.LIVE)return!1;let a=t.seekable;if(!a)return!0;if(!a.length)return!1;let r=a.end(a.length-1)-i;return t.currentTime>=r},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get:e=>aG(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get:e=>aq(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i,a;let{media:r,options:n}=t;if(!r)return;let s=e=>{var i;n.defaultSubtitles&&(e&&![id.CAPTIONS,id.SUBTITLES].includes(null==(i=null==e?void 0:e.track)?void 0:i.kind)||aj(t,!0))};return r.addEventListener("loadstart",s),null==(i=r.textTracks)||i.addEventListener("addtrack",s),null==(a=r.textTracks)||a.addEventListener("removetrack",s),()=>{var e,t;r.removeEventListener("loadstart",s),null==(e=r.textTracks)||e.removeEventListener("addtrack",s),null==(t=r.textTracks)||t.removeEventListener("removetrack",s)}}]},mediaChaptersCues:{get(e){var t;let{media:i}=e;if(!i)return[];let[a]=aM(i,{kind:id.CHAPTERS});return Array.from(null!=(t=null==a?void 0:a.cues)?t:[]).map(({text:e,startTime:t,endTime:i})=>({text:e&&a0.parseFromString(e,"text/html").body.textContent||e,startTime:t,endTime:i}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),n=null==(i=a.shadowRoot)?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return null==r||r.addEventListener("load",e),null==n||n.addEventListener("load",e),()=>{null==r||r.removeEventListener("load",e),null==n||n.removeEventListener("load",e)}}]},mediaIsPip:{get(e){var t,i;let{media:a,documentElement:r}=e;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return!!(null==(t=a.localName)?void 0:t.includes("-"))&&iZ(a,r.pictureInPictureElement);if(r.pictureInPictureElement.localName.includes("-")){let e=r.pictureInPictureElement.shadowRoot;for(;null==e?void 0:e.pictureInPictureElement;){if(e.pictureInPictureElement===a)return!0;e=null==(i=e.pictureInPictureElement)?void 0:i.shadowRoot}}return!1},set(e,t){let{media:i}=t;if(i)if(e){if(!i$.pictureInPictureEnabled)return void console.warn("MediaChrome: Picture-in-picture is not enabled");if(!i.requestPictureInPicture)return void console.warn("MediaChrome: The current media does not support picture-in-picture");let e=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(t=>{if(11===t.code){if(!i.src)return void console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");if(0===i.readyState&&"none"===i.preload){let t=()=>{i.removeEventListener("loadedmetadata",a),i.preload="none"},a=()=>{i.requestPictureInPicture().catch(e),t()};i.addEventListener("loadedmetadata",a),i.preload="metadata",setTimeout(()=>{0===i.readyState&&e(),t()},1e3)}else throw t}else throw t})}else i$.pictureInPictureElement&&i$.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]].map(e=>({...e}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.videoRenditions))return void console.warn("MediaController: Rendition selection not supported by this media.");let a=Array.prototype.findIndex.call(i.videoRenditions,t=>t.id==e);i.videoRenditions.selectedIndex!=a&&(i.videoRenditions.selectedIndex=a)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.audioTracks))return void console.warn("MediaChrome: Audio track selection not supported by this media.");for(let t of i.audioTracks)t.enabled=e==t.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get:e=>(e=>{var t;let{media:i,documentElement:a,fullscreenElement:r=i}=e;if(!i||!a)return!1;let n=(e=>{let{documentElement:t,media:i}=e,a=null==t?void 0:t[ax];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===ip.FULLSCREEN?i:a})(e);if(!n)return!1;if(n===r||n===i)return!0;if(n.localName.includes("-")){let e=n.shadowRoot;if(!(ax in e))return iZ(n,r);for(;null==e?void 0:e[ax];){if(e[ax]===r)return!0;e=null==(t=e[ax])?void 0:t.shadowRoot}}return!1})(e),set(e,t){e?(e=>{var t;let{media:i,fullscreenElement:a}=e;try{let e=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(e){let i=null==(t=a[e])?void 0:t.call(a);if(i instanceof Promise)return i.catch(()=>{})}else(null==i?void 0:i.webkitEnterFullscreen)?i.webkitEnterFullscreen():(null==i?void 0:i.requestFullscreen)&&i.requestFullscreen()}catch(e){console.error(e)}})(t):(e=>{var t;let{documentElement:i}=e;if(aD){let e=null==(t=null==i?void 0:i[aD])?void 0:t.call(i);if(e instanceof Promise)return e.catch(()=>{})}})(t)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(e){var t;let{media:i}=e;return!!(null==i?void 0:i.remote)&&(null==(t=i.remote)?void 0:t.state)!=="disconnected"&&!!i.remote.state},set(e,t){var i,a;let{media:r}=t;if(r&&(!e||(null==(i=r.remote)?void 0:i.state)==="disconnected")&&(e||(null==(a=r.remote)?void 0:a.state)==="connected")){if("function"!=typeof r.remote.prompt)return void console.warn("MediaChrome: Casting is not supported in this environment");r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get:()=>!1,set(e,t){let{media:i}=t;if(i){if(!(i.webkitShowPlaybackTargetPicker&&iU.WebKitPlaybackTargetAvailabilityEvent))return void console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!aV||!aB(t))return ih.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;if(!aF||!aH(t))return ih.UNSUPPORTED}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(!1===a||(null==t?void 0:t.volume)==void 0)return ih.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{null==a&&aX.then(t=>e(t?void 0:ih.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t="not-available"}={}){var i;let{media:a}=e;return aK&&(null==(i=null==a?void 0:a.remote)?void 0:i.state)?null!=t&&"available"!==t?ih.UNAVAILABLE:void 0:ih.UNSUPPORTED},stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get:(e,t)=>aY?(null==t?void 0:t.availability)==="not-available"?ih.UNAVAILABLE:void 0:ih.UNSUPPORTED,mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:ih.UNAVAILABLE:ih.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?ih.UNAVAILABLE:void 0:ih.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]}},a2={[ie.MEDIA_PREVIEW_REQUEST](e,t,{detail:i}){var a,r,n;let s,o,{media:l}=t,d=null!=i?i:void 0;if(l&&null!=d){let[e]=aM(l,{kind:id.METADATA,label:"thumbnails"}),t=Array.prototype.find.call(null!=(a=null==e?void 0:e.cues)?a:[],(e,t,i)=>0===t?e.endTime>d:t===i.length-1?e.startTime<=d:e.startTime<=d&&e.endTime>d);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)||null==(r=null==l?void 0:l.querySelector('track[label="thumbnails"]'))?void 0:r.src,i=new URL(t.text,e);o=new URLSearchParams(i.hash).get("#xywh").split(",").map(e=>+e),s=i.href}}let u=e.mediaDuration.get(t),c=null==(n=e.mediaChaptersCues.get(t).find((e,t,i)=>t===i.length-1&&u===e.endTime?e.startTime<=d&&e.endTime>=d:e.startTime<=d&&e.endTime>d))?void 0:n.text;return null!=i&&null==c&&(c=""),{mediaPreviewTime:d,mediaPreviewImage:s,mediaPreviewCoords:o,mediaPreviewChapter:c}},[ie.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[ie.MEDIA_PLAY_REQUEST](e,t){var i,a,r,n;let s=e.mediaStreamType.get(t)===im.LIVE,o=!(null==(i=t.options)?void 0:i.noAutoSeekToLive),l=e.mediaTargetLiveWindow.get(t)>0;if(s&&o&&!l){let i=null==(a=e.mediaSeekable.get(t))?void 0:a[1];if(i){let a=null!=(n=null==(r=t.options)?void 0:r.seekToLiveOffset)?n:0;e.mediaCurrentTime.set(i-a,t)}}e.mediaPaused.set(!1,t)},[ie.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:i}){e.mediaPlaybackRate.set(i,t)},[ie.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[ie.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[ie.MEDIA_VOLUME_REQUEST](e,t,{detail:i}){i&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(i,t)},[ie.MEDIA_SEEK_REQUEST](e,t,{detail:i}){e.mediaCurrentTime.set(i,t)},[ie.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){var i,a,r;let n=null==(i=e.mediaSeekable.get(t))?void 0:i[1];if(Number.isNaN(Number(n)))return;let s=null!=(r=null==(a=t.options)?void 0:a.seekToLiveOffset)?r:0;e.mediaCurrentTime.set(n-s,t)},[ie.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:i}){var a;let{options:r}=t,n=aG(t),s=a_(i),o=null==(a=s[0])?void 0:a.language;o&&!r.noSubtitlesLangPref&&iU.localStorage.setItem("media-chrome-pref-subtitles-lang",o),aR(iu.SHOWING,n,s)},[ie.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:i}){let a=aG(t);aR(iu.DISABLED,a,null!=i?i:[])},[ie.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:i}){aj(t,i)},[ie.MEDIA_RENDITION_REQUEST](e,t,{detail:i}){e.mediaRenditionSelected.set(i,t)},[ie.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:i}){e.mediaAudioTrackEnabled.set(i,t)},[ie.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[ie.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[ie.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t)},[ie.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[ie.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[ie.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[ie.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}};var a3=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},a4=(e,t,i)=>(a3(e,t,"read from private field"),i?i.call(e):t.get(e)),a5=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},a9=(e,t,i,a)=>(a3(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),a8=(e,t,i)=>(a3(e,t,"access private method"),i);let a6=["ArrowLeft","ArrowRight","Enter"," ","f","m","k","c"],a7="defaultsubtitles",re="defaultstreamtype",rt="defaultduration",ri="fullscreenelement",ra="hotkeys",rr="keysused",rn="liveedgeoffset",rs="seektoliveoffset",ro="noautoseektolive",rl="nohotkeys",rd="novolumepref",ru="nosubtitleslangpref",rc="nodefaultstore",rh="keyboardforwardseekoffset",rm="keyboardbackwardseekoffset",rp="lang";class rv extends ag{constructor(){super(),a5(this,lL),a5(this,lx),a5(this,lO),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,a5(this,l_,new ak(this,ra)),a5(this,lC,void 0),a5(this,lI,void 0),a5(this,lS,void 0),a5(this,lR,void 0),a5(this,lM,e=>{var t;null==(t=a4(this,lI))||t.dispatch(e)}),this.associateElement(this);let e={};a9(this,lS,t=>{Object.entries(t).forEach(([t,i])=>{if(t in e&&e[t]===i)return;this.propagateMediaState(t,i);let a=t.toLowerCase(),r=new iU.CustomEvent(il[a],{composed:!0,detail:i});this.dispatchEvent(r)}),e=t}),this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(rl,ra,re,a7,rt,rp)}get mediaStore(){return a4(this,lI)}set mediaStore(e){var t,i;(a4(this,lI)&&(null==(t=a4(this,lR))||t.call(this),a9(this,lR,void 0)),a9(this,lI,e),a4(this,lI)||this.hasAttribute(rc))?a9(this,lR,null==(i=a4(this,lI))?void 0:i.subscribe(a4(this,lS))):a8(this,lL,lD).call(this)}get fullscreenElement(){var e;return null!=(e=a4(this,lC))?e:this}set fullscreenElement(e){var t;this.hasAttribute(ri)&&this.removeAttribute(ri),a9(this,lC,e),null==(t=a4(this,lI))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return i4(this,a7)}set defaultSubtitles(e){i5(this,a7,e)}get defaultStreamType(){return i9(this,re)}set defaultStreamType(e){i8(this,re,e)}get defaultDuration(){return i2(this,rt)}set defaultDuration(e){i3(this,rt,e)}get noHotkeys(){return i4(this,rl)}set noHotkeys(e){i5(this,rl,e)}get keysUsed(){return i9(this,rr)}set keysUsed(e){i8(this,rr,e)}get liveEdgeOffset(){return i2(this,rn)}set liveEdgeOffset(e){i3(this,rn,e)}get noAutoSeekToLive(){return i4(this,ro)}set noAutoSeekToLive(e){i5(this,ro,e)}get noVolumePref(){return i4(this,rd)}set noVolumePref(e){i5(this,rd,e)}get noSubtitlesLangPref(){return i4(this,ru)}set noSubtitlesLangPref(e){i5(this,ru,e)}get noDefaultStore(){return i4(this,rc)}set noDefaultStore(e){i5(this,rc,e)}attributeChangedCallback(e,t,i){var a,r,n,s,o,l,d,u;if(super.attributeChangedCallback(e,t,i),e===rl)i!==t&&""===i?(this.hasAttribute(ra)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===ra)a4(this,l_).value=i;else if(e===a7&&i!==t)null==(a=a4(this,lI))||a.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(a7)}});else if(e===re)null==(n=a4(this,lI))||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:null!=(r=this.getAttribute(re))?r:void 0}});else if(e===rn)null==(s=a4(this,lI))||s.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(rn)?+this.getAttribute(rn):void 0,seekToLiveOffset:this.hasAttribute(rs)?void 0:+this.getAttribute(rn)}});else if(e===rs)null==(o=a4(this,lI))||o.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(rs)?+this.getAttribute(rs):void 0}});else if(e===ro)null==(l=a4(this,lI))||l.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(ro)}});else if(e===ri){let e=i?null==(d=this.getRootNode())?void 0:d.getElementById(i):void 0;a9(this,lC,e),null==(u=a4(this,lI))||u.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===rp&&i!==t&&(iS=i)}connectedCallback(){var e,t;a4(this,lI)||this.hasAttribute(rc)||a8(this,lL,lD).call(this),null==(e=a4(this,lI))||e.dispatch({type:"documentelementchangerequest",detail:i$}),super.connectedCallback(),a4(this,lI)&&!a4(this,lR)&&a9(this,lR,null==(t=a4(this,lI))?void 0:t.subscribe(a4(this,lS))),this.enableHotkeys()}disconnectedCallback(){var e,t,i,a;null==(e=super.disconnectedCallback)||e.call(this),a4(this,lI)&&(null==(t=a4(this,lI))||t.dispatch({type:"documentelementchangerequest",detail:void 0}),null==(i=a4(this,lI))||i.dispatch({type:ie.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})),a4(this,lR)&&(null==(a=a4(this,lR))||a.call(this),a9(this,lR,void 0))}mediaSetCallback(e){var t;super.mediaSetCallback(e),null==(t=a4(this,lI))||t.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),null==(t=a4(this,lI))||t.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,t){rw(this.mediaStateReceivers,e,t)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=r_(e,this.registerMediaStateReceiver.bind(this),this.unregisterMediaStateReceiver.bind(this));Object.values(ie).forEach(t=>{e.addEventListener(t,a4(this,lM))}),t.set(e,i)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;t.has(e)&&(t.get(e)(),t.delete(e),Object.values(ie).forEach(t=>{e.removeEventListener(t,a4(this,lM))}))}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers;!(t.indexOf(e)>-1)&&(t.push(e),a4(this,lI)&&Object.entries(a4(this,lI).getState()).forEach(([t,i])=>{rw([e],t,i)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",a8(this,lO,lP))}disableHotkeys(){this.removeEventListener("keydown",a8(this,lO,lP)),this.removeEventListener("keyup",a8(this,lx,lN))}get hotkeys(){return i9(this,ra)}set hotkeys(e){i8(this,ra,e)}keyboardShortcutHandler(e){var t,i,a,r,n;let s,o,l,d=e.target;if(!((null!=(a=null!=(i=null==(t=d.getAttribute(rr))?void 0:t.split(" "))?i:null==d?void 0:d.keysUsed)?a:[]).map(e=>"Space"===e?" ":e).filter(Boolean).includes(e.key)||a4(this,l_).contains(`no${e.key.toLowerCase()}`))&&!(" "===e.key&&a4(this,l_).contains("nospace")))switch(e.key){case" ":case"k":s=a4(this,lI).getState().mediaPaused?ie.MEDIA_PLAY_REQUEST:ie.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new iU.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"m":s="off"===this.mediaStore.getState().mediaVolumeLevel?ie.MEDIA_UNMUTE_REQUEST:ie.MEDIA_MUTE_REQUEST,this.dispatchEvent(new iU.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"f":s=this.mediaStore.getState().mediaIsFullscreen?ie.MEDIA_EXIT_FULLSCREEN_REQUEST:ie.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new iU.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new iU.CustomEvent(ie.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":{let e=this.hasAttribute(rm)?+this.getAttribute(rm):10;o=Math.max((null!=(r=this.mediaStore.getState().mediaCurrentTime)?r:0)-e,0),l=new iU.CustomEvent(ie.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:o}),this.dispatchEvent(l);break}case"ArrowRight":{let e=this.hasAttribute(rh)?+this.getAttribute(rh):10;o=Math.max((null!=(n=this.mediaStore.getState().mediaCurrentTime)?n:0)+e,0),l=new iU.CustomEvent(ie.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:o}),this.dispatchEvent(l)}}}}l_=new WeakMap,lC=new WeakMap,lI=new WeakMap,lS=new WeakMap,lR=new WeakMap,lM=new WeakMap,lL=new WeakSet,lD=function(){var e;this.mediaStore=(({media:e,fullscreenElement:t,documentElement:i,stateMediator:a=a1,requestMap:r=a2,options:n={},monitorStateOwnersOnlyWithSubscriptions:s=!0})=>{let o,l=[],d={options:{...n}},u=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),c=e=>{void 0==e||aZ(e,u)||(u=Object.freeze({...u,...e}),l.forEach(e=>e(u)))},h=()=>{c(Object.entries(a).reduce((e,[t,{get:i}])=>(e[t]=i(d),e),{}))},m={},p=async(e,t)=>{var i,r,n,u,p,v,b,g,E,f,y,A,k,T,w,_;let C=!!o;if(o={...d,...null!=o?o:{},...e},C)return;await aJ(...Object.values(e));let I=l.length>0&&0===t&&s,S=d.media!==o.media,R=(null==(i=d.media)?void 0:i.textTracks)!==(null==(r=o.media)?void 0:r.textTracks),M=(null==(n=d.media)?void 0:n.videoRenditions)!==(null==(u=o.media)?void 0:u.videoRenditions),L=(null==(p=d.media)?void 0:p.audioTracks)!==(null==(v=o.media)?void 0:v.audioTracks),D=(null==(b=d.media)?void 0:b.remote)!==(null==(g=o.media)?void 0:g.remote),x=d.documentElement!==o.documentElement,N=!!d.media&&(S||I),O=!!(null==(E=d.media)?void 0:E.textTracks)&&(R||I),P=!!(null==(f=d.media)?void 0:f.videoRenditions)&&(M||I),U=!!(null==(y=d.media)?void 0:y.audioTracks)&&(L||I),$=!!(null==(A=d.media)?void 0:A.remote)&&(D||I),W=!!d.documentElement&&(x||I),H=N||O||P||U||$||W,B=0===l.length&&1===t&&s,V=!!o.media&&(S||B),F=!!(null==(k=o.media)?void 0:k.textTracks)&&(R||B),Y=!!(null==(T=o.media)?void 0:T.videoRenditions)&&(M||B),K=!!(null==(w=o.media)?void 0:w.audioTracks)&&(L||B),G=!!(null==(_=o.media)?void 0:_.remote)&&(D||B),q=!!o.documentElement&&(x||B),j=V||F||Y||K||G||q;if(!(H||j)){Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0;return}Object.entries(a).forEach(([e,{get:t,mediaEvents:i=[],textTracksEvents:a=[],videoRenditionsEvents:r=[],audioTracksEvents:n=[],remoteEvents:s=[],rootEvents:l=[],stateOwnersUpdateHandlers:u=[]}])=>{let h;m[e]||(m[e]={});let p=i=>{c({[e]:t(d,i)})};h=m[e].mediaEvents,i.forEach(t=>{h&&N&&(d.media.removeEventListener(t,h),m[e].mediaEvents=void 0),V&&(o.media.addEventListener(t,p),m[e].mediaEvents=p)}),h=m[e].textTracksEvents,a.forEach(t=>{var i,a;h&&O&&(null==(i=d.media.textTracks)||i.removeEventListener(t,h),m[e].textTracksEvents=void 0),F&&(null==(a=o.media.textTracks)||a.addEventListener(t,p),m[e].textTracksEvents=p)}),h=m[e].videoRenditionsEvents,r.forEach(t=>{var i,a;h&&P&&(null==(i=d.media.videoRenditions)||i.removeEventListener(t,h),m[e].videoRenditionsEvents=void 0),Y&&(null==(a=o.media.videoRenditions)||a.addEventListener(t,p),m[e].videoRenditionsEvents=p)}),h=m[e].audioTracksEvents,n.forEach(t=>{var i,a;h&&U&&(null==(i=d.media.audioTracks)||i.removeEventListener(t,h),m[e].audioTracksEvents=void 0),K&&(null==(a=o.media.audioTracks)||a.addEventListener(t,p),m[e].audioTracksEvents=p)}),h=m[e].remoteEvents,s.forEach(t=>{var i,a;h&&$&&(null==(i=d.media.remote)||i.removeEventListener(t,h),m[e].remoteEvents=void 0),G&&(null==(a=o.media.remote)||a.addEventListener(t,p),m[e].remoteEvents=p)}),h=m[e].rootEvents,l.forEach(t=>{h&&W&&(d.documentElement.removeEventListener(t,h),m[e].rootEvents=void 0),q&&(o.documentElement.addEventListener(t,p),m[e].rootEvents=p)});let v=m[e].stateOwnersUpdateHandlers;u.forEach(t=>{v&&H&&v(),j&&(m[e].stateOwnersUpdateHandlers=t(p,o))})}),Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0};return p({media:e,fullscreenElement:t,documentElement:i,options:n}),{dispatch(e){let{type:t,detail:i}=e;r[t]&&null==u.mediaErrorCode?c(r[t](a,d,e)):"mediaelementchangerequest"===t?p({media:i}):"fullscreenelementchangerequest"===t?p({fullscreenElement:i}):"documentelementchangerequest"===t?p({documentElement:i}):"optionschangerequest"===t&&Object.entries(null!=i?i:{}).forEach(([e,t])=>{d.options[e]=t})},getState:()=>u,subscribe:e=>(p({},l.length+1),l.push(e),e(u),()=>{let t=l.indexOf(e);t>=0&&(p({},l.length-1),l.splice(t,1))})}})({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(a7),defaultDuration:this.hasAttribute(rt)?+this.getAttribute(rt):void 0,defaultStreamType:null!=(e=this.getAttribute(re))?e:void 0,liveEdgeOffset:this.hasAttribute(rn)?+this.getAttribute(rn):void 0,seekToLiveOffset:this.hasAttribute(rs)?+this.getAttribute(rs):this.hasAttribute(rn)?+this.getAttribute(rn):void 0,noAutoSeekToLive:this.hasAttribute(ro),noVolumePref:this.hasAttribute(rd),noSubtitlesLangPref:this.hasAttribute(ru)}})},lx=new WeakSet,lN=function(e){let{key:t}=e;a6.includes(t)?this.keyboardShortcutHandler(e):this.removeEventListener("keyup",a8(this,lx,lN))},lO=new WeakSet,lP=function(e){let{metaKey:t,altKey:i,key:a}=e;t||i||!a6.includes(a)?this.removeEventListener("keyup",a8(this,lx,lN)):([" ","ArrowLeft","ArrowRight"].includes(a)&&!(a4(this,l_).contains(`no${a.toLowerCase()}`)||" "===a&&a4(this,l_).contains("nospace"))&&e.preventDefault(),this.addEventListener("keyup",a8(this,lx,lN),{once:!0}))};let rb=Object.values(ir),rg=Object.values(ii),rE=e=>{var t,i,a,r;let{observedAttributes:n}=e.constructor;!n&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(iU.customElements.upgrade(e),{observedAttributes:n}=e.constructor);let s=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,it.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(n||s)?(n||s).filter(e=>rb.includes(e)):[]},rf=e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&iU.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof iU.customElements.get(e.nodeName.toLowerCase()))&&iU.customElements.upgrade(e),rg.some(t=>t in e)||!!rE(e).length},ry=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},rA={[ir.MEDIA_SUBTITLES_LIST]:aI,[ir.MEDIA_SUBTITLES_SHOWING]:aI,[ir.MEDIA_SEEKABLE]:ry,[ir.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(ry).join(" "),[ir.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[ir.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(iv).join(" ")},[ir.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(ig).join(" ")}},rk=async(e,t,i)=>{var a,r;if(e.isConnected||await ik(0),"boolean"==typeof i||null==i)return i5(e,t,i);if("number"==typeof i)return i3(e,t,i);if("string"==typeof i)return i8(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let n=null!=(r=null==(a=rA[t])?void 0:a.call(rA,i))?r:i;return e.setAttribute(t,n)},rT=(e,t)=>{var i;if(null==(i=e.closest)?void 0:i.call(e,'*[slot="media"]'))return;let a=(e,t)=>{var i,a;rf(e)&&t(e);let{children:r=[]}=null!=e?e:{};[...r,...null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[]].forEach(e=>rT(e,t))},r=null==e?void 0:e.nodeName.toLowerCase();r.includes("-")&&!rf(e)?iU.customElements.whenDefined(r).then(()=>{a(e,t)}):a(e,t)},rw=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=rE(e),r=t.toLowerCase();a.includes(r)&&rk(e,r,i)})},r_=(e,t,i)=>{rT(e,t);let a=e=>{var i;t(null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target)},r=e=>{var t;i(null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target)};e.addEventListener(ie.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(ie.UNREGISTER_MEDIA_STATE_RECEIVER,r);let n=[],s=e=>{let a=e.target;"media"!==a.name&&(n.forEach(e=>rT(e,i)),(n=[...a.assignedElements({flatten:!0})]).forEach(e=>rT(e,t)))};e.addEventListener("slotchange",s);let o=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:n,target:s,attributeName:o}=e;"childList"===n?(Array.prototype.forEach.call(a,e=>rT(e,t)),Array.prototype.forEach.call(r,e=>rT(e,i))):"attributes"===n&&o===it.MEDIA_CHROME_ATTRIBUTES&&(rf(s)?t(s):i(s))})});return o.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{rT(e,i),e.removeEventListener("slotchange",s),o.disconnect(),e.removeEventListener(ie.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(ie.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};iU.customElements.get("media-controller")||iU.customElements.define("media-controller",rv);let rC="placement",rI="bounds";class rS extends iU.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!iJ(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let t=this.placement;if("left"===t||"right"===t)return void this.style.removeProperty("--media-tooltip-offset-x");let i=getComputedStyle(this),a=null!=(e=iz(this,"#"+this.bounds))?e:iK(this);if(!a)return;let{x:r,width:n}=a.getBoundingClientRect(),{x:s,width:o}=this.getBoundingClientRect(),l=i.getPropertyValue("--media-tooltip-offset-x"),d=l?parseFloat(l.replace("px","")):0,u=i.getPropertyValue("--media-tooltip-container-margin"),c=u?parseFloat(u.replace("px","")):0,h=s-r+d-c,m=s+o-(r+n)+d+c;h<0?this.style.setProperty("--media-tooltip-offset-x",`${h}px`):m>0?this.style.setProperty("--media-tooltip-offset-x",`${m}px`):this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[rC,rI]}get placement(){return i9(this,rC)}set placement(e){i8(this,rC,e)}get bounds(){return i9(this,rI)}set bounds(e){i8(this,rI,e)}}rS.shadowRootOptions={mode:"open"},rS.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `},iU.customElements.get("media-tooltip")||iU.customElements.define("media-tooltip",rS);var rR=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rM=(e,t,i)=>(rR(e,t,"read from private field"),i?i.call(e):t.get(e)),rL=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rD=(e,t,i,a)=>(rR(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let rx="tooltipplacement",rN="disabled",rO="notooltip";class rP extends iU.HTMLElement{constructor(){if(super(),rL(this,lV),rL(this,lU,void 0),this.preventClick=!1,this.tooltipEl=null,rL(this,l$,e=>{this.preventClick||this.handleClick(e),setTimeout(rM(this,lW),0)}),rL(this,lW,()=>{var e,t;null==(t=null==(e=this.tooltipEl)?void 0:e.updateXOffset)||t.call(e)}),rL(this,lH,e=>{let{key:t}=e;this.keysUsed.includes(t)?this.preventClick||this.handleClick(e):this.removeEventListener("keyup",rM(this,lH))}),rL(this,lB,e=>{let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",rM(this,lH)):this.addEventListener("keyup",rM(this,lH),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",rx,it.MEDIA_CONTROLLER]}enable(){this.addEventListener("click",rM(this,l$)),this.addEventListener("keydown",rM(this,lB)),this.tabIndex=0}disable(){this.removeEventListener("click",rM(this,l$)),this.removeEventListener("keydown",rM(this,lB)),this.removeEventListener("keyup",rM(this,lH)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===it.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=rM(this,lU))?void 0:a.unassociateElement)||r.call(a,this),rD(this,lU,null)),i&&this.isConnected&&(rD(this,lU,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=rM(this,lU))?void 0:s.associateElement)||o.call(s,this))):"disabled"===e&&i!==t?null==i?this.enable():this.disable():e===rx&&this.tooltipEl&&i!==t&&(this.tooltipEl.placement=i),rM(this,lW).call(this)}connectedCallback(){var e,t,i;let{style:a}=i0(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let r=this.getAttribute(it.MEDIA_CONTROLLER);r&&(rD(this,lU,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=rM(this,lU))?void 0:t.associateElement)||i.call(t,this)),iU.customElements.whenDefined("media-tooltip").then(()=>{var e,t;return(e=lV,t=lF,rR(this,e,"access private method"),t).call(this)})}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=rM(this,lU))?void 0:e.unassociateElement)||t.call(e,this),rD(this,lU,null),this.removeEventListener("mouseenter",rM(this,lW)),this.removeEventListener("focus",rM(this,lW)),this.removeEventListener("click",rM(this,l$))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return i9(this,rx)}set tooltipPlacement(e){i8(this,rx,e)}get mediaController(){return i9(this,it.MEDIA_CONTROLLER)}set mediaController(e){i8(this,it.MEDIA_CONTROLLER,e)}get disabled(){return i4(this,rN)}set disabled(e){i5(this,rN,e)}get noTooltip(){return i4(this,rO)}set noTooltip(e){i5(this,rO,e)}handleClick(e){}}lU=new WeakMap,l$=new WeakMap,lW=new WeakMap,lH=new WeakMap,lB=new WeakMap,lV=new WeakSet,lF=function(){this.addEventListener("mouseenter",rM(this,lW)),this.addEventListener("focus",rM(this,lW)),this.addEventListener("click",rM(this,l$));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},rP.shadowRootOptions={mode:"open"},rP.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${rS.shadowRootOptions.mode}">
          ${rS.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `},rP.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},rP.getTooltipContentHTML=function(){return""},iU.customElements.get("media-chrome-button")||iU.customElements.define("media-chrome-button",rP);let rU=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,r$=e=>{let t=e.mediaIsAirplaying?iR("stop airplay"):iR("start airplay");e.setAttribute("aria-label",t)};class rW extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_IS_AIRPLAYING,ir.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),r$(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_IS_AIRPLAYING&&r$(this)}get mediaIsAirplaying(){return i4(this,ir.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){i5(this,ir.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return i9(this,ir.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){i8(this,ir.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new iU.CustomEvent(ie.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}rW.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${ir.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${ir.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${ir.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${ir.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${rU}</slot>
      <slot name="exit">${rU}</slot>
    </slot>
  `},rW.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${iR("start airplay")}</slot>
    <slot name="tooltip-exit">${iR("stop airplay")}</slot>
  `},iU.customElements.get("media-airplay-button")||iU.customElements.define("media-airplay-button",rW);let rH=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,rB=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,rV=e=>{e.setAttribute("aria-checked",aL(e).toString())};class rF extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_SUBTITLES_LIST,ir.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",iR("closed captions")),rV(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_SUBTITLES_SHOWING&&rV(this)}get mediaSubtitlesList(){return rY(this,ir.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){rK(this,ir.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return rY(this,ir.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){rK(this,ir.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new iU.CustomEvent(ie.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}rF.getSlotTemplateHTML=function(e){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${rH}</slot>
      <slot name="off">${rB}</slot>
    </slot>
  `},rF.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enable">${iR("Enable captions")}</slot>
    <slot name="tooltip-disable">${iR("Disable captions")}</slot>
  `};let rY=(e,t)=>{let i=e.getAttribute(t);return i?aw(i):[]},rK=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=aI(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};iU.customElements.get("media-captions-button")||iU.customElements.define("media-captions-button",rF);let rG=e=>{let t=e.mediaIsCasting?iR("stop casting"):iR("start casting");e.setAttribute("aria-label",t)};class rq extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_IS_CASTING,ir.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),rG(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_IS_CASTING&&rG(this)}get mediaIsCasting(){return i4(this,ir.MEDIA_IS_CASTING)}set mediaIsCasting(e){i5(this,ir.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return i9(this,ir.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){i8(this,ir.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?ie.MEDIA_EXIT_CAST_REQUEST:ie.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new iU.CustomEvent(e,{composed:!0,bubbles:!0}))}}rq.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${ir.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${ir.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${ir.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${ir.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
      <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
    </slot>
  `},rq.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${iR("Start casting")}</slot>
    <slot name="tooltip-exit">${iR("Stop casting")}</slot>
  `},iU.customElements.get("media-cast-button")||iU.customElements.define("media-cast-button",rq);var rj=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rZ=(e,t,i)=>(rj(e,t,"read from private field"),i?i.call(e):t.get(e)),rz=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rQ=(e,t,i,a)=>(rj(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),rX=(e,t,i)=>(rj(e,t,"access private method"),i);let rJ="open";class r0 extends iU.HTMLElement{constructor(){super(),rz(this,lq),rz(this,lZ),rz(this,lQ),rz(this,lJ),rz(this,l1),rz(this,l3),rz(this,lY,!1),rz(this,lK,null),rz(this,lG,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[rJ,"anchor"]}get open(){return i4(this,rJ)}set open(e){i5(this,rJ,e)}handleEvent(e){switch(e.type){case"invoke":rX(this,lJ,l0).call(this,e);break;case"focusout":rX(this,l1,l2).call(this,e);break;case"keydown":rX(this,l3,l4).call(this,e)}}connectedCallback(){rX(this,lq,lj).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,t,i){rX(this,lq,lj).call(this),e===rJ&&i!==t&&(this.open?rX(this,lZ,lz).call(this):rX(this,lQ,lX).call(this))}focus(){rQ(this,lK,iQ());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||t)return;let i=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==i||i.focus()}get keysUsed(){return["Escape","Tab"]}}lY=new WeakMap,lK=new WeakMap,lG=new WeakMap,lq=new WeakSet,lj=function(){if(!rZ(this,lY)&&(rQ(this,lY,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=i0(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}},lZ=new WeakSet,lz=function(){var e;null==(e=rZ(this,lG))||e.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})},lQ=new WeakSet,lX=function(){var e;null==(e=rZ(this,lG))||e.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))},lJ=new WeakSet,l0=function(e){rQ(this,lG,e.relatedTarget),iZ(this,e.relatedTarget)||(this.open=!this.open)},l1=new WeakSet,l2=function(e){var t;!iZ(this,e.relatedTarget)&&(null==(t=rZ(this,lK))||t.focus(),rZ(this,lG)&&rZ(this,lG)!==e.relatedTarget&&this.open&&(this.open=!1))},l3=new WeakSet,l4=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;o||l||d||this.keysUsed.includes(s)&&(e.preventDefault(),e.stopPropagation(),"Tab"===s?(e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()):"Escape"===s&&(null==(n=rZ(this,lK))||n.focus(),this.open=!1))},r0.shadowRootOptions={mode:"open"},r0.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(e)}
  `},r0.getSlotTemplateHTML=function(e){return`
    <slot id="content"></slot>
  `},iU.customElements.get("media-chrome-dialog")||iU.customElements.define("media-chrome-dialog",r0);var r1=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r2=(e,t,i)=>(r1(e,t,"read from private field"),i?i.call(e):t.get(e)),r3=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},r4=(e,t,i,a)=>(r1(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),r5=(e,t,i)=>(r1(e,t,"access private method"),i);class r9 extends iU.HTMLElement{constructor(){if(super(),r3(this,dr),r3(this,ds),r3(this,dd),r3(this,dc),r3(this,dm),r3(this,dv),r3(this,dg),r3(this,df),r3(this,l5,void 0),r3(this,l9,void 0),r3(this,l8,void 0),r3(this,l6,void 0),r3(this,l7,{}),r3(this,de,[]),r3(this,dt,()=>{if(this.range.matches(":focus-visible")){let{style:e}=i0(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),r3(this,di,()=>{let{style:e}=i0(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),r3(this,da,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector("#container"),r4(this,l8,this.shadowRoot.querySelector("#startpoint")),r4(this,l6,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",it.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===it.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=r2(this,l5))?void 0:a.unassociateElement)||r.call(a,this),r4(this,l5,null)),i&&this.isConnected&&(r4(this,l5,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=r2(this,l5))?void 0:s.associateElement)||o.call(s,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?(this.range.removeAttribute(e),r5(this,ds,dl).call(this)):(this.range.setAttribute(e,i),r5(this,dd,du).call(this)))}connectedCallback(){var e,t,i;let{style:a}=i0(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),r2(this,l7).pointer=i0(this.shadowRoot,"#pointer"),r2(this,l7).progress=i0(this.shadowRoot,"#progress"),r2(this,l7).thumb=i0(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),r2(this,l7).activeSegment=i0(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let r=this.getAttribute(it.MEDIA_CONTROLLER);r&&(r4(this,l5,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=r2(this,l5))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",r2(this,dt)),this.shadowRoot.addEventListener("focusout",r2(this,di)),r5(this,ds,dl).call(this),iV(this.container,r2(this,da))}disconnectedCallback(){var e,t;r5(this,dd,du).call(this),null==(t=null==(e=r2(this,l5))?void 0:e.unassociateElement)||t.call(e,this),r4(this,l5,null),this.shadowRoot.removeEventListener("focusin",r2(this,dt)),this.shadowRoot.removeEventListener("focusout",r2(this,di)),iF(this.container,r2(this,da))}updatePointerBar(e){var t;null==(t=r2(this,l7).pointer)||t.style.setProperty("width",`${100*this.getPointerRatio(e)}%`)}updateBar(){var e,t;let i=100*this.range.valueAsNumber;null==(e=r2(this,l7).progress)||e.style.setProperty("width",`${i}%`),null==(t=r2(this,l7).thumb)||t.style.setProperty("left",`${i}%`)}updateSegments(e){let t=this.shadowRoot.querySelector("#segments-clipping");if(t.textContent="",this.container.classList.toggle("segments",!!(null==e?void 0:e.length)),!(null==e?void 0:e.length))return;let i=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];r4(this,de,[...i]);let a=i.pop();for(let[e,r]of i.entries()){let[n,s]=[0===e,e===i.length-1],o=n?"calc(var(--segments-gap) / -1)":`${100*r}%`,l=s?a:i[e+1],d=`calc(${(l-r)*100}%${n||s?"":" - var(--segments-gap)"})`,u=i$.createElementNS("http://www.w3.org/2000/svg","rect"),c=i0(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);c.style.setProperty("x",o),c.style.setProperty("width",d),t.append(u)}}getPointerRatio(e){var t,i,a,r;let n,s,o;return t=e.clientX,i=e.clientY,a=r2(this,l8).getBoundingClientRect(),n=(r=r2(this,l6).getBoundingClientRect()).x-a.x,0==(o=n*n+(s=r.y-a.y)*s)?0:Math.max(0,Math.min(1,((t-a.x)*n+(i-a.y)*s)/o))}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":r5(this,df,dy).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":r5(this,dm,dp).call(this,e);break;case"pointerdown":r5(this,dc,dh).call(this,e);break;case"pointerup":r5(this,dv,db).call(this);break;case"pointerleave":r5(this,dg,dE).call(this)}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}l5=new WeakMap,l9=new WeakMap,l8=new WeakMap,l6=new WeakMap,l7=new WeakMap,de=new WeakMap,dt=new WeakMap,di=new WeakMap,da=new WeakMap,dr=new WeakSet,dn=function(e){let t=r2(this,l7).activeSegment;if(!t)return;let i=this.getPointerRatio(e),a=r2(this,de).findIndex((e,t,a)=>{let r=a[t+1];return null!=r&&i>=e&&i<=r}),r=`#segments-clipping rect:nth-child(${a+1})`;t.selectorText==r&&t.style.transform||(t.selectorText=r,t.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))},ds=new WeakSet,dl=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))},dd=new WeakSet,du=function(){var e,t;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),null==(e=iU.window)||e.removeEventListener("pointerup",this),null==(t=iU.window)||t.removeEventListener("pointermove",this)},dc=new WeakSet,dh=function(e){var t;r4(this,l9,e.composedPath().includes(this.range)),null==(t=iU.window)||t.addEventListener("pointerup",this)},dm=new WeakSet,dp=function(e){var t;"mouse"!==e.pointerType&&r5(this,dc,dh).call(this,e),this.addEventListener("pointerleave",this),null==(t=iU.window)||t.addEventListener("pointermove",this)},dv=new WeakSet,db=function(){var e;null==(e=iU.window)||e.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")},dg=new WeakSet,dE=function(){var e,t;this.removeEventListener("pointerleave",this),null==(e=iU.window)||e.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),null==(t=r2(this,l7).activeSegment)||t.style.removeProperty("transform")},df=new WeakSet,dy=function(e){this.toggleAttribute("dragging",1===e.buttons||"mouse"!==e.pointerType),this.updatePointerBar(e),r5(this,dr,dn).call(this,e),this.dragging&&("mouse"!==e.pointerType||!r2(this,l9))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})))},r9.shadowRootOptions={mode:"open"},r9.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">
    </div>
    <div id="rightgap"></div>
  `},iU.customElements.get("media-chrome-range")||iU.customElements.define("media-chrome-range",r9);var r8=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r6=(e,t,i)=>(r8(e,t,"read from private field"),i?i.call(e):t.get(e)),r7=(e,t,i,a)=>(r8(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ne extends iU.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dA,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[it.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===it.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=r6(this,dA))?void 0:a.unassociateElement)||r.call(a,this),r7(this,dA,null)),i&&this.isConnected&&(r7(this,dA,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=r6(this,dA))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(it.MEDIA_CONTROLLER);a&&(r7(this,dA,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=r6(this,dA))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=r6(this,dA))?void 0:e.unassociateElement)||t.call(e,this),r7(this,dA,null)}}dA=new WeakMap,ne.shadowRootOptions={mode:"open"},ne.getTemplateHTML=function(e){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `},iU.customElements.get("media-control-bar")||iU.customElements.define("media-control-bar",ne);var nt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ni=(e,t,i)=>(nt(e,t,"read from private field"),i?i.call(e):t.get(e)),na=(e,t,i,a)=>(nt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class nr extends iU.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dk,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[it.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===it.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ni(this,dk))?void 0:a.unassociateElement)||r.call(a,this),na(this,dk,null)),i&&this.isConnected&&(na(this,dk,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=ni(this,dk))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let{style:a}=i0(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let r=this.getAttribute(it.MEDIA_CONTROLLER);r&&(na(this,dk,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=ni(this,dk))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=ni(this,dk))?void 0:e.unassociateElement)||t.call(e,this),na(this,dk,null)}}dk=new WeakMap,nr.shadowRootOptions={mode:"open"},nr.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}
  `},nr.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},iU.customElements.get("media-text-display")||iU.customElements.define("media-text-display",nr);var nn=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ns=(e,t,i)=>(nn(e,t,"read from private field"),i?i.call(e):t.get(e));class no extends nr{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dT,void 0),((e,t,i,a)=>(nn(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dT,this.shadowRoot.querySelector("slot")),ns(this,dT).textContent=i_(null!=(e=this.mediaDuration)?e:0)}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===ir.MEDIA_DURATION&&(ns(this,dT).textContent=i_(+i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return i2(this,ir.MEDIA_DURATION)}set mediaDuration(e){i3(this,ir.MEDIA_DURATION,e)}}dT=new WeakMap,no.getSlotTemplateHTML=function(e,t){return`
    <slot>${i_(t.mediaDuration)}</slot>
  `},iU.customElements.get("media-duration-display")||iU.customElements.define("media-duration-display",no);let nl={2:iR("Network Error"),3:iR("Decode Error"),4:iR("Source Not Supported"),5:iR("Encryption Error")},nd={2:iR("A network error caused the media download to fail."),3:iR("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:iR("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:iR("The media is encrypted and there are no keys to decrypt it.")},nu=e=>{var t,i;return 1===e.code?null:{title:null!=(t=nl[e.code])?t:`Error ${e.code}`,message:null!=(i=nd[e.code])?i:e.message}};var nc=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};function nh(e){var t;let{title:i,message:a}=null!=(t=nu(e))?t:{},r="";return i&&(r+=`<slot name="error-${e.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${e.code}-message"><p>${a}</p></slot>`),r}let nm=[ir.MEDIA_ERROR_CODE,ir.MEDIA_ERROR_MESSAGE];class np extends r0{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dw,null)}static get observedAttributes(){return[...super.observedAttributes,...nm]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,i){var a;if(super.attributeChangedCallback(e,t,i),!nm.includes(e))return;let r=null!=(a=this.mediaError)?a:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=r.code&&null!==nu(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r))}get mediaError(){var e,t;return nc(this,e=dw,"read from private field"),t?t.call(this):e.get(this)}set mediaError(e){var t,i;nc(this,t=dw,"write to private field"),i?i.call(this,e):t.set(this,e)}get mediaErrorCode(){return i2(this,"mediaerrorcode")}set mediaErrorCode(e){i3(this,"mediaerrorcode",e)}get mediaErrorMessage(){return i9(this,"mediaerrormessage")}set mediaErrorMessage(e){i8(this,"mediaerrormessage",e)}}dw=new WeakMap,np.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${nh({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `},np.formatErrorMessage=nh,iU.customElements.get("media-error-dialog")||iU.customElements.define("media-error-dialog",np);let nv=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,nb=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,ng=e=>{let t=e.mediaIsFullscreen?iR("exit fullscreen mode"):iR("enter fullscreen mode");e.setAttribute("aria-label",t)};class nE extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_IS_FULLSCREEN,ir.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),ng(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_IS_FULLSCREEN&&ng(this)}get mediaFullscreenUnavailable(){return i9(this,ir.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){i8(this,ir.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return i4(this,ir.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){i5(this,ir.MEDIA_IS_FULLSCREEN,e)}handleClick(){let e=this.mediaIsFullscreen?ie.MEDIA_EXIT_FULLSCREEN_REQUEST:ie.MEDIA_ENTER_FULLSCREEN_REQUEST;this.dispatchEvent(new iU.CustomEvent(e,{composed:!0,bubbles:!0}))}}nE.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${ir.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${ir.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${ir.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${ir.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${nv}</slot>
      <slot name="exit">${nb}</slot>
    </slot>
  `},nE.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${iR("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${iR("Exit fullscreen mode")}</slot>
  `},iU.customElements.get("media-fullscreen-button")||iU.customElements.define("media-fullscreen-button",nE);let{MEDIA_TIME_IS_LIVE:nf,MEDIA_PAUSED:ny}=ir,{MEDIA_SEEK_TO_LIVE_REQUEST:nA,MEDIA_PLAY_REQUEST:nk}=ie,nT=e=>{let t=e.mediaPaused||!e.mediaTimeIsLive,i=t?iR("seek to live"):iR("playing live");e.setAttribute("aria-label",i),t?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};class nw extends rP{static get observedAttributes(){return[...super.observedAttributes,nf,ny]}connectedCallback(){super.connectedCallback(),nT(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),nT(this)}get mediaPaused(){return i4(this,ir.MEDIA_PAUSED)}set mediaPaused(e){i5(this,ir.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return i4(this,ir.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){i5(this,ir.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new iU.CustomEvent(nA,{composed:!0,bubbles:!0})),this.hasAttribute(ny)&&this.dispatchEvent(new iU.CustomEvent(nk,{composed:!0,bubbles:!0})))}}nw.getSlotTemplateHTML=function(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${nf}]:not([${ny}])) slot[name=indicator] > *,
      :host([${nf}]:not([${ny}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${nf}]:not([${ny}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator"><svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg></slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${iR("live")}</slot>
  `},iU.customElements.get("media-live-button")||iU.customElements.define("media-live-button",nw);var n_=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nC=(e,t,i)=>(n_(e,t,"read from private field"),i?i.call(e):t.get(e)),nI=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},nS=(e,t,i,a)=>(n_(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let nR="loadingdelay",nM="noautohide",nL=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;class nD extends iU.HTMLElement{constructor(){if(super(),nI(this,d_,void 0),nI(this,dC,500),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[it.MEDIA_CONTROLLER,ir.MEDIA_PAUSED,ir.MEDIA_LOADING,nR]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===nR&&t!==i?this.loadingDelay=Number(i):e===it.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=nC(this,d_))?void 0:a.unassociateElement)||r.call(a,this),nS(this,d_,null)),i&&this.isConnected&&(nS(this,d_,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=nC(this,d_))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(it.MEDIA_CONTROLLER);a&&(nS(this,d_,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=nC(this,d_))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=nC(this,d_))?void 0:e.unassociateElement)||t.call(e,this),nS(this,d_,null)}get loadingDelay(){return nC(this,dC)}set loadingDelay(e){nS(this,dC,e);let{style:t}=i0(this.shadowRoot,":host");t.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return i4(this,ir.MEDIA_PAUSED)}set mediaPaused(e){i5(this,ir.MEDIA_PAUSED,e)}get mediaLoading(){return i4(this,ir.MEDIA_LOADING)}set mediaLoading(e){i5(this,ir.MEDIA_LOADING,e)}get mediaController(){return i9(this,it.MEDIA_CONTROLLER)}set mediaController(e){i8(this,it.MEDIA_CONTROLLER,e)}get noAutohide(){return i4(this,nM)}set noAutohide(e){i5(this,nM,e)}}d_=new WeakMap,dC=new WeakMap,nD.shadowRootOptions={mode:"open"},nD.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${ir.MEDIA_LOADING}]:not([${ir.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${ir.MEDIA_LOADING}]:not([${ir.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${ir.MEDIA_LOADING}]:not([${ir.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${nL}</slot>
    <div id="status" role="status" aria-live="polite">${iR("media loading")}</div>
  `},iU.customElements.get("media-loading-indicator")||iU.customElements.define("media-loading-indicator",nD);let nx=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,nN=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,nO=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,nP=e=>{let t="off"===e.mediaVolumeLevel?iR("unmute"):iR("mute");e.setAttribute("aria-label",t)};class nU extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),nP(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_VOLUME_LEVEL&&nP(this)}get mediaVolumeLevel(){return i9(this,ir.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){i8(this,ir.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?ie.MEDIA_UNMUTE_REQUEST:ie.MEDIA_MUTE_REQUEST;this.dispatchEvent(new iU.CustomEvent(e,{composed:!0,bubbles:!0}))}}nU.getSlotTemplateHTML=function(e){return`
    <style>
      :host(:not([${ir.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${ir.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${ir.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${ir.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${ir.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${ir.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${ir.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${nx}</slot>
      <slot name="low">${nN}</slot>
      <slot name="medium">${nN}</slot>
      <slot name="high">${nO}</slot>
    </slot>
  `},nU.getTooltipContentHTML=function(){return`
    <slot name="tooltip-mute">${iR("Mute")}</slot>
    <slot name="tooltip-unmute">${iR("Unmute")}</slot>
  `},iU.customElements.get("media-mute-button")||iU.customElements.define("media-mute-button",nU);let n$=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,nW=e=>{let t=e.mediaIsPip?iR("exit picture in picture mode"):iR("enter picture in picture mode");e.setAttribute("aria-label",t)};class nH extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_IS_PIP,ir.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),nW(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_IS_PIP&&nW(this)}get mediaPipUnavailable(){return i9(this,ir.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){i8(this,ir.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return i4(this,ir.MEDIA_IS_PIP)}set mediaIsPip(e){i5(this,ir.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?ie.MEDIA_EXIT_PIP_REQUEST:ie.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new iU.CustomEvent(e,{composed:!0,bubbles:!0}))}}nH.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${ir.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${ir.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${ir.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${ir.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${n$}</slot>
      <slot name="exit">${n$}</slot>
    </slot>
  `},nH.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${iR("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${iR("Exit picture in picture mode")}</slot>
  `},iU.customElements.get("media-pip-button")||iU.customElements.define("media-pip-button",nH);var nB=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)};let nV="rates",nF=[1,1.2,1.5,1.7,2];class nY extends rP{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dI,new ak(this,nV,{defaultValue:nF})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PLAYBACK_RATE,nV]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===nV&&(nB(this,dI).value=i),e===ir.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",iR("Playback rate {playbackRate}",{playbackRate:t}))}}get rates(){return nB(this,dI)}set rates(e){e?Array.isArray(e)?nB(this,dI).value=e.join(" "):"string"==typeof e&&(nB(this,dI).value=e):nB(this,dI).value=""}get mediaPlaybackRate(){return i2(this,ir.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){i3(this,ir.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(nB(this,dI).values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new iU.CustomEvent(ie.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}}dI=new WeakMap,nY.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},nY.getTooltipContentHTML=function(){return iR("Playback rate")},iU.customElements.get("media-playback-rate-button")||iU.customElements.define("media-playback-rate-button",nY);let nK=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,nG=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,nq=e=>{let t=e.mediaPaused?iR("play"):iR("pause");e.setAttribute("aria-label",t)};class nj extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PAUSED,ir.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),nq(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_PAUSED&&nq(this)}get mediaPaused(){return i4(this,ir.MEDIA_PAUSED)}set mediaPaused(e){i5(this,ir.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?ie.MEDIA_PLAY_REQUEST:ie.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new iU.CustomEvent(e,{composed:!0,bubbles:!0}))}}nj.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${ir.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${ir.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${ir.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${ir.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${nK}</slot>
      <slot name="pause">${nG}</slot>
    </slot>
  `},nj.getTooltipContentHTML=function(){return`
    <slot name="tooltip-play">${iR("Play")}</slot>
    <slot name="tooltip-pause">${iR("Pause")}</slot>
  `},iU.customElements.get("media-play-button")||iU.customElements.define("media-play-button",nj);let nZ="placeholdersrc";class nz extends iU.HTMLElement{static get observedAttributes(){return[nZ,"src"]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){if("src"===e&&(null==i?this.image.removeAttribute("src"):this.image.setAttribute("src",i)),e===nZ)if(null==i)this.image.style.removeProperty("background-image");else{var a;a=this.image,a.style["background-image"]=`url('${i}')`}}get placeholderSrc(){return i9(this,nZ)}set placeholderSrc(e){i8(this,"src",e)}get src(){return i9(this,"src")}set src(e){i8(this,"src",e)}}nz.shadowRootOptions={mode:"open"},nz.getTemplateHTML=function(e){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `},iU.customElements.get("media-poster-image")||iU.customElements.define("media-poster-image",nz);var nQ=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};dS=new WeakMap,iU.customElements.get("media-preview-chapter-display")||iU.customElements.define("media-preview-chapter-display",class extends nr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dS,void 0),((e,t,i,a)=>(nQ(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dS,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PREVIEW_CHAPTER]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ir.MEDIA_PREVIEW_CHAPTER&&i!==t&&null!=i){var a;(nQ(this,dS,"read from private field"),a?a.call(this):dS.get(this)).textContent=i,""!==i?this.setAttribute("aria-valuetext",`chapter: ${i}`):this.removeAttribute("aria-valuetext")}}get mediaPreviewChapter(){return i9(this,ir.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){i8(this,ir.MEDIA_PREVIEW_CHAPTER,e)}});var nX=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nJ=(e,t,i)=>(nX(e,t,"read from private field"),i?i.call(e):t.get(e)),n0=(e,t,i,a)=>(nX(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class n1 extends iU.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dR,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[it.MEDIA_CONTROLLER,ir.MEDIA_PREVIEW_IMAGE,ir.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(it.MEDIA_CONTROLLER);a&&(n0(this,dR,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=nJ(this,dR))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=nJ(this,dR))?void 0:e.unassociateElement)||t.call(e,this),n0(this,dR,null)}attributeChangedCallback(e,t,i){var a,r,n,s,o;[ir.MEDIA_PREVIEW_IMAGE,ir.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===it.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=nJ(this,dR))?void 0:a.unassociateElement)||r.call(a,this),n0(this,dR,null)),i&&this.isConnected&&(n0(this,dR,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=nJ(this,dR))?void 0:s.associateElement)||o.call(s,this)))}get mediaPreviewImage(){return i9(this,ir.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){i8(this,ir.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(ir.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){e?this.setAttribute(ir.MEDIA_PREVIEW_COORDS,e.join(" ")):this.removeAttribute(ir.MEDIA_PREVIEW_COORDS)}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[i,a,r,n]=e,s=t.split("#")[0],{maxWidth:o,maxHeight:l,minWidth:d,minHeight:u}=getComputedStyle(this),c=Math.min(parseInt(o)/r,parseInt(l)/n),h=Math.max(parseInt(d)/r,parseInt(u)/n),m=c<1,p=m?c:h>1?h:1,{style:v}=i0(this.shadowRoot,":host"),b=i0(this.shadowRoot,"img").style,g=this.shadowRoot.querySelector("img"),E=m?"min":"max";v.setProperty(`${E}-width`,"initial","important"),v.setProperty(`${E}-height`,"initial","important"),v.width=`${r*p}px`,v.height=`${n*p}px`;let f=()=>{b.width=`${this.imgWidth*p}px`,b.height=`${this.imgHeight*p}px`,b.display="block"};g.src!==s&&(g.onload=()=>{this.imgWidth=g.naturalWidth,this.imgHeight=g.naturalHeight,f()},g.src=s,f()),f(),b.transform=`translate(-${i*p}px, -${a*p}px)`}}dR=new WeakMap,n1.shadowRootOptions={mode:"open"},n1.getTemplateHTML=function(e){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `},iU.customElements.get("media-preview-thumbnail")||iU.customElements.define("media-preview-thumbnail",n1);var n2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},n3=(e,t,i)=>(n2(e,t,"read from private field"),i?i.call(e):t.get(e));dM=new WeakMap,iU.customElements.get("media-preview-time-display")||iU.customElements.define("media-preview-time-display",class extends nr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dM,void 0),((e,t,i,a)=>(n2(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dM,this.shadowRoot.querySelector("slot")),n3(this,dM).textContent=i_(0)}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_PREVIEW_TIME&&null!=i&&(n3(this,dM).textContent=i_(parseFloat(i)))}get mediaPreviewTime(){return i2(this,ir.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){i3(this,ir.MEDIA_PREVIEW_TIME,e)}});let n4="seekoffset";class n5 extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_CURRENT_TIME,n4]}connectedCallback(){super.connectedCallback(),this.seekOffset=i2(this,n4,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n4&&(this.seekOffset=i2(this,n4,30))}get seekOffset(){return i2(this,n4,30)}set seekOffset(e){i3(this,n4,e),this.setAttribute("aria-label",iR("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),iq(ij(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return i2(this,ir.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){i3(this,ir.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new iU.CustomEvent(ie.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}n5.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${i}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`}</slot>
  `},n5.getTooltipContentHTML=function(){return iR("Seek backward")},iU.customElements.get("media-seek-backward-button")||iU.customElements.define("media-seek-backward-button",n5);let n9="seekoffset";class n8 extends rP{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_CURRENT_TIME,n9]}connectedCallback(){super.connectedCallback(),this.seekOffset=i2(this,n9,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n9&&(this.seekOffset=i2(this,n9,30))}get seekOffset(){return i2(this,n9,30)}set seekOffset(e){i3(this,n9,e),this.setAttribute("aria-label",iR("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),iq(ij(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return i2(this,ir.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){i3(this,ir.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new iU.CustomEvent(ie.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}n8.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${i}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`}</slot>
  `},n8.getTooltipContentHTML=function(){return iR("Seek forward")},iU.customElements.get("media-seek-forward-button")||iU.customElements.define("media-seek-forward-button",n8);var n6=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},n7=(e,t,i)=>(n6(e,t,"read from private field"),i?i.call(e):t.get(e));let se={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},st=[...Object.values(se),ir.MEDIA_CURRENT_TIME,ir.MEDIA_DURATION,ir.MEDIA_SEEKABLE],si=["Enter"," "],sa="&nbsp;/&nbsp;",sr=(e,{timesSep:t=sa}={})=>{var i,a;let r=null!=(i=e.mediaCurrentTime)?i:0,[,n]=null!=(a=e.mediaSeekable)?a:[],s=0;Number.isFinite(e.mediaDuration)?s=e.mediaDuration:Number.isFinite(n)&&(s=n);let o=e.remaining?i_(0-(s-r)):i_(r);return e.showDuration?`${o}${t}${i_(s)}`:o};class sn extends nr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dL,void 0),((e,t,i,a)=>(n6(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dL,this.shadowRoot.querySelector("slot")),n7(this,dL).innerHTML=`${sr(this)}`}static get observedAttributes(){return[...super.observedAttributes,...st,"disabled"]}connectedCallback(){let{style:e}=i0(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",iR("playback time"));let t=e=>{let{key:i}=e;si.includes(i)?this.toggleTimeDisplay():this.removeEventListener("keyup",t)};this.addEventListener("keydown",e=>{let{metaKey:i,altKey:a,key:r}=e;i||a||!si.includes(r)?this.removeEventListener("keyup",t):this.addEventListener("keyup",t)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,t,i){st.includes(e)?this.update():"disabled"===e&&i!==t&&(null==i?this.enable():this.disable()),super.attributeChangedCallback(e,t,i)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return i4(this,se.REMAINING)}set remaining(e){i5(this,se.REMAINING,e)}get showDuration(){return i4(this,se.SHOW_DURATION)}set showDuration(e){i5(this,se.SHOW_DURATION,e)}get noToggle(){return i4(this,se.NO_TOGGLE)}set noToggle(e){i5(this,se.NO_TOGGLE,e)}get mediaDuration(){return i2(this,ir.MEDIA_DURATION)}set mediaDuration(e){i3(this,ir.MEDIA_DURATION,e)}get mediaCurrentTime(){return i2(this,ir.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){i3(this,ir.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(ir.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(ir.MEDIA_SEEKABLE):this.setAttribute(ir.MEDIA_SEEKABLE,e.join(":"))}update(){let e=sr(this);(e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(a)&&(r=a),null==i||null===r)return e.setAttribute("aria-valuetext","video not loaded, unknown time.");let n=e.remaining?iw(0-(r-i)):iw(i);if(!e.showDuration)return e.setAttribute("aria-valuetext",n);let s=iw(r),o=`${n} of ${s}`;e.setAttribute("aria-valuetext",o)})(this),e!==n7(this,dL).innerHTML&&(n7(this,dL).innerHTML=e)}}dL=new WeakMap,sn.getSlotTemplateHTML=function(e,t){return`
    <slot>${sr(t)}</slot>
  `},iU.customElements.get("media-time-display")||iU.customElements.define("media-time-display",sn);var ss=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},so=(e,t,i)=>(ss(e,t,"read from private field"),i?i.call(e):t.get(e)),sl=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sd=(e,t,i,a)=>(ss(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class su{constructor(e,t,i){sl(this,dD,void 0),sl(this,dx,void 0),sl(this,dN,void 0),sl(this,dO,void 0),sl(this,dP,void 0),sl(this,dU,void 0),sl(this,d$,void 0),sl(this,dW,void 0),sl(this,dH,0),sl(this,dB,(e=performance.now())=>{sd(this,dH,requestAnimationFrame(so(this,dB))),sd(this,dO,performance.now()-so(this,dN));let t=1e3/this.fps;if(so(this,dO)>t){let i,a,r,n;sd(this,dN,e-so(this,dO)%t);let s=1e3/((e-so(this,dx))/++(i=this,a=dP,{set _(value){sd(i,a,value,r)},get _(){return so(i,a,n)}})._),o=(e-so(this,dU))/1e3/this.duration,l=so(this,d$)+o*this.playbackRate;l-so(this,dD).valueAsNumber>0?sd(this,dW,this.playbackRate/this.duration/s):(sd(this,dW,.995*so(this,dW)),l=so(this,dD).valueAsNumber+so(this,dW)),this.callback(l)}}),sd(this,dD,e),this.callback=t,this.fps=i}start(){0===so(this,dH)&&(sd(this,dN,performance.now()),sd(this,dx,so(this,dN)),sd(this,dP,0),so(this,dB).call(this))}stop(){0!==so(this,dH)&&(cancelAnimationFrame(so(this,dH)),sd(this,dH,0))}update({start:e,duration:t,playbackRate:i}){let a=e-so(this,dD).valueAsNumber,r=Math.abs(t-this.duration);(a>0||a<-.03||r>=.5)&&this.callback(e),sd(this,d$,e),sd(this,dU,performance.now()),this.duration=t,this.playbackRate=i}}dD=new WeakMap,dx=new WeakMap,dN=new WeakMap,dO=new WeakMap,dP=new WeakMap,dU=new WeakMap,d$=new WeakMap,dW=new WeakMap,dH=new WeakMap,dB=new WeakMap;var sc=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sh=(e,t,i)=>(sc(e,t,"read from private field"),i?i.call(e):t.get(e)),sm=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sp=(e,t,i,a)=>(sc(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sv=(e,t,i)=>(sc(e,t,"access private method"),i);let sb=(e,t=e.mediaCurrentTime)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:Math.max(0,Math.min((t-i)/(a-i),1))},sg=(e,t=e.range.valueAsNumber)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:t*(a-i)+i};class sE extends r9{constructor(){super(),sm(this,dQ),sm(this,dJ),sm(this,d2),sm(this,d4),sm(this,d9),sm(this,d6),sm(this,ue),sm(this,ui),sm(this,dV,void 0),sm(this,dF,void 0),sm(this,dY,void 0),sm(this,dK,void 0),sm(this,dG,void 0),sm(this,dq,void 0),sm(this,dj,void 0),sm(this,dZ,void 0),sm(this,dz,void 0),sm(this,d1,e=>{this.dragging||(iy(e)&&(this.range.valueAsNumber=e),this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),sp(this,dY,this.shadowRoot.querySelectorAll('[part~="box"]')),sp(this,dG,this.shadowRoot.querySelector('[part~="preview-box"]')),sp(this,dq,this.shadowRoot.querySelector('[part~="current-box"]'));const e=getComputedStyle(this);sp(this,dj,parseInt(e.getPropertyValue("--media-box-padding-left"))),sp(this,dZ,parseInt(e.getPropertyValue("--media-box-padding-right"))),sp(this,dF,new su(this.range,sh(this,d1),60))}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PAUSED,ir.MEDIA_DURATION,ir.MEDIA_SEEKABLE,ir.MEDIA_CURRENT_TIME,ir.MEDIA_PREVIEW_IMAGE,ir.MEDIA_PREVIEW_TIME,ir.MEDIA_PREVIEW_CHAPTER,ir.MEDIA_BUFFERED,ir.MEDIA_PLAYBACK_RATE,ir.MEDIA_LOADING,ir.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",iR("seek")),sv(this,dQ,dX).call(this),sp(this,dV,this.getRootNode()),null==(e=sh(this,dV))||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),sv(this,dQ,dX).call(this),null==(e=sh(this,dV))||e.removeEventListener("transitionstart",this),sp(this,dV,null)}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),t!=i){if(e===ir.MEDIA_CURRENT_TIME||e===ir.MEDIA_PAUSED||e===ir.MEDIA_ENDED||e===ir.MEDIA_LOADING||e===ir.MEDIA_DURATION||e===ir.MEDIA_SEEKABLE){let e,t,i,a;sh(this,dF).update({start:sb(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),sv(this,dQ,dX).call(this),e=this.range,t=iw(+sg(this)),i=iw(+this.mediaSeekableEnd),a=t&&i?`${t} of ${i}`:"video not loaded, unknown time.",e.setAttribute("aria-valuetext",a)}else e===ir.MEDIA_BUFFERED&&this.updateBufferedBar();(e===ir.MEDIA_DURATION||e===ir.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=sh(this,dz),this.updateBar())}}get mediaChaptersCues(){return sh(this,dz)}set mediaChaptersCues(e){var t;sp(this,dz,e),this.updateSegments(null==(t=sh(this,dz))?void 0:t.map(e=>({start:sb(this,e.startTime),end:sb(this,e.endTime)})))}get mediaPaused(){return i4(this,ir.MEDIA_PAUSED)}set mediaPaused(e){i5(this,ir.MEDIA_PAUSED,e)}get mediaLoading(){return i4(this,ir.MEDIA_LOADING)}set mediaLoading(e){i5(this,ir.MEDIA_LOADING,e)}get mediaDuration(){return i2(this,ir.MEDIA_DURATION)}set mediaDuration(e){i3(this,ir.MEDIA_DURATION,e)}get mediaCurrentTime(){return i2(this,ir.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){i3(this,ir.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return i2(this,ir.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){i3(this,ir.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(ir.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e)return void this.removeAttribute(ir.MEDIA_BUFFERED);let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(ir.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(ir.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(ir.MEDIA_SEEKABLE):this.setAttribute(ir.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,t=this.mediaDuration]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaSeekableStart(){var e;let[t=0]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaPreviewImage(){return i9(this,ir.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){i8(this,ir.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return i2(this,ir.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){i3(this,ir.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return i4(this,ir.MEDIA_ENDED)}set mediaEnded(e){i5(this,ir.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let t,i=this.mediaBuffered;if(!i.length)return;if(this.mediaEnded)t=1;else{let a=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=null!=(e=i.find(([e,t])=>e<=a&&a<=t))?e:[];t=sb(this,r)}let{style:a}=i0(this.shadowRoot,"#buffered");a.setProperty("width",`${100*t}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let e=i0(this.shadowRoot,"#current-rail"),t=i0(this.shadowRoot,'[part~="current-box"]'),i=sv(this,d2,d3).call(this,sh(this,dq)),a=sv(this,d4,d5).call(this,i,this.range.valueAsNumber),r=sv(this,d9,d8).call(this,i,this.range.valueAsNumber);e.style.transform=`translateX(${a})`,e.style.setProperty("--_range-width",`${i.range.width}`),t.style.setProperty("--_box-shift",`${r}`),t.style.setProperty("--_box-width",`${i.box.width}px`),t.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":sv(this,ui,ua).call(this);break;case"pointermove":sv(this,d6,d7).call(this,e);break;case"pointerup":case"pointerleave":sv(this,ue,ut).call(this,null);break;case"transitionstart":iZ(e.target,this)&&setTimeout(()=>sv(this,dQ,dX).call(this),0)}}}dV=new WeakMap,dF=new WeakMap,dY=new WeakMap,dK=new WeakMap,dG=new WeakMap,dq=new WeakMap,dj=new WeakMap,dZ=new WeakMap,dz=new WeakMap,dQ=new WeakSet,dX=function(){sv(this,dJ,d0).call(this)?sh(this,dF).start():sh(this,dF).stop()},dJ=new WeakSet,d0=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&iJ(this)},d1=new WeakMap,d2=new WeakSet,d3=function(e){var t;let i=(null!=(t=this.getAttribute("bounds")?iz(this,`#${this.getAttribute("bounds")}`):this.parentElement)?t:this).getBoundingClientRect(),a=this.range.getBoundingClientRect(),r=e.offsetWidth,n=-(a.left-i.left-r/2),s=i.right-a.left-r/2;return{box:{width:r,min:n,max:s},bounds:i,range:a}},d4=new WeakSet,d5=function(e,t){let i=`${100*t}%`,{width:a,min:r,max:n}=e.box;if(!a)return i;if(!Number.isNaN(r)){let e=`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`;i=`max(${e}, ${i})`}if(!Number.isNaN(n)){let e=`calc(1 / var(--_range-width) * 100 * ${n}% - var(--media-box-padding-right))`;i=`min(${i}, ${e})`}return i},d9=new WeakSet,d8=function(e,t){let{width:i,min:a,max:r}=e.box,n=t*e.range.width;if(n<a+sh(this,dj)){let t=e.range.left-e.bounds.left-sh(this,dj);return`${n-i/2+t}px`}if(n>r-sh(this,dZ)){let t=e.bounds.right-e.range.right-sh(this,dZ);return`${n+i/2-t-e.range.width}px`}return 0},d6=new WeakSet,d7=function(e){let t=[...sh(this,dY)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this)))return void sv(this,ue,ut).call(this,null);let i=this.mediaSeekableEnd;if(!i)return;let a=i0(this.shadowRoot,"#preview-rail"),r=i0(this.shadowRoot,'[part~="preview-box"]'),n=sv(this,d2,d3).call(this,sh(this,dG)),s=(e.clientX-n.range.left)/n.range.width;s=Math.max(0,Math.min(1,s));let o=sv(this,d4,d5).call(this,n,s),l=sv(this,d9,d8).call(this,n,s);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${n.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${n.box.width}px`),1>Math.abs(Math.round(sh(this,dK))-Math.round(s*i))&&s>.01&&s<.99||(sp(this,dK,s*i),sv(this,ue,ut).call(this,sh(this,dK)))},ue=new WeakSet,ut=function(e){this.dispatchEvent(new iU.CustomEvent(ie.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:e}))},ui=new WeakSet,ua=function(){sh(this,dF).stop();let e=sg(this);this.dispatchEvent(new iU.CustomEvent(ie.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e}))},sE.shadowRootOptions={mode:"open"},sE.getTemplateHTML=function(e){return`
    ${r9.getTemplateHTML(e)}
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${ir.MEDIA_PREVIEW_IMAGE}], [${ir.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${ir.MEDIA_PREVIEW_IMAGE}], [${ir.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${ir.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${ir.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${ir.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${ir.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${ir.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${ir.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${ir.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${ir.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${ir.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${ir.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${ir.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${ir.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${n1.shadowRootOptions.mode}">
            ${n1.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `},iU.customElements.get("media-time-range")||iU.customElements.define("media-time-range",sE),iU.customElements.get("media-volume-range")||iU.customElements.define("media-volume-range",class extends r9{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_VOLUME,ir.MEDIA_MUTED,ir.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{let e=this.range.value,t=new iU.CustomEvent(ie.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",iR("volume"))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ir.MEDIA_VOLUME||e===ir.MEDIA_MUTED){let e;this.range.valueAsNumber=this.mediaMuted?0:this.mediaVolume,this.range.setAttribute("aria-valuetext",(e=this.range.valueAsNumber,`${Math.round(100*e)}%`)),this.updateBar()}}get mediaVolume(){return i2(this,ir.MEDIA_VOLUME,1)}set mediaVolume(e){i3(this,ir.MEDIA_VOLUME,e)}get mediaMuted(){return i4(this,ir.MEDIA_MUTED)}set mediaMuted(e){i5(this,ir.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return i9(this,ir.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){i8(this,ir.MEDIA_VOLUME_UNAVAILABLE,e)}});var sf=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sy=(e,t,i)=>(sf(e,t,"read from private field"),i?i.call(e):t.get(e)),sA=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sk=(e,t,i,a)=>(sf(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let sT={processCallback(e,t,i){if(i){for(let[e,a]of t)if(e in i){let t=i[e];"boolean"==typeof t&&a instanceof sL&&"boolean"==typeof a.element[a.attributeName]?a.booleanValue=t:"function"==typeof t&&a instanceof sL?a.element[a.attributeName]=t:a.value=t}}}};class sw extends iU.DocumentFragment{constructor(e,t,i=sT){var a;super(),sA(this,ur,void 0),sA(this,un,void 0),this.append(e.content.cloneNode(!0)),sk(this,ur,s_(this)),sk(this,un,i),null==(a=i.createCallback)||a.call(i,this,sy(this,ur),t),i.processCallback(this,sy(this,ur),t)}update(e){sy(this,un).processCallback(this,sy(this,ur),e)}}ur=new WeakMap,un=new WeakMap;let s_=(e,t=[])=>{let i,a;for(let r of e.attributes||[])if(r.value.includes("{{")){let n=new sM;for([i,a]of sI(r.value))if(i){let i=new sL(e,r.name,r.namespaceURI);n.append(i),t.push([a,i])}else n.append(a);r.value=n.toString()}for(let r of e.childNodes)if(1!==r.nodeType||r instanceof HTMLTemplateElement){let n=r.data;if(1===r.nodeType||n.includes("{{")){let s=[];if(n)for([i,a]of sI(n))if(i){let i=new sD(e);s.push(i),t.push([a,i])}else s.push(new Text(a));else if(r instanceof HTMLTemplateElement){let i=new sx(e,r);s.push(i),t.push([i.expression,i])}r.replaceWith(...s.flatMap(e=>e.replacementNodes||[e]))}}else s_(r,t);return t},sC={},sI=e=>{let t="",i=0,a=sC[e],r=0,n;if(a)return a;for(a=[];n=e[r];r++)"{"===n&&"{"===e[r+1]&&"\\"!==e[r-1]&&e[r+2]&&1==++i?(t&&a.push([0,t]),t="",r++):"}"!==n||"}"!==e[r+1]||"\\"===e[r-1]||--i?t+=n||"":(a.push([1,t.trim()]),t="",r++);return t&&a.push([0,(i>0?"{{":"")+t]),sC[e]=a};class sS{get value(){return""}set value(e){}toString(){return this.value}}let sR=new WeakMap;class sM{constructor(){sA(this,us,[])}[Symbol.iterator](){return sy(this,us).values()}get length(){return sy(this,us).length}item(e){return sy(this,us)[e]}append(...e){for(let t of e)t instanceof sL&&sR.set(t,this),sy(this,us).push(t)}toString(){return sy(this,us).join("")}}us=new WeakMap;class sL extends sS{constructor(e,t,i){super(),sA(this,uc),sA(this,uo,""),sA(this,ul,void 0),sA(this,ud,void 0),sA(this,uu,void 0),sk(this,ul,e),sk(this,ud,t),sk(this,uu,i)}get attributeName(){return sy(this,ud)}get attributeNamespace(){return sy(this,uu)}get element(){return sy(this,ul)}get value(){return sy(this,uo)}set value(e){sy(this,uo)!==e&&(sk(this,uo,e),sy(this,uc,uh)&&1!==sy(this,uc,uh).length?sy(this,ul).setAttributeNS(sy(this,uu),sy(this,ud),sy(this,uc,uh).toString()):null==e?sy(this,ul).removeAttributeNS(sy(this,uu),sy(this,ud)):sy(this,ul).setAttributeNS(sy(this,uu),sy(this,ud),e))}get booleanValue(){return sy(this,ul).hasAttributeNS(sy(this,uu),sy(this,ud))}set booleanValue(e){if(sy(this,uc,uh)&&1!==sy(this,uc,uh).length)throw new DOMException("Value is not fully templatized");this.value=e?"":null}}uo=new WeakMap,ul=new WeakMap,ud=new WeakMap,uu=new WeakMap,uc=new WeakSet,uh=function(){return sR.get(this)};class sD extends sS{constructor(e,t){super(),sA(this,um,void 0),sA(this,up,void 0),sk(this,um,e),sk(this,up,t?[...t]:[new Text])}get replacementNodes(){return sy(this,up)}get parentNode(){return sy(this,um)}get nextSibling(){return sy(this,up)[sy(this,up).length-1].nextSibling}get previousSibling(){return sy(this,up)[0].previousSibling}get value(){return sy(this,up).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){let t=e.flat().flatMap(e=>null==e?[new Text]:e.forEach?[...e]:11===e.nodeType?[...e.childNodes]:e.nodeType?[e]:[new Text(e)]);t.length||t.push(new Text),sk(this,up,function(e,t,i,a=null){let r=0,n,s,o,l=i.length,d=t.length;for(;r<l&&r<d&&t[r]==i[r];)r++;for(;r<l&&r<d&&i[l-1]==t[d-1];)a=i[--d,--l];if(r==d)for(;r<l;)e.insertBefore(i[r++],a);if(r==l)for(;r<d;)e.removeChild(t[r++]);else{for(n=t[r];r<l;)o=i[r++],s=n?n.nextSibling:a,n==o?n=s:r<l&&i[r]==s?(e.replaceChild(o,n),n=s):e.insertBefore(o,n);for(;n!=a;)s=n.nextSibling,e.removeChild(n),n=s}return i}(sy(this,up)[0].parentNode,sy(this,up),t,this.nextSibling))}}um=new WeakMap,up=new WeakMap;class sx extends sD{constructor(e,t){const i=t.getAttribute("directive")||t.getAttribute("type");let a=t.getAttribute("expression")||t.getAttribute(i)||"";a.startsWith("{{")&&(a=a.trim().slice(2,-2).trim()),super(e),this.expression=a,this.template=t,this.directive=i}}let sN={string:e=>String(e)};class sO{constructor(e){this.template=e,this.state=void 0}}let sP=new WeakMap,sU=new WeakMap,s$={partial:(e,t)=>{t[e.expression]=new sO(e.template)},if:(e,t)=>{var i;if(sV(e.expression,t))if(sP.get(e)!==e.template){sP.set(e,e.template);let i=new sw(e.template,t,sH);e.replace(i),sU.set(e,i)}else null==(i=sU.get(e))||i.update(t);else e.replace(""),sP.delete(e),sU.delete(e)}},sW=Object.keys(s$),sH={processCallback(e,t,i){var a,r;if(i)for(let[e,n]of t){if(n instanceof sx){if(!n.directive){let e=sW.find(e=>n.template.hasAttribute(e));e&&(n.directive=e,n.expression=n.template.getAttribute(e))}null==(a=s$[n.directive])||a.call(s$,n,i);continue}let t=sV(e,i);if(t instanceof sO){sP.get(n)!==t.template?(sP.set(n,t.template),n.value=t=new sw(t.template,t.state,sH),sU.set(n,t)):null==(r=sU.get(n))||r.update(t.state);continue}t?(n instanceof sL&&n.attributeName.startsWith("aria-")&&(t=String(t)),n instanceof sL?"boolean"==typeof t?n.booleanValue=t:"function"==typeof t?n.element[n.attributeName]=t:n.value=t:(n.value=t,sP.delete(n),sU.delete(n))):n instanceof sL?n.value=void 0:(n.value=void 0,sP.delete(n),sU.delete(n))}}},sB={"!":e=>!e,"!!":e=>!!e,"==":(e,t)=>e==t,"!=":(e,t)=>e!=t,">":(e,t)=>e>t,">=":(e,t)=>e>=t,"<":(e,t)=>e<t,"<=":(e,t)=>e<=t,"??":(e,t)=>null!=e?e:t,"|":(e,t)=>{var i;return null==(i=sN[t])?void 0:i.call(sN,e)}};function sV(e,t={}){var i,a,r,n,s,o,l;let d=(function(e,t){let i,a,r,n=[];for(;e;){for(let n in r=null,i=e.length,t)(a=t[n].exec(e))&&a.index<i&&(r={token:a[0],type:n,matches:a.slice(1)},i=a.index);i&&n.push({token:e.substr(0,i),type:void 0}),r&&n.push(r),e=e.substr(i+(r?r.token.length:0))}return n})(e,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>"ws"!==e);if(0===d.length||d.some(({type:e})=>!e))return sF(e);if((null==(i=d[0])?void 0:i.token)===">"){let i=t[null==(a=d[1])?void 0:a.token];if(!i)return sF(e);let o={...t};i.state=o;let l=d.slice(2);for(let e=0;e<l.length;e+=3){let i=null==(r=l[e])?void 0:r.token,a=null==(n=l[e+1])?void 0:n.token,d=null==(s=l[e+2])?void 0:s.token;i&&"="===a&&(o[i]=sK(d,t))}return i}if(1===d.length)return sY(d[0])?sK(d[0].token,t):sF(e);if(2===d.length){let i=sB[null==(o=d[0])?void 0:o.token];return i&&sY(d[1])?i(sK(d[1].token,t)):sF(e)}if(3===d.length){let i=null==(l=d[1])?void 0:l.token,a=sB[i];if(!a||!sY(d[0])||!sY(d[2]))return sF(e);let r=sK(d[0].token,t);return a(r,"|"===i?d[2].token:sK(d[2].token,t))}}function sF(e){return console.warn(`Warning: invalid expression \`${e}\``),!1}function sY({type:e}){return["number","boolean","string","param"].includes(e)}function sK(e,t){let i=e[0],a=e.slice(-1);return"true"===e||"false"===e?"true"===e:i===a&&["'",'"'].includes(i)?e.slice(1,-1):iA(e)?parseFloat(e):t[e]}var sG=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sq=(e,t,i)=>(sG(e,t,"read from private field"),i?i.call(e):t.get(e)),sj=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sZ=(e,t,i,a)=>(sG(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sz=(e,t,i)=>(sG(e,t,"access private method"),i);let sQ={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},sX=i$.createElement("template");sX.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class sJ extends iU.HTMLElement{constructor(){super(),sj(this,uE),sj(this,uy),sj(this,uv,void 0),sj(this,ub,void 0),sj(this,ug,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer());const e=new MutationObserver(e=>{var t;(!this.mediaController||(null==(t=this.mediaController)?void 0:t.breakpointsComputed))&&e.some(e=>{let t=e.target;return t===this||"media-controller"===t.localName&&!!(sQ[e.attributeName]||e.attributeName.startsWith("breakpoint"))})&&this.render()});e.observe(this,{attributes:!0}),e.observe(this.renderRoot,{attributes:!0,subtree:!0}),this.addEventListener(is.BREAKPOINTS_COMPUTED,this.render),sz(this,uE,uf).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return null!=(e=sq(this,uv))?e:this.constructor.template}set template(e){sZ(this,ug,null),sZ(this,uv,e),this.createRenderer()}get props(){var e,t,i;let a=[...Array.from(null!=(t=null==(e=this.mediaController)?void 0:e.attributes)?t:[]).filter(({name:e})=>sQ[e]||e.startsWith("breakpoint")),...Array.from(this.attributes)],r={};for(let e of a){let t=null!=(i=sQ[e.name])?i:e.name.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase()),{value:a}=e;null!=a?(iA(a)&&(a=parseFloat(a)),r[t]=""===a||a):r[t]=!1}return r}attributeChangedCallback(e,t,i){"template"===e&&t!=i&&sz(this,uy,uA).call(this)}connectedCallback(){sz(this,uy,uA).call(this)}createRenderer(){this.template&&this.template!==sq(this,ub)&&(sZ(this,ub,this.template),this.renderer=new sw(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(sX.content.cloneNode(!0),this.renderer))}render(){var e;null==(e=this.renderer)||e.update(this.props)}}async function s0(e){let t=await fetch(e);if(200!==t.status)throw Error(`Failed to load resource: the server responded with a status of ${t.status}`);return t.text()}function s1(e){return e.split("-")[0]}uv=new WeakMap,ub=new WeakMap,ug=new WeakMap,uE=new WeakSet,uf=function(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}},uy=new WeakSet,uA=function(){var e;let t=this.getAttribute("template");if(!t||t===sq(this,ug))return;let i=this.getRootNode(),a=null==(e=null==i?void 0:i.getElementById)?void 0:e.call(i,t);if(a){sZ(this,ug,t),sZ(this,uv,a),this.createRenderer();return}(function(e){if(!/^(\/|\.\/|https?:\/\/)/.test(e))return!1;let t=/^https?:\/\//.test(e)?void 0:location.origin;try{new URL(e,t)}catch(e){return!1}return!0})(t)&&(sZ(this,ug,t),s0(t).then(e=>{let t=i$.createElement("template");t.innerHTML=e,sZ(this,uv,t),this.createRenderer()}).catch(console.error))},sJ.observedAttributes=["template"],sJ.processor=sH,iU.customElements.get("media-theme")||iU.customElements.define("media-theme",sJ);class s2 extends Event{constructor({action:e="auto",relatedTarget:t,...i}){super("invoke",i),this.action=e,this.relatedTarget=t}}class s3 extends Event{constructor({newState:e,oldState:t,...i}){super("toggle",i),this.newState=e,this.oldState=t}}var s4=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},s5=(e,t,i)=>(s4(e,t,"read from private field"),i?i.call(e):t.get(e)),s9=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},s8=(e,t,i,a)=>(s4(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),s6=(e,t,i)=>(s4(e,t,"access private method"),i);function s7({type:e,text:t,value:i,checked:a}){let r=i$.createElement("media-chrome-menu-item");r.type=null!=e?e:"",r.part.add("menu-item"),e&&r.part.add(e),r.value=i,r.checked=a;let n=i$.createElement("span");return n.textContent=t,r.append(n),r}function oe(e,t){let i=e.querySelector(`:scope > [slot="${t}"]`);if((null==i?void 0:i.nodeName)=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i.cloneNode(!0);let a=e.shadowRoot.querySelector(`[name="${t}"] > svg`);return a?a.cloneNode(!0):""}let ot="style",oi="hidden",oa="disabled";class or extends iU.HTMLElement{constructor(){if(super(),s9(this,uR),s9(this,uD),s9(this,uN),s9(this,uP),s9(this,u$),s9(this,uV),s9(this,uY),s9(this,uG),s9(this,uj),s9(this,uz),s9(this,uX),s9(this,u0),s9(this,u2),s9(this,u4),s9(this,u9),s9(this,u6),s9(this,ce),s9(this,uk,null),s9(this,uT,null),s9(this,uw,null),s9(this,u_,new Set),s9(this,uC,void 0),s9(this,uI,!1),s9(this,uS,null),s9(this,uL,()=>{let e=s5(this,u_),t=new Set(this.items);for(let i of e)t.has(i)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:i}));for(let i of t)e.has(i)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:i}));s8(this,u_,t)}),s9(this,uH,()=>{s6(this,uV,uF).call(this),s6(this,uY,uK).call(this,!1)}),s9(this,uB,()=>{s6(this,uV,uF).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),this.shadowRoot.addEventListener("slotchange",this),s8(this,uC,new MutationObserver(s5(this,uL))),s5(this,uC).observe(this.defaultSlot,{childList:!0})}static get observedAttributes(){return[oa,oi,ot,"anchor",it.MEDIA_CONTROLLER]}static formatMenuItemText(e,t){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":s6(this,uR,uM).call(this,e);break;case"invoke":s6(this,uN,uO).call(this,e);break;case"click":s6(this,uG,uq).call(this,e);break;case"toggle":s6(this,uz,uQ).call(this,e);break;case"focusout":s6(this,u0,u1).call(this,e);break;case"keydown":s6(this,u2,u3).call(this,e)}}connectedCallback(){var e,t;s8(this,uS,i1(this.shadowRoot,":host")),s6(this,uD,ux).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),s8(this,uk,iG(this)),null==(t=null==(e=s5(this,uk))?void 0:e.associateElement)||t.call(e,this),this.hidden||(iV(os(this),s5(this,uH)),iV(this,s5(this,uB)))}disconnectedCallback(){var e,t;iF(os(this),s5(this,uH)),iF(this,s5(this,uB)),this.disable(),null==(t=null==(e=s5(this,uk))?void 0:e.unassociateElement)||t.call(e,this),s8(this,uk,null)}attributeChangedCallback(e,t,i){var a,r,n,s;e===oi&&i!==t?(s5(this,uI)||s8(this,uI,!0),this.hidden?s6(this,u$,uW).call(this):s6(this,uP,uU).call(this),this.dispatchEvent(new s3({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===it.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=s5(this,uk))?void 0:a.unassociateElement)||r.call(a,this),s8(this,uk,null)),i&&this.isConnected&&(s8(this,uk,iG(this)),null==(s=null==(n=s5(this,uk))?void 0:n.associateElement)||s.call(n,this))):e===oa&&i!==t?null==i?this.enable():this.disable():e===ot&&i!==t&&s6(this,uD,ux).call(this)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?null==(e=iX(this))?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(on)}get radioGroupItems(){return this.items.filter(e=>"menuitemradio"===e.role)}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,t;return null!=(t=null==(e=this.checkedItems[0])?void 0:e.value)?t:""}set value(e){let t=this.items.find(t=>t.value===e);t&&s6(this,ce,ct).call(this,t)}focus(){if(s8(this,uT,iQ()),this.items.length){s6(this,u6,u7).call(this,this.items[0]),this.items[0].focus();return}let e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==e||e.focus()}handleSelect(e){var t;let i=s6(this,u4,u5).call(this,e);i&&(s6(this,ce,ct).call(this,i,"checkbox"===i.type),s5(this,uw)&&!this.hidden&&(null==(t=s5(this,uT))||t.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var t,i;let{key:a}=e,r=this.items,n=null!=(i=null!=(t=s6(this,u4,u5).call(this,e))?t:s6(this,u9,u8).call(this))?i:r[0],s=Math.max(0,r.indexOf(n));"ArrowDown"===a?s++:"ArrowUp"===a?s--:"Home"===e.key?s=0:"End"===e.key&&(s=r.length-1),s<0&&(s=r.length-1),s>r.length-1&&(s=0),s6(this,u6,u7).call(this,r[s]),r[s].focus()}}function on(e){return["menuitem","menuitemradio","menuitemcheckbox"].includes(null==e?void 0:e.role)}function os(e){var t;return null!=(t=e.getAttribute("bounds")?iz(e,`#${e.getAttribute("bounds")}`):iK(e)||e.parentElement)?t:e}uk=new WeakMap,uT=new WeakMap,uw=new WeakMap,u_=new WeakMap,uC=new WeakMap,uI=new WeakMap,uS=new WeakMap,uR=new WeakSet,uM=function(e){let t=e.target;for(let e of t.assignedNodes({flatten:!0}))3===e.nodeType&&""===e.textContent.trim()&&e.remove();["header","title"].includes(t.name)&&(this.shadowRoot.querySelector('slot[name="header"]').hidden=0===t.assignedNodes().length),t.name||s5(this,uL).call(this)},uL=new WeakMap,uD=new WeakSet,ux=function(){var e;let t=this.shadowRoot.querySelector("#layout-row"),i=null==(e=getComputedStyle(this).getPropertyValue("--media-menu-layout"))?void 0:e.trim();t.setAttribute("media","row"===i?"":"width:0")},uN=new WeakSet,uO=function(e){s8(this,uw,e.relatedTarget),iZ(this,e.relatedTarget)||(this.hidden=!this.hidden)},uP=new WeakSet,uU=function(){var e;null==(e=s5(this,uw))||e.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),iV(os(this),s5(this,uH)),iV(this,s5(this,uB))},u$=new WeakSet,uW=function(){var e;null==(e=s5(this,uw))||e.setAttribute("aria-expanded","false"),iF(os(this),s5(this,uH)),iF(this,s5(this,uB))},uH=new WeakMap,uB=new WeakMap,uV=new WeakSet,uF=function(e){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;let{x:t,y:i}=function({anchor:e,floating:t,placement:i}){let{x:a,y:r}=function({anchor:e,floating:t},i){let a,r="x"==(["top","bottom"].includes(s1(i))?"y":"x")?"y":"x",n="y"===r?"height":"width",s=s1(i),o=e.x+e.width/2-t.width/2,l=e.y+e.height/2-t.height/2,d=e[n]/2-t[n]/2;switch(s){case"top":a={x:o,y:e.y-t.height};break;case"bottom":a={x:o,y:e.y+e.height};break;case"right":a={x:e.x+e.width,y:l};break;case"left":a={x:e.x-t.width,y:l};break;default:a={x:e.x,y:e.y}}switch(i.split("-")[1]){case"start":a[r]-=d;break;case"end":a[r]+=d}return a}(function({anchor:e,floating:t}){var i,a,r;let n,s;return{anchor:(i=e,a=t.offsetParent,n=i.getBoundingClientRect(),s=null!=(r=null==a?void 0:a.getBoundingClientRect())?r:{x:0,y:0},{x:n.x-s.x,y:n.y-s.y,width:n.width,height:n.height}),floating:{x:0,y:0,width:t.offsetWidth,height:t.offsetHeight}}}({anchor:e,floating:t}),i);return{x:a,y:r}}({anchor:this.anchorElement,floating:this,placement:"top-start"});null!=e||(e=this.offsetWidth);let a=os(this).getBoundingClientRect(),r=a.width-t-e,n=a.height-i-this.offsetHeight,{style:s}=s5(this,uS);s.setProperty("position","absolute"),s.setProperty("right",`${Math.max(0,r)}px`),s.setProperty("--_menu-bottom",`${n}px`);let o=getComputedStyle(this),l=s.getPropertyValue("--_menu-bottom")===o.bottom?n:parseFloat(o.bottom),d=a.height-l-parseFloat(o.marginBottom);this.style.setProperty("--_menu-max-height",`${d}px`)},uY=new WeakSet,uK=function(e){let t=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=null==t?void 0:t.querySelector('[role="menu"]'),{style:a}=s5(this,uS);if(e||a.setProperty("--media-menu-transition-in","none"),i){let e=i.offsetHeight,a=Math.max(i.offsetWidth,t.offsetWidth);this.style.setProperty("min-width",`${a}px`),this.style.setProperty("min-height",`${e}px`),s6(this,uV,uF).call(this,a)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),s6(this,uV,uF).call(this);a.removeProperty("--media-menu-transition-in")},uG=new WeakSet,uq=function(e){var t;if(e.stopPropagation(),e.composedPath().includes(s5(this,uj,uZ))){null==(t=s5(this,uT))||t.focus(),this.hidden=!0;return}let i=s6(this,u4,u5).call(this,e);!i||i.hasAttribute("disabled")||(s6(this,u6,u7).call(this,i),this.handleSelect(e))},uj=new WeakSet,uZ=function(){var e;return null==(e=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))?void 0:e.find(e=>e.matches('button[part~="back"]'))},uz=new WeakSet,uQ=function(e){if(e.target===this)return;s6(this,uX,uJ).call(this);let t=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(let i of t)i.invokeTargetElement!=e.target&&("open"!=e.newState||"true"!=i.getAttribute("aria-expanded")||i.invokeTargetElement.hidden||i.invokeTargetElement.dispatchEvent(new s2({relatedTarget:i})));for(let e of t)e.setAttribute("aria-expanded",`${!e.submenuElement.hidden}`);s6(this,uY,uK).call(this,!0)},uX=new WeakSet,uJ=function(){let e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)},u0=new WeakSet,u1=function(e){var t;iZ(this,e.relatedTarget)||(s5(this,uI)&&(null==(t=s5(this,uT))||t.focus()),s5(this,uw)&&s5(this,uw)!==e.relatedTarget&&!this.hidden&&(this.hidden=!0))},u2=new WeakSet,u3=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;if(!o&&!l&&!d&&this.keysUsed.includes(s))if(e.preventDefault(),e.stopPropagation(),"Tab"===s){if(s5(this,uI)){this.hidden=!0;return}e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()}else"Escape"===s?(null==(n=s5(this,uT))||n.focus(),s5(this,uI)&&(this.hidden=!0)):"Enter"===s||" "===s?this.handleSelect(e):this.handleMove(e)},u4=new WeakSet,u5=function(e){return e.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))},u9=new WeakSet,u8=function(){return this.items.find(e=>0===e.tabIndex)},u6=new WeakSet,u7=function(e){for(let t of this.items)t.tabIndex=t===e?0:-1},ce=new WeakSet,ct=function(e,t){let i=[...this.checkedItems];"radio"===e.type&&this.radioGroupItems.forEach(e=>e.checked=!1),t?e.checked=!e.checked:e.checked=!0,this.checkedItems.some((e,t)=>e!=i[t])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))},or.shadowRootOptions={mode:"open"},or.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex);
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `},iU.customElements.get("media-chrome-menu")||iU.customElements.define("media-chrome-menu",or);var oo=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ol=(e,t,i)=>(oo(e,t,"read from private field"),i?i.call(e):t.get(e)),od=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ou=(e,t,i,a)=>(oo(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oc=(e,t,i)=>(oo(e,t,"access private method"),i);let oh="type",om="value",op="checked",ov="disabled";class ob extends iU.HTMLElement{constructor(){if(super(),od(this,cr),od(this,cs),od(this,cl),od(this,cc),od(this,cm),od(this,cv),od(this,ci,!1),od(this,ca,void 0),od(this,cu,()=>{var e,t;this.setAttribute("submenusize",`${this.submenuElement.items.length}`);let i=this.shadowRoot.querySelector('slot[name="description"]'),a=null==(e=this.submenuElement.checkedItems)?void 0:e[0],r=null!=(t=null==a?void 0:a.dataset.description)?t:null==a?void 0:a.text,n=i$.createElement("span");n.textContent=null!=r?r:"",i.replaceChildren(n)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=iY(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.shadowRoot.addEventListener("slotchange",this)}static get observedAttributes(){return[oh,ov,op,om]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),og(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":oc(this,cr,cn).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":oc(this,cm,cp).call(this,e);break;case"keyup":oc(this,cc,ch).call(this,e)}}attributeChangedCallback(e,t,i){e===op&&og(this)&&!ol(this,ci)?this.setAttribute("aria-checked",null!=i?"true":"false"):e===oh&&i!==t?this.role="menuitem"+i:e===ov&&i!==t&&(null==i?this.enable():this.disable())}connectedCallback(){this.hasAttribute(ov)||this.enable(),this.role="menuitem"+this.type,ou(this,ca,function e(t,i){if(!t)return null;let{host:a}=t.getRootNode();return!i&&a?e(t,a):(null==i?void 0:i.items)?i:e(i,null==i?void 0:i.parentNode)}(this,this.parentNode)),oc(this,cv,cb).call(this)}disconnectedCallback(){this.disable(),oc(this,cv,cb).call(this),ou(this,ca,null)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=iX(this))?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return null!=(e=this.getAttribute(oh))?e:""}set type(e){this.setAttribute(oh,`${e}`)}get value(){var e;return null!=(e=this.getAttribute(om))?e:this.text}set value(e){this.setAttribute(om,e)}get text(){var e;return(null!=(e=this.textContent)?e:"").trim()}get checked(){if(og(this))return"true"===this.getAttribute("aria-checked")}set checked(e){og(this)&&(ou(this,ci,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){!og(this)&&this.invokeTargetElement&&iZ(this,e.target)&&this.invokeTargetElement.dispatchEvent(new s2({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}}function og(e){return"radio"===e.type||"checkbox"===e.type}ci=new WeakMap,ca=new WeakMap,cr=new WeakSet,cn=function(e){let t=e.target;if(!(null==t?void 0:t.name))for(let e of t.assignedNodes({flatten:!0}))e instanceof Text&&""===e.textContent.trim()&&e.remove();"submenu"===t.name&&(this.submenuElement?oc(this,cs,co).call(this):oc(this,cl,cd).call(this))},cs=new WeakSet,co=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",ol(this,cu)),this.submenuElement.addEventListener("addmenuitem",ol(this,cu)),this.submenuElement.addEventListener("removemenuitem",ol(this,cu)),ol(this,cu).call(this)},cl=new WeakSet,cd=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",ol(this,cu)),this.submenuElement.removeEventListener("addmenuitem",ol(this,cu)),this.submenuElement.removeEventListener("removemenuitem",ol(this,cu)),ol(this,cu).call(this)},cu=new WeakMap,cc=new WeakSet,ch=function(e){let{key:t}=e;this.keysUsed.includes(t)?this.handleClick(e):this.removeEventListener("keyup",oc(this,cc,ch))},cm=new WeakSet,cp=function(e){let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",oc(this,cc,ch)):this.addEventListener("keyup",oc(this,cc,ch),{once:!0})},cv=new WeakSet,cb=function(){var e;let t=null==(e=ol(this,ca))?void 0:e.radioGroupItems;if(!t)return;let i=t.filter(e=>"true"===e.getAttribute("aria-checked")).pop();for(let e of(i||(i=t[0]),t))e.setAttribute("aria-checked","false");null==i||i.setAttribute("aria-checked","true")},ob.shadowRootOptions={mode:"open"},ob.getTemplateHTML=function(e){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(e)}
    </slot>
    <slot name="submenu"></slot>
  `},ob.getSuffixSlotInnerHTML=function(e){return""},iU.customElements.get("media-chrome-menu-item")||iU.customElements.define("media-chrome-menu-item",ob);class oE extends or{get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iK(this).querySelector("media-settings-menu-button")}}oE.getTemplateHTML=function(e){return`
    ${or.getTemplateHTML(e)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `},iU.customElements.get("media-settings-menu")||iU.customElements.define("media-settings-menu",oE);class of extends ob{}of.shadowRootOptions={mode:"open"},of.getTemplateHTML=function(e){return`
    ${ob.getTemplateHTML.call(this,e)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `},of.getSuffixSlotInnerHTML=function(e){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `},iU.customElements.get("media-settings-menu-item")||iU.customElements.define("media-settings-menu-item",of);class oy extends rP{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=iX(this))?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;null==(e=this.invokeTargetElement)||e.dispatchEvent(new s2({relatedTarget:this}))}}iU.customElements.get("media-chrome-menu-button")||iU.customElements.define("media-chrome-menu-button",oy);class oA extends oy{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",iR("settings"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iK(this).querySelector("media-settings-menu")}}oA.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `},oA.getTooltipContentHTML=function(){return iR("Settings")},iU.customElements.get("media-settings-menu-button")||iU.customElements.define("media-settings-menu-button",oA);var ok=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oT=(e,t,i)=>(ok(e,t,"read from private field"),i?i.call(e):t.get(e)),ow=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},o_=(e,t,i,a)=>(ok(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oC=(e,t,i)=>(ok(e,t,"access private method"),i);cg=new WeakMap,cE=new WeakMap,cf=new WeakSet,cy=function(){if(oT(this,cE)===JSON.stringify(this.mediaAudioTrackList))return;o_(this,cE,JSON.stringify(this.mediaAudioTrackList));let e=this.mediaAudioTrackList;for(let t of(this.defaultSlot.textContent="",e)){let e=s7({type:"radio",text:this.formatMenuItemText(t.label,t),value:`${t.id}`,checked:t.enabled});e.prepend(oe(this,"checked-indicator")),this.defaultSlot.append(e)}},cA=new WeakSet,ck=function(){if(null==this.value)return;let e=new iU.CustomEvent(ie.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},iU.customElements.get("media-audio-track-menu")||iU.customElements.define("media-audio-track-menu",class extends or{constructor(){super(...arguments),ow(this,cf),ow(this,cA),ow(this,cg,[]),ow(this,cE,void 0)}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_AUDIO_TRACK_LIST,ir.MEDIA_AUDIO_TRACK_ENABLED,ir.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ir.MEDIA_AUDIO_TRACK_ENABLED&&t!==i)this.value=i;else if(e===ir.MEDIA_AUDIO_TRACK_LIST&&t!==i){var a;o_(this,cg,null==(a=null!=i?i:"")?void 0:a.split(/\s+/).map(iE)),oC(this,cf,cy).call(this)}}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oC(this,cA,ck))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oC(this,cA,ck))}get anchorElement(){var e;return"auto"!==this.anchor?super.anchorElement:null==(e=iK(this))?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return oT(this,cg)}set mediaAudioTrackList(e){o_(this,cg,e),oC(this,cf,cy).call(this)}get mediaAudioTrackEnabled(){var e;return null!=(e=i9(this,ir.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){i8(this,ir.MEDIA_AUDIO_TRACK_ENABLED,e)}});let oI=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;class oS extends oy{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_AUDIO_TRACK_ENABLED,ir.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",iR("Audio"))}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=iK(this))?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return null!=(e=i9(this,ir.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){i8(this,ir.MEDIA_AUDIO_TRACK_ENABLED,e)}}oS.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${oI}</slot>
  `},oS.getTooltipContentHTML=function(){return iR("Audio")},iU.customElements.get("media-audio-track-menu-button")||iU.customElements.define("media-audio-track-menu-button",oS);var oR=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oM=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oL=(e,t,i)=>(oR(e,t,"access private method"),i);let oD=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;class ox extends or{constructor(){super(...arguments),oM(this,cw),oM(this,cC),oM(this,cT,void 0)}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_SUBTITLES_LIST,ir.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_SUBTITLES_LIST&&t!==i?oL(this,cw,c_).call(this):e===ir.MEDIA_SUBTITLES_SHOWING&&t!==i&&(this.value=i)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oL(this,cC,cI))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oL(this,cC,cI))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iK(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return oN(this,ir.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){oO(this,ir.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return oN(this,ir.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){oO(this,ir.MEDIA_SUBTITLES_SHOWING,e)}}cT=new WeakMap,cw=new WeakSet,c_=function(){var e,t,i,a,r,n;if(oR(this,t=cT,"read from private field"),(i?i.call(this):t.get(this))===JSON.stringify(this.mediaSubtitlesList))return;a=cT,r=JSON.stringify(this.mediaSubtitlesList),oR(this,a,"write to private field"),n?n.call(this,r):a.set(this,r),this.defaultSlot.textContent="";let s=!this.value,o=s7({type:"radio",text:this.formatMenuItemText(iR("Off")),value:"off",checked:s});for(let t of(o.prepend(oe(this,"checked-indicator")),this.defaultSlot.append(o),this.mediaSubtitlesList)){let i=s7({type:"radio",text:this.formatMenuItemText(t.label,t),value:aC(t),checked:this.value==aC(t)});i.prepend(oe(this,"checked-indicator")),"captions"===(null!=(e=t.kind)?e:"subs")&&i.append(oe(this,"captions-indicator")),this.defaultSlot.append(i)}},cC=new WeakSet,cI=function(){let e=this.mediaSubtitlesShowing,t=this.getAttribute(ir.MEDIA_SUBTITLES_SHOWING),i=this.value!==t;if((null==e?void 0:e.length)&&i&&this.dispatchEvent(new iU.CustomEvent(ie.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:e})),!this.value||!i)return;let a=new iU.CustomEvent(ie.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)},ox.getTemplateHTML=function(e){return`
    ${or.getTemplateHTML(e)}
    <slot name="captions-indicator" hidden>${oD}</slot>
  `};let oN=(e,t)=>{let i=e.getAttribute(t);return i?aw(i):[]},oO=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=aI(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};iU.customElements.get("media-captions-menu")||iU.customElements.define("media-captions-menu",ox);let oP=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,oU=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,o$=e=>{e.setAttribute("aria-checked",aL(e).toString())};class oW extends oy{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_SUBTITLES_LIST,ir.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",iR("closed captions")),o$(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_SUBTITLES_SHOWING&&o$(this)}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=iK(this))?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return oH(this,ir.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){oB(this,ir.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return oH(this,ir.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){oB(this,ir.MEDIA_SUBTITLES_SHOWING,e)}}oW.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${oP}</slot>
      <slot name="off">${oU}</slot>
    </slot>
  `},oW.getTooltipContentHTML=function(){return iR("Captions")};let oH=(e,t)=>{let i=e.getAttribute(t);return i?aw(i):[]},oB=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=aI(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};iU.customElements.get("media-captions-menu-button")||iU.customElements.define("media-captions-menu-button",oW);var oV=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oF=(e,t,i)=>(oV(e,t,"read from private field"),i?i.call(e):t.get(e)),oY=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oK=(e,t,i)=>(oV(e,t,"access private method"),i);let oG="rates";cS=new WeakMap,cR=new WeakSet,cM=function(){for(let e of(this.defaultSlot.textContent="",oF(this,cS))){let t=s7({type:"radio",text:this.formatMenuItemText(`${e}x`,e),value:e,checked:this.mediaPlaybackRate===Number(e)});t.prepend(oe(this,"checked-indicator")),this.defaultSlot.append(t)}},cL=new WeakSet,cD=function(){if(!this.value)return;let e=new iU.CustomEvent(ie.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},iU.customElements.get("media-playback-rate-menu")||iU.customElements.define("media-playback-rate-menu",class extends or{constructor(){super(),oY(this,cR),oY(this,cL),oY(this,cS,new ak(this,oG,{defaultValue:nF})),oK(this,cR,cM).call(this)}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PLAYBACK_RATE,oG]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===ir.MEDIA_PLAYBACK_RATE&&t!=i?this.value=i:e===oG&&t!=i&&(oF(this,cS).value=i,oK(this,cR,cM).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oK(this,cL,cD))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oK(this,cL,cD))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iK(this).querySelector("media-playback-rate-menu-button")}get rates(){return oF(this,cS)}set rates(e){e?Array.isArray(e)?oF(this,cS).value=e.join(" "):"string"==typeof e&&(oF(this,cS).value=e):oF(this,cS).value="",oK(this,cR,cM).call(this)}get mediaPlaybackRate(){return i2(this,ir.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){i3(this,ir.MEDIA_PLAYBACK_RATE,e)}});class oq extends oy{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ir.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",iR("Playback rate {playbackRate}",{playbackRate:t}))}}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iK(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return i2(this,ir.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){i3(this,ir.MEDIA_PLAYBACK_RATE,e)}}oq.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},oq.getTooltipContentHTML=function(){return iR("Playback rate")},iU.customElements.get("media-playback-rate-menu-button")||iU.customElements.define("media-playback-rate-menu-button",oq);var oj=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oZ=(e,t,i)=>(oj(e,t,"read from private field"),i?i.call(e):t.get(e)),oz=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oQ=(e,t,i,a)=>(oj(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oX=(e,t,i)=>(oj(e,t,"access private method"),i);cx=new WeakMap,cN=new WeakMap,cO=new WeakSet,cP=function(){if(oZ(this,cN).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&oZ(this,cN).mediaHeight===this.mediaHeight)return;oZ(this,cN).mediaRenditionList=JSON.stringify(this.mediaRenditionList),oZ(this,cN).mediaHeight=this.mediaHeight;let e=this.mediaRenditionList.sort((e,t)=>t.height-e.height);for(let t of e)t.selected=t.id===this.mediaRenditionSelected;this.defaultSlot.textContent="";let t=!this.mediaRenditionSelected;for(let i of e){let e=s7({type:"radio",text:this.formatMenuItemText(`${Math.min(i.width,i.height)}p`,i),value:`${i.id}`,checked:i.selected&&!t});e.prepend(oe(this,"checked-indicator")),this.defaultSlot.append(e)}let i=s7({type:"radio",text:t?this.formatMenuItemText(`${iR("Auto")} (${this.mediaHeight}p)`):this.formatMenuItemText(iR("Auto")),value:"auto",checked:t}),a=this.mediaHeight>0?`${iR("Auto")} (${this.mediaHeight}p)`:iR("Auto");i.dataset.description=a,i.prepend(oe(this,"checked-indicator")),this.defaultSlot.append(i)},cU=new WeakSet,c$=function(){if(null==this.value)return;let e=new iU.CustomEvent(ie.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},iU.customElements.get("media-rendition-menu")||iU.customElements.define("media-rendition-menu",class extends or{constructor(){super(...arguments),oz(this,cO),oz(this,cU),oz(this,cx,[]),oz(this,cN,{})}static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_RENDITION_LIST,ir.MEDIA_RENDITION_SELECTED,ir.MEDIA_RENDITION_UNAVAILABLE,ir.MEDIA_HEIGHT]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===ir.MEDIA_RENDITION_SELECTED&&t!==i)this.value=null!=i?i:"auto",oX(this,cO,cP).call(this);else if(e===ir.MEDIA_RENDITION_LIST&&t!==i)oQ(this,cx,null==i?void 0:i.split(/\s+/).map(ib)),oX(this,cO,cP).call(this);else e===ir.MEDIA_HEIGHT&&t!==i&&oX(this,cO,cP).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oX(this,cU,c$))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oX(this,cU,c$))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iK(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return oZ(this,cx)}set mediaRenditionList(e){oQ(this,cx,e),oX(this,cO,cP).call(this)}get mediaRenditionSelected(){return i9(this,ir.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){i8(this,ir.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return i2(this,ir.MEDIA_HEIGHT)}set mediaHeight(e){i3(this,ir.MEDIA_HEIGHT,e)}});let oJ=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;class o0 extends oy{static get observedAttributes(){return[...super.observedAttributes,ir.MEDIA_RENDITION_SELECTED,ir.MEDIA_RENDITION_UNAVAILABLE,ir.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",iR("quality"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iK(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return i9(this,ir.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){i8(this,ir.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return i2(this,ir.MEDIA_HEIGHT)}set mediaHeight(e){i3(this,ir.MEDIA_HEIGHT,e)}}o0.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${oJ}</slot>
  `},o0.getTooltipContentHTML=function(){return iR("Quality")},iU.customElements.get("media-rendition-menu-button")||iU.customElements.define("media-rendition-menu-button",o0);var o1=e=>{throw TypeError(e)},o2=(e,t,i)=>t.has(e)||o1("Cannot "+i),o3=(e,t,i)=>(o2(e,t,"read from private field"),i?i.call(e):t.get(e)),o4=(e,t,i)=>t.has(e)?o1("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),o5=(e,t,i,a)=>(o2(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),o9=(e,t,i)=>(o2(e,t,"access private method"),i),o8=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends o8{});var o6,o7,le,lt,li,la,lr,ln,ls,lo,ll,ld,lu,lc,lh,lm,lp,lv,lb,lg,lE,lf,ly,lA,lk,lT,lw,l_,lC,lI,lS,lR,lM,lL,lD,lx,lN,lO,lP,lU,l$,lW,lH,lB,lV,lF,lY,lK,lG,lq,lj,lZ,lz,lQ,lX,lJ,l0,l1,l2,l3,l4,l5,l9,l8,l6,l7,de,dt,di,da,dr,dn,ds,dl,dd,du,dc,dh,dm,dp,dv,db,dg,dE,df,dy,dA,dk,dT,dw,d_,dC,dI,dS,dR,dM,dL,dD,dx,dN,dO,dP,dU,d$,dW,dH,dB,dV,dF,dY,dK,dG,dq,dj,dZ,dz,dQ,dX,dJ,d0,d1,d2,d3,d4,d5,d9,d8,d6,d7,ue,ut,ui,ua,ur,un,us,uo,ul,ud,uu,uc,uh,um,up,uv,ub,ug,uE,uf,uy,uA,uk,uT,uw,u_,uC,uI,uS,uR,uM,uL,uD,ux,uN,uO,uP,uU,u$,uW,uH,uB,uV,uF,uY,uK,uG,uq,uj,uZ,uz,uQ,uX,uJ,u0,u1,u2,u3,u4,u5,u9,u8,u6,u7,ce,ct,ci,ca,cr,cn,cs,co,cl,cd,cu,cc,ch,cm,cp,cv,cb,cg,cE,cf,cy,cA,ck,cT,cw,c_,cC,cI,cS,cR,cM,cL,cD,cx,cN,cO,cP,cU,c$,cW,cH=class extends o8{},cB=class{constructor(e,t={}){o4(this,cW),o5(this,cW,null==t?void 0:t.detail)}get detail(){return o3(this,cW)}initCustomEvent(){}};cW=new WeakMap;var cV={document:{createElement:function(e,t){return new cH}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(cH)},CustomEvent:cB,EventTarget:o8,HTMLElement:cH,HTMLVideoElement:class extends o8{}},cF="u"<typeof window||void 0===globalThis.customElements,cY=cF?cV:globalThis,cK=cF?cV.document:globalThis.document;function cG(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function cq(e){return e.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase())}function cj(e){if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}function cZ(e){let t=(function(e){let t={};for(let i in e)null!=e[i]&&(t[i]=e[i]);return new URLSearchParams(t)})(e).toString();return t?"?"+t:""}var cz,cQ,cX,cJ=(e,t)=>!!e&&!!t&&(!!e.contains(t)||cJ(e,t.getRootNode().host)),c0="mux.com",c1=(()=>{try{return"3.5.1"}catch{}return"UNKNOWN"})(),c2=e=>{if(e){if([p,m].includes(e))return e;if(null!=e&&e.includes("live"))return p}},c3={crossorigin:"crossOrigin",playsinline:"playsInline"},c4=class{constructor(e,t){o4(this,cz),o4(this,cQ),o4(this,cX,[]),o5(this,cz,e),o5(this,cQ,t)}[Symbol.iterator](){return o3(this,cX).values()}get length(){return o3(this,cX).length}get value(){var e;return null!=(e=o3(this,cX).join(" "))?e:""}set value(e){var t;e!==this.value&&(o5(this,cX,[]),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return o3(this,cX)[e]}values(){return o3(this,cX).values()}keys(){return o3(this,cX).keys()}forEach(e){o3(this,cX).forEach(e)}add(...e){var t,i;e.forEach(e=>{this.contains(e)||o3(this,cX).push(e)}),(""!==this.value||null!=(t=o3(this,cz))&&t.hasAttribute(`${o3(this,cQ)}`))&&null!=(i=o3(this,cz))&&i.setAttribute(`${o3(this,cQ)}`,`${this.value}`)}remove(...e){var t;e.forEach(e=>{o3(this,cX).splice(o3(this,cX).indexOf(e),1)}),null==(t=o3(this,cz))||t.setAttribute(`${o3(this,cQ)}`,`${this.value}`)}contains(e){return o3(this,cX).includes(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){this.remove(e),this.add(t)}};cz=new WeakMap,cQ=new WeakMap,cX=new WeakMap;var c5=`[mux-player ${c1}]`;function c9(...e){console.warn(c5,...e)}function c8(...e){console.error(c5,...e)}function c6(e){var t;let i=null!=(t=e.message)?t:"";e.context&&(i+=` ${e.context}`),e.file&&(i+=` ${L("Read more: ")}
https://github.com/muxinc/elements/blob/main/errors/${e.file}`),c9(i)}var c7={AUTOPLAY:"autoplay",CROSSORIGIN:"crossorigin",LOOP:"loop",MUTED:"muted",PLAYSINLINE:"playsinline",PRELOAD:"preload"},he={VOLUME:"volume",PLAYBACKRATE:"playbackrate",MUTED:"muted"},ht=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}}),hi=[...Object.values(c7).filter(e=>c7.PLAYSINLINE!==e),...Object.values(he)];function ha(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}var hr=class extends cY.HTMLElement{static get observedAttributes(){return hi}constructor(){super()}attributeChangedCallback(e,t,i){var a,r;switch(e){case he.MUTED:this.media&&(this.media.muted=null!=i,this.media.defaultMuted=null!=i);return;case he.VOLUME:{let e=null!=(a=cj(i))?a:1;this.media&&(this.media.volume=e);return}case he.PLAYBACKRATE:{let e=null!=(r=cj(i))?r:1;this.media&&(this.media.playbackRate=e,this.media.defaultPlaybackRate=e);return}}}play(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.play())?t:Promise.reject()}pause(){var e;null==(e=this.media)||e.pause()}load(){var e;null==(e=this.media)||e.load()}get media(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("mux-video")}get audioTracks(){return this.media.audioTracks}get videoTracks(){return this.media.videoTracks}get audioRenditions(){return this.media.audioRenditions}get videoRenditions(){return this.media.videoRenditions}get paused(){var e,t;return null==(t=null==(e=this.media)?void 0:e.paused)||t}get duration(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.duration)?t:NaN}get ended(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.ended)&&t}get buffered(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.buffered)?t:ht}get seekable(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.seekable)?t:ht}get readyState(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.readyState)?t:0}get videoWidth(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoWidth)?t:0}get videoHeight(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoHeight)?t:0}get currentSrc(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentSrc)?t:""}get currentTime(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentTime)?t:0}set currentTime(e){this.media&&(this.media.currentTime=Number(e))}get volume(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.volume)?t:1}set volume(e){this.media&&(this.media.volume=Number(e))}get playbackRate(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.playbackRate)?t:1}set playbackRate(e){this.media&&(this.media.playbackRate=Number(e))}get defaultPlaybackRate(){var e;return null!=(e=cj(this.getAttribute(he.PLAYBACKRATE)))?e:1}set defaultPlaybackRate(e){null!=e?this.setAttribute(he.PLAYBACKRATE,`${e}`):this.removeAttribute(he.PLAYBACKRATE)}get crossOrigin(){return ha(this,c7.CROSSORIGIN)}set crossOrigin(e){this.setAttribute(c7.CROSSORIGIN,`${e}`)}get autoplay(){return null!=ha(this,c7.AUTOPLAY)}set autoplay(e){e?this.setAttribute(c7.AUTOPLAY,"string"==typeof e?e:""):this.removeAttribute(c7.AUTOPLAY)}get loop(){return null!=ha(this,c7.LOOP)}set loop(e){e?this.setAttribute(c7.LOOP,""):this.removeAttribute(c7.LOOP)}get muted(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.muted)&&t}set muted(e){this.media&&(this.media.muted=!!e)}get defaultMuted(){return null!=ha(this,c7.MUTED)}set defaultMuted(e){e?this.setAttribute(c7.MUTED,""):this.removeAttribute(c7.MUTED)}get playsInline(){return null!=ha(this,c7.PLAYSINLINE)}set playsInline(e){c8("playsInline is set to true by default and is not currently supported as a setter.")}get preload(){return this.media?this.media.preload:this.getAttribute("preload")}set preload(e){["","none","metadata","auto"].includes(e)?this.setAttribute(c7.PRELOAD,e):this.removeAttribute(c7.PRELOAD)}},hn=`:host {
  --media-control-display: var(--controls);
  --media-loading-indicator-display: var(--loading-indicator);
  --media-dialog-display: var(--dialog);
  --media-play-button-display: var(--play-button);
  --media-live-button-display: var(--live-button);
  --media-seek-backward-button-display: var(--seek-backward-button);
  --media-seek-forward-button-display: var(--seek-forward-button);
  --media-mute-button-display: var(--mute-button);
  --media-captions-button-display: var(--captions-button);
  --media-captions-menu-button-display: var(--captions-menu-button, var(--media-captions-button-display));
  --media-rendition-menu-button-display: var(--rendition-menu-button);
  --media-audio-track-menu-button-display: var(--audio-track-menu-button);
  --media-airplay-button-display: var(--airplay-button);
  --media-pip-button-display: var(--pip-button);
  --media-fullscreen-button-display: var(--fullscreen-button);
  --media-cast-button-display: var(--cast-button, var(--_cast-button-drm-display));
  --media-playback-rate-button-display: var(--playback-rate-button);
  --media-playback-rate-menu-button-display: var(--playback-rate-menu-button);
  --media-volume-range-display: var(--volume-range);
  --media-time-range-display: var(--time-range);
  --media-time-display-display: var(--time-display);
  --media-duration-display-display: var(--duration-display);
  --media-title-display-display: var(--title-display);

  display: inline-block;
  line-height: 0;
  width: 100%;
}

a {
  color: #fff;
  font-size: 0.9em;
  text-decoration: underline;
}

media-theme {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
  direction: ltr;
}

media-poster-image {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
}

media-poster-image:not([src]):not([placeholdersrc]) {
  display: none;
}

::part(top),
[part~='top'] {
  --media-control-display: var(--controls, var(--top-controls));
  --media-play-button-display: var(--play-button, var(--top-play-button));
  --media-live-button-display: var(--live-button, var(--top-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--top-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--top-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--top-mute-button));
  --media-captions-button-display: var(--captions-button, var(--top-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--top-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--top-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--top-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--top-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--top-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--top-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--top-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--top-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --captions-menu-button,
    var(--media-playback-rate-button-display, var(--top-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--top-volume-range));
  --media-time-range-display: var(--time-range, var(--top-time-range));
  --media-time-display-display: var(--time-display, var(--top-time-display));
  --media-duration-display-display: var(--duration-display, var(--top-duration-display));
  --media-title-display-display: var(--title-display, var(--top-title-display));
}

::part(center),
[part~='center'] {
  --media-control-display: var(--controls, var(--center-controls));
  --media-play-button-display: var(--play-button, var(--center-play-button));
  --media-live-button-display: var(--live-button, var(--center-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--center-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--center-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--center-mute-button));
  --media-captions-button-display: var(--captions-button, var(--center-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--center-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--center-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--center-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--center-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--center-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--center-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--center-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--center-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--center-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--center-volume-range));
  --media-time-range-display: var(--time-range, var(--center-time-range));
  --media-time-display-display: var(--time-display, var(--center-time-display));
  --media-duration-display-display: var(--duration-display, var(--center-duration-display));
}

::part(bottom),
[part~='bottom'] {
  --media-control-display: var(--controls, var(--bottom-controls));
  --media-play-button-display: var(--play-button, var(--bottom-play-button));
  --media-live-button-display: var(--live-button, var(--bottom-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--bottom-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--bottom-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--bottom-mute-button));
  --media-captions-button-display: var(--captions-button, var(--bottom-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--bottom-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--bottom-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--bottom-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--bottom-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--bottom-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--bottom-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--bottom-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--bottom-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--bottom-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--bottom-volume-range));
  --media-time-range-display: var(--time-range, var(--bottom-time-range));
  --media-time-display-display: var(--time-display, var(--bottom-time-display));
  --media-duration-display-display: var(--duration-display, var(--bottom-duration-display));
  --media-title-display-display: var(--title-display, var(--bottom-title-display));
}

:host([no-tooltips]) {
  --media-tooltip-display: none;
}
`,hs=new WeakMap,ho=class e{constructor(e,t){this.element=e,this.type=t,this.element.addEventListener(this.type,this);let i=hs.get(this.element);i&&i.set(this.type,this)}set(e){if("function"==typeof e)this.handleEvent=e.bind(this.element);else if("object"==typeof e&&"function"==typeof e.handleEvent)this.handleEvent=e.handleEvent.bind(e);else{this.element.removeEventListener(this.type,this);let e=hs.get(this.element);e&&e.delete(this.type)}}static for(t){hs.has(t.element)||hs.set(t.element,new Map);let i=t.attributeName.slice(2),a=hs.get(t.element);return a&&a.has(i)?a.get(i):new e(t.element,i)}},hl=new Map,hd=new WeakMap,hu=new WeakMap,hc=class{constructor(e,t,i){this.strings=e,this.values=t,this.processor=i,this.stringsKey=this.strings.join("\x01")}get template(){if(hl.has(this.stringsKey))return hl.get(this.stringsKey);{let e=cK.createElement("template"),t=this.strings.length-1;return e.innerHTML=this.strings.reduce((e,i,a)=>e+i+(a<t?`{{ ${a} }}`:""),""),hl.set(this.stringsKey,e),e}}renderInto(e){var t;let i=this.template;if(hd.get(e)!==i){hd.set(e,i);let t=new sw(i,this.values,this.processor);hu.set(e,t),e instanceof sD?e.replace(...t.children):e.appendChild(t);return}let a=hu.get(e);null==(t=null==a?void 0:a.update)||t.call(a,this.values)}},hh={processCallback(e,t,i){var a;if(i)for(let[e,r]of t)e in i&&function(e,t){(function(e,t){if(e instanceof sL&&t instanceof Element){let i=e.element;return i[e.attributeName]!==t&&(e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),i[e.attributeName]=t),!0}return!1})(e,t)||function(e,t){if("boolean"==typeof t&&e instanceof sL){let i=e.attributeNamespace;return t!==e.element.hasAttributeNS(i,e.attributeName)&&(e.booleanValue=t),!0}return!1}(e,t)||e instanceof sL&&e.attributeName.startsWith("on")&&(ho.for(e).set(t),e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),1)||!1===t&&e instanceof sD&&(e.replace(""),1)||t instanceof hc&&e instanceof sD&&(t.renderInto(e),1)||t instanceof DocumentFragment&&e instanceof sD&&(t.childNodes.length&&e.replace(...t.childNodes),1)||function(e,t){if(e instanceof sL){let i=e.attributeNamespace,a=e.element.getAttributeNS(i,e.attributeName);return String(t)!==a&&(e.value=String(t))}e.value=String(t)}(e,t)}(r,null!=(a=i[e])?a:"")}};function hm(e,...t){return new hc(e,t,hh)}var hp=Object.values({TOP:"top",CENTER:"center",BOTTOM:"bottom",LAYER:"layer",MEDIA_LAYER:"media-layer",POSTER_LAYER:"poster-layer",VERTICAL_LAYER:"vertical-layer",CENTERED_LAYER:"centered-layer",GESTURE_LAYER:"gesture-layer",CONTROLLER_LAYER:"controller",BUTTON:"button",RANGE:"range",DISPLAY:"display",CONTROL_BAR:"control-bar",MENU_BUTTON:"menu-button",MENU:"menu",OPTION:"option",POSTER:"poster",LIVE:"live",PLAY:"play",PRE_PLAY:"pre-play",SEEK_BACKWARD:"seek-backward",SEEK_FORWARD:"seek-forward",MUTE:"mute",CAPTIONS:"captions",AIRPLAY:"airplay",PIP:"pip",FULLSCREEN:"fullscreen",CAST:"cast",PLAYBACK_RATE:"playback-rate",VOLUME:"volume",TIME:"time",TITLE:"title",AUDIO_TRACK:"audio-track",RENDITION:"rendition"}).join(", "),hv=e=>e.charAt(0).toUpperCase()+e.slice(1),hb=(e,t)=>{let i=(e=>{if(e.muxCode){if(2403210===e.muxCode)return"403-expired-token.md";if(2412202===e.muxCode)return"403-malformatted-token.md";if([2403222,2403221].includes(e.muxCode))return"403-incorrect-aud-value.md";if(2403232===e.muxCode)return"403-playback-id-mismatch.md";if(2403201===e.muxCode)return"missing-signed-tokens.md";if(2404e3===e.muxCode)return"404-not-found.md";if(2412e3===e.muxCode)return"412-not-playable.md"}if(e.code){if(e.code===u.MEDIA_ERR_NETWORK)return"";if(e.code===u.MEDIA_ERR_DECODE)return"media-decode-error.md";if(e.code===u.MEDIA_ERR_SRC_NOT_SUPPORTED)return"media-src-not-supported.md"}return""})(e);return{message:e.message,context:e.context,file:i}},hg=`<template id="media-theme-gerwig">
  <style>
    @keyframes pre-play-hide {
      0% {
        transform: scale(1);
        opacity: 1;
      }

      30% {
        transform: scale(0.7);
      }

      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    :host {
      --_primary-color: var(--media-primary-color, #fff);
      --_secondary-color: var(--media-secondary-color, transparent);
      --_accent-color: var(--media-accent-color, #fa50b5);
      --_text-color: var(--media-text-color, #000);

      --media-icon-color: var(--_primary-color);
      --media-control-background: var(--_secondary-color);
      --media-control-hover-background: var(--_accent-color);
      --media-time-buffered-color: rgba(255, 255, 255, 0.4);
      --media-preview-time-text-shadow: none;
      --media-control-height: 14px;
      --media-control-padding: 6px;
      --media-tooltip-container-margin: 6px;
      --media-tooltip-distance: 18px;

      color: var(--_primary-color);
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    :host([audio]) {
      --_secondary-color: var(--media-secondary-color, black);
      --media-preview-time-text-shadow: none;
    }

    :host([audio]) ::slotted([slot='media']) {
      height: 0px;
    }

    :host([audio]) media-loading-indicator {
      display: none;
    }

    :host([audio]) media-controller {
      background: transparent;
    }

    :host([audio]) media-controller::part(vertical-layer) {
      background: transparent;
    }

    :host([audio]) media-control-bar {
      width: 100%;
      background-color: var(--media-control-background);
    }

    /*
     * 0.433s is the transition duration for VTT Regions.
     * Borrowed here, so the captions don't move too fast.
     */
    media-controller {
      --media-webkit-text-track-transform: translateY(0) scale(0.98);
      --media-webkit-text-track-transition: transform 0.433s ease-out 0.3s;
    }
    media-controller:is([mediapaused], :not([userinactive])) {
      --media-webkit-text-track-transform: translateY(-50px) scale(0.98);
      --media-webkit-text-track-transition: transform 0.15s ease;
    }

    /*
     * CSS specific to iOS devices.
     * See: https://stackoverflow.com/questions/30102792/css-media-query-to-target-only-ios-devices/60220757#60220757
     */
    @supports (-webkit-touch-callout: none) {
      /* Disable subtitle adjusting for iOS Safari */
      media-controller[mediaisfullscreen] {
        --media-webkit-text-track-transform: unset;
        --media-webkit-text-track-transition: unset;
      }
    }

    media-time-range {
      --media-box-padding-left: 6px;
      --media-box-padding-right: 6px;
      --media-range-bar-color: var(--_accent-color);
      --media-time-range-buffered-color: var(--_primary-color);
      --media-range-track-color: transparent;
      --media-range-track-background: rgba(255, 255, 255, 0.4);
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_accent-color) 25%,
        var(--_accent-color)
      );
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-transform: scale(0);
      --media-range-thumb-transition: transform 0.3s;
      --media-range-thumb-opacity: 1;
      --media-preview-background: var(--_primary-color);
      --media-box-arrow-background: var(--_primary-color);
      --media-preview-thumbnail-border: 5px solid var(--_primary-color);
      --media-preview-border-radius: 5px;
      --media-text-color: var(--_text-color);
      --media-control-hover-background: transparent;
      --media-preview-chapter-text-shadow: none;
      color: var(--_accent-color);
      padding: 0 6px;
    }

    :host([audio]) media-time-range {
      --media-preview-time-padding: 1.5px 6px;
      --media-preview-box-margin: 0 0 -5px;
    }

    media-time-range:hover {
      --media-range-thumb-transform: scale(1);
    }

    media-preview-thumbnail {
      border-bottom-width: 0;
    }

    [part~='menu'] {
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      bottom: 50px;
      padding: 2.5px 10px;
    }

    [part~='menu']::part(indicator) {
      fill: var(--_accent-color);
    }

    [part~='menu']::part(menu-item) {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 6px 10px;
      min-height: 34px;
    }

    [part~='menu']::part(checked) {
      font-weight: 700;
    }

    media-captions-menu,
    media-rendition-menu,
    media-audio-track-menu,
    media-playback-rate-menu {
      position: absolute; /* ensure they don't take up space in DOM on load */
      --media-menu-background: var(--_primary-color);
      --media-menu-item-checked-background: transparent;
      --media-text-color: var(--_text-color);
      --media-menu-item-hover-background: transparent;
      --media-menu-item-hover-outline: var(--_accent-color) solid 1px;
    }

    media-rendition-menu {
      min-width: 140px;
    }

    /* The icon is a circle so make it 16px high instead of 14px for more balance. */
    media-audio-track-menu-button {
      --media-control-padding: 5px;
      --media-control-height: 16px;
    }

    media-playback-rate-menu-button {
      --media-control-padding: 6px 3px;
      min-width: 4.4ch;
    }

    media-playback-rate-menu {
      --media-menu-flex-direction: row;
      --media-menu-item-checked-background: var(--_accent-color);
      --media-menu-item-checked-indicator-display: none;
      margin-right: 6px;
      padding: 0;
      --media-menu-gap: 0.25em;
    }

    media-playback-rate-menu[part~='menu']::part(menu-item) {
      padding: 6px 6px 6px 8px;
    }

    media-playback-rate-menu[part~='menu']::part(checked) {
      color: #fff;
    }

    :host(:not([audio])) media-time-range {
      /* Adding px is required here for calc() */
      --media-range-padding: 0px;
      background: transparent;
      z-index: 10;
      height: 10px;
      bottom: -3px;
      width: 100%;
    }

    media-control-bar :is([role='button'], [role='switch'], button) {
      line-height: 0;
    }

    media-control-bar :is([part*='button'], [part*='range'], [part*='display']) {
      border-radius: 3px;
    }

    .spacer {
      flex-grow: 1;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    media-control-bar[slot~='top-chrome'] {
      min-height: 42px;
      pointer-events: none;
    }

    media-control-bar {
      --gradient-steps:
        hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%, hsl(0 0% 0% / 0.104) 22.5%,
        hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%, hsl(0 0% 0% / 0.45) 47.1%,
        hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%, hsl(0 0% 0% / 0.825) 71%,
        hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%, hsl(0 0% 0%) 100%;
    }

    :host([title]:not([audio])) media-control-bar[slot='top-chrome']::before {
      content: '';
      position: absolute;
      width: 100%;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to top, var(--gradient-steps));
      opacity: 0.8;
      pointer-events: none;
    }

    :host(:not([audio])) media-control-bar[part~='bottom']::before {
      content: '';
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to bottom, var(--gradient-steps));
      opacity: 0.8;
      z-index: 1;
      pointer-events: none;
    }

    media-control-bar[part~='bottom'] > * {
      z-index: 20;
    }

    media-control-bar[part~='bottom'] {
      padding: 6px 6px;
    }

    media-control-bar[slot~='top-chrome'] > * {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      position: relative;
    }

    media-controller::part(vertical-layer) {
      transition: background-color 1s;
    }

    media-controller:is([mediapaused], :not([userinactive]))::part(vertical-layer) {
      background-color: var(--controls-backdrop-color, var(--controls, transparent));
      transition: background-color 0.25s;
    }

    .center-controls {
      --media-button-icon-width: 100%;
      --media-button-icon-height: auto;
      --media-tooltip-display: none;
      pointer-events: none;
      width: 100%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
      paint-order: stroke;
      stroke: rgba(102, 102, 102, 1);
      stroke-width: 0.3px;
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    .center-controls media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      --media-control-padding: 0;
      width: 40px;
    }

    [breakpointsm] .center-controls media-play-button {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      transition: background 0.4s;
      padding: 24px;
      --media-control-background: #000;
      --media-control-hover-background: var(--_accent-color);
    }

    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      margin: 0 20px;
      width: max(33px, min(8%, 40px));
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback {
      display: grid;
      align-items: initial;
      justify-content: initial;
      height: 100%;
      overflow: hidden;
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback media-play-button {
      place-self: var(--_pre-playback-place, center);
      grid-area: 1 / 1;
      margin: 16px;
    }

    /* Show and hide controls or pre-playback state */

    [breakpointsm]:is([mediahasplayed], :not([mediapaused])):not([audio])
      .center-controls.pre-playback
      media-play-button {
      /* Using \`forwards\` would lead to a laggy UI after the animation got in the end state */
      animation: 0.3s linear pre-play-hide;
      opacity: 0;
      pointer-events: none;
    }

    .autoplay-unmute {
      --media-control-hover-background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    .autoplay-unmute-btn {
      --media-control-height: 16px;
      border-radius: 8px;
      background: #000;
      color: var(--_primary-color);
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
    }

    .autoplay-unmute-btn:hover {
      background: var(--_accent-color);
    }

    [breakpointsm] .autoplay-unmute-btn {
      --media-control-height: 30px;
      padding: 14px 24px;
      font-size: 26px;
    }

    .autoplay-unmute-btn svg {
      margin: 0 6px 0 0;
    }

    [breakpointsm] .autoplay-unmute-btn svg {
      margin: 0 10px 0 0;
    }

    media-controller:not([audio]):not([mediahasplayed]) *:is(media-control-bar, media-time-range) {
      display: none;
    }

    media-error-dialog:not([mediaerrorcode]) {
      opacity: 0;
    }

    media-loading-indicator {
      --media-loading-icon-width: 100%;
      --media-button-icon-height: auto;
      display: var(--media-control-display, var(--media-loading-indicator-display, flex));
      pointer-events: none;
      position: absolute;
      width: min(15%, 150px);
      flex-flow: row;
      align-items: center;
      justify-content: center;
    }

    /* Intentionally don't target the div for transition but the children
     of the div. Prevents messing with media-chrome's autohide feature. */
    media-loading-indicator + div * {
      transition: opacity 0.15s;
      opacity: 1;
    }

    media-loading-indicator[medialoading]:not([mediapaused]) ~ div > * {
      opacity: 0;
      transition-delay: 400ms;
    }

    media-volume-range {
      width: min(100%, 100px);
      --media-range-padding-left: 10px;
      --media-range-padding-right: 10px;
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_primary-color) 25%,
        var(--_primary-color)
      );
      --media-control-hover-background: none;
    }

    media-time-display {
      white-space: nowrap;
    }

    /* Generic style for explicitly disabled controls */
    media-control-bar[part~='bottom'] [disabled],
    media-control-bar[part~='bottom'] [aria-disabled='true'] {
      opacity: 60%;
      cursor: not-allowed;
    }

    media-text-display {
      --media-font-size: 16px;
      --media-control-padding: 14px;
      font-weight: 500;
    }

    media-play-button.animated *:is(g, path) {
      transition: all 0.3s;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt1 {
      opacity: 0;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt2 {
      transform-origin: center center;
      transform: scaleY(0);
    }

    media-play-button.animated[mediapaused] .play-icon {
      clip-path: inset(0 0 0 0);
    }

    media-play-button.animated:not([mediapaused]) .play-icon {
      clip-path: inset(0 0 0 100%);
    }

    media-seek-forward-button,
    media-seek-backward-button {
      --media-font-weight: 400;
    }

    .mute-icon {
      display: inline-block;
    }

    .mute-icon :is(path, g) {
      transition: opacity 0.5s;
    }

    .muted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='low'] :is(.volume-medium, .volume-high),
    media-mute-button[mediavolumelevel='medium'] :is(.volume-high) {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .unmuted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .muted {
      opacity: 1;
    }

    /**
     * Our defaults for these buttons are to hide them at small sizes
     * users can override this with CSS
     */
    media-controller:not([breakpointsm]):not([audio]) {
      --bottom-play-button: none;
      --bottom-seek-backward-button: none;
      --bottom-seek-forward-button: none;
      --bottom-time-display: none;
      --bottom-playback-rate-menu-button: none;
      --bottom-pip-button: none;
    }

    [part='mux-badge'] {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 2;
      opacity: 0.6;
      transition:
        opacity 0.2s ease-in-out,
        bottom 0.2s ease-in-out;
    }

    [part='mux-badge']:hover {
      opacity: 1;
    }

    [part='mux-badge'] a {
      font-size: 14px;
      font-family: var(--_font-family);
      color: var(--_primary-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    [part='mux-badge'] .mux-badge-text {
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    }

    [part='mux-badge'] .mux-badge-logo {
      width: 40px;
      height: auto;
      display: inline-block;
    }

    [part='mux-badge'] .mux-badge-logo svg {
      width: 100%;
      height: 100%;
      fill: white;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'],
    media-controller:not([userinactive]) [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      transition: bottom 0.1s ease-in-out;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      transition: bottom 0.2s ease-in-out 0.62s;
    }

    media-controller:not([userinactive]) [part='mux-badge'] .mux-badge-text,
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] .mux-badge-text {
      opacity: 1;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] .mux-badge-text {
      opacity: 0;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive])[mediahasplayed] [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      bottom: calc(28px + var(--media-control-height, 0px) + var(--media-control-padding, 0px) * 2);
    }
  </style>

  <template partial="TitleDisplay">
    <template if="videotitle">
      <template if="videotitle != true">
        <media-text-display part="top title display" class="title-display">{{videotitle}}</media-text-display>
      </template>
    </template>
    <template if="!videotitle">
      <template if="title">
        <media-text-display part="top title display" class="title-display">{{title}}</media-text-display>
      </template>
    </template>
  </template>

  <template partial="PlayButton">
    <media-play-button
      part="{{section ?? 'bottom'}} play button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      class="animated"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon">
        <g class="play-icon">
          <path
            d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
          />
        </g>
        <g class="pause-icon">
          <path
            class="pause-icon-pt1"
            d="M5.90709 0H2.96889C2.46857 0 2.06299 0.405585 2.06299 0.9059V13.0941C2.06299 13.5944 2.46857 14 2.96889 14H5.90709C6.4074 14 6.81299 13.5944 6.81299 13.0941V0.9059C6.81299 0.405585 6.4074 0 5.90709 0Z"
          />
          <path
            class="pause-icon-pt2"
            d="M15.1571 0H12.2189C11.7186 0 11.313 0.405585 11.313 0.9059V13.0941C11.313 13.5944 11.7186 14 12.2189 14H15.1571C15.6574 14 16.063 13.5944 16.063 13.0941V0.9059C16.063 0.405585 15.6574 0 15.1571 0Z"
          />
        </g>
      </svg>
    </media-play-button>
  </template>

  <template partial="PrePlayButton">
    <media-play-button
      part="{{section ?? 'center'}} play button pre-play"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon" style="transform: translate(3px, 0)">
        <path
          d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
        />
      </svg>
    </media-play-button>
  </template>

  <template partial="SeekBackwardButton">
    <media-seek-backward-button
      seekoffset="{{backwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-backward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <path
          d="M3.65 2.07888L0.0864 6.7279C-0.0288 6.87812 -0.0288 7.12188 0.0864 7.2721L3.65 11.9211C3.7792 12.0896 4 11.9703 4 11.7321V2.26787C4 2.02968 3.7792 1.9104 3.65 2.07888Z"
        />
        <text transform="translate(6 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
          {{backwardseekoffset}}
        </text>
      </svg>
    </media-seek-backward-button>
  </template>

  <template partial="SeekForwardButton">
    <media-seek-forward-button
      seekoffset="{{forwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-forward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <g>
          <text transform="translate(-1 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
            {{forwardseekoffset}}
          </text>
          <path
            d="M18.35 11.9211L21.9136 7.2721C22.0288 7.12188 22.0288 6.87812 21.9136 6.7279L18.35 2.07888C18.2208 1.91041 18 2.02968 18 2.26787V11.7321C18 11.9703 18.2208 12.0896 18.35 11.9211Z"
          />
        </g>
      </svg>
    </media-seek-forward-button>
  </template>

  <template partial="MuteButton">
    <media-mute-button part="bottom mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" slot="icon" class="mute-icon" aria-hidden="true">
        <g class="unmuted">
          <path
            d="M6.76786 1.21233L3.98606 3.98924H1.19937C0.593146 3.98924 0.101743 4.51375 0.101743 5.1607V6.96412L0 6.99998L0.101743 7.03583V8.83926C0.101743 9.48633 0.593146 10.0108 1.19937 10.0108H3.98606L6.76773 12.7877C7.23561 13.2547 8 12.9007 8 12.2171V1.78301C8 1.09925 7.23574 0.745258 6.76786 1.21233Z"
          />
          <path
            class="volume-low"
            d="M10 3.54781C10.7452 4.55141 11.1393 5.74511 11.1393 6.99991C11.1393 8.25471 10.7453 9.44791 10 10.4515L10.7988 11.0496C11.6734 9.87201 12.1356 8.47161 12.1356 6.99991C12.1356 5.52821 11.6735 4.12731 10.7988 2.94971L10 3.54781Z"
          />
          <path
            class="volume-medium"
            d="M12.3778 2.40086C13.2709 3.76756 13.7428 5.35806 13.7428 7.00026C13.7428 8.64246 13.2709 10.233 12.3778 11.5992L13.2106 12.1484C14.2107 10.6185 14.739 8.83796 14.739 7.00016C14.739 5.16236 14.2107 3.38236 13.2106 1.85156L12.3778 2.40086Z"
          />
          <path
            class="volume-high"
            d="M15.5981 0.75L14.7478 1.2719C15.7937 2.9919 16.3468 4.9723 16.3468 7C16.3468 9.0277 15.7937 11.0082 14.7478 12.7281L15.5981 13.25C16.7398 11.3722 17.343 9.211 17.343 7C17.343 4.789 16.7398 2.6268 15.5981 0.75Z"
          />
        </g>
        <g class="muted">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.39976 4.98924H1.19937C1.19429 4.98924 1.17777 4.98961 1.15296 5.01609C1.1271 5.04369 1.10174 5.09245 1.10174 5.1607V8.83926C1.10174 8.90761 1.12714 8.95641 1.15299 8.984C1.17779 9.01047 1.1943 9.01084 1.19937 9.01084H4.39977L7 11.6066V2.39357L4.39976 4.98924ZM7.47434 1.92006C7.4743 1.9201 7.47439 1.92002 7.47434 1.92006V1.92006ZM6.76773 12.7877L3.98606 10.0108H1.19937C0.593146 10.0108 0.101743 9.48633 0.101743 8.83926V7.03583L0 6.99998L0.101743 6.96412V5.1607C0.101743 4.51375 0.593146 3.98924 1.19937 3.98924H3.98606L6.76786 1.21233C7.23574 0.745258 8 1.09925 8 1.78301V12.2171C8 12.9007 7.23561 13.2547 6.76773 12.7877Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.2677 9.30323C15.463 9.49849 15.7796 9.49849 15.9749 9.30323C16.1701 9.10796 16.1701 8.79138 15.9749 8.59612L14.2071 6.82841L15.9749 5.06066C16.1702 4.8654 16.1702 4.54882 15.9749 4.35355C15.7796 4.15829 15.4631 4.15829 15.2678 4.35355L13.5 6.1213L11.7322 4.35348C11.537 4.15822 11.2204 4.15822 11.0251 4.35348C10.8298 4.54874 10.8298 4.86532 11.0251 5.06058L12.7929 6.82841L11.0251 8.59619C10.8299 8.79146 10.8299 9.10804 11.0251 9.3033C11.2204 9.49856 11.537 9.49856 11.7323 9.3033L13.5 7.53552L15.2677 9.30323Z"
          />
        </g>
      </svg>
    </media-mute-button>
  </template>

  <template partial="PipButton">
    <media-pip-button part="bottom pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M15.9891 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.989C0 13.0996 0.9004 14 2.011 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0ZM17 11.9891C17 12.5465 16.5465 13 15.9891 13H2.011C1.4536 13 1.0001 12.5465 1.0001 11.9891V2.0109C1.0001 1.4535 1.4536 0.9999 2.011 0.9999H15.9891C16.5465 0.9999 17 1.4535 17 2.0109V11.9891Z"
        />
        <path
          d="M15.356 5.67822H8.19523C8.03253 5.67822 7.90063 5.81012 7.90063 5.97282V11.3836C7.90063 11.5463 8.03253 11.6782 8.19523 11.6782H15.356C15.5187 11.6782 15.6506 11.5463 15.6506 11.3836V5.97282C15.6506 5.81012 15.5187 5.67822 15.356 5.67822Z"
        />
      </svg>
    </media-pip-button>
  </template>

  <template partial="CaptionsMenu">
    <media-captions-menu-button part="bottom captions button">
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="on">
        <path
          d="M15.989 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9004 14 2.011 14H15.989C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.989 0ZM4.2292 8.7639C4.5954 9.1902 5.0935 9.4031 5.7233 9.4031C6.1852 9.4031 6.5544 9.301 6.8302 9.0969C7.1061 8.8933 7.2863 8.614 7.3702 8.26H8.4322C8.3062 8.884 8.0093 9.3733 7.5411 9.7273C7.0733 10.0813 6.4703 10.2581 5.732 10.2581C5.108 10.2581 4.5699 10.1219 4.1168 9.8489C3.6637 9.5759 3.3141 9.1946 3.0685 8.7058C2.8224 8.2165 2.6994 7.6511 2.6994 7.009C2.6994 6.3611 2.8224 5.7927 3.0685 5.3034C3.3141 4.8146 3.6637 4.4323 4.1168 4.1559C4.5699 3.88 5.108 3.7418 5.732 3.7418C6.4703 3.7418 7.0733 3.922 7.5411 4.2818C8.0094 4.6422 8.3062 5.1461 8.4322 5.794H7.3702C7.2862 5.4283 7.106 5.1368 6.8302 4.921C6.5544 4.7052 6.1852 4.5968 5.7233 4.5968C5.0934 4.5968 4.5954 4.8116 4.2292 5.2404C3.8635 5.6696 3.6804 6.259 3.6804 7.009C3.6804 7.7531 3.8635 8.3381 4.2292 8.7639ZM11.0974 8.7639C11.4636 9.1902 11.9617 9.4031 12.5915 9.4031C13.0534 9.4031 13.4226 9.301 13.6984 9.0969C13.9743 8.8933 14.1545 8.614 14.2384 8.26H15.3004C15.1744 8.884 14.8775 9.3733 14.4093 9.7273C13.9415 10.0813 13.3385 10.2581 12.6002 10.2581C11.9762 10.2581 11.4381 10.1219 10.985 9.8489C10.5319 9.5759 10.1823 9.1946 9.9367 8.7058C9.6906 8.2165 9.5676 7.6511 9.5676 7.009C9.5676 6.3611 9.6906 5.7927 9.9367 5.3034C10.1823 4.8146 10.5319 4.4323 10.985 4.1559C11.4381 3.88 11.9762 3.7418 12.6002 3.7418C13.3385 3.7418 13.9415 3.922 14.4093 4.2818C14.8776 4.6422 15.1744 5.1461 15.3004 5.794H14.2384C14.1544 5.4283 13.9742 5.1368 13.6984 4.921C13.4226 4.7052 13.0534 4.5968 12.5915 4.5968C11.9616 4.5968 11.4636 4.8116 11.0974 5.2404C10.7317 5.6696 10.5486 6.259 10.5486 7.009C10.5486 7.7531 10.7317 8.3381 11.0974 8.7639Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="off">
        <path
          d="M5.73219 10.258C5.10819 10.258 4.57009 10.1218 4.11699 9.8488C3.66389 9.5758 3.31429 9.1945 3.06869 8.7057C2.82259 8.2164 2.69958 7.651 2.69958 7.0089C2.69958 6.361 2.82259 5.7926 3.06869 5.3033C3.31429 4.8145 3.66389 4.4322 4.11699 4.1558C4.57009 3.8799 5.10819 3.7417 5.73219 3.7417C6.47049 3.7417 7.07348 3.9219 7.54128 4.2817C8.00958 4.6421 8.30638 5.146 8.43238 5.7939H7.37039C7.28639 5.4282 7.10618 5.1367 6.83039 4.9209C6.55459 4.7051 6.18538 4.5967 5.72348 4.5967C5.09358 4.5967 4.59559 4.8115 4.22939 5.2403C3.86369 5.6695 3.68058 6.2589 3.68058 7.0089C3.68058 7.753 3.86369 8.338 4.22939 8.7638C4.59559 9.1901 5.09368 9.403 5.72348 9.403C6.18538 9.403 6.55459 9.3009 6.83039 9.0968C7.10629 8.8932 7.28649 8.6139 7.37039 8.2599H8.43238C8.30638 8.8839 8.00948 9.3732 7.54128 9.7272C7.07348 10.0812 6.47049 10.258 5.73219 10.258Z"
        />
        <path
          d="M12.6003 10.258C11.9763 10.258 11.4382 10.1218 10.9851 9.8488C10.532 9.5758 10.1824 9.1945 9.93685 8.7057C9.69075 8.2164 9.56775 7.651 9.56775 7.0089C9.56775 6.361 9.69075 5.7926 9.93685 5.3033C10.1824 4.8145 10.532 4.4322 10.9851 4.1558C11.4382 3.8799 11.9763 3.7417 12.6003 3.7417C13.3386 3.7417 13.9416 3.9219 14.4094 4.2817C14.8777 4.6421 15.1745 5.146 15.3005 5.7939H14.2385C14.1545 5.4282 13.9743 5.1367 13.6985 4.9209C13.4227 4.7051 13.0535 4.5967 12.5916 4.5967C11.9617 4.5967 11.4637 4.8115 11.0975 5.2403C10.7318 5.6695 10.5487 6.2589 10.5487 7.0089C10.5487 7.753 10.7318 8.338 11.0975 8.7638C11.4637 9.1901 11.9618 9.403 12.5916 9.403C13.0535 9.403 13.4227 9.3009 13.6985 9.0968C13.9744 8.8932 14.1546 8.6139 14.2385 8.2599H15.3005C15.1745 8.8839 14.8776 9.3732 14.4094 9.7272C13.9416 10.0812 13.3386 10.258 12.6003 10.258Z"
        />
        <path
          d="M15.9891 1C16.5465 1 17 1.4535 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H2.0109C1.4535 13 1 12.5465 1 11.9891V2.0109C1 1.4535 1.4535 0.9999 2.0109 0.9999L15.9891 1ZM15.9891 0H2.0109C0.9003 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9003 14 2.0109 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0Z"
        />
      </svg>
    </media-captions-menu-button>
    <media-captions-menu
      hidden
      anchor="auto"
      part="bottom captions menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg></div
    ></media-captions-menu>
  </template>

  <template partial="AirplayButton">
    <media-airplay-button part="bottom airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M16.1383 0H1.8618C0.8335 0 0 0.8335 0 1.8617V10.1382C0 11.1664 0.8335 12 1.8618 12H3.076C3.1204 11.9433 3.1503 11.8785 3.2012 11.826L4.004 11H1.8618C1.3866 11 1 10.6134 1 10.1382V1.8617C1 1.3865 1.3866 0.9999 1.8618 0.9999H16.1383C16.6135 0.9999 17.0001 1.3865 17.0001 1.8617V10.1382C17.0001 10.6134 16.6135 11 16.1383 11H13.9961L14.7989 11.826C14.8499 11.8785 14.8798 11.9432 14.9241 12H16.1383C17.1665 12 18.0001 11.1664 18.0001 10.1382V1.8617C18 0.8335 17.1665 0 16.1383 0Z"
        />
        <path
          d="M9.55061 8.21903C9.39981 8.06383 9.20001 7.98633 9.00011 7.98633C8.80021 7.98633 8.60031 8.06383 8.44951 8.21903L4.09771 12.697C3.62471 13.1838 3.96961 13.9998 4.64831 13.9998H13.3518C14.0304 13.9998 14.3754 13.1838 13.9023 12.697L9.55061 8.21903Z"
        />
      </svg>
    </media-airplay-button>
  </template>

  <template partial="FullscreenButton">
    <media-fullscreen-button part="bottom fullscreen button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M1.00745 4.39539L1.01445 1.98789C1.01605 1.43049 1.47085 0.978289 2.02835 0.979989L6.39375 0.992589L6.39665 -0.007411L2.03125 -0.020011C0.920646 -0.023211 0.0176463 0.874489 0.0144463 1.98509L0.00744629 4.39539H1.00745Z"
        />
        <path
          d="M17.0144 2.03431L17.0076 4.39541H18.0076L18.0144 2.03721C18.0176 0.926712 17.1199 0.0237125 16.0093 0.0205125L11.6439 0.0078125L11.641 1.00781L16.0064 1.02041C16.5638 1.02201 17.016 1.47681 17.0144 2.03431Z"
        />
        <path
          d="M16.9925 9.60498L16.9855 12.0124C16.9839 12.5698 16.5291 13.022 15.9717 13.0204L11.6063 13.0078L11.6034 14.0078L15.9688 14.0204C17.0794 14.0236 17.9823 13.1259 17.9855 12.0153L17.9925 9.60498H16.9925Z"
        />
        <path
          d="M0.985626 11.9661L0.992426 9.60498H-0.0074737L-0.0142737 11.9632C-0.0174737 13.0738 0.880226 13.9767 1.99083 13.98L6.35623 13.9926L6.35913 12.9926L1.99373 12.98C1.43633 12.9784 0.983926 12.5236 0.985626 11.9661Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M5.39655 -0.0200195L5.38955 2.38748C5.38795 2.94488 4.93315 3.39708 4.37565 3.39538L0.0103463 3.38278L0.00744629 4.38278L4.37285 4.39538C5.48345 4.39858 6.38635 3.50088 6.38965 2.39028L6.39665 -0.0200195H5.39655Z"
        />
        <path
          d="M12.6411 2.36891L12.6479 0.0078125H11.6479L11.6411 2.36601C11.6379 3.47651 12.5356 4.37951 13.6462 4.38271L18.0116 4.39531L18.0145 3.39531L13.6491 3.38271C13.0917 3.38111 12.6395 2.92641 12.6411 2.36891Z"
        />
        <path
          d="M12.6034 14.0204L12.6104 11.613C12.612 11.0556 13.0668 10.6034 13.6242 10.605L17.9896 10.6176L17.9925 9.61759L13.6271 9.60499C12.5165 9.60179 11.6136 10.4995 11.6104 11.6101L11.6034 14.0204H12.6034Z"
        />
        <path
          d="M5.359 11.6315L5.3522 13.9926H6.3522L6.359 11.6344C6.3622 10.5238 5.4645 9.62088 4.3539 9.61758L-0.0115043 9.60498L-0.0144043 10.605L4.351 10.6176C4.9084 10.6192 5.3607 11.074 5.359 11.6315Z"
        />
      </svg>
    </media-fullscreen-button>
  </template>

  <template partial="CastButton">
    <media-cast-button part="bottom cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M16.0072 0H2.0291C0.9185 0 0.0181 0.9003 0.0181 2.011V5.5009C0.357 5.5016 0.6895 5.5275 1.0181 5.5669V2.011C1.0181 1.4536 1.4716 1 2.029 1H16.0072C16.5646 1 17.0181 1.4536 17.0181 2.011V11.9891C17.0181 12.5465 16.5646 13 16.0072 13H8.4358C8.4746 13.3286 8.4999 13.6611 8.4999 13.9999H16.0071C17.1177 13.9999 18.018 13.0996 18.018 11.989V2.011C18.0181 0.9003 17.1178 0 16.0072 0ZM0 6.4999V7.4999C3.584 7.4999 6.5 10.4159 6.5 13.9999H7.5C7.5 9.8642 4.1357 6.4999 0 6.4999ZM0 8.7499V9.7499C2.3433 9.7499 4.25 11.6566 4.25 13.9999H5.25C5.25 11.1049 2.895 8.7499 0 8.7499ZM0.0181 11V14H3.0181C3.0181 12.3431 1.675 11 0.0181 11Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M15.9891 0H2.01103C0.900434 0 3.35947e-05 0.9003 3.35947e-05 2.011V5.5009C0.338934 5.5016 0.671434 5.5275 1.00003 5.5669V2.011C1.00003 1.4536 1.45353 1 2.01093 1H15.9891C16.5465 1 17 1.4536 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H8.41773C8.45653 13.3286 8.48183 13.6611 8.48183 13.9999H15.989C17.0996 13.9999 17.9999 13.0996 17.9999 11.989V2.011C18 0.9003 17.0997 0 15.9891 0ZM-0.0180664 6.4999V7.4999C3.56593 7.4999 6.48193 10.4159 6.48193 13.9999H7.48193C7.48193 9.8642 4.11763 6.4999 -0.0180664 6.4999ZM-0.0180664 8.7499V9.7499C2.32523 9.7499 4.23193 11.6566 4.23193 13.9999H5.23193C5.23193 11.1049 2.87693 8.7499 -0.0180664 8.7499ZM3.35947e-05 11V14H3.00003C3.00003 12.3431 1.65693 11 3.35947e-05 11Z"
        />
        <path d="M2.15002 5.634C5.18352 6.4207 7.57252 8.8151 8.35282 11.8499H15.8501V2.1499H2.15002V5.634Z" />
      </svg>
    </media-cast-button>
  </template>

  <template partial="LiveButton">
    <media-live-button part="{{section ?? 'top'}} live button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <span slot="text">Live</span>
    </media-live-button>
  </template>

  <template partial="PlaybackRateMenu">
    <media-playback-rate-menu-button part="bottom playback-rate button"></media-playback-rate-menu-button>
    <media-playback-rate-menu
      hidden
      anchor="auto"
      rates="{{playbackrates}}"
      exportparts="menu-item"
      part="bottom playback-rate menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-playback-rate-menu>
  </template>

  <template partial="VolumeRange">
    <media-volume-range
      part="bottom volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </template>

  <template partial="TimeDisplay">
    <media-time-display
      remaining="{{defaultshowremainingtime}}"
      showduration="{{!hideduration}}"
      part="bottom time display"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-display>
  </template>

  <template partial="TimeRange">
    <media-time-range part="bottom time range" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
      <media-preview-time-display slot="preview"></media-preview-time-display>
      <div slot="preview" part="arrow"></div>
    </media-time-range>
  </template>

  <template partial="AudioTrackMenu">
    <media-audio-track-menu-button part="bottom audio-track button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 16">
        <path d="M9 15A7 7 0 1 1 9 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 9 0a8 8 0 0 0 0 16Z" />
        <path
          d="M5.2 6.3a.5.5 0 0 1 .5.5v2.4a.5.5 0 1 1-1 0V6.8a.5.5 0 0 1 .5-.5Zm2.4-2.4a.5.5 0 0 1 .5.5v7.2a.5.5 0 0 1-1 0V4.4a.5.5 0 0 1 .5-.5ZM10 5.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.4-.8a.5.5 0 0 1 .5.5v5.6a.5.5 0 0 1-1 0V5.2a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </media-audio-track-menu-button>
    <media-audio-track-menu
      hidden
      anchor="auto"
      part="bottom audio-track menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-audio-track-menu>
  </template>

  <template partial="RenditionMenu">
    <media-rendition-menu-button part="bottom rendition button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 14">
        <path
          d="M2.25 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
      </svg>
    </media-rendition-menu-button>
    <media-rendition-menu
      hidden
      anchor="auto"
      part="bottom rendition menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            opacity: 0;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-rendition-menu>
  </template>

  <template partial="MuxBadge">
    <div part="mux-badge">
      <a href="https://www.mux.com/player" target="_blank">
        <span class="mux-badge-text">Powered by</span>
        <div class="mux-badge-logo">
          <svg
            viewBox="0 0 1600 500"
            style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
          >
            <g>
              <path
                d="M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M437.511,468.521c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m23.915,-463.762c-23.348,-9.672 -50.226,-4.327 -68.096,13.544l-143.331,143.329l-143.33,-143.329c-17.871,-17.871 -44.747,-23.216 -68.096,-13.544c-23.349,9.671 -38.574,32.455 -38.574,57.729l0,375.026c0,34.51 27.977,62.486 62.487,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-224.173l80.843,80.844c24.404,24.402 63.965,24.402 88.369,-0l80.843,-80.844l0,224.173c0,34.51 27.976,62.486 62.486,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-375.026c0,-25.274 -15.224,-48.058 -38.573,-57.729"
                style="fill-rule: nonzero"
              ></path>
            </g>
          </svg>
        </div>
      </a>
    </div>
  </template>

  <media-controller
    part="controller"
    defaultstreamtype="{{defaultstreamtype ?? 'on-demand'}}"
    breakpoints="sm:470"
    gesturesdisabled="{{disabled}}"
    hotkeys="{{hotkeys}}"
    nohotkeys="{{nohotkeys}}"
    novolumepref="{{novolumepref}}"
    audio="{{audio}}"
    noautoseektolive="{{noautoseektolive}}"
    defaultsubtitles="{{defaultsubtitles}}"
    defaultduration="{{defaultduration ?? false}}"
    keyboardforwardseekoffset="{{forwardseekoffset}}"
    keyboardbackwardseekoffset="{{backwardseekoffset}}"
    exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
    style="--_pre-playback-place:{{preplaybackplace ?? 'center'}}"
  >
    <slot name="media" slot="media"></slot>
    <slot name="poster" slot="poster"></slot>

    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
    <media-error-dialog slot="dialog" noautohide></media-error-dialog>

    <template if="!audio">
      <!-- Pre-playback UI -->
      <!-- same for both on-demand and live -->
      <div slot="centered-chrome" class="center-controls pre-playback">
        <template if="!breakpointsm">{{>PlayButton section="center"}}</template>
        <template if="breakpointsm">{{>PrePlayButton section="center"}}</template>
      </div>

      <!-- Mux Badge -->
      <template if="proudlydisplaymuxbadge"> {{>MuxBadge}} </template>

      <!-- Autoplay centered unmute button -->
      <!--
        todo: figure out how show this with available state variables
        needs to show when:
        - autoplay is enabled
        - playback has been successful
        - audio is muted
        - in place / instead of the pre-plaback play button
        - not to show again after user has interacted with this button
          - OR user has interacted with the mute button in the control bar
      -->
      <!--
        There should be a >MuteButton to the left of the "Unmute" text, but a templating bug
        makes it appear even if commented out in the markup, add it back when code is un-commented
      -->
      <!-- <div slot="centered-chrome" class="autoplay-unmute">
        <div role="button" class="autoplay-unmute-btn">Unmute</div>
      </div> -->

      <template if="streamtype == 'on-demand'">
        <template if="breakpointsm">
          <media-control-bar part="control-bar top" slot="top-chrome">{{>TitleDisplay}} </media-control-bar>
        </template>
        {{>TimeRange}}
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>SeekBackwardButton}} {{>SeekForwardButton}} {{>TimeDisplay}} {{>MuteButton}}
          {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>PlaybackRateMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}}
          {{>CastButton}} {{>PipButton}} {{>FullscreenButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <media-control-bar part="control-bar top" slot="top-chrome">
          {{>LiveButton}}
          <template if="breakpointsm"> {{>TitleDisplay}} </template>
        </media-control-bar>
        <template if="targetlivewindow > 0">{{>TimeRange}}</template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="targetlivewindow > 0">{{>SeekBackwardButton}} {{>SeekForwardButton}}</template>
          {{>MuteButton}} {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}} {{>CastButton}} {{>PipButton}}
          {{>FullscreenButton}}
        </media-control-bar>
      </template>
    </template>

    <template if="audio">
      <template if="streamtype == 'on-demand'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="breakpointsm"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          {{>MuteButton}}
          <template if="breakpointsm">{{>VolumeRange}}</template>
          {{>TimeDisplay}} {{>TimeRange}}
          <template if="breakpointsm">{{>PlaybackRateMenu}}</template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>LiveButton section="bottom"}} {{>MuteButton}}
          <template if="breakpointsm">
            {{>VolumeRange}}
            <template if="targetlivewindow > 0"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          </template>
          <template if="targetlivewindow > 0"> {{>TimeDisplay}} {{>TimeRange}} </template>
          <template if="!targetlivewindow"><div class="spacer"></div></template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>
    </template>

    <slot></slot>
  </media-controller>
</template>
`,hE=cK.createElement("template");"innerHTML"in hE&&(hE.innerHTML=hg);var hf,hy,hA=class extends sJ{};hA.template=null==(hy=null==(hf=hE.content)?void 0:hf.children)?void 0:hy[0],cY.customElements.get("media-theme-gerwig")||cY.customElements.define("media-theme-gerwig",hA);var hk={SRC:"src",POSTER:"poster"},hT={STYLE:"style",DEFAULT_HIDDEN_CAPTIONS:"default-hidden-captions",PRIMARY_COLOR:"primary-color",SECONDARY_COLOR:"secondary-color",ACCENT_COLOR:"accent-color",FORWARD_SEEK_OFFSET:"forward-seek-offset",BACKWARD_SEEK_OFFSET:"backward-seek-offset",PLAYBACK_TOKEN:"playback-token",THUMBNAIL_TOKEN:"thumbnail-token",STORYBOARD_TOKEN:"storyboard-token",DRM_TOKEN:"drm-token",STORYBOARD_SRC:"storyboard-src",THUMBNAIL_TIME:"thumbnail-time",AUDIO:"audio",NOHOTKEYS:"nohotkeys",HOTKEYS:"hotkeys",PLAYBACK_RATES:"playbackrates",DEFAULT_SHOW_REMAINING_TIME:"default-show-remaining-time",DEFAULT_DURATION:"default-duration",TITLE:"title",VIDEO_TITLE:"video-title",PLACEHOLDER:"placeholder",THEME:"theme",DEFAULT_STREAM_TYPE:"default-stream-type",TARGET_LIVE_WINDOW:"target-live-window",EXTRA_SOURCE_PARAMS:"extra-source-params",NO_VOLUME_PREF:"no-volume-pref",CAST_RECEIVER:"cast-receiver",NO_TOOLTIPS:"no-tooltips",PROUDLY_DISPLAY_MUX_BADGE:"proudly-display-mux-badge"},hw=["audio","backwardseekoffset","defaultduration","defaultshowremainingtime","defaultsubtitles","noautoseektolive","disabled","exportparts","forwardseekoffset","hideduration","hotkeys","nohotkeys","playbackrates","defaultstreamtype","streamtype","style","targetlivewindow","template","title","videotitle","novolumepref","proudlydisplaymuxbadge"],h_=np.formatErrorMessage;function hC(e){let t=e.videoTitle?{video_title:e.videoTitle}:{};return e.getAttributeNames().filter(e=>e.startsWith("metadata-")).reduce((t,i)=>{let a=e.getAttribute(i);return null!==a&&(t[i.replace(/^metadata-/,"").replace(/-/g,"_")]=a),t},t)}np.formatErrorMessage=e=>{var t,i;if(e instanceof u){let a=((e,t=!1)=>({title:((e,t=!1)=>{var i,a;if(e.muxCode){let r=hv(null!=(i=e.errorCategory)?i:"video"),n=d(null!=(a=e.errorCategory)?a:l);if(2000002===e.muxCode)return L("Your device appears to be offline",t);if(2403210===e.muxCode)return L("{category} URL has expired",t).format({category:r});if([2403232,2403222,2403221,2412202].includes(e.muxCode))return L("{category} URL is formatted incorrectly",t).format({category:r});if(2403201===e.muxCode)return L("Invalid {categoryName} URL",t).format({categoryName:n});if(2404e3===e.muxCode)return L("{category} does not exist",t).format({category:r});if(2412e3===e.muxCode){let i="live"===e.streamType?"Live stream":"Video";return L("{mediaType} is not currently available",t).format({mediaType:i})}}if(e.code){if(e.code===u.MEDIA_ERR_NETWORK)return L("Network Error",t);if(e.code===u.MEDIA_ERR_DECODE)return L("Media Error",t);if(e.code===u.MEDIA_ERR_SRC_NOT_SUPPORTED)return L("Source Not Supported",t)}return L("Error",t)})(e,t).toString(),message:((e,t=!1)=>{var i,a;if(e.muxCode){let r=hv(null!=(i=e.errorCategory)?i:"video"),n=d(null!=(a=e.errorCategory)?a:l);return 2000002===e.muxCode?L("Check your internet connection and try reloading this video.",t):2403210===e.muxCode?L("The video’s secured {tokenNamePrefix}-token has expired.",t).format({tokenNamePrefix:n}):2403232===e.muxCode?L("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",t).format({tokenNamePrefix:n}):2412202===e.muxCode?L("{category} URL is formatted incorrectly",t).format({category:r}):[2403222,2403221].includes(e.muxCode)?L("The {tokenNamePrefix}-token is formatted with incorrect information.",t).format({tokenNamePrefix:n}):[2403201,24e5].includes(e.muxCode)?L("The video URL or {tokenNamePrefix}-token are formatted with incorrect or incomplete information.",t).format({tokenNamePrefix:n}):2404e3===e.muxCode?"":e.message}return e.code&&(e.code===u.MEDIA_ERR_NETWORK||e.code===u.MEDIA_ERR_DECODE||e.code===u.MEDIA_ERR_SRC_NOT_SUPPORTED),e.message})(e,t).toString()}))(e,!1);return`
      ${null!=a&&a.title?`<h3>${a.title}</h3>`:""}
      ${null!=a&&a.message||null!=a&&a.linkUrl?`<p>
        ${null==a?void 0:a.message}
        ${null!=a&&a.linkUrl?`<a
              href="${a.linkUrl}"
              target="_blank"
              rel="external noopener"
              aria-label="${null!=(t=a.linkText)?t:""} ${L("(opens in a new window)")}"
              >${null!=(i=a.linkText)?i:a.linkUrl}</a
            >`:""}
      </p>`:""}
    `}return h_(e)};var hI,hS,hR,hM,hL,hD,hx,hN,hO,hP,hU,h$,hW,hH,hB,hV=Object.values(to),hF=Object.values(hk),hY=Object.values(hT),hK="mux-player",hG={isDialogOpen:!1},hq={redundant_streams:!0},hj=class extends hr{constructor(){super(),o4(this,hx),o4(this,hI),o4(this,hS,!1),o4(this,hR,{}),o4(this,hM,!0),o4(this,hL,new c4(this,"hotkeys")),o4(this,hD,{...hG,onCloseErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&o9(this,hx,hP).call(this,{isDialogOpen:!1})},onFocusInErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&(cJ(this,cK.activeElement)||e.preventDefault())}}),o5(this,hI,eE()),this.attachShadow({mode:"open"}),o9(this,hx,hO).call(this),this.isConnected&&o9(this,hx,hN).call(this)}static get NAME(){return hK}static get VERSION(){return c1}static get observedAttributes(){var e;return[...null!=(e=hr.observedAttributes)?e:[],...hF,...hV,...hY]}get mediaTheme(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("media-theme")}get mediaController(){var e,t;return null==(t=null==(e=this.mediaTheme)?void 0:e.shadowRoot)?void 0:t.querySelector("media-controller")}connectedCallback(){let e=this.media;e&&(e.metadata=hC(this))}attributeChangedCallback(e,t,i){var a;switch(o9(this,hx,hN).call(this),super.attributeChangedCallback(e,t,i),e){case hT.HOTKEYS:o3(this,hL).value=i;break;case hT.THUMBNAIL_TIME:null!=i&&this.tokens.thumbnail&&c9(L("Use of thumbnail-time with thumbnail-token is currently unsupported. Ignore thumbnail-time.").toString());break;case hT.THUMBNAIL_TOKEN:if(i){let e=M(i);if(e){let{aud:t}=e;"t"!==t&&c9(L("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"t",tokenNamePrefix:"thumbnail"}))}}break;case hT.STORYBOARD_TOKEN:if(i){let e=M(i);if(e){let{aud:t}=e;"s"!==t&&c9(L("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"s",tokenNamePrefix:"storyboard"}))}}break;case hT.DRM_TOKEN:if(i){let e=M(i);if(e){let{aud:t}=e;"d"!==t&&c9(L("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:"d",tokenNamePrefix:"drm"}))}}break;case to.PLAYBACK_ID:null!=i&&i.includes("?token")&&c8(L("The specificed playback ID {playbackId} contains a token which must be provided via the playback-token attribute.").format({playbackId:i}));break;case to.STREAM_TYPE:i&&![p,m,v].includes(i)?["ll-live","live:dvr","ll-live:dvr"].includes(this.streamType)?this.targetLiveWindow=i.includes("dvr")?1/0:0:c6({file:"invalid-stream-type.md",message:L("Invalid stream-type value supplied: `{streamType}`. Please provide stream-type as either: `on-demand` or `live`").format({streamType:this.streamType})}):i===p?null==this.getAttribute(hT.TARGET_LIVE_WINDOW)&&(this.targetLiveWindow=0):this.targetLiveWindow=NaN}[to.PLAYBACK_ID,hk.SRC,hT.PLAYBACK_TOKEN].includes(e)&&t!==i&&o5(this,hD,{...o3(this,hD),...hG}),o9(this,hx,hU).call(this,{[null!=(a=c3[e])?a:cq(e)]:i})}async requestFullscreen(e){var t;if(!(!this.mediaController||this.mediaController.hasAttribute(ir.MEDIA_IS_FULLSCREEN)))return null==(t=this.mediaController)||t.dispatchEvent(new cY.CustomEvent(ie.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(is.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}async exitFullscreen(){var e;if(!(!this.mediaController||!this.mediaController.hasAttribute(ir.MEDIA_IS_FULLSCREEN)))return null==(e=this.mediaController)||e.dispatchEvent(new cY.CustomEvent(ie.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(is.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}get preferCmcd(){var e;return null!=(e=this.getAttribute(to.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?E.includes(e)?this.setAttribute(to.PREFER_CMCD,e):c9(`Invalid value for preferCmcd. Must be one of ${E.join()}`):this.removeAttribute(to.PREFER_CMCD))}get hasPlayed(){var e,t;return null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(ir.MEDIA_HAS_PLAYED))&&t}get inLiveWindow(){var e;return null==(e=this.mediaController)?void 0:e.hasAttribute(ir.MEDIA_TIME_IS_LIVE)}get _hls(){var e;return null==(e=this.media)?void 0:e._hls}get mux(){var e;return null==(e=this.media)?void 0:e.mux}get theme(){var e;return null!=(e=this.getAttribute(hT.THEME))?e:"gerwig"}set theme(e){this.setAttribute(hT.THEME,`${e}`)}get themeProps(){let e=this.mediaTheme;if(!e)return;let t={};for(let i of e.getAttributeNames()){if(hw.includes(i))continue;let a=e.getAttribute(i);t[cq(i)]=""===a||a}return t}set themeProps(e){var t,i;o9(this,hx,hN).call(this);let a={...this.themeProps,...e};for(let r in a){if(hw.includes(r))continue;let a=null==e?void 0:e[r];"boolean"==typeof a||null==a?null==(t=this.mediaTheme)||t.toggleAttribute(cG(r),!!a):null==(i=this.mediaTheme)||i.setAttribute(cG(r),a)}}get playbackId(){var e;return null!=(e=this.getAttribute(to.PLAYBACK_ID))?e:void 0}set playbackId(e){e?this.setAttribute(to.PLAYBACK_ID,e):this.removeAttribute(to.PLAYBACK_ID)}get src(){var e,t;return this.playbackId?null!=(e=hZ(this,hk.SRC))?e:void 0:null!=(t=this.getAttribute(hk.SRC))?t:void 0}set src(e){e?this.setAttribute(hk.SRC,e):this.removeAttribute(hk.SRC)}get poster(){var e;let t=this.getAttribute(hk.POSTER);if(null!=t)return t;let{tokens:i}=this;return i.playback&&!i.thumbnail?void c9("Missing expected thumbnail token. No poster image will be shown"):this.playbackId&&!this.audio?((e,{token:t,customDomain:i=c0,thumbnailTime:a,programTime:r}={})=>{var n;let s=null==t?a:void 0,{aud:o}=null!=(n=M(t))?n:{};if(!(t&&"t"!==o))return`https://image.${i}/${e}/thumbnail.webp${cZ({token:t,time:s,program_time:r})}`})(this.playbackId,{customDomain:this.customDomain,thumbnailTime:null!=(e=this.thumbnailTime)?e:this.startTime,programTime:this.programStartTime,token:i.thumbnail}):void 0}set poster(e){e||""===e?this.setAttribute(hk.POSTER,e):this.removeAttribute(hk.POSTER)}get storyboardSrc(){var e;return null!=(e=this.getAttribute(hT.STORYBOARD_SRC))?e:void 0}set storyboardSrc(e){e?this.setAttribute(hT.STORYBOARD_SRC,e):this.removeAttribute(hT.STORYBOARD_SRC)}get storyboard(){let{tokens:e}=this;return this.storyboardSrc&&!e.storyboard?this.storyboardSrc:this.audio||!this.playbackId||!this.streamType||[p,v].includes(this.streamType)||e.playback&&!e.storyboard?void 0:((e,{token:t,customDomain:i=c0,programStartTime:a,programEndTime:r}={})=>{var n;let{aud:s}=null!=(n=M(t))?n:{};if(!(t&&"s"!==s))return`https://image.${i}/${e}/storyboard.vtt${cZ({token:t,format:"webp",program_start_time:a,program_end_time:r})}`})(this.playbackId,{customDomain:this.customDomain,token:e.storyboard,programStartTime:this.programStartTime,programEndTime:this.programEndTime})}get audio(){return this.hasAttribute(hT.AUDIO)}set audio(e){e?this.setAttribute(hT.AUDIO,""):this.removeAttribute(hT.AUDIO)}get hotkeys(){return o3(this,hL)}get nohotkeys(){return this.hasAttribute(hT.NOHOTKEYS)}set nohotkeys(e){e?this.setAttribute(hT.NOHOTKEYS,""):this.removeAttribute(hT.NOHOTKEYS)}get thumbnailTime(){return cj(this.getAttribute(hT.THUMBNAIL_TIME))}set thumbnailTime(e){this.setAttribute(hT.THUMBNAIL_TIME,`${e}`)}get videoTitle(){var e,t;return null!=(t=null!=(e=this.getAttribute(hT.VIDEO_TITLE))?e:this.getAttribute(hT.TITLE))?t:""}set videoTitle(e){e!==this.videoTitle&&(e?this.setAttribute(hT.VIDEO_TITLE,e):this.removeAttribute(hT.VIDEO_TITLE))}get placeholder(){var e;return null!=(e=hZ(this,hT.PLACEHOLDER))?e:""}set placeholder(e){this.setAttribute(hT.PLACEHOLDER,`${e}`)}get primaryColor(){var e,t;let i=this.getAttribute(hT.PRIMARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=cY.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_primary-color"))?void 0:t.trim()))return i}set primaryColor(e){this.setAttribute(hT.PRIMARY_COLOR,`${e}`)}get secondaryColor(){var e,t;let i=this.getAttribute(hT.SECONDARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=cY.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_secondary-color"))?void 0:t.trim()))return i}set secondaryColor(e){this.setAttribute(hT.SECONDARY_COLOR,`${e}`)}get accentColor(){var e,t;let i=this.getAttribute(hT.ACCENT_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=cY.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_accent-color"))?void 0:t.trim()))return i}set accentColor(e){this.setAttribute(hT.ACCENT_COLOR,`${e}`)}get defaultShowRemainingTime(){return this.hasAttribute(hT.DEFAULT_SHOW_REMAINING_TIME)}set defaultShowRemainingTime(e){e?this.setAttribute(hT.DEFAULT_SHOW_REMAINING_TIME,""):this.removeAttribute(hT.DEFAULT_SHOW_REMAINING_TIME)}get playbackRates(){if(this.hasAttribute(hT.PLAYBACK_RATES))return this.getAttribute(hT.PLAYBACK_RATES).trim().split(/\s*,?\s+/).map(e=>Number(e)).filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t)}set playbackRates(e){e?this.setAttribute(hT.PLAYBACK_RATES,e.join(" ")):this.removeAttribute(hT.PLAYBACK_RATES)}get forwardSeekOffset(){var e;return null!=(e=cj(this.getAttribute(hT.FORWARD_SEEK_OFFSET)))?e:10}set forwardSeekOffset(e){this.setAttribute(hT.FORWARD_SEEK_OFFSET,`${e}`)}get backwardSeekOffset(){var e;return null!=(e=cj(this.getAttribute(hT.BACKWARD_SEEK_OFFSET)))?e:10}set backwardSeekOffset(e){this.setAttribute(hT.BACKWARD_SEEK_OFFSET,`${e}`)}get defaultHiddenCaptions(){return this.hasAttribute(hT.DEFAULT_HIDDEN_CAPTIONS)}set defaultHiddenCaptions(e){e?this.setAttribute(hT.DEFAULT_HIDDEN_CAPTIONS,""):this.removeAttribute(hT.DEFAULT_HIDDEN_CAPTIONS)}get defaultDuration(){return cj(this.getAttribute(hT.DEFAULT_DURATION))}set defaultDuration(e){null==e?this.removeAttribute(hT.DEFAULT_DURATION):this.setAttribute(hT.DEFAULT_DURATION,`${e}`)}get playerInitTime(){return this.hasAttribute(to.PLAYER_INIT_TIME)?cj(this.getAttribute(to.PLAYER_INIT_TIME)):o3(this,hI)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(to.PLAYER_INIT_TIME):this.setAttribute(to.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=this.getAttribute(to.PLAYER_SOFTWARE_NAME))?e:hK}get playerSoftwareVersion(){var e;return null!=(e=this.getAttribute(to.PLAYER_SOFTWARE_VERSION))?e:c1}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(to.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(to.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(to.BEACON_COLLECTION_DOMAIN))}get maxResolution(){var e;return null!=(e=this.getAttribute(to.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(to.MAX_RESOLUTION,e):this.removeAttribute(to.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(to.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(to.MIN_RESOLUTION,e):this.removeAttribute(to.MIN_RESOLUTION))}get renditionOrder(){var e;return null!=(e=this.getAttribute(to.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(to.RENDITION_ORDER,e):this.removeAttribute(to.RENDITION_ORDER))}get programStartTime(){return cj(this.getAttribute(to.PROGRAM_START_TIME))}set programStartTime(e){null==e?this.removeAttribute(to.PROGRAM_START_TIME):this.setAttribute(to.PROGRAM_START_TIME,`${e}`)}get programEndTime(){return cj(this.getAttribute(to.PROGRAM_END_TIME))}set programEndTime(e){null==e?this.removeAttribute(to.PROGRAM_END_TIME):this.setAttribute(to.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){return cj(this.getAttribute(to.ASSET_START_TIME))}set assetStartTime(e){null==e?this.removeAttribute(to.ASSET_START_TIME):this.setAttribute(to.ASSET_START_TIME,`${e}`)}get assetEndTime(){return cj(this.getAttribute(to.ASSET_END_TIME))}set assetEndTime(e){null==e?this.removeAttribute(to.ASSET_END_TIME):this.setAttribute(to.ASSET_END_TIME,`${e}`)}get extraSourceParams(){return this.hasAttribute(hT.EXTRA_SOURCE_PARAMS)?[...new URLSearchParams(this.getAttribute(hT.EXTRA_SOURCE_PARAMS)).entries()].reduce((e,[t,i])=>(e[t]=i,e),{}):hq}set extraSourceParams(e){null==e?this.removeAttribute(hT.EXTRA_SOURCE_PARAMS):this.setAttribute(hT.EXTRA_SOURCE_PARAMS,new URLSearchParams(e).toString())}get customDomain(){var e;return null!=(e=this.getAttribute(to.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(to.CUSTOM_DOMAIN,e):this.removeAttribute(to.CUSTOM_DOMAIN))}get envKey(){var e;return null!=(e=hZ(this,to.ENV_KEY))?e:void 0}set envKey(e){this.setAttribute(to.ENV_KEY,`${e}`)}get noVolumePref(){return this.hasAttribute(hT.NO_VOLUME_PREF)}set noVolumePref(e){e?this.setAttribute(hT.NO_VOLUME_PREF,""):this.removeAttribute(hT.NO_VOLUME_PREF)}get debug(){return null!=hZ(this,to.DEBUG)}set debug(e){e?this.setAttribute(to.DEBUG,""):this.removeAttribute(to.DEBUG)}get disableTracking(){return null!=hZ(this,to.DISABLE_TRACKING)}set disableTracking(e){this.toggleAttribute(to.DISABLE_TRACKING,!!e)}get disableCookies(){return null!=hZ(this,to.DISABLE_COOKIES)}set disableCookies(e){e?this.setAttribute(to.DISABLE_COOKIES,""):this.removeAttribute(to.DISABLE_COOKIES)}get streamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(to.STREAM_TYPE))?t:null==(e=this.media)?void 0:e.streamType)?i:v}set streamType(e){this.setAttribute(to.STREAM_TYPE,`${e}`)}get defaultStreamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(hT.DEFAULT_STREAM_TYPE))?t:null==(e=this.mediaController)?void 0:e.getAttribute(hT.DEFAULT_STREAM_TYPE))?i:m}set defaultStreamType(e){e?this.setAttribute(hT.DEFAULT_STREAM_TYPE,e):this.removeAttribute(hT.DEFAULT_STREAM_TYPE)}get targetLiveWindow(){var e,t;return this.hasAttribute(hT.TARGET_LIVE_WINDOW)?+this.getAttribute(hT.TARGET_LIVE_WINDOW):null!=(t=null==(e=this.media)?void 0:e.targetLiveWindow)?t:NaN}set targetLiveWindow(e){e==this.targetLiveWindow||Number.isNaN(e)&&Number.isNaN(this.targetLiveWindow)||(null==e?this.removeAttribute(hT.TARGET_LIVE_WINDOW):this.setAttribute(hT.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e;return null==(e=this.media)?void 0:e.liveEdgeStart}get startTime(){return cj(hZ(this,to.START_TIME))}set startTime(e){this.setAttribute(to.START_TIME,`${e}`)}get preferPlayback(){let e=this.getAttribute(to.PREFER_PLAYBACK);if("mse"===e||e===b)return e}set preferPlayback(e){e!==this.preferPlayback&&("mse"===e||e===b?this.setAttribute(to.PREFER_PLAYBACK,e):this.removeAttribute(to.PREFER_PLAYBACK))}get metadata(){var e;return null==(e=this.media)?void 0:e.metadata}set metadata(e){(o9(this,hx,hN).call(this),this.media)?this.media.metadata={...hC(this),...e}:c8("underlying media element missing when trying to set metadata. metadata will not be set.")}get _hlsConfig(){var e;return null==(e=this.media)?void 0:e._hlsConfig}set _hlsConfig(e){(o9(this,hx,hN).call(this),this.media)?this.media._hlsConfig=e:c8("underlying media element missing when trying to set _hlsConfig. _hlsConfig will not be set.")}async addCuePoints(e){var t;return(o9(this,hx,hN).call(this),this.media)?null==(t=this.media)?void 0:t.addCuePoints(e):void c8("underlying media element missing when trying to addCuePoints. cuePoints will not be added.")}get activeCuePoint(){var e;return null==(e=this.media)?void 0:e.activeCuePoint}get cuePoints(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.cuePoints)?t:[]}addChapters(e){var t;return(o9(this,hx,hN).call(this),this.media)?null==(t=this.media)?void 0:t.addChapters(e):void c8("underlying media element missing when trying to addChapters. chapters will not be added.")}get activeChapter(){var e;return null==(e=this.media)?void 0:e.activeChapter}get chapters(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.chapters)?t:[]}getStartDate(){var e;return null==(e=this.media)?void 0:e.getStartDate()}get currentPdt(){var e;return null==(e=this.media)?void 0:e.currentPdt}get tokens(){let e=this.getAttribute(hT.PLAYBACK_TOKEN),t=this.getAttribute(hT.DRM_TOKEN),i=this.getAttribute(hT.THUMBNAIL_TOKEN),a=this.getAttribute(hT.STORYBOARD_TOKEN);return{...o3(this,hR),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{},...null!=i?{thumbnail:i}:{},...null!=a?{storyboard:a}:{}}}set tokens(e){o5(this,hR,null!=e?e:{})}get playbackToken(){var e;return null!=(e=this.getAttribute(hT.PLAYBACK_TOKEN))?e:void 0}set playbackToken(e){this.setAttribute(hT.PLAYBACK_TOKEN,`${e}`)}get drmToken(){var e;return null!=(e=this.getAttribute(hT.DRM_TOKEN))?e:void 0}set drmToken(e){this.setAttribute(hT.DRM_TOKEN,`${e}`)}get thumbnailToken(){var e;return null!=(e=this.getAttribute(hT.THUMBNAIL_TOKEN))?e:void 0}set thumbnailToken(e){this.setAttribute(hT.THUMBNAIL_TOKEN,`${e}`)}get storyboardToken(){var e;return null!=(e=this.getAttribute(hT.STORYBOARD_TOKEN))?e:void 0}set storyboardToken(e){this.setAttribute(hT.STORYBOARD_TOKEN,`${e}`)}addTextTrack(e,t,i,a){var r;let n=null==(r=this.media)?void 0:r.nativeEl;if(n)return U(n,e,t,i,a)}removeTextTrack(e){var t;let i=null==(t=this.media)?void 0:t.nativeEl;if(i){let t;return void(null==(t=Array.prototype.find.call(i.querySelectorAll("track"),t=>t.track===e))||t.remove())}}get textTracks(){var e;return null==(e=this.media)?void 0:e.textTracks}get castReceiver(){var e;return null!=(e=this.getAttribute(hT.CAST_RECEIVER))?e:void 0}set castReceiver(e){e!==this.castReceiver&&(e?this.setAttribute(hT.CAST_RECEIVER,e):this.removeAttribute(hT.CAST_RECEIVER))}get castCustomData(){var e;return null==(e=this.media)?void 0:e.castCustomData}set castCustomData(e){this.media?this.media.castCustomData=e:c8("underlying media element missing when trying to set castCustomData. castCustomData will not be set.")}get noTooltips(){return this.hasAttribute(hT.NO_TOOLTIPS)}set noTooltips(e){e?this.setAttribute(hT.NO_TOOLTIPS,""):this.removeAttribute(hT.NO_TOOLTIPS)}get proudlyDisplayMuxBadge(){return this.hasAttribute(hT.PROUDLY_DISPLAY_MUX_BADGE)}set proudlyDisplayMuxBadge(e){e?this.setAttribute(hT.PROUDLY_DISPLAY_MUX_BADGE,""):this.removeAttribute(hT.PROUDLY_DISPLAY_MUX_BADGE)}};function hZ(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}hI=new WeakMap,hS=new WeakMap,hR=new WeakMap,hM=new WeakMap,hL=new WeakMap,hD=new WeakMap,hx=new WeakSet,hN=function(){var e,t,i,a;if(!o3(this,hS)){o5(this,hS,!0),o9(this,hx,hU).call(this);try{if(customElements.upgrade(this.mediaTheme),!(this.mediaTheme instanceof cY.HTMLElement))throw""}catch{c8("<media-theme> failed to upgrade!")}try{customElements.upgrade(this.media)}catch{c8("underlying media element failed to upgrade!")}try{if(customElements.upgrade(this.mediaController),!(this.mediaController instanceof rv))throw""}catch{c8("<media-controller> failed to upgrade!")}o9(this,hx,h$).call(this),o9(this,hx,hW).call(this),o9(this,hx,hH).call(this),o5(this,hM,null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(am))||t),o9(this,hx,hB).call(this),null==(i=this.media)||i.addEventListener("streamtypechange",()=>o9(this,hx,hU).call(this)),null==(a=this.media)||a.addEventListener("loadstart",()=>o9(this,hx,hU).call(this))}},hO=function(){var e,t;try{null==(e=null==window?void 0:window.CSS)||e.registerProperty({name:"--media-primary-color",syntax:"<color>",inherits:!0}),null==(t=null==window?void 0:window.CSS)||t.registerProperty({name:"--media-secondary-color",syntax:"<color>",inherits:!0})}catch{}},hP=function(e){Object.assign(o3(this,hD),e),o9(this,hx,hU).call(this)},hU=function(e={}){var t,i,a,r,n,s,o,l,d,u,c,h,m,v,b,g,E,f,y,A,k,T,w,_,C,I,S,R,M,L,D,x,N,O,P,U,$,W,H,B,V,F,Y;let K,G,q,j;t={...o3(this,hD),...e},K={src:!this.playbackId&&this.src,playbackId:this.playbackId,hasSrc:!!this.playbackId||!!this.src||!!this.currentSrc,poster:this.poster,storyboard:this.storyboard,storyboardSrc:this.getAttribute(hT.STORYBOARD_SRC),placeholder:this.getAttribute("placeholder"),themeTemplate:function(e){var t,i;let a=e.theme;if(a){let r=null==(i=null==(t=e.getRootNode())?void 0:t.getElementById)?void 0:i.call(t,a);if(r&&r instanceof HTMLTemplateElement)return r;a.startsWith("media-theme-")||(a=`media-theme-${a}`);let n=cY.customElements.get(a);if(null!=n&&n.template)return n.template}}(this),thumbnailTime:!this.tokens.thumbnail&&this.thumbnailTime,autoplay:this.autoplay,crossOrigin:this.crossOrigin,loop:this.loop,noHotKeys:this.hasAttribute(hT.NOHOTKEYS),hotKeys:this.getAttribute(hT.HOTKEYS),muted:this.muted,paused:this.paused,preload:this.preload,envKey:this.envKey,preferCmcd:this.preferCmcd,debug:this.debug,disableTracking:this.disableTracking,disableCookies:this.disableCookies,tokens:this.tokens,beaconCollectionDomain:this.beaconCollectionDomain,maxResolution:this.maxResolution,minResolution:this.minResolution,programStartTime:this.programStartTime,programEndTime:this.programEndTime,assetStartTime:this.assetStartTime,assetEndTime:this.assetEndTime,renditionOrder:this.renditionOrder,metadata:this.metadata,playerInitTime:this.playerInitTime,playerSoftwareName:this.playerSoftwareName,playerSoftwareVersion:this.playerSoftwareVersion,startTime:this.startTime,preferPlayback:this.preferPlayback,audio:this.audio,defaultStreamType:this.defaultStreamType,targetLiveWindow:this.getAttribute(to.TARGET_LIVE_WINDOW),streamType:c2(this.getAttribute(to.STREAM_TYPE)),primaryColor:this.getAttribute(hT.PRIMARY_COLOR),secondaryColor:this.getAttribute(hT.SECONDARY_COLOR),accentColor:this.getAttribute(hT.ACCENT_COLOR),forwardSeekOffset:this.forwardSeekOffset,backwardSeekOffset:this.backwardSeekOffset,defaultHiddenCaptions:this.defaultHiddenCaptions,defaultDuration:this.defaultDuration,defaultShowRemainingTime:this.defaultShowRemainingTime,hideDuration:(G=null==(r=this.mediaController)?void 0:r.querySelector("media-time-display"))&&"none"===getComputedStyle(G).getPropertyValue("--media-duration-display-display").trim(),playbackRates:this.getAttribute(hT.PLAYBACK_RATES),customDomain:null!=(i=this.getAttribute(to.CUSTOM_DOMAIN))?i:void 0,title:this.getAttribute(hT.TITLE),videoTitle:null!=(a=this.getAttribute(hT.VIDEO_TITLE))?a:this.getAttribute(hT.TITLE),novolumepref:this.hasAttribute(hT.NO_VOLUME_PREF),proudlyDisplayMuxBadge:this.hasAttribute(hT.PROUDLY_DISPLAY_MUX_BADGE),castReceiver:this.castReceiver,...t,extraSourceParams:this.extraSourceParams},n=hm`
  <style>
    ${(e=>{let{tokens:t}=e;return t.drm?":host(:not([cast-receiver])) { --_cast-button-drm-display: none; }":""})(K)}
    ${hn}
  </style>
  ${o=K,hm`
  <media-theme
    template="${o.themeTemplate||!1}"
    defaultstreamtype="${null!=(l=o.defaultStreamType)&&l}"
    hotkeys="${q=o.hotKeys?`${o.hotKeys}`:"","live"===c2(o.streamType)&&(q+=" noarrowleft noarrowright"),q||!1}"
    nohotkeys="${o.noHotKeys||!o.hasSrc||!1}"
    noautoseektolive="${!!(null!=(d=o.streamType)&&d.includes(p))&&0!==o.targetLiveWindow}"
    novolumepref="${o.novolumepref||!1}"
    disabled="${!o.hasSrc||o.isDialogOpen}"
    audio="${null!=(u=o.audio)&&u}"
    style="${null!=(Y={"--media-primary-color":o.primaryColor,"--media-secondary-color":o.secondaryColor,"--media-accent-color":o.accentColor},j="",Object.entries(Y).forEach(([e,t])=>{null!=t&&(j+=`${cG(e)}: ${t}; `)}),c=j?j.trim():void 0)&&c}"
    defaultsubtitles="${!o.defaultHiddenCaptions}"
    forwardseekoffset="${null!=(h=o.forwardSeekOffset)&&h}"
    backwardseekoffset="${null!=(m=o.backwardSeekOffset)&&m}"
    playbackrates="${null!=(v=o.playbackRates)&&v}"
    defaultshowremainingtime="${null!=(b=o.defaultShowRemainingTime)&&b}"
    defaultduration="${null!=(g=o.defaultDuration)&&g}"
    hideduration="${null!=(E=o.hideDuration)&&E}"
    title="${null!=(f=o.title)&&f}"
    videotitle="${null!=(y=o.videoTitle)&&y}"
    proudlydisplaymuxbadge="${null!=(A=o.proudlyDisplayMuxBadge)&&A}"
    exportparts="${hp}"
    onclose="${o.onCloseErrorDialog}"
    onfocusin="${o.onFocusInErrorDialog}"
  >
    <mux-video
      slot="media"
      target-live-window="${null!=(k=o.targetLiveWindow)&&k}"
      stream-type="${null!=(T=c2(o.streamType))&&T}"
      crossorigin="${null!=(w=o.crossOrigin)?w:""}"
      playsinline
      autoplay="${null!=(_=o.autoplay)&&_}"
      muted="${null!=(C=o.muted)&&C}"
      loop="${null!=(I=o.loop)&&I}"
      preload="${null!=(S=o.preload)&&S}"
      debug="${null!=(R=o.debug)&&R}"
      prefer-cmcd="${null!=(M=o.preferCmcd)&&M}"
      disable-tracking="${null!=(L=o.disableTracking)&&L}"
      disable-cookies="${null!=(D=o.disableCookies)&&D}"
      prefer-playback="${null!=(x=o.preferPlayback)&&x}"
      start-time="${null!=o.startTime&&o.startTime}"
      beacon-collection-domain="${null!=(N=o.beaconCollectionDomain)&&N}"
      player-init-time="${null!=(O=o.playerInitTime)&&O}"
      player-software-name="${null!=(P=o.playerSoftwareName)&&P}"
      player-software-version="${null!=(U=o.playerSoftwareVersion)&&U}"
      env-key="${null!=($=o.envKey)&&$}"
      custom-domain="${null!=(W=o.customDomain)&&W}"
      src="${o.src?o.src:!!o.playbackId&&ey(o)}"
      cast-src="${o.src?o.src:!!o.playbackId&&ey(o)}"
      cast-receiver="${null!=(H=o.castReceiver)&&H}"
      drm-token="${null!=(V=null==(B=o.tokens)?void 0:B.drm)&&V}"
      exportparts="video"
    >
      ${o.storyboard?hm`<track label="thumbnails" default kind="metadata" src="${o.storyboard}" />`:hm``}
      <slot></slot>
    </mux-video>
    <slot name="poster" slot="poster">
      <media-poster-image
        part="poster"
        exportparts="poster, img"
        src="${!!o.poster&&o.poster}"
        placeholdersrc="${null!=(F=o.placeholder)&&F}"
      ></media-poster-image>
    </slot>
  </media-theme>
`}
`,s=this.shadowRoot,n.renderInto(s)},h$=function(){let e=e=>{var t,i;if(!(null!=e&&e.startsWith("theme-")))return;let a=e.replace(/^theme-/,"");if(hw.includes(a))return;let r=this.getAttribute(e);null!=r?null==(t=this.mediaTheme)||t.setAttribute(a,r):null==(i=this.mediaTheme)||i.removeAttribute(a)};new MutationObserver(t=>{for(let{attributeName:i}of t)e(i)}).observe(this,{attributes:!0}),this.getAttributeNames().forEach(e)},hW=function(){let e=e=>{var t;let i=null==(t=this.media)?void 0:t.error;if(!(i instanceof u)){let{message:e,code:t}=null!=i?i:{};i=new u(e,t)}if(!(null!=i&&i.fatal)){c9(i),i.data&&c9(`${i.name} data:`,i.data);return}let a=hb(i,!1);a.message&&c6(a),c8(i),i.data&&c8(`${i.name} data:`,i.data),o9(this,hx,hP).call(this,{isDialogOpen:!0})};this.addEventListener("error",e),this.media&&(this.media.errorTranslator=(e={})=>{var t,i,a;if(!((null==(t=this.media)?void 0:t.error)instanceof u))return e;let r=hb(null==(i=this.media)?void 0:i.error,!1);return{player_error_code:null==(a=this.media)?void 0:a.error.code,player_error_message:r.message?String(r.message):e.player_error_message,player_error_context:r.context?String(r.context):e.player_error_context}})},hH=function(){var e,t,i,a;let r=()=>o9(this,hx,hU).call(this);null==(t=null==(e=this.media)?void 0:e.textTracks)||t.addEventListener("addtrack",r),null==(a=null==(i=this.media)?void 0:i.textTracks)||a.addEventListener("removetrack",r)},hB=function(){var e,t;if(!/Firefox/i.test(navigator.userAgent))return;let i,a=new WeakMap,r=()=>this.streamType===p&&!this.secondaryColor&&this.offsetWidth>=800,n=(e,t,i=!1)=>{r()||Array.from(e&&e.activeCues||[]).forEach(e=>{if(!(!e.snapToLines||e.line<-5||e.line>=0&&e.line<10))if(!t||this.paused){let t=e.text.split(`
`).length,r=-3;this.streamType===p&&(r=-2);let n=r-t;if(e.line===n&&!i)return;a.has(e)||a.set(e,e.line),e.line=n}else setTimeout(()=>{e.line=a.get(e)||"auto"},500)})},s=()=>{var e,t;n(i,null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(am))&&t)},o=()=>{var e,t;let a=Array.from((null==(t=null==(e=this.mediaController)?void 0:e.media)?void 0:t.textTracks)||[]).filter(e=>["subtitles","captions"].includes(e.kind)&&"showing"===e.mode)[0];a!==i&&(null==i||i.removeEventListener("cuechange",s)),null==(i=a)||i.addEventListener("cuechange",s),n(i,o3(this,hM))};o(),null==(e=this.textTracks)||e.addEventListener("change",o),null==(t=this.textTracks)||t.addEventListener("addtrack",o),this.addEventListener("userinactivechange",()=>{var e,t;let a=null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(am))||t;o3(this,hM)!==a&&(o5(this,hM,a),n(i,o3(this,hM)))})};var hz=e=>{throw TypeError(e)},hQ=(e,t,i)=>t.has(e)||hz("Cannot "+i),hX=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends hX{});var hJ,h0=class extends hX{},h1=class{constructor(e,t={}){((e,t,i)=>t.has(e)?hz("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i))(this,hJ),((e,t,i,a)=>(hQ(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,hJ,null==t?void 0:t.detail)}get detail(){let e,t;return hQ(this,e=hJ,"read from private field"),t?t.call(this):e.get(this)}initCustomEvent(){}};hJ=new WeakMap;var h2={document:{createElement:function(e,t){return new h0}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(h0)},CustomEvent:h1,EventTarget:hX,HTMLElement:h0,HTMLVideoElement:class extends hX{}},h3="u"<typeof window||void 0===globalThis.customElements,h4=h3?h2:globalThis;h3&&h2.document,h4.customElements.get("mux-player")||(h4.customElements.define("mux-player",hj),h4.MuxPlayerElement=hj);var h5=parseInt(n.default.version)>=19,h9={className:"class",classname:"class",htmlFor:"for",crossOrigin:"crossorigin",viewBox:"viewBox",playsInline:"playsinline",autoPlay:"autoplay",playbackRate:"playbackrate"};function h8(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}var h6=Object.prototype.hasOwnProperty,h7=(e,t,i)=>!((e,t)=>{if(Object.is(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;if(Array.isArray(e))return!!Array.isArray(t)&&e.length===t.length&&e.some((e,i)=>t[i]===e);let i=Object.keys(e),a=Object.keys(t);if(i.length!==a.length)return!1;for(let a=0;a<i.length;a++)if(!h6.call(t,i[a])||!Object.is(e[i[a]],t[i[a]]))return!1;return!0})(t,e[i]),me=(e,t,i)=>{e[i]=t},mt=(e,t,i,a=me,r=h7)=>(0,n.useEffect)(()=>{let n=null==i?void 0:i.current;n&&r(n,t,e)&&a(n,t,e)},[null==i?void 0:i.current,t]),mi=(()=>{try{return"3.5.1"}catch{}return"UNKNOWN"})(),ma=(e,t,i)=>(0,n.useEffect)(()=>{let a=null==t?void 0:t.current;if(a&&i)return a.addEventListener(e,i),()=>{a.removeEventListener(e,i)}},[null==t?void 0:t.current,i,e]),mr=n.default.forwardRef(({children:e,...t},i)=>n.default.createElement("mux-player",{suppressHydrationWarning:!0,...((e={})=>{let{ref:t,...i}=e;return Object.entries(i).reduce((e,[t,i])=>{let a=((e,t)=>{if(!(!h5&&"boolean"==typeof t&&!t)){let i,a;if(i=e,null!=(a=h9)&&i in a)return h9[e];if(void 0!==t)return/[A-Z]/.test(e)?e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`):e}})(t,i);if(!a)return e;let r=h5||"boolean"!=typeof i?i:"";return e[a]=r,e},{})})(t),ref:i},e)),mn=n.default.forwardRef((e,t)=>{var i;let a=(0,n.useRef)(null),r=function(...e){return n.useCallback(function(...e){return t=>{let i=!1,a=e.map(e=>{let a=h8(e,t);return i||"function"!=typeof a||(i=!0),a});if(i)return()=>{for(let t=0;t<a.length;t++){let i=a[t];"function"==typeof i?i():h8(e[t],null)}}}}(...e),e)}(a,t),[s]=((e,t)=>{let{onAbort:i,onCanPlay:a,onCanPlayThrough:r,onEmptied:n,onLoadStart:s,onLoadedData:o,onLoadedMetadata:l,onProgress:d,onDurationChange:u,onVolumeChange:c,onRateChange:h,onResize:m,onWaiting:p,onPlay:v,onPlaying:b,onTimeUpdate:g,onPause:E,onSeeking:f,onSeeked:y,onStalled:A,onSuspend:k,onEnded:T,onError:w,onCuePointChange:_,onChapterChange:C,metadata:I,tokens:S,paused:R,playbackId:M,playbackRates:L,currentTime:D,themeProps:x,extraSourceParams:N,castCustomData:O,_hlsConfig:P,...U}=t;return mt("playbackRates",L,e),mt("metadata",I,e),mt("extraSourceParams",N,e),mt("_hlsConfig",P,e),mt("themeProps",x,e),mt("tokens",S,e),mt("playbackId",M,e),mt("castCustomData",O,e),mt("paused",R,e,(e,t)=>{null!=t&&(t?e.pause():e.play())},(e,t,i)=>(!e.hasAttribute("autoplay")||!!e.hasPlayed)&&h7(e,t,i)),mt("currentTime",D,e,(e,t)=>{null!=t&&(e.currentTime=t)}),ma("abort",e,i),ma("canplay",e,a),ma("canplaythrough",e,r),ma("emptied",e,n),ma("loadstart",e,s),ma("loadeddata",e,o),ma("loadedmetadata",e,l),ma("progress",e,d),ma("durationchange",e,u),ma("volumechange",e,c),ma("ratechange",e,h),ma("resize",e,m),ma("waiting",e,p),ma("play",e,v),ma("playing",e,b),ma("timeupdate",e,g),ma("pause",e,E),ma("seeking",e,f),ma("seeked",e,y),ma("stalled",e,A),ma("suspend",e,k),ma("ended",e,T),ma("error",e,w),ma("cuepointchange",e,_),ma("chapterchange",e,C),[U]})(a,e),[o]=(0,n.useState)(null!=(i=e.playerInitTime)?i:eE());return n.default.createElement(mr,{ref:r,defaultHiddenCaptions:e.defaultHiddenCaptions,playerSoftwareName:"mux-player-react",playerSoftwareVersion:mi,playerInitTime:o,...s})}),ms=e.i(754506),mo=e.i(143247);function ml({image:e,className:t,sizes:i}){return e&&"number"!=typeof e&&e.url&&e.width&&e.height?(0,r.jsx)(ms.default,{src:e.url,alt:e.alt||"",className:(0,mo.cn)(t),width:e.width,height:e.height,sizes:i}):null}e.s(["Video",0,function({video:e,className:t,autoplay:i=!1,playWhileHovered:a=!1,poster:s,sizes:o}){let l=(0,n.useRef)(null),d=(0,n.useRef)(null),[u,c]=(0,n.useState)(!1),[h,m]=(0,n.useState)(!1),[p,v]=(0,n.useState)(!1);if((0,n.useEffect)(()=>{if("when-in-view"!==i||!d.current)return;let e=new IntersectionObserver(e=>{e.forEach(e=>{e.intersectionRatio>=.2?c(!0):c(!1)})},{threshold:[.2]});return e.observe(d.current),()=>{d.current&&e.unobserve(d.current),e.disconnect()}},[i]),(0,n.useEffect)(()=>{if(!l.current||!e)return;let t=!1;if(a?t=h:"when-in-view"===i&&(t=u),"when-in-view"===i||a)if(t)l.current.play().catch(e=>{});else try{l.current.pause()}catch(e){}},[u,h,a,i,e]),!e||"number"==typeof e)return null;let b=e.playbackOptions?.[0],g=(0,mo.cn)("relative w-full h-auto",t),E={aspectRatio:e.aspectRatio||(e.maxWidth&&e.maxHeight?`${e.maxWidth}/${e.maxHeight}`:void 0)},f="string"==typeof s?s:b?.posterUrl||void 0,y=s&&"object"==typeof s,A=null;return A=b?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(mn,{ref:l,playbackId:b.playbackId??void 0,src:b.playbackUrl,poster:f,className:(0,mo.cn)("absolute w-full h-full"),autoPlay:!0===i&&"muted",muted:!0,playsInline:!0,loop:!0,onPlay:()=>{v(!0)},onPause:()=>{v(!1)},onEnded:()=>{v(!1)},style:{"--controls":"none","--media-object-fit":"cover"}}),y&&(0,r.jsx)(ml,{image:s,className:(0,mo.cn)("absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-200",p?"opacity-0":"opacity-100"),sizes:o})]}):null,(0,r.jsx)("div",{ref:d,className:g,style:E,onMouseEnter:()=>{a&&m(!0)},onMouseLeave:()=>{a&&m(!1)},children:A})}],629617)}]);