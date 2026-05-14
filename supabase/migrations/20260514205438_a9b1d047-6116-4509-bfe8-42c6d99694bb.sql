create table if not exists public.knowledge_base (
  id bigint generated always as identity primary key,
  category text not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists knowledge_base_fts
  on public.knowledge_base
  using gin(to_tsvector('portuguese', content));

alter table public.knowledge_base enable row level security;

create policy "Leitura pública" on public.knowledge_base
  for select using (true);

truncate table public.knowledge_base restart identity;

insert into public.knowledge_base (category, content) values
('transferencia', 'DOCUMENTOS OBRIGATÓRIOS PARA TRANSFERÊNCIA DE VEÍCULO (lista completa): 1. CRV assinado pelo vendedor com firma reconhecida em cartório, OU ATPV-e (documento digital — não precisa de firma reconhecida). 2. RG e CPF do comprador e do vendedor. 3. CNH do comprador (pode substituir RG). 4. Comprovante de residência atualizado (últimos 90 dias) do comprador. 5. Laudo CSV (Vistoria de Identificação Veicular) — OBRIGATÓRIO pelo DETRAN-SP para todos os veículos usados. O prazo para transferir após a compra é de 30 dias. Atraso gera multa e pode bloquear o licenciamento.'),
('transferencia', 'LAUDO CSV vs LAUDO CAUTELAR — diferença fundamental: • Laudo CSV (Certificado de Segurança Veicular / ECV): é OBRIGATÓRIO por lei para transferência. Verifica chassi, motor e identificação do veículo. Emitido por ECVs credenciadas pelo DETRAN. Sem ele, o DETRAN não processa a transferência. • Laudo Cautelar (Perícia Veicular): é OPCIONAL, feito por peritos particulares. Verifica histórico de colisões, leilão, recall. Serve para o comprador ter mais segurança na compra, mas NÃO é aceito pelo DETRAN para transferência. Nunca confundir: quem exige CSV é o DETRAN. Cautelar é escolha do comprador.'),
('transferencia', 'TRANSFERÊNCIA COM FINANCIAMENTO ATIVO: Se o veículo ainda tem financiamento (gravame no banco), é necessário: 1. Carta de anuência ou autorização do banco credor para transferência, OU 2. Carta de quitação do financiamento. O banco precisa liberar o gravame antes do DETRAN processar a transferência. Esse processo pode levar de 5 a 15 dias úteis dependendo da instituição financeira. O Despachante Paixão auxilia na comunicação com o banco e acompanha o processo.'),
('transferencia', 'PRAZO E MULTA POR ATRASO NA TRANSFERÊNCIA: O comprador tem 30 dias corridos após a assinatura do CRV para registrar a transferência no DETRAN. Após esse prazo: • Multa administrativa por atraso na transferência. • Multas geradas pelo vendedor após a venda continuam no nome do vendedor, mas podem gerar bloqueio para o comprador se o veículo não for transferido. • O vendedor pode registrar "comunicação de venda" no site do DETRAN-SP para se proteger de multas geradas após a venda. Recomendamos sempre transferir imediatamente após a compra para evitar complicações.'),
('transferencia', 'TAXA DE TRANSFERÊNCIA NO DETRAN-SP (TFDTE): O DETRAN-SP cobra a Taxa de Fiscalização e Serviços de Transferência de Propriedade (TFDTE). O valor exato varia conforme o tipo e categoria do veículo (automóvel, moto, caminhão, etc.) e é reajustado anualmente. Para consultar o valor atualizado e emitir a guia, fale pelo WhatsApp (11) 95328-4566.'),
('transferencia', 'COMUNICAÇÃO DE VENDA — como o vendedor se protege: Após vender o veículo e entregar o CRV/ATPV-e assinado, o vendedor deve registrar a Comunicação de Venda no portal do DETRAN-SP (detran.sp.gov.br). Isso protege o vendedor de multas, infrações e IPVA gerados após a venda, enquanto o comprador não transfere. A comunicação é gratuita e pode ser feita online.'),
('transferencia', 'TRANSFERÊNCIA ENTRE ESTADOS: Se o comprador mora em outro estado, o veículo precisará ser transferido primeiro para o estado do novo proprietário. O processo envolve o DETRAN do estado de destino. Em SP, é necessário quitar todos os débitos (IPVA, multas, licenciamento) antes da transferência interestadual. O prazo pode ser maior. Consulte-nos pelo WhatsApp para orientação específica.'),
('licenciamento', 'CALENDÁRIO DE LICENCIAMENTO SP 2026 — Automóveis, Motos, Ônibus e Reboques (por final de placa): • Final 1 e 2: julho/2026 • Final 3: agosto/2026 • Final 4: agosto/2026 • Final 5: setembro/2026 • Final 6: setembro/2026 • Final 7: outubro/2026 • Final 8: outubro/2026 • Final 9: novembro/2026 • Final 0: dezembro/2026. Veículos com IPVA pago à vista têm o prazo do mês correspondente ao final da placa. Pagamento parcelado: considerar data da última parcela.'),
('licenciamento', 'CALENDÁRIO DE LICENCIAMENTO SP 2026 — Caminhões e Tratores (por final de placa): • Final 1 e 2: setembro/2026 • Final 3, 4 e 5: outubro/2026 • Final 6, 7 e 8: novembro/2026 • Final 9 e 0: dezembro/2026'),
('licenciamento', 'O QUE É NECESSÁRIO PARA LICENCIAR (CRLV anual): 1. IPVA do ano quitado (à vista ou última parcela paga). 2. Seguro DPVAT pago (quando aplicável). 3. Multas de trânsito quitadas ou com recurso em andamento válido. 4. Taxa de Licenciamento Estadual (TFDLE) recolhida. 5. Não ter restrições administrativas. Com tudo quitado, o CRLV fica disponível automaticamente no sistema.'),
('licenciamento', 'CRLV DIGITAL — como obter gratuitamente: O CRLV digital tem validade legal idêntica ao físico. 1. Aplicativo "Carteira Digital de Trânsito" (CDT). 2. Portal do SENATRAN / gov.br. 3. O Despachante Paixão pode auxiliar a baixar, imprimir ou plastificar se precisar.'),
('licenciamento', 'CONSEQUÊNCIAS DE NÃO LICENCIAR NO PRAZO: Circular com licenciamento vencido é infração GRAVÍSSIMA: • 7 pontos na CNH. • Multa. • Retenção do veículo na fiscalização. • Impedimento de transferência e outros serviços no DETRAN. Regularize antes do vencimento para evitar esses problemas.'),
('licenciamento', 'EMPLACAMENTO DE VEÍCULO NOVO (0km): Documentos: Nota Fiscal, CPF/RG do comprador, Comprovante de endereço. Escolha da placa (modelo Mercosul). O Despachante Paixão realiza o processo completo em 1 a 3 dias úteis.'),
('licenciamento', 'LICENCIAMENTO COM DÉBITOS ANTIGOS — como regularizar: Veículos com débitos de anos anteriores podem ser regularizados via pagamento à vista, parcelamento pelo DETRAN-SP ou contestação de multas. O Despachante Paixão consulta a situação completa via WhatsApp (11) 95328-4566.'),
('multas', 'COMO CONSULTAR MULTAS E DÉBITOS DO VEÍCULO: A consulta é feita pelo número da placa ou RENAVAM. O Despachante Paixão faz essa consulta gratuitamente via WhatsApp (11) 95328-4566 enviando placa ou RENAVAM.'),
('multas', 'COMO RECORRER DE MULTA DE TRÂNSITO: 1. Defesa Prévia (até 30 dias da autuação). 2. Recurso JARI (1ª instância). 3. Recurso CETRAN (2ª instância). Durante o recurso a multa fica suspensa e não gera pontos. O Despachante Paixão auxilia na elaboração e protocolo.'),
('multas', 'SUSPENSÃO DA CNH POR PONTOS: • 20 pontos (infratores primários). • 30 pontos (sem infração grave/gravíssima em 12 meses). • 40 pontos (sem infrações em 12 meses). A suspensão pode ser de 6 meses a 1 ano.'),
('multas', 'NOTIFICAÇÃO DE MULTA — o que fazer: 1. Verifique os dados. 2. Indique o condutor real se não foi você. 3. Pague ou recorra. O Despachante Paixão orienta em todos esses casos.'),
('multas', 'BLOQUEIO DO VEÍCULO POR MULTAS OU DÉBITOS: Veículos com muitas multas ou débitos atrasados podem ter o licenciamento e transferência bloqueados. Para regularizar é necessário quitar ou parcelar os débitos.'),
('vistoria', 'LAUDO CSV (Vistoria de Identificação Veicular) — tudo sobre: • O que é: perícia oficial por ECVs credenciadas. • O que verifica: chassi, motor, identificação estrutural. • Quando é obrigatório: transferência de usado, mudança de município, alteração de cor/carroceria. • Validade: 90 dias.'),
('vistoria', 'VISTORIA OBRIGATÓRIA — quando é exigida: 1. Transferência (usado). 2. Mudança de município. 3. Alteração de características (cor, adaptações). 4. Veículos de leilão.'),
('vistoria', 'PRAZO DA VISTORIA NO DETRAN-SP: Realizada em média em 3 a 10 dias úteis após agendamento. O laudo fica disponível no sistema do DETRAN. O Despachante Paixão acompanha o resultado.'),
('ipva', 'IPVA SP: Alíquota de 4% para carros/pick-ups; 2% para caminhões/ônibus; 1,5% para motos. Base de cálculo via tabela FIPE. Isenção para veículos com mais de 20 anos, táxis e PCD.'),
('ipva', 'IPVA ATRASADO — consequências: Gera juros, multa de mora, inscrição em dívida ativa e bloqueio do licenciamento/transferência. Regularize via site da SEFAZ-SP ou banco autorizado.'),
('regularizacao', 'REGULARIZAÇÃO DE VEÍCULO COM RESTRIÇÕES: Resolvendo roubo/furto (BO e perícia), financeira (gravame), administrativa (débitos) ou judicial (ordem do juiz). O Despachante Paixão analisa seu caso.'),
('regularizacao', 'SEGUNDA VIA DO CRV / ATPV-e: Em caso de perda ou furto do documento físico, é necessário BO e solicitação de 2ª via no DETRAN-SP. No caso do digital (ATPV-e), o processo é simplificado.'),
('regularizacao', 'LACRE DE PLACA — quando é necessário: Quando a placa está danificada, ilegível ou foi furtada/roubada. Exige CRV/CRLV, RG/CPF do dono e BO em caso de furto.'),
('regularizacao', 'TROCA DE PLACA PARA MODELO MERCOSUL: Obrigatória em transferência de estado ou voluntária. Veículos 0km já saem com ela. O Despachante Paixão orienta o processo.'),
('cnh', 'RENOVAÇÃO DA CNH: Validade de 5 anos (até 50 anos), 3 anos (50-70 anos) e 1 ano (acima de 70 anos). Exige exame médico/psicológico.'),
('cnh', 'ADIÇÃO DE CATEGORIA NA CNH: Exige exames, curso teórico/prático em autoescola e exame no DETRAN. O Despachante Paixão orienta a documentação.'),
('cnh', 'SEGUNDA VIA DA CNH: Em caso de perda ou dano, solicita-se via DETRAN-SP com taxa de emissão. Prazo de 5 a 15 dias úteis.'),
('atendimento', 'SERVIÇOS COMPLETOS DO DESPACHANTE PAIXÃO (Guarulhos-SP): Transferência, Licenciamento, Emplacamento, Vistoria/Laudo CSV, Recursos de multas, 2ª via de docs e Renovação de CNH.'),
('atendimento', 'HORÁRIO E CONTATO: Seg-Sex 8h-18h, Sáb 8h-12h. Guarulhos-SP. WhatsApp: (11) 95328-4566.'),
('atendimento', 'PRAZO MÉDIO: Transferência (3-7 dias), Licenciamento (1-2 dias), Vistoria (3-10 dias), CNH (10-20 dias).'),
('atendimento', 'FORMAS DE PAGAMENTO: Pix, Dinheiro e Cartão. Taxas do DETRAN são pagas via guia oficial. Cobramos apenas o serviço de despachante.'),
('atendimento', 'POR QUE USAR UM DESPACHANTE: Economia de tempo, segurança documental, agilidade nos processos e prevenção de erros que atrasam o licenciamento.');