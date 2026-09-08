export type Channel = 'whatsapp' | 'gmail';
export type Category = 'cobranca' | 'longo' | 'geral' | 'urgente';
export type Status = 'novo' | 'classificado' | 'processado' | 'respondido';

export interface Message {
  id: string;
  channel: Channel;
  sender: string;
  senderAvatar: string;
  subject: string;
  content: string;
  timestamp: string;
  category: Category | null;
  status: Status;
  priority: 'alta' | 'media' | 'baixa';
  billingData?: BillingData;
  draftResponse?: string;
  wordCount: number;
}

export interface BillingData {
  amount: string;
  dueDate: string;
  beneficiary: string;
  barcode?: string;
  pixKey?: string;
  reference: string;
}

export interface WebhookConfig {
  id: string;
  channel: Channel;
  url: string;
  status: 'ativo' | 'inativo';
  lastTrigger: string;
  messagesProcessed: number;
}

export const mockMessages: Message[] = [
  {
    id: '1',
    channel: 'whatsapp',
    sender: 'Maria Silva',
    senderAvatar: 'MS',
    subject: 'Boleto de mensalidade - Março/2026',
    content: 'Olá! Segue o boleto da mensalidade referente ao mês de Março/2026. Valor: R$ 1.250,00. Vencimento: 15/03/2026. Beneficiário: Academia FitPro Ltda. Código de barras: 23793.38128 60000.000003 00000.004437 1 92370000125000. Por favor, confirme o recebimento e o pagamento até a data de vencimento. Qualquer dúvida estou à disposição.',
    timestamp: '2026-03-10T09:30:00',
    category: 'cobranca',
    status: 'classificado',
    priority: 'alta',
    wordCount: 62,
    billingData: {
      amount: 'R$ 1.250,00',
      dueDate: '15/03/2026',
      beneficiary: 'Academia FitPro Ltda',
      barcode: '23793.38128 60000.000003 00000.004437 1 92370000125000',
      reference: 'Mensalidade Março/2026'
    }
  },
  {
    id: '2',
    channel: 'gmail',
    sender: 'João Pereira',
    senderAvatar: 'JP',
    subject: 'Relatório trimestral de vendas - Q4 2025',
    content: 'Prezados, segue em anexo o relatório completo de vendas do quarto trimestre de 2025. O documento contém análises detalhadas de performance por região, comparação com o trimestre anterior, projeções para Q1 2026, análise de mercado e concorrência, métricas de satisfação do cliente, relatório de devoluções e trocas, análise de margem por produto, e recomendações estratégicas para o próximo ciclo. Recomendo leitura atenta das páginas 15 a 23 onde estão as conclusões principais. Aguardo retorno com considerações até sexta-feira para consolidarmos a apresentação ao conselho.',
    timestamp: '2026-03-10T08:15:00',
    category: 'longo',
    status: 'classificado',
    priority: 'media',
    wordCount: 98
  },
  {
    id: '3',
    channel: 'whatsapp',
    sender: 'Carlos Mendes',
    senderAvatar: 'CM',
    subject: 'Confirmação de reunião',
    content: 'Oi! Confirmado amanhã às 14h na sala 3. Leve os documentos do projeto.',
    timestamp: '2026-03-10T10:45:00',
    category: 'geral',
    status: 'novo',
    priority: 'media',
    wordCount: 14
  },
  {
    id: '4',
    channel: 'gmail',
    sender: 'Financeiro - TechSupply',
    senderAvatar: 'TS',
    subject: 'Fatura #FS-2026-0892 - Vencimento 20/03',
    content: 'Prezado cliente, informamos que a fatura referente aos serviços de infraestrutura cloud do período de 01/02 a 28/02/2026 está disponível. Valor total: R$ 3.450,00. Data de vencimento: 20/03/2026. Beneficiário: TechSupply Serviços de TI Ltda - CNPJ 12.345.678/0001-90. Chave PIX (CNPJ): 12.345.678/0001-90. Referência: Contrato #TS-2024-156. Em caso de pagamento já realizado, desconsidere este aviso.',
    timestamp: '2026-03-09T16:20:00',
    category: 'cobranca',
    status: 'processado',
    priority: 'alta',
    wordCount: 78,
    billingData: {
      amount: 'R$ 3.450,00',
      dueDate: '20/03/2026',
      beneficiary: 'TechSupply Serviços de TI Ltda',
      pixKey: '12.345.678/0001-90',
      reference: 'Contrato #TS-2024-156'
    }
  },
  {
    id: '5',
    channel: 'gmail',
    sender: 'Ana Beatriz Costa',
    senderAvatar: 'AC',
    subject: 'Análise completa do mercado de tecnologia 2026',
    content: 'Bom dia! Gostaria de compartilhar com vocês a análise completa que preparei sobre o mercado de tecnologia para 2026. O estudo abrange os seguintes tópicos: 1) Tendências de IA generativa e seu impacto nos negócios, incluindo casos de uso práticos e ROI mensurado; 2) Evolução do mercado de cloud computing com análise de market share dos principais providers; 3) Regulamentação de dados e privacidade no Brasil e no mundo; 4) Crescimento do mercado de cybersecurity e novas ameaças; 5) Transformação digital em PMEs brasileiras; 6) Análise comparativa de frameworks ágeis; 7) Impacto do 5G nos negócios; 8) Sustentabilidade e ESG no setor de TI; 9) Panorama de startups e investimentos; 10) Previsões e cenários para os próximos 5 anos. O documento tem 47 páginas e inclui gráficos, tabelas comparativas e referências bibliográficas. Acredito que será muito útil para o planejamento estratégico do próximo trimestre.',
    timestamp: '2026-03-09T14:00:00',
    category: 'longo',
    status: 'novo',
    priority: 'baixa',
    wordCount: 156
  },
  {
    id: '6',
    channel: 'whatsapp',
    sender: 'Roberto Alves',
    senderAvatar: 'RA',
    subject: 'URGENTE - Problema no servidor',
    content: '🚨 URGENTE! O servidor principal caiu há 30 minutos e os clientes estão sem acesso. Preciso de autorização imediata para acionar o suporte emergencial da AWS. O custo estimado é de R$ 800. Posso prosseguir?',
    timestamp: '2026-03-10T11:00:00',
    category: 'urgente',
    status: 'novo',
    priority: 'alta',
    wordCount: 34
  },
  {
    id: '7',
    channel: 'gmail',
    sender: 'Banco Digital - Notificações',
    senderAvatar: 'BD',
    subject: 'Aviso de cobrança - Empréstimo pessoal',
    content: 'Sr. Cliente, informamos que o vencimento da parcela 12/36 do seu empréstimo pessoal (Contrato #EMP-2025-4451) será no dia 18/03/2026. Valor da parcela: R$ 890,50. Beneficiário: Banco Digital S.A. Chave PIX para pagamento: emprestimo@bancodigital.com.br. Certifique-se de realizar o pagamento até a data de vencimento para evitar juros e multa de 2% ao mês.',
    timestamp: '2026-03-08T07:00:00',
    category: 'cobranca',
    status: 'respondido',
    priority: 'alta',
    wordCount: 67,
    billingData: {
      amount: 'R$ 890,50',
      dueDate: '18/03/2026',
      beneficiary: 'Banco Digital S.A.',
      pixKey: 'emprestimo@bancodigital.com.br',
      reference: 'Contrato #EMP-2025-4451 - Parcela 12/36'
    },
    draftResponse: 'Olá! Confirmo o recebimento do aviso. O pagamento da parcela 12/36 no valor de R$ 890,50 será realizado até o vencimento em 18/03/2026 via PIX. Obrigado pela notificação.'
  },
  {
    id: '8',
    channel: 'whatsapp',
    sender: 'Equipe de Vendas',
    senderAvatar: 'EV',
    subject: 'Atualização de metas mensais',
    content: 'Pessoal, segue a atualização das metas de março: 1) Aumentar base de clientes em 15%; 2) Reduzir churn para menos de 3%; 3) Lançar novo produto premium até dia 20; 4) Realizar 50 demos por semana; 5) Melhorar NPS para acima de 70. Reunião de acompanhamento toda segunda às 9h. Dúvidas, me chamem!',
    timestamp: '2026-03-10T07:30:00',
    category: 'longo',
    status: 'classificado',
    priority: 'media',
    wordCount: 58
  },
  {
    id: '9',
    channel: 'gmail',
    sender: 'Patricia Lima',
    senderAvatar: 'PL',
    subject: 'Re: Proposta de parceria',
    content: 'Oi! Analisei a proposta e achei muito interessante. Podemos agendar uma call para discutir os detalhes? Estou disponível terça ou quarta à tarde.',
    timestamp: '2026-03-10T10:00:00',
    category: 'geral',
    status: 'novo',
    priority: 'media',
    wordCount: 26
  },
  {
    id: '10',
    channel: 'whatsapp',
    sender: 'Contabilidade - Silva & Associados',
    senderAvatar: 'CS',
    subject: 'DARF - Imposto de Renda PJ',
    content: 'Prezado cliente, segue orientação para pagamento do DARF referente ao IRPJ do 4º trimestre de 2025. Valor: R$ 4.780,00. Vencimento: 25/03/2026. Beneficiário: Receita Federal do Brasil. Código da receita: 2072. Referência: IRPJ 4T2025 - CNPJ 98.765.432/0001-10. O pagamento deve ser feito via DARF gerado no SICALC. Dúvidas, entre em contato.',
    timestamp: '2026-03-09T11:00:00',
    category: 'cobranca',
    status: 'classificado',
    priority: 'alta',
    wordCount: 64,
    billingData: {
      amount: 'R$ 4.780,00',
      dueDate: '25/03/2026',
      beneficiary: 'Receita Federal do Brasil',
      reference: 'IRPJ 4T2025 - DARF Código 2072'
    }
  }
];

export const webhookConfigs: WebhookConfig[] = [
  {
    id: 'wh1',
    channel: 'whatsapp',
    url: 'https://api.triador.com/webhooks/whatsapp/inbound',
    status: 'ativo',
    lastTrigger: '2026-03-10T11:00:00',
    messagesProcessed: 1247
  },
  {
    id: 'wh2',
    channel: 'gmail',
    url: 'https://api.triador.com/webhooks/gmail/push',
    status: 'ativo',
    lastTrigger: '2026-03-10T10:00:00',
    messagesProcessed: 3891
  }
];

export const classificationRules = [
  { id: 'r1', pattern: 'boleto|fatura|cobrança|vencimento|parcela|DARF|pagamento', category: 'cobranca' as Category, label: 'Cobrança / Pagamento', color: 'red' },
  { id: 'r2', pattern: 'urgente|emergência|crítico|imediatamente|agora', category: 'urgente' as Category, label: 'Urgente', color: 'orange' },
  { id: 'r3', pattern: 'relatório|análise|documento extenso|estudo completo', category: 'longo' as Category, label: 'Leitura Posterior', color: 'blue' },
  { id: 'r4', pattern: '.*', category: 'geral' as Category, label: 'Geral', color: 'green' },
];
