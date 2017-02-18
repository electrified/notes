window.jQuery = window.$ = require("jquery");

require('foundation-sites/dist/js/foundation');

$(document).ready(function() {
$(document).foundation();
/*
  $(document).foundation({
    orbit: {
      animation: 'slide',
      timer_speed: 1000,
      pause_on_hover: true,
      animation_speed: 500,
      navigation_arrows: true,
      bullets: false
    }
  });*/
});

require('highlight.js/styles/railscasts.css');

require(['highlight.js/lib/highlight'], function(hljs) {
  hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
  hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
  hljs.registerLanguage('cmake', require('highlight.js/lib/languages/cmake'));
  hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
  hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
  hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
  hljs.initHighlightingOnLoad();
});

require('react-tagsinput/react-tagsinput.css');

require('fixed-data-table/dist/fixed-data-table.css');
