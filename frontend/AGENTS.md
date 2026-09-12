# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Regras de UI e Feedback Visual

- **Feedback Visual Obrigatório (Snackbar Global)**:
  - Todas as telas e ações de mutação (criação, edição, exclusão, importação ou qualquer ação do usuário que altere dados ou execute requisição) **devem obrigatoriamente** fornecer feedback visual imediato ao usuário.
  - O feedback deve ser acionado através do hook global `useSnackbar()` localizado em `frontend/context/SnackbarContext.tsx`.
  - Métodos padronizados:
    - `showSuccess(message: string, duration?: number)`: para ações bem-sucedidas.
    - `showError(message: string, duration?: number)`: para falhas ou erros da API.
  - As cores de feedback visual **devem sempre** derivar da constante `snackbarColor` em `frontend/constants/theme.ts` (`success` e `error`).
  - Nunca recrie componentes locais de `<Snackbar>` dentro das telas; sempre utilize o `useSnackbar()` global.

