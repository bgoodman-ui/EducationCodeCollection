(function () {
  var root = document.getElementById('factory');
  if (!root) return;

  var timesIn = document.getElementById('factory-times');
  var addIn = document.getElementById('factory-add');
  var runBtn = document.getElementById('factory-run');
  var resetBtn = document.getElementById('factory-reset');
  var msg = document.getElementById('factory-msg');
  var counter = document.getElementById('factory-counter');
  var scene = document.getElementById('factory-scene');

  var PITCH = 32;          // box size + gap
  var BELT_TOP = 340;      // top of the belt; boxes sit on it
  var FLOOR_TOP = 360;     // top of the floor; stacks sit on it
  var START_X = 100;       // where the machine drops new columns
  var END_X = 300;         // end of the belt
  var BIN_X = 330;         // left edge of first stack
  var running = false;

  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  function clamp(input) {
    var n = parseInt(input.value, 10);
    if (isNaN(n)) return null;
    return Math.min(10, Math.max(1, n));
  }

  function clearScene() {
    scene.querySelectorAll('.box').forEach(function (b) { b.remove(); });
    counter.textContent = '';
    msg.textContent = '';
  }

  async function run() {
    if (running) return;
    var times = clamp(timesIn);
    var add = clamp(addIn);
    if (times === null || add === null) {
      msg.textContent = 'Type a number from 1 to 10 in both boxes!';
      return;
    }
    timesIn.value = times;
    addIn.value = add;
    clearScene();
    running = true;
    root.classList.add('running');
    runBtn.disabled = timesIn.disabled = addIn.disabled = true;

    var total = 0;
    var parts = [];
    for (var i = 0; i < times; i++) {
      total += add;
      parts.push(add);
      msg.textContent = 'Loop ' + (i + 1) + ' of ' + times + ': add ' + add + ' more boxes!';
      counter.textContent = 'total = ' + parts.join(' + ') + ' = ' + total;

      var column = [];
      for (var j = 0; j < add; j++) {
        var box = document.createElement('div');
        box.className = 'box';
        box.style.left = START_X + 'px';
        box.style.top = (BELT_TOP - (j + 1) * PITCH + 2) + 'px';
        scene.appendChild(box);
        column.push(box);
      }
      await wait(50);
      var destX = BIN_X + i * PITCH;
      column.forEach(function (b) { b.style.left = END_X + 'px'; });
      await wait(850);
      column.forEach(function (b, j) {
        b.style.left = destX + 'px';
        b.style.top = (FLOOR_TOP - (j + 1) * PITCH + 2) + 'px';
      });
      await wait(450);
    }

    msg.textContent = 'Done! ' + times + ' columns × ' + add + ' high = ' + total + ' boxes!';
    root.classList.remove('running');
    runBtn.disabled = timesIn.disabled = addIn.disabled = false;
    running = false;
  }

  runBtn.addEventListener('click', run);
  resetBtn.addEventListener('click', function () { if (!running) clearScene(); });
})();
