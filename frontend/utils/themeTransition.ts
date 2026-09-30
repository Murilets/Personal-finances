export interface TransitionOrigin {
  x: number;
  y: number;
}

// Android/iOS: sem animação de transição, o tema só troca. A versão web
// (themeTransition.web.ts) faz o "circular reveal"; o Metro escolhe o arquivo por plataforma.
export function runThemeTransition(_origin: TransitionOrigin | undefined, apply: () => void) {
  apply();
}
