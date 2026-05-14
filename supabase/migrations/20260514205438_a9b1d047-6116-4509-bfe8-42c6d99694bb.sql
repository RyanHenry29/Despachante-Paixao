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

insert into public.knowledge_base (category, content) values
('transferencia', 'Transferência de veículo: documentos necessários do vendedor: CRV (documento do veículo) original assinado, RG e CPF, comprovante de endereço. Documentos do comprador: RG, CPF e comprovante de endereço. O prazo para transferir após a compra é de 30 dias. Após esse prazo incidem multas.'),
('transferencia', 'Transferência com financiamento: é necessário também a carta de quitação ou autorização do banco para a transferência. Em caso de veículo financiado, o banco deve liberar o gravame antes da transferência ser efetivada.'),
('transferencia', 'Taxa de transferência de veículo em São Paulo: o DETRAN-SP cobra uma taxa de TFDTE (Taxa de Fiscalização e Serviços). O valor varia conforme o tipo de veículo e é atualizado anualmente. Consulte o valor atualizado pelo WhatsApp (11) 95328-4566.'),
('licenciamento', 'Licenciamento anual (CRLV): o licenciamento é obrigatório todo ano. Os documentos necessários são: IPVA pago, DPVAT (seguro obrigatório) pago, e ausência de multas bloqueantes. O vencimento varia conforme o final da placa. Após a quitação, o CRLV digital fica disponível no app SENATRAN.'),
('licenciamento', 'CRLV digital: disponível gratuitamente pelo aplicativo Carteira Digital de Trânsito (CDT) ou pelo site do DENATRAN. Tem validade legal igual ao CRLV físico. O Despachante Paixão pode ajudar a baixar e imprimir se precisar.'),
('licenciamento', 'Emplacamento de veículo novo (0km): documentos necessários: nota fiscal da concessionária, CPF e RG do comprador, comprovante de endereço. A concessionária normalmente entrega com placa, mas se precisar de ajuda, fazemos todo o processo.'),
('multas', 'Consulta de multas e débitos: verificamos todos os débitos do veículo: multas de trânsito, IPVA atrasado, licenciamento pendente, DPVAT. A consulta é feita pelo número da placa ou Renavam. Entre em contato pelo WhatsApp para solicitar a consulta.'),
('multas', 'Recurso de multa: é possível recorrer de multas de trânsito em até 30 dias após a notificação de autuação, e em até 30 dias após a notificação de penalidade. Auxiliamos na elaboração do recurso. Consulte pelo WhatsApp.'),
('multas', 'Bloqueio por multas: veículos com multas graves ou em grande quantidade podem ter o licenciamento bloqueado. É necessário quitar ou parcelar os débitos antes de licenciar. Ajudamos a verificar e resolver a situação.'),
('vistoria', 'Vistoria cautelar: é uma inspeção detalhada do veículo antes de comprar ou vender. Verifica número do motor, chassi, situação estrutural e elétrica. Recomendada para proteger comprador e vendedor. Realizamos o agendamento e acompanhamento.'),
('vistoria', 'Vistoria obrigatória DETRAN: exigida em alguns casos como mudança de cor, alteração de carroceria ou regularização de veículo. Agendamos e acompanhamos todo o processo no DETRAN.'),
('regularizacao', 'Regularização de veículo com débitos antigos: veículos com IPVA, licenciamento ou multas em atraso de anos anteriores podem ser regularizados. Existe a possibilidade de parcelamento pelo DETRAN-SP. Consultamos a situação e orientamos o melhor caminho.'),
('regularizacao', 'Lacre de placa: necessário quando a placa está danificada, ilegível ou foi furtada. Documentos: boletim de ocorrência (em caso de furto), CRV/CRLV do veículo, RG e CPF do proprietário. Realizamos o processo completo.'),
('atendimento', 'Horário de atendimento do Despachante Paixão: segunda a sexta das 8h às 18h, sábado das 8h às 12h. Atendemos presencialmente em Guarulhos-SP e também pelo WhatsApp (11) 95328-4566.'),
('atendimento', 'Prazo médio dos serviços: transferência simples 3 a 7 dias úteis, emplacamento 1 a 3 dias úteis, licenciamento 1 a 2 dias úteis após pagamento dos débitos, vistoria conforme disponibilidade do DETRAN (geralmente 3 a 10 dias).'),
('atendimento', 'Formas de pagamento: aceitamos Pix, dinheiro e cartão. As taxas do DETRAN são pagas separadamente via guia oficial. Consulte pelo WhatsApp para orçamento do serviço de despachante.');