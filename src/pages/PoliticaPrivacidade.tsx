import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-muted">
      <Header onScrollToForm={() => {}} />
      <main className="container-custom py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-primary mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground text-sm mb-8">Última atualização: 15 de junho de 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <p>
              A sua privacidade é importante para nós. Esta política explica como coletamos, usamos,
              armazenamos e protegemos seus dados pessoais quando você utiliza o site da
              <strong> Despachante Paixão</strong>, em conformidade com a Lei Geral de Proteção de Dados
              (LGPD — Lei n° 13.709/2018).
            </p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">1. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais fornecidos voluntariamente por você através do formulário de contato:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo</li>
              <li>Número de WhatsApp / telefone</li>
              <li>E-mail</li>
              <li>Serviço de interesse</li>
              <li>Mensagem personalizada</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">2. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Viabilizar o contato e o atendimento solicitado</li>
              <li>Prestar informações sobre os serviços da Despachante Paixão</li>
              <li>Enviar comunicações relacionadas ao serviço solicitado, mediante seu consentimento</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">3. Compartilhamento de Dados</h2>
            <p>
              Seus dados são enviados diretamente para o WhatsApp da Despachante Paixão e{" "}
              <strong>não são armazenados em bancos de dados próprios</strong>.
              Não compartilhamos seus dados com terceiros para fins de marketing ou publicidade.
            </p>
            <p>
              Utilizamos o Google Analytics 4 para medição de audiência, que coleta dados anonimizados
              de navegação (endereço IP anonimizado, páginas visitadas, navegador). O Google pode
              processar esses dados conforme sua{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Política de Privacidade
              </a>.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">4. Cookies</h2>
            <p>
              Este site utiliza cookies essenciais para o funcionamento básico e cookies do Google Analytics 4
              para análise de audiência. Você pode gerenciar suas preferências de cookies através das
              configurações do seu navegador.
            </p>
            <p>Você pode desativar os cookies não essenciais a qualquer momento através das configurações do seu navegador.</p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">5. Direitos do Titular (LGPD)</h2>
            <p>Nos termos da LGPD, você possui os seguintes direitos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Eliminar os dados tratados com seu consentimento</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">6. Armazenamento e Segurança</h2>
            <p>
              Os dados enviados via formulário são transmitidos através de conexão segura (HTTPS) e
              encaminhados diretamente ao WhatsApp da Despachante Paixão. Recomendamos que não inclua
              informações sensíveis (como senhas ou documentos bancários) no formulário.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">7. Retenção dos Dados</h2>
            <p>
              Seus dados serão mantidos pelo tempo necessário para atender à finalidade do contato.
              Após a conclusão do atendimento, você pode solicitar a exclusão a qualquer momento.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">8. Contato do Controlador</h2>
            <p>Para exercer seus direitos, esclarecer dúvidas ou solicitar a remoção de seus dados, entre em contato:</p>
            <p>
              <strong>Despachante Paixão</strong><br />
              WhatsApp:{" "}
              <a href="https://wa.me/5511953284566" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                (11) 95328-4566
              </a><br />
              E-mail:{" "}
              <a href="mailto:despachantepaixao@gmail.com" className="text-primary underline">
                despachantepaixao@gmail.com
              </a><br />
              Endereço: R. Geraldo Augusto, 106 — Jardim Pte. Alta I, Guarulhos/SP
            </p>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">9. Alterações nesta Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Recomendamos a revisão regular desta
              página para se manter informado sobre eventuais mudanças.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t">
            <Link to="/" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              &larr; Voltar ao site
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
