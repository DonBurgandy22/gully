var gform;gform||(document.addEventListener("gform_main_scripts_loaded",function(){gform.scriptsLoaded=!0}),document.addEventListener("gform/theme/scripts_loaded",function(){gform.themeScriptsLoaded=!0}),window.addEventListener("DOMContentLoaded",function(){gform.domLoaded=!0}),gform={domLoaded:!1,scriptsLoaded:!1,themeScriptsLoaded:!1,isFormEditor:()=>"function"==typeof InitializeEditor,callIfLoaded:function(o){return!(!gform.domLoaded||!gform.scriptsLoaded||!gform.themeScriptsLoaded&&!gform.isFormEditor()||(gform.isFormEditor()&&console.warn("The use of gform.initializeOnLoaded() is deprecated in the form editor context and will be removed in Gravity Forms 3.1."),o(),0))},initializeOnLoaded:function(o){gform.callIfLoaded(o)||(document.addEventListener("gform_main_scripts_loaded",()=>{gform.scriptsLoaded=!0,gform.callIfLoaded(o)}),document.addEventListener("gform/theme/scripts_loaded",()=>{gform.themeScriptsLoaded=!0,gform.callIfLoaded(o)}),window.addEventListener("DOMContentLoaded",()=>{gform.domLoaded=!0,gform.callIfLoaded(o)}))},hooks:{action:{},filter:{}},addAction:function(o,r,e,t){gform.addHook("action",o,r,e,t)},addFilter:function(o,r,e,t){gform.addHook("filter",o,r,e,t)},doAction:function(o){gform.doHook("action",o,arguments)},applyFilters:function(o){return gform.doHook("filter",o,arguments)},removeAction:function(o,r){gform.removeHook("action",o,r)},removeFilter:function(o,r,e){gform.removeHook("filter",o,r,e)},addHook:function(o,r,e,t,n){null==gform.hooks[o][r]&&(gform.hooks[o][r]=[]);var d=gform.hooks[o][r];null==n&&(n=r+"_"+d.length),gform.hooks[o][r].push({tag:n,callable:e,priority:t=null==t?10:t})},doHook:function(r,o,e){var t;if(e=Array.prototype.slice.call(e,1),null!=gform.hooks[r][o]&&((o=gform.hooks[r][o]).sort(function(o,r){return o.priority-r.priority}),o.forEach(function(o){"function"!=typeof(t=o.callable)&&(t=window[t]),"action"==r?t.apply(null,e):e[0]=t.apply(null,e)})),"filter"==r)return e[0]},removeHook:function(o,r,t,n){var e;null!=gform.hooks[o][r]&&(e=(e=gform.hooks[o][r]).filter(function(o,r,e){return!!(null!=n&&n!=o.tag||null!=t&&t!=o.priority)}),gform.hooks[o][r]=e)}})

