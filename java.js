document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');
  const overlay = document.getElementById('overlay');
  const svgLines = document.getElementById('svg-lines');
  let zIndexCounter = 1;
  let notes = [];

  overlay.addEventListener('dblclick', function (event) {
    const x = event.clientX;
    const y = event.clientY;
    createNotepad(x, y);
  });

  function createNotepad(x, y) {
    const notepad = document.createElement('textarea');
    notepad.className = 'notepad';
    notepad.style.left = x + 'px';
    notepad.style.top = y + 'px';
    notepad.style.zIndex = zIndexCounter++;
    container.appendChild(notepad);
    notepad.focus();

    notepad.addEventListener('blur', function () {
      const text = this.value;
      this.remove();
      createPoint(text, x, y);
      checkAndConnect();
    });
  }

  function createPoint(text, x, y) {
    const point = document.createElement('div');
    point.className = 'point';
    point.style.left = x - 5 + 'px';
    point.style.top = y - 5 + 'px';
    container.appendChild(point);

    notes.push({ text, x, y, point });

    point.addEventListener('dblclick', function () {
      editNotepad(text, x, y);
    });

    point.addEventListener('mouseenter', function () {
      point.title = text; // Shows the text as a tooltip
    });
  }

  function editNotepad(text, x, y) {
    const notepad = document.createElement('textarea');
    notepad.className = 'notepad';
    notepad.value = text;
    notepad.style.left = x + 'px';
    notepad.style.top = y + 'px';
    notepad.style.zIndex = zIndexCounter++;
    container.appendChild(notepad);
    notepad.focus();

    notepad.addEventListener('blur', function () {
      const newText = this.value;
      this.remove();
      notes = notes.map(note => 
        note.x === x && note.y === y ? { ...note, text: newText } : note
      );
      checkAndConnect();
    });
  }

  function checkAndConnect() {
    clearLines();

    const manoNotes = notes.filter(note => note.text.includes('mano'));

    for (let i = 0; i < manoNotes.length; i++) {
      for (let j = i + 1; j < manoNotes.length; j++) {
        drawLine(manoNotes[i], manoNotes[j]);
      }
    }
  }

  function drawLine(note1, note2) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'line-path');
    path.setAttribute('d', `M${note1.x} ${note1.y} Q ${(note1.x + note2.x) / 2} ${(note1.y + note2.y) / 2} ${note2.x} ${note2.y}`);
    svgLines.appendChild(path);
  }

  function clearLines() {
    while (svgLines.firstChild) {
      svgLines.removeChild(svgLines.firstChild);
    }
  }
});
