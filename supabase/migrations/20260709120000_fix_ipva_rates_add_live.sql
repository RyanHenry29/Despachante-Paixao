-- Corrige alíquotas de IPVA que estavam trocadas na base de conhecimento
-- (o registro dizia "2% caminhões/ônibus; 1,5% motos", quando o certo é o
-- inverso: 2% motos/ônibus, 1,5% caminhões). Também completa as isenções
-- que faltavam (motos até 180cc, híbridos/hidrogênio, teto do PCD).
update public.knowledge_base
set content = 'IPVA SP 2026: Alíquota de 4% para carros de passeio/utilitários; 2% para motos e ônibus; 1,5% para caminhões; 1% para locadoras. Base de cálculo via tabela FIPE (valor venal). Isenção para: veículos com mais de 20 anos de fabricação, táxi/mototáxi, transporte escolar, motos até 180 cilindradas, veículos híbridos/hidrogênio (até R$ 250 mil de valor venal). PCD: isenção total até R$ 70 mil de valor venal, isenção parcial acima disso.'
where category = 'ipva'
  and content like 'IPVA SP: Alíquota de 4%carros/pick-ups%';

-- Novo conteúdo: serviço LIVE (Liberação Instantânea de Veículos), novidade
-- 2026 para veículo apreendido/guinchado, e as taxas de pátio atualizadas.
insert into public.knowledge_base (category, content) values
('regularizacao', 'VEÍCULO APREENDIDO/GUINCHADO — LIVE (NOVIDADE 2026): O Detran-SP lançou o LIVE (Liberação Instantânea de Veículos), serviço que permite solicitar a liberação do veículo assim que ele chega ao pátio, direto pelo celular (portal ou app do Detran-SP), sem precisar comparecer pessoalmente — desde que todos os débitos estejam quitados. Taxas 2026: Liberação R$ 19,17 + Estadia R$ 38,90 por dia + Reboque R$ 388,96, além de licenciamento/IPVA/multas em aberto. O Despachante Paixão orienta e agiliza esse processo.');
