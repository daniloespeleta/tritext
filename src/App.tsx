import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Tags,
  CreditCard,
  BookOpen,
  PenTool,
  Webhook,
  Bell,
  Menu,
  X,
  Zap,
  MessageSquare,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { mockMessages, webhookConfigs, classificationRules, type Message, type Category, type Status } from './data/mockData';

type View = 'dashboard' | 'inbox' | 'classifier' | 'billing' | 'readlater' | 'drafts' | 'webhooks';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const stats = {
    total: messages.length,
    novos: messages.filter(m => m.status === 'novo').length,
    classificados: messages.filter(m => m.status === 'classificado').length,
    processados: messages.filter(m => m.status === 'processado').length,
    respondidos: messages.filter(m => m.status === 'respondido').length,
    cobrancas: messages.filter(m => m.category === 'cobranca').length,
    longos: messages.filter(m => m.category === 'longo').length,
    urgentes: messages.filter(m => m.category === 'urgente').length,
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const simulateNewMessage = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newMsg: Message = {
        id: String(Date.now()),
        channel: Math.random() > 0.5 ? 'whatsapp' : 'gmail',
        sender: 'Novo Contato',
        senderAvatar: 'NC',
        subject: 'Nova mensagem recebida via webhook',
        content: 'Esta é uma mensagem simulada recebida através do webhook configurado. O sistema irá classificar automaticamente com base nas regras definidas.',
        timestamp: new Date().toISOString(),
        category: null,
        status: 'novo',
        priority: 'media',
        wordCount: 32
      };
      setMessages(prev => [newMsg, ...prev]);
      setIsProcessing(false);
      setNotifications(prev => prev + 1);
    }, 2000);
  };

  const navItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inbox' as View, icon: Inbox, label: 'Caixa de Entrada', badge: stats.novos },
    { id: 'classifier' as View, icon: Tags, label: 'Classificador' },
    { id: 'billing' as View, icon: CreditCard, label: 'Cobranças' },
    { id: 'readlater' as View, icon: BookOpen, label: 'Leitura Posterior' },
    { id: 'drafts' as View, icon: PenTool, label: 'Rascunhos' },
    { id: 'webhooks' as View, icon: Webhook, label: 'Webhooks' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Triador</h1>
                <p className="text-xs text-gray-400">Comunicação & Execução</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-violet-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl p-4 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-medium text-violet-300">Sistema Ativo</span>
              </div>
              <p className="text-xs text-gray-400">
                {webhookConfigs.filter(w => w.status === 'ativo').length} webhooks ativos • {messages.filter(m => m.status !== 'respondido').length} pendentes
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-800">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {navItems.find(n => n.id === currentView)?.label}
                </h2>
                <p className="text-sm text-gray-400 hidden sm:block">
                  {currentView === 'dashboard' && 'Visão geral do sistema de triagem'}
                  {currentView === 'inbox' && 'Todas as mensagens recebidas'}
                  {currentView === 'classifier' && 'Regras de classificação automática'}
                  {currentView === 'billing' && 'Cobranças e dados de pagamento extraídos'}
                  {currentView === 'readlater' && 'Conteúdo longo para leitura posterior'}
                  {currentView === 'drafts' && 'Rascunhos de resposta gerados por IA'}
                  {currentView === 'webhooks' && 'Configuração de canais de entrada'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={simulateNewMessage}
                disabled={isProcessing}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Simular Webhook
              </button>
              <button className="relative p-2 rounded-xl hover:bg-gray-800 transition-all">
                <Bell className="w-5 h-5 text-gray-400" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {currentView === 'dashboard' && <DashboardView stats={stats} messages={messages} setCurrentView={setCurrentView} />}
          {currentView === 'inbox' && (
            <InboxView
              messages={filteredMessages}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              setMessages={setMessages}
            />
          )}
          {currentView === 'classifier' && <ClassifierView messages={messages} setMessages={setMessages} />}
          {currentView === 'billing' && <BillingView messages={messages} />}
          {currentView === 'readlater' && <ReadLaterView messages={messages} />}
          {currentView === 'drafts' && <DraftsView messages={messages} setMessages={setMessages} />}
          {currentView === 'webhooks' && <WebhooksView />}
        </div>
      </main>
    </div>
  );
}

