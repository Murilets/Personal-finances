import { flushSync } from 'react-dom';

export interface TransitionOrigin {
  x: number;
  y: number;
}

const DURATION_MS = 600;
const STYLE_ID = 'theme-transition-style';

// O navegador faz um cross-fade por padrão entre o snapshot antigo e o novo;
// desligamos isso para que só o clip-path circular (animado abaixo) apareça.
function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
  `;
  document.head.appendChild(style);
}

// "Circular reveal": o novo tema aparece dentro de um círculo que nasce em `origin`
// e cresce até cobrir a tela toda. Sem View Transitions API ou com
// prefers-reduced-motion, apenas aplica a mudança.
export function runThemeTransition(origin: TransitionOrigin | undefined, apply: () => void) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduceMotion) {
    apply();
    return;
  }

  ensureStyle();

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  // raio até o canto mais distante: garante que o círculo cubra a tela inteira
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // flushSync: o React 19 atualiza de forma assíncrona; o snapshot "novo" só sai
  // correto se o DOM já estiver com o novo tema quando este callback terminar.
  const transition = document.startViewTransition(() => {
    flushSync(apply);
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: DURATION_MS, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
}
