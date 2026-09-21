/**
 * Terminal One-Shot Typing Simulation
 * Types commands once on page load without endless repetitive loops.
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('hero-terminal-body');
  if (!terminalBody) return;

  const steps = [
    { type: 'cmd', text: 'whoami', prompt: '$' },
    { type: 'output', text: 'abderrahmane-imlouli' },
    { type: 'pause', duration: 400 },
    { type: 'cmd', text: 'focus', prompt: '$' },
    { type: 'output', text: 'cybersecurity · networks · systems · software' },
    { type: 'pause', duration: 400 },
    { type: 'cmd', text: 'status', prompt: '$' },
    { type: 'output', text: '4th-year cybersecurity engineering student — building & learning' }
  ];

  // If user prefers reduced motion, render immediately without typing delay
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    terminalBody.innerHTML = `
      <div class="terminal-line"><span class="terminal-prompt">$</span> <span class="terminal-cmd">whoami</span><div class="terminal-output">abderrahmane-imlouli</div></div>
      <div class="terminal-line"><span class="terminal-prompt">$</span> <span class="terminal-cmd">focus</span><div class="terminal-output">cybersecurity · networks · systems · software</div></div>
      <div class="terminal-line"><span class="terminal-prompt">$</span> <span class="terminal-cmd">status</span><div class="terminal-output">4th-year cybersecurity engineering student — building & learning</div></div>
    `;
    return;
  }

  terminalBody.innerHTML = '';
  let currentStep = 0;

  function runNextStep() {
    if (currentStep >= steps.length) {
      // Completed typing - add idle subtle cursor at end
      const endLine = document.createElement('div');
      endLine.className = 'terminal-line';
      endLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor"></span>`;
      terminalBody.appendChild(endLine);
      return;
    }

    const step = steps[currentStep];

    if (step.type === 'pause') {
      currentStep++;
      setTimeout(runNextStep, step.duration);
    } else if (step.type === 'cmd') {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="terminal-prompt">${step.prompt}</span> <span class="terminal-cmd"></span><span class="terminal-cursor"></span>`;
      terminalBody.appendChild(line);

      const cmdEl = line.querySelector('.terminal-cmd');
      const cursorEl = line.querySelector('.terminal-cursor');
      let charIdx = 0;

      const typeInterval = setInterval(() => {
        if (charIdx < step.text.length) {
          cmdEl.textContent += step.text[charIdx];
          charIdx++;
        } else {
          clearInterval(typeInterval);
          cursorEl.remove();
          currentStep++;
          setTimeout(runNextStep, 250);
        }
      }, 45);
    } else if (step.type === 'output') {
      const output = document.createElement('div');
      output.className = 'terminal-output';
      output.textContent = step.text;
      terminalBody.appendChild(output);
      currentStep++;
      setTimeout(runNextStep, 200);
    }
  }

  // Start after slight entry delay
  setTimeout(runNextStep, 500);
});