// ==================== DASHBOARD ====================
function DashboardView({ stats, messages, setCurrentView }: { stats: any; messages: Message[]; setCurrentView: (v: View) => void }) {
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="Total de Mensagens" value={stats.total} color="violet" />
        <StatCard icon={Clock} label="Novas / Pendentes" value={stats.novos} color="amber" />
        <StatCard icon={CreditCard} label="Cobranças Detectadas" value={stats.cobrancas} color="red" />
        <StatCard icon={BookOpen} label="Leitura Posterior" value={stats.longos} color="blue" />
      </div>

      {/* Pipeline */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Pipeline de Processamento</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <PipelineStep icon={Inbox} label="Recebidas" count={stats.total} color="gray" />
          <ArrowRight className="w-5 h-5 text-gray-600 hidden sm:block" />
          <PipelineStep icon={Tags} label="Classificadas" count={stats.classificados} color="violet" />
          <ArrowRight className="w-5 h-5 text-gray-600 hidden sm:block" />
          <PipelineStep icon={CheckCircle2} label="Processadas" count={stats.processados} color="green" />
          <ArrowRight className="w-5 h-5 text-gray-600 hidden sm:block" />
          <PipelineStep icon={PenTool} label="Respondidas" count={stats.respondidos} color="emerald" />
        </div>
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button onClick={() => setCurrentView('billing')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-left">
              <CreditCard className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-white">Ver Cobranças</p>
                <p className="text-xs text-gray-400">{stats.cobrancas} cobranças pendentes</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('inbox')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-left">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white">Pendentes</p>
                <p className="text-xs text-gray-400">{stats.novos} mensagens novas</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('drafts')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-left">
              <PenTool className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Rascunhos</p>
                <p className="text-xs text-gray-400">Gerar respostas automáticas</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('webhooks')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all text-left">
              <Webhook className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-sm font-medium text-white">Webhooks</p>
                <p className="text-xs text-gray-400">Configurar canais</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Mensagens Recentes</h3>
            <button onClick={() => setCurrentView('inbox')} className="text-sm text-violet-400 hover:text-violet-300">Ver todas →</button>
          </div>
          <div className="space-y-3">
            {recentMessages.map(msg => (
              <div key={msg.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.channel === 'whatsapp' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {msg.senderAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{msg.sender}</p>
                    {msg.channel === 'whatsapp' ? (
                      <MessageSquare className="w-3 h-3 text-green-400" />
                    ) : (
                      <Mail className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <CategoryBadge category={msg.category} />
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Activity */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade dos Canais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">WhatsApp</p>
              <p className="text-xs text-gray-400">{messages.filter(m => m.channel === 'whatsapp').length} mensagens • Webhook ativo</p>
              <div className="mt-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">Conectado</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Gmail</p>
              <p className="text-xs text-gray-400">{messages.filter(m => m.channel === 'gmail').length} mensagens • Push ativo</p>
              <div className="mt-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== INBOX ====================
function InboxView({ messages, searchTerm, setSearchTerm, filterCategory, setFilterCategory, setMessages }: any) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar mensagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">Todas categorias</option>
            <option value="cobranca">Cobranças</option>
            <option value="longo">Leitura Posterior</option>
            <option value="urgente">Urgentes</option>
            <option value="geral">Geral</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma mensagem encontrada</p>
          </div>
        ) : (
          messages.map((msg: Message) => (
            <MessageCard key={msg.id} message={msg} setMessages={setMessages} />
          ))
        )}
      </div>
    </div>
  );
}

// ==================== CLASSIFIER ====================
function ClassifierView({ messages, setMessages }: { messages: Message[]; setMessages: (fn: any) => void }) {
  const unclassified = messages.filter(m => !m.category);

  const classifyMessage = (msgId: string, category: Category) => {
    setMessages((prev: Message[]) => prev.map((m: Message) =>
      m.id === msgId ? { ...m, category, status: 'classificado' as Status, priority: category === 'urgente' ? 'alta' as const : category === 'cobranca' ? 'alta' as const : 'media' as const } : m
    ));
  };

  const autoClassifyAll = () => {
    setMessages((prev: Message[]) => prev.map(m => {
      if (m.category) return m;
      const content = (m.subject + ' ' + m.content).toLowerCase();
      let category: Category = 'geral';
      if (/boleto|fatura|cobrança|vencimento|parcela|darf|pagamento/.test(content)) category = 'cobranca';
      else if (/urgente|emergência|crítico|imediatamente/.test(content)) category = 'urgente';
      else if (m.wordCount > 50 || /relatório|análise|documento|estudo/.test(content)) category = 'longo';
      return { ...m, category, status: 'classificado' as Status, priority: category === 'cobranca' || category === 'urgente' ? 'alta' as const : 'media' as const };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Classification Rules */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Regras de Classificação</h3>
          <button onClick={autoClassifyAll} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium transition-all">
            Auto-classificar Todos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {classificationRules.map(rule => (
            <div key={rule.id} className={`p-4 rounded-xl border ${
              rule.color === 'red' ? 'bg-red-500/5 border-red-500/20' :
              rule.color === 'orange' ? 'bg-orange-500/5 border-orange-500/20' :
              rule.color === 'blue' ? 'bg-blue-500/5 border-blue-500/20' :
              'bg-green-500/5 border-green-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  rule.color === 'red' ? 'bg-red-500' :
                  rule.color === 'orange' ? 'bg-orange-500' :
                  rule.color === 'blue' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <span className="text-sm font-medium text-white">{rule.label}</span>
              </div>
              <code className="text-xs text-gray-400 break-all">{rule.pattern}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Unclassified Messages */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Mensagens Pendentes de Classificação ({unclassified.length})
        </h3>
        {unclassified.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
            <p>Todas as mensagens foram classificadas!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unclassified.map(msg => (
              <div key={msg.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.channel === 'whatsapp' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    {msg.senderAvatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{msg.sender}</p>
                    <p className="text-xs text-gray-400">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{msg.content}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classificationRules.filter(r => r.id !== 'r4').map(rule => (
                    <button
                      key={rule.id}
                      onClick={() => classifyMessage(msg.id, rule.category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                        rule.color === 'red' ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' :
                        rule.color === 'orange' ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' :
                        'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      }`}
                    >
                      {rule.label}
                    </button>
                  ))}
                  <button
                    onClick={() => classifyMessage(msg.id, 'geral')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all hover:scale-105"
                  >
                    Geral
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== BILLING ====================
function BillingView({ messages }: { messages: Message[] }) {
  const billingMessages = messages.filter(m => m.category === 'cobranca' && m.billingData);
  const totalAmount = billingMessages.reduce((acc, m) => {
    if (!m.billingData) return acc;
    const value = m.billingData.amount.replace(/[^\d,]/g, '').replace(',', '.');
    return acc + (parseFloat(value) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl border border-red-500/20 p-6">
          <CreditCard className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-2xl font-bold text-white">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-400">Total em cobranças</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-2xl border border-amber-500/20 p-6">
          <Clock className="w-8 h-8 text-amber-400 mb-3" />
          <p className="text-2xl font-bold text-white">{billingMessages.filter(m => m.status !== 'respondido').length}</p>
          <p className="text-sm text-gray-400">Pendentes de ação</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl border border-green-500/20 p-6">
          <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-2xl font-bold text-white">{billingMessages.filter(m => m.status === 'respondido').length}</p>
          <p className="text-sm text-gray-400">Processadas</p>
        </div>
      </div>

      {/* Billing Cards */}
      <div className="space-y-4">
        {billingMessages.map(msg => (
          <div key={msg.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{msg.sender}</p>
                  <p className="text-xs text-gray-400">{msg.subject}</p>
                </div>
              </div>
              <StatusBadge status={msg.status} />
            </div>

            {msg.billingData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-800/50">
                <DataField label="Valor" value={msg.billingData.amount} highlight />
                <DataField label="Vencimento" value={msg.billingData.dueDate} />
                <DataField label="Beneficiário" value={msg.billingData.beneficiary} />
                <DataField label="Referência" value={msg.billingData.reference} />
                {msg.billingData.barcode && <DataField label="Código de Barras" value={msg.billingData.barcode} mono />}
                {msg.billingData.pixKey && <DataField label="Chave PIX" value={msg.billingData.pixKey} mono />}
              </div>
            )}

            {msg.draftResponse && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <PenTool className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Rascunho de resposta gerado</span>
                </div>
                <p className="text-sm text-gray-300">{msg.draftResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== READ LATER ====================
function ReadLaterView({ messages }: { messages: Message[] }) {
  const longMessages = messages.filter(m => m.category === 'longo');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Fila de Leitura Posterior</h3>
            <p className="text-sm text-gray-400">{longMessages.length} conteúdos longos identificados</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {longMessages.map(msg => (
          <div key={msg.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.channel === 'whatsapp' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {msg.senderAvatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{msg.sender}</p>
                  <p className="text-xs text-gray-400">{msg.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs">
                  {msg.wordCount} palavras
                </span>
                <StatusBadge status={msg.status} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 max-h-32 overflow-hidden relative">
              <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-800/90 to-transparent" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl text-sm font-medium transition-all">
                Marcar como lido
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all">
                Expandir
              </button>
              <span className="text-xs text-gray-500 ml-auto">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DRAFTS ====================
function DraftsView({ messages, setMessages }: { messages: Message[]; setMessages: (fn: any) => void }) {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateDraft = (msgId: string) => {
    setGenerating(msgId);
    setTimeout(() => {
      const msg = messages.find(m => m.id === msgId);
      let draft = '';
      if (msg?.category === 'cobranca') {
        draft = `Olá! Confirmo o recebimento da cobrança referente a "${msg?.billingData?.reference || 'serviços contratados'}". O pagamento no valor de ${msg?.billingData?.amount || 'valor informado'} será realizado até ${msg?.billingData?.dueDate || 'a data de vencimento'}. Obrigado pela notificação.`;
      } else if (msg?.category === 'urgente') {
        draft = 'Recebido! Estou tomando as providências imediatas. Retorno em breve com atualização sobre a resolução.';
      } else if (msg?.category === 'longo') {
        draft = 'Obrigado por compartilhar! Vou analisar o conteúdo com atenção e retorno com considerações em breve.';
      } else {
        draft = 'Recebi sua mensagem. Agradeço o contato e retorno em breve com mais informações.';
      }
      setMessages((prev: Message[]) => prev.map(m =>
        m.id === msgId ? { ...m, draftResponse: draft } : m
      ));
      setGenerating(null);
    }, 1500);
  };

  const messagesWithDrafts = messages.filter(m => m.draftResponse);
  const messagesWithoutDrafts = messages.filter(m => !m.draftResponse && m.category);

  return (
    <div className="space-y-6">
      {/* Generated Drafts */}
      {messagesWithDrafts.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Rascunhos Gerados ({messagesWithDrafts.length})</h3>
          </div>
          <div className="space-y-4">
            {messagesWithDrafts.map(msg => (
              <div key={msg.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">Para: {msg.sender}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-400">Via {msg.channel === 'whatsapp' ? 'WhatsApp' : 'Gmail'}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{msg.draftResponse}</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium text-white transition-all">
                    Enviar Resposta
                  </button>
                  <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium text-gray-300 transition-all">
                    Editar
                  </button>
                  <button
                    onClick={() => generateDraft(msg.id)}
                    className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 rounded-lg text-xs font-medium text-violet-300 transition-all"
                  >
                    Regenerar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Needing Drafts */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <PenTool className="w-4 h-4 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Gerar Rascunhos ({messagesWithoutDrafts.length})</h3>
        </div>
        <div className="space-y-3">
          {messagesWithoutDrafts.map(msg => (
            <div key={msg.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.channel === 'whatsapp' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {msg.senderAvatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{msg.sender}</p>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{msg.subject}</p>
                </div>
                <CategoryBadge category={msg.category} />
              </div>
              <button
                onClick={() => generateDraft(msg.id)}
                disabled={generating === msg.id}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-all flex items-center gap-2"
              >
                {generating === msg.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Gerar Rascunho
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== WEBHOOKS ====================
function WebhooksView() {
  const [logs, setLogs] = useState([
    { time: '11:00:32', channel: 'whatsapp', event: 'Mensagem recebida de Roberto Alves', status: 'success' },
    { time: '10:45:18', channel: 'whatsapp', event: 'Mensagem recebida de Carlos Mendes', status: 'success' },
    { time: '10:00:05', channel: 'gmail', event: 'Push notification - Patricia Lima', status: 'success' },
    { time: '09:30:12', channel: 'whatsapp', event: 'Mensagem recebida de Maria Silva', status: 'success' },
    { time: '08:15:44', channel: 'gmail', event: 'Push notification - João Pereira', status: 'success' },
    { time: '07:00:01', channel: 'gmail', event: 'Push notification - Banco Digital', status: 'success' },
  ]);

  return (
    <div className="space-y-6">
      {/* Webhook Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {webhookConfigs.map(config => (
          <div key={config.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  config.channel === 'whatsapp' ? 'bg-green-600/20' : 'bg-blue-600/20'
                }`}>
                  {config.channel === 'whatsapp' ? (
                    <MessageSquare className="w-6 h-6 text-green-400" />
                  ) : (
                    <Mail className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white capitalize">{config.channel}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-400">{config.status}</span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-all">
                Configurar
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-800/50">
                <p className="text-xs text-gray-500 mb-1">Endpoint URL</p>
                <code className="text-xs text-violet-300 break-all">{config.url}</code>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <p className="text-xs text-gray-500 mb-1">Último Trigger</p>
                  <p className="text-sm text-white">{formatTime(config.lastTrigger)}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <p className="text-xs text-gray-500 mb-1">Msgs Processadas</p>
                  <p className="text-sm text-white">{config.messagesProcessed.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Log de Atividade em Tempo Real</h3>
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all">
              <span className="text-xs text-gray-500 font-mono w-16">{log.time}</span>
              <div className={`w-2 h-2 rounded-full ${log.channel === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <span className="text-sm text-gray-300 flex-1">{log.event}</span>
              <span className="text-xs text-green-400">✓ OK</span>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Payload Example */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Exemplo de Payload</h3>
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono">
{`{
  "event": "message.received",
  "timestamp": "2026-03-10T11:00:00Z",
  "channel": "whatsapp",
  "payload": {
    "from": "+5511999999999",
    "message_id": "msg_abc123",
    "content": "Olá, segue o boleto...",
    "type": "text",
    "metadata": {
      "sender_name": "Maria Silva",
      "phone": "+5511999999999"
    }
  },
  "classification": {
    "category": "cobranca",
    "confidence": 0.94,
    "extracted_data": {
      "amount": "R$ 1.250,00",
      "due_date": "15/03/2026"
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==================== SHARED COMPONENTS ====================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    violet: 'from-violet-600/20 to-violet-800/20 border-violet-500/20',
    amber: 'from-amber-600/20 to-amber-800/20 border-amber-500/20',
    red: 'from-red-600/20 to-red-800/20 border-red-500/20',
    blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/20',
  };
  const iconColors: Record<string, string> = {
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl border p-6`}>
      <Icon className={`w-8 h-8 ${iconColors[color]} mb-3`} />
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function PipelineStep({ icon: Icon, label, count, color }: { icon: any; label: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-700/50 border-gray-600',
    violet: 'bg-violet-600/20 border-violet-500/30',
    green: 'bg-green-600/20 border-green-500/30',
    emerald: 'bg-emerald-600/20 border-emerald-500/30',
  };

  return (
    <div className={`flex-1 flex flex-col items-center p-4 rounded-xl border ${colors[color]} text-center`}>
      <Icon className="w-5 h-5 text-gray-300 mb-2" />
      <p className="text-lg font-bold text-white">{count}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function CategoryBadge({ category }: { category: Category | null }) {
  if (!category) return <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 text-xs">Sem categoria</span>;
  const styles: Record<Category, string> = {
    cobranca: 'bg-red-500/20 text-red-300 border border-red-500/30',
    longo: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    urgente: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    geral: 'bg-green-500/20 text-green-300 border border-green-500/30',
  };
  const labels: Record<Category, string> = {
    cobranca: '💰 Cobrança',
    longo: '📖 Leitura',
    urgente: '🚨 Urgente',
    geral: '📋 Geral',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${styles[category]}`}>{labels[category]}</span>;
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    novo: 'bg-amber-500/20 text-amber-300',
    classificado: 'bg-violet-500/20 text-violet-300',
    processado: 'bg-blue-500/20 text-blue-300',
    respondido: 'bg-green-500/20 text-green-300',
  };
  const labels: Record<Status, string> = {
    novo: 'Novo',
    classificado: 'Classificado',
    processado: 'Processado',
    respondido: 'Respondido',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${styles[status]}`}>{labels[status]}</span>;
}

function MessageCard({ message, setMessages }: { message: Message; setMessages: any }) {
  const markAsRead = () => {
    setMessages((prev: Message[]) => prev.map(m =>
      m.id === message.id ? { ...m, status: 'classificado' as Status } : m
    ));
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          message.channel === 'whatsapp' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
        }`}>
          {message.senderAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{message.sender}</p>
              {message.channel === 'whatsapp' ? (
                <MessageSquare className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-blue-400" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={message.status} />
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-200 mb-1">{message.subject}</p>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{message.content}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={message.category} />
            {message.priority === 'alta' && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs border border-red-500/30">⚡ Alta prioridade</span>
            )}
            {message.status === 'novo' && (
              <button onClick={markAsRead} className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30 hover:bg-violet-500/30 transition-all">
                Classificar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'text-green-400 font-bold' : 'text-white'} ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default App;