{"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://drawhistory.com/","url":"https://drawhistory.com/","name":"Social Impact Agency | Asia-Pacific | DrawHistory","isPartOf":{"@id":"https://www.drawhistory.com/#website"},"primaryImageOfPage":{"@id":"https://drawhistory.com/#primaryimage"},"image":{"@id":"https://drawhistory.com/#primaryimage"},"thumbnailUrl":"https://drawhistory.com/wp-content/uploads/2022/07/dh-hero-F.png","datePublished":"2022-04-11T07:07:00+00:00","dateModified":"2025-08-15T06:06:37+00:00","description":"DrawHistory is a social impact agency using brand, design, comms, and research to design new futures in the Asia-Pacific. Find out more today.","breadcrumb":{"@id":"https://drawhistory.com/#breadcrumb"},"inLanguage":"en-AU","potentialAction":[{"@type":"ReadAction","target":["https://drawhistory.com/"]}]},{"@type":"ImageObject","inLanguage":"en-AU","@id":"https://drawhistory.com/#primaryimage","url":"https://drawhistory.com/wp-content/uploads/2022/07/dh-hero-F.png","contentUrl":"https://drawhistory.com/wp-content/uploads/2022/07/dh-hero-F.png","width":1140,"height":1377},{"@type":"BreadcrumbList","@id":"https://drawhistory.com/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]},{"@type":"WebSite","@id":"https://www.drawhistory.com/#website","url":"https://www.drawhistory.com/","name":"DrawHistory","description":"Strategy and Design Consultancy","potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://www.drawhistory.com/?s={search_term_string}"},"query-input":{"@type":"PropertyValueSpecification","valueRequired":true,"valueName":"search_term_string"}}],"inLanguage":"en-AU"}]}

WebFontConfig={google:{families:["Roboto Mono:ital,wght@0,400;0,500;1,400&display=swap"]}};if ( typeof WebFont === "object" && typeof WebFont.load === "function" ) { WebFont.load( WebFontConfig ); }

var gf_global={"gf_currency_config":{"name":"Australian Dollar","symbol_left":"$","symbol_right":"","symbol_padding":" ","thousand_separator":",","decimal_separator":".","decimals":2,"code":"AUD"},"base_url":"https://drawhistory.com/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://drawhistory.com/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"3ff2223f92556c2166da5031ff880b62","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};var gform_i18n={"datepicker":{"days":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"},"months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"firstDay":1,"iconText":"Select date"}};var gf_legacy_multi={"1":""};var gform_gravityforms={"strings":{"invalid_file_extension":"This type of file is not allowed. Must be one of the following:","delete_file":"Delete this file","in_progress":"in progress","file_exceeds_limit":"File exceeds size limit","illegal_extension":"This type of file is not allowed.","max_reached":"Maximum number of files reached","unknown_error":"There was a problem while saving the file on the server","currently_uploading":"Please wait for the uploading to complete","cancel":"Cancel","cancel_upload":"Cancel this upload","cancelled":"Cancelled"},"vars":{"images_url":"https://drawhistory.com/wp-content/plugins/gravityforms/images"}}

window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-33548333-1');



gform.initializeOnLoaded(function(){gformInitSpinner(1,'https://drawhistory.com/wp-content/plugins/gravityforms/images/spinner.svg',!0);jQuery('#gform_ajax_frame_1').on('load',function(){var contents=jQuery(this).contents().find('*').html();var is_postback=contents.indexOf('GF_AJAX_POSTBACK')>=0;if(!is_postback){return}var form_content=jQuery(this).contents().find('#gform_wrapper_1');var is_confirmation=jQuery(this).contents().find('#gform_confirmation_wrapper_1').length>0;var is_redirect=contents.indexOf('gformRedirect(){')>=0;var is_form=form_content.length>0&&!is_redirect&&!is_confirmation;var mt=parseInt(jQuery('html').css('margin-top'),10)+parseInt(jQuery('body').css('margin-top'),10)+100;if(is_form){jQuery('#gform_wrapper_1').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_1').addClass('gform_validation_error')}else{jQuery('#gform_wrapper_1').removeClass('gform_validation_error')}setTimeout(function(){jQuery(document).scrollTop(jQuery('#gform_wrapper_1').offset().top-mt)},50);if(window.gformInitDatepicker){gformInitDatepicker()}if(window.gformInitPriceFields){gformInitPriceFields()}var current_page=jQuery('#gform_source_page_number_1').val();gformInitSpinner(1,'https://drawhistory.com/wp-content/plugins/gravityforms/images/spinner.svg',!0);jQuery(document).trigger('gform_page_loaded',[1,current_page]);window.gf_submitting_1=!1}else if(!is_redirect){var confirmation_content=jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content=contents}jQuery('#gform_wrapper_1').replaceWith(confirmation_content);jQuery(document).scrollTop(jQuery('#gf_1').offset().top-mt);jQuery(document).trigger('gform_confirmation_loaded',[1]);window.gf_submitting_1=!1;wp.a11y.speak(jQuery('#gform_confirmation_message_1').text())}else{jQuery('#gform_1').append(contents);if(window.gformRedirect){gformRedirect()}}jQuery(document).trigger("gform_pre_post_render",[{formId:"1",currentPage:"current_page",abort:function(){this.preventDefault()}}]);if(event&&event.defaultPrevented){return}const gformWrapperDiv=document.getElementById("gform_wrapper_1");if(gformWrapperDiv){const visibilitySpan=document.createElement("span");visibilitySpan.id="gform_visibility_test_1";gformWrapperDiv.insertAdjacentElement("afterend",visibilitySpan)}const visibilityTestDiv=document.getElementById("gform_visibility_test_1");let postRenderFired=!1;function triggerPostRender(){if(postRenderFired){return}postRenderFired=!0;jQuery(document).trigger('gform_post_render',[1,current_page]);gform.utils.trigger({event:'gform/postRender',native:!1,data:{formId:1,currentPage:current_page}});gform.utils.trigger({event:'gform/post_render',native:!1,data:{formId:1,currentPage:current_page}});if(visibilityTestDiv){visibilityTestDiv.parentNode.removeChild(visibilityTestDiv)}}function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);}}const debouncedTriggerPostRender=debounce(function(){triggerPostRender()},200);if(visibilityTestDiv&&visibilityTestDiv.offsetParent===null){const observer=new MutationObserver((mutations)=>{mutations.forEach((mutation)=>{if(mutation.type==='attributes'&&visibilityTestDiv.offsetParent!==null){debouncedTriggerPostRender();observer.disconnect()}})});observer.observe(document.body,{attributes:!0,childList:!1,subtree:!0,attributeFilter:['style','class'],})}else{triggerPostRender()}})})

{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":["/wp-*.php","/wp-admin/*","/wp-content/uploads/*","/wp-content/*","/wp-content/plugins/*","/wp-content/themes/hatchet/*","/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}

(()=>{'use strict';let loaded=!1,scrolled=!1,timerId;function load(){if(loaded){return}
loaded=!0;clearTimeout(timerId);window.removeEventListener('touchstart',load);document.body.removeEventListener('mouseenter',load);document.body.removeEventListener('click',load);window.removeEventListener('scroll',scrollHandler);const t=document.getElementsByTagName('script')[0];const s=document.createElement('script');s.type='text/javascript';s.id='hcaptcha-api';s.src='https://js.hcaptcha.com/1/api.js?onload=hCaptchaOnLoad&render=explicit';s.async=!0;t.parentNode.insertBefore(s,t)}
function scrollHandler(){if(!scrolled){scrolled=!0;return}
load()}
document.addEventListener('hCaptchaBeforeAPI',function(){const delay=-100;if(delay>=0){setTimeout(load,delay);return}
window.addEventListener('touchstart',load);document.body.addEventListener('mouseenter',load);document.body.addEventListener('click',load);window.addEventListener('scroll',scrollHandler)})})()

wp.i18n.setLocaleData({'text direction\u0004ltr':['ltr']})

(function(domain,translations){var localeData=translations.locale_data[domain]||translations.locale_data.messages;localeData[""].domain=domain;wp.i18n.setLocaleData(localeData,domain)})("default",{"translation-revision-date":"2026-02-18 19:42:42+0000","generator":"GlotPress\/4.0.3","domain":"messages","locale_data":{"messages":{"":{"domain":"messages","plural-forms":"nplurals=2; plural=n != 1;","lang":"en_AU"},"Notifications":["Notifications"]}},"comment":{"reference":"wp-includes\/js\/dist\/a11y.js"}})

var gform_theme_config={"common":{"form":{"honeypot":{"version_hash":"3ff2223f92556c2166da5031ff880b62"},"ajax":{"ajaxurl":"https://drawhistory.com/wp-admin/admin-ajax.php","ajax_submission_nonce":"c4c21f31ee","i18n":{"step_announcement":"Step %1$s of %2$s, %3$s","unknown_error":"There was an unknown error processing your request. Please try again."}}}},"hmr_dev":"","public_path":"https://drawhistory.com/wp-content/plugins/gravityforms/assets/js/dist/","config_nonce":"1551a95baf"}

var loadmore={"url":"https://drawhistory.com/wp-admin/admin-ajax.php","theme_directory_uri":"https://drawhistory.com/wp-content/themes/hatchet"}

var HCaptchaMainObject={"params":"{\"sitekey\":\"7c42462e-f661-4168-8981-a15d9412d95e\",\"theme\":\"light\",\"size\":\"invisible\",\"hl\":\"en\"}"}

gform.initializeOnLoaded(function(){jQuery(document).on('gform_post_render',function(event,formId,currentPage){if(formId==1){if(typeof Placeholders!='undefined'){Placeholders.enable()}}});jQuery(document).on('gform_post_conditional_logic',function(event,formId,fields,isInit){})})

gform.initializeOnLoaded(function(){jQuery(document).trigger("gform_pre_post_render",[{formId:"1",currentPage:"1",abort:function(){this.preventDefault()}}]);if(event&&event.defaultPrevented){return}const gformWrapperDiv=document.getElementById("gform_wrapper_1");if(gformWrapperDiv){const visibilitySpan=document.createElement("span");visibilitySpan.id="gform_visibility_test_1";gformWrapperDiv.insertAdjacentElement("afterend",visibilitySpan)}const visibilityTestDiv=document.getElementById("gform_visibility_test_1");let postRenderFired=!1;function triggerPostRender(){if(postRenderFired){return}postRenderFired=!0;jQuery(document).trigger('gform_post_render',[1,1]);gform.utils.trigger({event:'gform/postRender',native:!1,data:{formId:1,currentPage:1}});gform.utils.trigger({event:'gform/post_render',native:!1,data:{formId:1,currentPage:1}});if(visibilityTestDiv){visibilityTestDiv.parentNode.removeChild(visibilityTestDiv)}}function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);}}const debouncedTriggerPostRender=debounce(function(){triggerPostRender()},200);if(visibilityTestDiv&&visibilityTestDiv.offsetParent===null){const observer=new MutationObserver((mutations)=>{mutations.forEach((mutation)=>{if(mutation.type==='attributes'&&visibilityTestDiv.offsetParent!==null){debouncedTriggerPostRender();observer.disconnect()}})});observer.observe(document.body,{attributes:!0,childList:!1,subtree:!0,attributeFilter:['style','class'],})}else{triggerPostRender()}})

{
    "@context": "http://schema.org",
    "@type": "LocalBusiness",
    
        "@id":"https://drawhistory.com",
    "name":"DrawHistory",
          "email": "hello@drawhistory.com",
        "url": "https://drawhistory.com",
    "address":{
      "@type":"PostalAddress",
              "streetAddress": "136 Stirling Hwy",
      
              "addressLocality": "Nedlands",
      
              "addressRegion": "Western Australia",
      
              "postalCode": "6009",
      
              "addressCountry": "AU"
          },
    "geo":{
      "@type":"GeoCoordinates",
      
          },
          "telephone": ["+61864689861"],
    
          "vatID": "30 149 945 513",
    
        "currenciesAccepted":"AUD",
    "priceRange":"$",
    "paymentAccepted":[
      "MasterCard",
      "VISA",
      "Credit Card",
      "Cash",
      "AmericanExpress"
    ],
    "sameAs":[
      "https://www.instagram.com/draw.history/","https://www.facebook.com/drawhistory/","https://twitter.com/DrawHistory","http://www.linkedin.com/company/drawhistory"
    ]
  }