(function(){
  var toggle  = document.getElementById('off-canvas-toggle');
  var nav     = document.getElementById('off-canvas-nav');
  var overlay = document.getElementById('off-canvas-overlay');

  function setOpen(open){
    toggle.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    nav.setAttribute('aria-hidden', !open);
  }

  toggle.addEventListener('click', function(){ setOpen(!nav.classList.contains('is-open')); });
  overlay.addEventListener('click', function(){ setOpen(false); });

  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });

  nav.querySelectorAll('.opener').forEach(function(op){
    op.addEventListener('click', function(){
      var wasActive = op.classList.contains('active');
      nav.querySelectorAll('.opener').forEach(function(o){
        var isExpanded = o === op && !wasActive;
        var submenu = document.getElementById(o.getAttribute('aria-controls'));

        o.classList.toggle('active', isExpanded);
        o.setAttribute('aria-expanded', isExpanded);
        submenu.setAttribute('aria-hidden', !isExpanded);
        submenu.toggleAttribute('inert', !isExpanded);
      });
    });
  });
})();
