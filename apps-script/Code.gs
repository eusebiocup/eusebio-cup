/**
 * 1º Eusébio Cup de Handebol — recebimento das inscrições
 *
 * Este script é colado numa Planilha Google (Extensões > Apps Script).
 * Cada inscrição de equipe vira uma linha na aba "Equipes", cada atleta uma linha
 * na aba "Atletas" e cada dirigente uma linha na aba "Dirigentes".
 * Os comprovantes Pix e as fichas assinadas são salvos numa pasta do Google Drive.
 *
 * Passo a passo no arquivo LEIA-ME.md, na pasta da landing page.
 */

const NOME_PASTA = 'Eusébio Cup 2027 - Comprovantes e Fichas';
const EMAIL_AVISO = ''; // opcional: coloque um e-mail para ser avisado a cada nova inscrição

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActive();
    const pasta = obterPasta_();

    if (d.tipo === 'equipe') {
      const comp = salvarArquivo_(pasta, d.comprovante, d.protocolo + ' - comprovante Pix - ' + d.entidade);
      const aba = obterAba_(ss, 'Equipes', [
        'Data', 'Protocolo', 'Entidade', 'CEP entidade', 'Endereço entidade', 'Responsável', 'Estado', 'Cidade',
        'Endereço responsável', 'Bairro', 'CEP responsável', 'Celular', 'E-mail', 'Categorias',
        'Atletas pagos', 'Lote', 'Valor por atleta', 'Valor total', 'Hosp. masc.', 'Dirig. masc.',
        'Hosp. fem.', 'Dirig. fem.', 'Hospedagem total', 'Tipo de hospedagem', 'Previsão de chegada',
        'Observações', 'Comprovante Pix'
      ]);
      aba.appendRow([
        new Date(), d.protocolo, d.entidade, d.cepEntidade, d.enderecoEntidade, d.responsavel, d.estado, d.cidade,
        d.enderecoResponsavel, d.bairro, d.cepResponsavel, d.celular, d.email, (d.categorias || []).join(', '),
        d.atletas, d.lote, d.valorAtleta, d.valorTotal, d.hospMasc, d.dirigMasc,
        d.hospFem, d.dirigFem, d.hospTotal, d.tipoHospedagem, d.chegada,
        d.observacoes, comp
      ]);
      avisar_('Nova equipe inscrita: ' + d.entidade + ' (' + d.protocolo + ')',
        d.entidade + ' — ' + d.cidade + '/' + d.estado + '\nResponsável: ' + d.responsavel + ' · ' + d.celular +
        '\nCategorias: ' + (d.categorias || []).join(', ') + '\nAtletas: ' + d.atletas + ' · Total: ' + d.valorTotal +
        '\nComprovante: ' + comp);
    }

    if (d.tipo === 'atletas') {
      const abaA = obterAba_(ss, 'Atletas', ['Data', 'Protocolo', 'Entidade', 'Categoria', 'Nº', 'Nome do atleta', 'Data de nascimento', 'Identidade']);
      const abaD = obterAba_(ss, 'Dirigentes', ['Data', 'Protocolo', 'Entidade', 'Categoria', 'Função', 'Nome', 'Nº do CREF']);
      const abaF = obterAba_(ss, 'Fichas', ['Data', 'Protocolo', 'Entidade', 'Categoria', 'Qtd. atletas', 'Telefone', 'E-mail', 'Declaração aceita', 'Ficha assinada']);
      const agora = new Date();
      (d.fichas || []).forEach(function (f) {
        const linhasA = f.atletas.map(function (a, i) { return [agora, d.protocolo, d.entidade, f.categoria, i + 1, a.nome, a.nascimento, a.identidade]; });
        if (linhasA.length) abaA.getRange(abaA.getLastRow() + 1, 1, linhasA.length, linhasA[0].length).setValues(linhasA);
        const linhasD = f.dirigentes.filter(function (x) { return x.nome; })
          .map(function (x) { return [agora, d.protocolo, d.entidade, f.categoria, x.funcao, x.nome, x.cref]; });
        if (linhasD.length) abaD.getRange(abaD.getLastRow() + 1, 1, linhasD.length, linhasD[0].length).setValues(linhasD);
        const ficha = f.arquivo ? salvarArquivo_(pasta, f.arquivo, d.protocolo + ' - ficha assinada - ' + f.categoria) : '';
        abaF.appendRow([agora, d.protocolo, d.entidade, f.categoria, f.atletas.length, d.telefone, d.email, d.declaracao ? 'Sim' : 'Não', ficha]);
      });
      avisar_('Fichas de atletas recebidas: ' + d.entidade + ' (' + d.protocolo + ')',
        (d.fichas || []).map(function (f) { return f.categoria + ': ' + f.atletas.length + ' atletas'; }).join('\n'));
    }

    return json_({ ok: true, protocolo: d.protocolo });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, info: 'Eusébio Cup — recebimento de inscrições ativo' });
}

function obterPasta_() {
  const it = DriveApp.getFoldersByName(NOME_PASTA);
  return it.hasNext() ? it.next() : DriveApp.createFolder(NOME_PASTA);
}

function obterAba_(ss, nome, cabecalho) {
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    aba.appendRow(cabecalho);
    aba.getRange(1, 1, 1, cabecalho.length).setFontWeight('bold').setBackground('#071447').setFontColor('#ffc20e');
    aba.setFrozenRows(1);
  }
  return aba;
}

function salvarArquivo_(pasta, arq, nomeBase) {
  if (!arq || !arq.base64) return '';
  const bytes = Utilities.base64Decode(arq.base64);
  const ext = (arq.nome || '').split('.').pop();
  const blob = Utilities.newBlob(bytes, arq.tipo || 'application/octet-stream', nomeBase + (ext ? '.' + ext : ''));
  return pasta.createFile(blob).getUrl();
}

function avisar_(assunto, corpo) {
  if (EMAIL_AVISO) MailApp.sendEmail(EMAIL_AVISO, assunto, corpo);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
