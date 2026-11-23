# Landing page · 1º Eusébio Cup de Handebol

Arquivos:
- `index.html` — página principal (textos, premiações, formulário e fichas)
- `regulamento.html` — regras principais, regulamento oficial e dúvidas
- `assets/` — estilos (`site.css`), logo, fotos e vídeos
- `apps-script/Code.gs` — script que recebe as inscrições numa Planilha Google
- `servidor.ps1` — servidor local só para testar no computador

## 1. Ligar o formulário ao Drive do evento (gratuito, ~10 minutos)

Sem esse passo, a página funciona em **modo de teste**: nada é gravado, e no final a equipe é orientada a mandar o resumo e o comprovante pelo WhatsApp.

> **Faça tudo logado na conta `handeboleusebiocup@gmail.com`.**
> A planilha, as pastas e todos os arquivos enviados pelo site ficam no Drive da conta que criar o script.
> Se estiver logada em outra conta, use uma janela anônima ou troque de conta no canto superior direito do Google.

**A. Criar a planilha**
1. Acesse drive.google.com com a conta do evento.
2. **Novo › Planilhas Google**. Dê o nome "Inscrições Eusébio Cup 2027".

**B. Colar o script**
3. Na planilha, abra **Extensões › Apps Script**.
4. Apague o que estiver lá, cole todo o conteúdo de `apps-script/Code.gs` e clique em **Salvar** (ícone de disquete).

**C. Configurar (uma vez só)**
5. Na barra de cima, escolha a função **`configurar`** e clique em **Executar**.
6. O Google vai pedir autorização: **Revisar permissões › escolha a conta do evento › Avançado › Acessar "projeto sem título" (não seguro) › Permitir**.
   (O aviso aparece porque o script é seu e não foi publicado na loja do Google. É normal.)
7. Volte para a planilha: devem aparecer as abas **Painel, Equipes, Atletas, Dirigentes e Fichas**, e chega um e-mail "planilha de inscrições configurada".

**D. Publicar o recebimento**
8. No Apps Script, clique em **Implantar › Nova implantação**. Na engrenagem, escolha **App da Web**.
   - Executar como: **Eu (handeboleusebiocup@gmail.com)**
   - Quem pode acessar: **Qualquer pessoa**
9. Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
10. No `index.html`, procure `ENDPOINT: ''` e cole a URL entre as aspas:
    `ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',`
    Depois suba o `index.html` de novo no GitHub.

> Se um dia alterar o `Code.gs`, publique de novo em **Implantar › Gerenciar implantações › ✏️ › Versão: Nova versão**. Assim a URL continua a mesma.

## 2. O que fica no Drive do evento

| Onde | O que tem |
|---|---|
| Aba **Painel** | Totais automáticos: equipes inscritas, pagamentos confirmados e a conferir, valor confirmado, atletas por categoria, hospedagem |
| Aba **Equipes** | Uma linha por equipe: dados da entidade e do responsável, categorias, lote, valor, hospedagem, link do comprovante Pix e colunas de controle (em amarelo) |
| Aba **Atletas** | Um atleta por linha: categoria, nome, nascimento, ano, documento e a caixinha **Documento conferido** |
| Aba **Dirigentes** | Técnicos, auxiliares, massagistas e diretores, com CREF |
| Aba **Fichas** | Resumo de cada ficha enviada e link da ficha assinada |
| Pasta **Eusébio Cup 2027 - Inscrições** | Uma subpasta por equipe (`protocolo - nome da equipe`) com o comprovante Pix e as fichas assinadas |
| E-mail do evento | Aviso a cada nova equipe e a cada envio de fichas |

## 3. Rotina da organização

1. Chegou o e-mail "Nova equipe inscrita": abra o comprovante pelo link e confira valor e nome no extrato da conta da Liga.
2. Na aba **Equipes**, mude **Status do pagamento** para **Pago ✓**, **Pagamento incompleto** ou **Recusado**. A cor da célula muda e o Painel atualiza sozinho.
3. Use **Anotações da organização** para registrar contatos e combinados.
4. Quando as fichas chegarem, **Fichas enviadas** vira "Sim" sozinho. Na aba **Atletas**, marque **Documento conferido** à medida que os documentos forem checados.
5. Se uma equipe reenviar as fichas, a versão nova substitui a anterior. A aba Fichas mostra "Reenvio".

Dica: para dar acesso a outras pessoas da organização, use o botão **Compartilhar** da planilha e da pasta.

## 4. Publicar a página

O site está no GitHub Pages. Para atualizar: no repositório, **Add file › Upload files**, arraste os arquivos alterados e clique em **Commit changes**. Arquivos dentro de `assets/` precisam ir para a pasta `assets` (arraste a pasta inteira).

## 5. Ajustes rápidos no `index.html`

No bloco `CONFIG`, perto do fim do arquivo:
- `ENDPOINT`: URL do Apps Script (passo 1).
- `WHATSAPP`: número de contato no formato `55 + DDD + número`, só dígitos.
- `LOTES`: valores e datas de fim de cada lote. O lote atual e a contagem regressiva mudam sozinhos; depois de 07/01/2027 o formulário fecha.

## Testar no computador

Num terminal, dentro da pasta `landing`, rode:
`powershell -ExecutionPolicy Bypass -File servidor.ps1` e abra http://localhost:8780
