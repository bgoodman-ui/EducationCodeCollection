(function () {
  var examples = document.querySelectorAll('.factory-example');

  examples.forEach(function (example) {
    var button = example.querySelector('.factory-fullscreen-toggle');
    var icon = button && button.querySelector('.factory-fullscreen-icon');
    var status = example.querySelector('.factory-fullscreen-status');
    if (!button || !icon || !status) return;

    button.addEventListener('click', async function () {
      status.textContent = '';
      try {
        if (document.fullscreenElement === example) {
          await document.exitFullscreen();
        } else {
          await example.requestFullscreen();
        }
      } catch (error) {
        status.textContent = 'Unable to change fullscreen mode: ' + error.message;
      }
    });
  });

  document.addEventListener('fullscreenchange', function () {
    examples.forEach(function (example) {
      var button = example.querySelector('.factory-fullscreen-toggle');
      var icon = button && button.querySelector('.factory-fullscreen-icon');
      if (!button || !icon) return;

      var isFullscreen = document.fullscreenElement === example;
      button.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
      button.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
      icon.textContent = isFullscreen ? '×' : '⛶';
    });
  });
})();
// Scale the Box Factory to fill the screen in fullscreen mode.
(function () {
  var factory = document.getElementById('factory');
  if (!factory) return;
  var section = factory.closest('.factory-example');

  function fit() {
    factory.style.transform = '';   // reset first so we measure the natural size
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs !== section) return;     // only scale when this example is fullscreen

    var margin = 32;                // breathing room around the edges, in px
    var scale = Math.min(
      (window.innerWidth - margin) / factory.offsetWidth,
      (window.innerHeight - margin) / factory.offsetHeight
    );
    factory.style.transform = 'scale(' + scale + ')';
  }

  document.addEventListener('fullscreenchange', fit);
  document.addEventListener('webkitfullscreenchange', fit);
  window.addEventListener('resize', fit);

})();
