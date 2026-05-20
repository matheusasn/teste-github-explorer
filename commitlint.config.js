module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // Aceita emoji (ou qualquer prefixo não-alfanumérico) opcional antes do tipo.
      // Exemplos válidos:
      //   feat: cria projeto
      //   ✨ feat: cria projeto
      //   🔧 chore(git): adiciona husky
      //   ✨ feat(domain)!: breaking change
      headerPattern: /^(?:(\S+)\s+)?(\w+)(?:\(([^)]+)\))?(!?):\s+(.+)$/u,
      headerCorrespondence: ['emoji', 'type', 'scope', 'breaking', 'subject'],
    },
  },
};
