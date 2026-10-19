// Box Factory: runs the animation for the FOR-loop multiplication game.
// Reads the two numbers typed into the terminal and builds X columns of Y boxes.
(function () {
  // Stop quietly if this page has no factory.
  var root = document.getElementById('factory');
  if (!root) return;

  // ---- Page elements ----
  var timesIn = document.getElementById('factory-times');   // X: how many loops (columns)
  var addIn = document.getElementById('factory-add');       // Y: number added each loop (column height)
  var runBtn = document.getElementById('factory-run');
  var resetBtn = document.getElementById('factory-reset');
  var msg = document.getElementById('factory-msg');         // "Loop 2 of 3..." message
  var counter = document.getElementById('factory-counter'); // "total = 4 + 4 = 8" line
  var scene = document.getElementById('factory-scene');     // area where boxes are drawn

  // ---- Layout numbers (pixels inside the scene; keep in sync with the CSS) ----
  var PITCH = 32;          // box size + gap, used to stack boxes
  var BELT_TOP = 480;      // top of the belt; boxes sit on it
  var FLOOR_TOP = 500;     // top of the floor; dropped stacks sit on it
  var CHUTE_X = 320;       // hidden behind the machine; boxes start here
  var PIPE_TOP = 58;       // height of the pipe's horizontal run
  var STACK_X = 352;       // where each column builds up, under the pipe spout
  var END_X = 488;         // end of the belt, where columns fall off
  var BIN_X = 570;         // left edge of the first dropped column
  var running = false;     // true while an animation is playing

  // Pause helper: "await wait(500)" waits half a second.
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // Turn an input into a whole number from 1 to 10, or null if it's blank/invalid.
  function clamp(input) {
    var n = parseInt(input.value, 10);
    if (isNaN(n)) return null;
    return Math.min(10, Math.max(1, n));
  }

  // Remove all boxes and clear the text.
  function clearScene() {
    scene.querySelectorAll('.box').forEach(function (b) { b.remove(); });
    counter.textContent = '';
    msg.textContent = '';
  }

  // The animation. Each pass of the outer loop is one pass of the on-screen FOR loop.
  async function run() {
    if (running) return;
    var times = clamp(timesIn);
    var add = clamp(addIn);
    if (times === null || add === null) {
      msg.textContent = 'Type a number from 1 to 10 in both boxes!';
      return;
    }
    // Show the cleaned-up numbers, reset, and lock the controls while running.
    timesIn.value = times;
    addIn.value = add;
    clearScene();
    running = true;
    root.classList.add('running'); // makes the belt stripes move (see CSS)
    runBtn.disabled = timesIn.disabled = addIn.disabled = true;

    var total = 0;   // running answer
    var parts = [];  // the numbers added so far, for the "4 + 4 + 4" text
    for (var i = 0; i < times; i++) {
      total += add;
      parts.push(add);
      msg.textContent = 'Loop ' + (i + 1) + ' of ' + times + ': add ' + add + ' more boxes!';
      counter.textContent = 'total = ' + parts.join(' + ') + ' = ' + total;

      // Build one column: boxes leave the machine one at a time.
      var column = [];
      for (var j = 0; j < add; j++) {
        var box = document.createElement('div');
        box.className = 'box';
        box.style.left = CHUTE_X + 'px';
        box.style.top = PIPE_TOP + 'px';
        scene.appendChild(box);
        column.push(box);
        await wait(30);                    // lets the browser draw the start position first
        box.style.left = STACK_X + 'px';   // slide along the pipe (CSS transition animates it)
        await wait(450);
        // Drop down the pipe onto the belt, on top of the boxes already there.
        box.style.top = (BELT_TOP - (j + 1) * PITCH + 2) + 'px';
        await wait(350);
      }
      await wait(200);

      // Column is full: the belt carries it to the end...
      column.forEach(function (b) { b.style.left = END_X + 'px'; });
      await wait(900);

      // ...then it drops off into the next slot, side by side with earlier columns.
      var destX = BIN_X + i * PITCH;
      column.forEach(function (b, j) {
        b.style.left = destX + 'px';
        b.style.top = (FLOOR_TOP - (j + 1) * PITCH + 2) + 'px';
      });
      await wait(450);
    }

    // Final answer, then unlock the controls.
    msg.textContent = 'Done! ' + times + ' columns × ' + add + ' high = ' + total + ' boxes!';
    root.classList.remove('running');
    runBtn.disabled = timesIn.disabled = addIn.disabled = false;
    running = false;
  }

  // Start and Clear buttons (Clear is ignored while running).
  runBtn.addEventListener('click', run);
  resetBtn.addEventListener('click', function () { if (!running) clearScene(); });
})();
