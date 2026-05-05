# Skill: Refactor

Carregue esta skill antes de tarefas de refatoração no Fluxo.

## Quando usar
- Pedido explícito de refactor / "limpar" / "extrair função"
- Ao detectar código duplicado >3x ou função >80 linhas
- NÃO usar como bônus durante outras tarefas (rule #7 do INSTRUCTIONS)

## Protocolo

### 1. Antes de mexer
Liste em uma frase cada:
- **Escopo**: arquivos/funções afetados
- **Comportamento**: o que NÃO deve mudar (lista de invariantes)
- **Risco**: o que pode quebrar (ex: tipos no `state.tasks`, ordem de eventos)

Aguarde "ok" do usuário antes de codar.

### 2. Durante
- Use `Edit` para mudanças cirúrgicas. `Write` apenas para rewrite >50% do arquivo.
- Refatore em commits pequenos: 1 commit = 1 transformação.
- Mantenha o código funcionando entre commits (não quebre testes/sintaxe).

### 3. Verificação
Após cada batch:
```bash
node --check app.js && node --check sw.js
python3 -m http.server 8765 &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/index.html
```

Se quebrar: `git stash` ou reverte e investiga. Não force.

### 4. Mensagem de commit
`refactor(escopo): o que foi reorganizado e por quê (1 linha)`

## Padrões aceitos no Fluxo
- Funções nomeadas em camelCase, exportadas via top-level (sem módulos ES)
- Estado global via `state` object (não criar Redux/store)
- DOM manipulado via helper `el(tag, attrs, ...children)` em `app.js`
- Storage: chave única `fluxo/v2`. Bump pra `fluxo/v3` se schema muda.

## Padrões a evitar
- Adicionar dependências (sem build, sem npm)
- Criar arquivos novos a menos que >150 linhas justifique
- Comentários explicando "o quê". Comentários só para "por quê" não-óbvio.
- Try/catch defensivo em código interno (só em I/O e parsers de input externo)
