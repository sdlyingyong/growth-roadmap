import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, ShieldAlert, Trash2, Sparkles, Target, Clock, Zap, 
  Heart, Users, Briefcase, Coins, HelpCircle, History, LayoutGrid, 
  ArrowRight, CheckCircle2, AlertCircle, FileText, Settings,
  Upload, Edit3, Brain, BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Category Definitions
const CATEGORIES = [
  { id: 'work', label: '深度工作', icon: Briefcase, color: 'border-violet-500', glow: 'bg-violet-500/20', text: 'text-violet-400' },
  { id: 'health', label: '健康', icon: Heart, color: 'border-emerald-500', glow: 'bg-emerald-500/20', text: 'text-emerald-400' },
  { id: 'social', label: '社交', icon: Users, color: 'border-blue-500', glow: 'bg-blue-500/20', text: 'text-blue-400' },
  { id: 'finance', label: '财务', icon: Coins, color: 'border-amber-500', glow: 'bg-amber-500/20', text: 'text-amber-400' },
  { id: 'other', label: '其他', icon: HelpCircle, color: 'border-stone-500', glow: 'bg-stone-500/20', text: 'text-stone-400' },
];

const INSIGHTS = [
  { text: "不做不对的事情，比做对的事情更重要。", author: "段永平" },
  { text: "Stop Doing List 比 To Do List 更重要。", author: "段永平" },
  { text: "发现错了马上改，不管多大的代价都是最小的代价。", author: "段永平" },
  { text: "Pain + Reflection = Progress. (痛苦 + 反思 = 进步)", author: "Ray Dalio" },
  { text: "如果你不失败，说明你没有在挑战极限。", author: "Ray Dalio" },
  { text: "我只想知道我将来会死在什么地方，这样我就可以永远不去那里了。", author: "Charlie Munger" },
  { text: "反过来想，总是反过来想。", author: "Charlie Munger" },
  { text: "通过努力保持不愚蠢，而不是努力变得非常聪明，能获得巨大的长期优势。", author: "Charlie Munger" },
  { text: "如果我知道我会死在哪里，我一辈子都不会去那个地方。", author: "Charlie Munger" },
  { text: "避开愚蠢比追求卓越更容易，也更有效。", author: "Charlie Munger" },
  { text: "本分，就是不被诱惑，做正确的事情。", author: "段永平" },
  { text: "如果你不能在别人贪婪时感到恐惧，你就不适合投资。", author: "Charlie Munger" },
  { text: "如果你不觉得一年前的自己是个蠢货，那说明你这一年没学到什么东西。", author: "Ray Dalio" },
  { text: "所谓的‘快’，往往就是‘慢’的积累。", author: "段永平" },
  { text: "我们不需要非常聪明，我们只需要比别人少犯一点点错误。", author: "Charlie Munger" },
];

interface RuleLog {
  id: string;
  timestamp: number;
  scenario: string;
  choice: 'stuck' | 'broken';
  outcome: string;
}

interface NotToDoItem {
  id: string;
  text: string;
  category: string;
  reflection: string;
  timestamp: number;
  logs?: RuleLog[];
}

interface DecisionItem {
  id: string;
  content: string;
  tenYearView: string;
  timestamp: number;
}

type View = 'pyramid' | 'audit' | 'decisions';

export default function App() {
  const [items, setItems] = useState<NotToDoItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [currentView, setCurrentView] = useState<View>('pyramid');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [randomQuote, setRandomQuote] = useState(INSIGHTS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INSIGHTS.length);
    setRandomQuote(INSIGHTS[randomIndex]);
  }, []);
  
  // Pyramid State
  const [inputText, setInputText] = useState('');
  const [reflection, setReflection] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<NotToDoItem | null>(null);

  // Logging State
  const [loggingItem, setLoggingItem] = useState<NotToDoItem | null>(null);
  const [logScenario, setLogScenario] = useState('');
  const [logChoice, setLogChoice] = useState<'stuck' | 'broken'>('stuck');
  const [logOutcome, setLogOutcome] = useState('');

  // Decision State
  const [isAddingDecision, setIsAddingDecision] = useState(false);
  const [decisionContent, setDecisionContent] = useState('');
  const [tenYearView, setTenYearView] = useState('');
  const [editingDecision, setEditingDecision] = useState<DecisionItem | null>(null);

  const [showInfo, setShowInfo] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  // Audit Wizard State
  const [auditStep, setAuditStep] = useState(0);
  const [auditFailure, setAuditFailure] = useState('');
  const [auditCause, setAuditCause] = useState('');
  const [auditRule, setAuditRule] = useState('');
  const [auditCategory, setAuditCategory] = useState('work');

  // Load from local storage
  useEffect(() => {
    const savedItems = localStorage.getItem('nottodo-pyramid-v4');
    const savedDecisions = localStorage.getItem('nottodo-decisions-v4');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to parse saved items', e);
      }
    }
    if (savedDecisions) {
      try {
        setDecisions(JSON.parse(savedDecisions));
      } catch (e) {
        console.error('Failed to parse saved decisions', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('nottodo-pyramid-v4', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('nottodo-decisions-v4', JSON.stringify(decisions));
  }, [decisions]);

  const addItem = (text: string, cat: string, refl: string) => {
    const newItem: NotToDoItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: text.trim(),
      category: cat,
      reflection: refl.trim(),
      timestamp: Date.now(),
      logs: [],
    };
    setItems([...items, newItem]);
  };

  const addDecision = (content: string, view: string) => {
    const newDecision: DecisionItem = {
      id: Math.random().toString(36).substring(2, 9),
      content: content.trim(),
      tenYearView: view.trim(),
      timestamp: Date.now(),
    };
    setDecisions([...decisions, newDecision]);
  };

  const updateDecision = (id: string, content: string, view: string) => {
    setDecisions(decisions.map(d => 
      d.id === id 
        ? { ...d, content: content.trim(), tenYearView: view.trim() }
        : d
    ));
  };

  const handlePyramidAdd = () => {
    if (!inputText.trim()) return;
    
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, text: inputText.trim(), category: selectedCategory, reflection: reflection.trim() }
          : item
      ));
      setEditingItem(null);
    } else {
      addItem(inputText, selectedCategory, reflection);
    }
    
    setInputText('');
    setReflection('');
    setIsAdding(false);
  };

  const handleDecisionAdd = () => {
    if (!decisionContent.trim()) return;
    
    if (editingDecision) {
      updateDecision(editingDecision.id, decisionContent, tenYearView);
      setEditingDecision(null);
    } else {
      addDecision(decisionContent, tenYearView);
    }
    
    setDecisionContent('');
    setTenYearView('');
    setIsAddingDecision(false);
  };

  const startEditing = (item: NotToDoItem) => {
    setEditingItem(item);
    setInputText(item.text);
    setReflection(item.reflection);
    setSelectedCategory(item.category);
    setIsAdding(true);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleLogAdd = () => {
    if (!loggingItem || !logScenario.trim()) return;
    
    const newLog: RuleLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      scenario: logScenario.trim(),
      choice: logChoice,
      outcome: logOutcome.trim(),
    };
    
    setItems(items.map(item => 
      item.id === loggingItem.id 
        ? { ...item, logs: [...(item.logs || []), newLog] }
        : item
    ));
    
    setLoggingItem(null);
    setLogScenario('');
    setLogChoice('stuck');
    setLogOutcome('');
  };

  const completeAudit = () => {
    addItem(auditRule, auditCategory, `历史教训：${auditFailure}\n根本原因：${auditCause}`);
    setAuditStep(0);
    setAuditFailure('');
    setAuditCause('');
    setAuditRule('');
    setCurrentView('pyramid');
  };

  const importMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const sections = content.split('## ').slice(1);
        const importedItems: NotToDoItem[] = sections.map(section => {
          const lines = section.split('\n');
          const title = lines[0].replace(/^\d+\.\s+/, '').trim();
          
          let category = 'other';
          const catLine = lines.find(l => l.includes('**分类**:'));
          if (catLine) {
            const catLabel = catLine.split(': ')[1].trim();
            category = CATEGORIES.find(c => c.label === catLabel)?.id || 'other';
          }

          let timestamp = Date.now();
          const timeLine = lines.find(l => l.includes('**建立时间**:'));
          if (timeLine) {
            const dateStr = timeLine.split(': ')[1].trim();
            timestamp = new Date(dateStr).getTime() || Date.now();
          }

          let reflection = '';
          const reflectionStart = lines.findIndex(l => l.includes('**前车之鉴**:'));
          if (reflectionStart !== -1) {
            reflection = lines.slice(reflectionStart + 2)
              .filter(l => l.startsWith('> '))
              .map(l => l.replace(/^> /, ''))
              .join('\n')
              .split('---')[0]
              .trim();
          }

          return {
            id: Math.random().toString(36).substring(2, 9),
            text: title,
            category,
            reflection,
            timestamp,
            logs: []
          };
        });

        if (importedItems.length > 0) {
          if (confirm(`识别到 ${importedItems.length} 条准则，是否导入并覆盖当前数据？`)) {
            setItems(importedItems);
            setShowDataModal(false);
          }
        } else {
          alert('未能从 Markdown 中识别到有效数据');
        }
      } catch (err) {
        alert('解析 Markdown 失败');
      }
    };
    reader.readAsText(file);
  };

  const exportMarkdown = () => {
    let md = `# 不为清单金字塔 (Not-To-Do List)\n\n`;
    md += `> 导出时间: ${new Date().toLocaleString()}\n\n`;
    
    items.forEach((item, index) => {
      const category = CATEGORIES.find(c => c.id === item.category)?.label || '其他';
      md += `## ${index + 1}. ${item.text}\n`;
      md += `- **分类**: ${category}\n`;
      md += `- **建立时间**: ${new Date(item.timestamp).toLocaleDateString()}\n`;
      if (item.reflection) {
        md += `- **前车之鉴**:\n\n> ${item.reflection.replace(/\n/g, '\n> ')}\n\n`;
      }
      if (item.logs && item.logs.length > 0) {
        md += `- **实战记录**:\n\n`;
        item.logs.forEach(log => {
          md += `  - **${new Date(log.timestamp).toLocaleDateString()}** [${log.choice === 'stuck' ? '守住' : '打破'}]\n`;
          md += `    - 情景: ${log.scenario}\n`;
          md += `    - 结果: ${log.outcome}\n`;
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nottodo-list-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group items into rows for the pyramid
  const rows: NotToDoItem[][] = [];
  let currentIndex = 0;
  let rowSize = 1;

  while (currentIndex < items.length) {
    const row = items.slice(currentIndex, currentIndex + rowSize);
    rows.push(row);
    currentIndex += rowSize;
    rowSize++;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen selection:bg-amber-500/30">
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        {currentView !== 'audit' && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative w-full"
          >
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
                <button 
                  onClick={() => setCurrentView('pyramid')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    currentView === 'pyramid' ? "bg-amber-500 text-stone-950 shadow-lg" : "text-stone-500 hover:text-stone-300"
                  )}
                >
                  <LayoutGrid size={18} />
                  {lang === 'zh' ? '金字塔' : 'Pyramid'}
                </button>
                <button 
                  onClick={() => setCurrentView('decisions')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    currentView === 'decisions' ? "bg-amber-500 text-stone-950 shadow-lg" : "text-stone-500 hover:text-stone-300"
                  )}
                >
                  <Brain size={18} />
                  {lang === 'zh' ? '决策实验室' : 'Decision Lab'}
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-400">
              {currentView === 'pyramid' 
                ? (lang === 'zh' ? '不为清单 · 金字塔' : 'Not-To-Do · Pyramid')
                : (lang === 'zh' ? '十年决策 · 实验室' : '10-Year Decision Lab')
              }
            </h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-stone-900/30 border border-stone-800/50 backdrop-blur-sm relative group cursor-pointer"
              onClick={() => {
                const nextIndex = (INSIGHTS.indexOf(randomQuote) + 1) % INSIGHTS.length;
                setRandomQuote(INSIGHTS[nextIndex]);
              }}
            >
              <div className="absolute -top-2 -left-2 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
                <Sparkles size={24} />
              </div>
              <p className="text-stone-400 text-sm italic leading-relaxed mb-2">
                “{randomQuote.text}”
              </p>
              <div className="text-[10px] text-stone-600 font-bold uppercase tracking-widest text-right">
                —— {randomQuote.author}
              </div>
            </motion.div>
          </motion.header>
        )}

        {currentView === 'pyramid' ? (
          <>
            {/* Pyramid Container */}
            <div className="flex-1 w-full flex flex-col items-center justify-center mb-40 overflow-visible">
              <div className="flex flex-col items-center gap-3">
                <AnimatePresence mode="popLayout">
                  {rows.map((row, rowIndex) => (
                    <motion.div 
                      key={`row-${rowIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center gap-3"
                    >
                      {row.map((item) => {
                        const category = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4];
                        return (
                          <motion.div
                            key={item.id}
                            layoutId={item.id}
                            initial={{ opacity: 0, y: 20, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="group relative"
                          >
                            <div className={cn(
                              "w-28 h-14 sm:w-36 sm:h-18 bg-stone-900 border-b-2 border-r-2 rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-2xl cursor-default overflow-hidden transition-all group-hover:brightness-125",
                              category.color
                            )}>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                              <span className="text-[10px] sm:text-xs font-medium text-stone-300 line-clamp-2 leading-tight tracking-wide z-10">
                                {item.text}
                              </span>
                              {item.logs && item.logs.length > 0 && (
                                <div className="absolute -bottom-1 -left-1 flex items-center justify-center w-4 h-4 bg-amber-500 rounded-full border-2 border-stone-900 z-20 shadow-lg shadow-amber-500/20">
                                  <BookOpen size={8} className="text-stone-950" />
                                </div>
                              )}
                              {item.reflection && (
                                <div className="absolute bottom-1 right-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                  <Clock size={10} className="text-amber-500" />
                                </div>
                              )}
                              <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button 
                                  onClick={() => startEditing(item)}
                                  className="bg-stone-800 text-stone-500 p-1.5 rounded-full hover:text-amber-400 hover:bg-stone-700"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button 
                                  onClick={() => setLoggingItem(item)}
                                  className="bg-stone-800 text-stone-500 p-1.5 rounded-full hover:text-amber-400 hover:bg-stone-700"
                                  title={lang === 'zh' ? '记录实战' : 'Log Encounter'}
                                >
                                  <BookOpen size={12} />
                                </button>
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="bg-stone-800 text-stone-500 p-1.5 rounded-full hover:text-red-400 hover:bg-stone-700"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {item.reflection && (
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-stone-950 border border-stone-800 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-[10px] text-stone-400 leading-relaxed">
                                <div className="flex items-center gap-1 text-amber-500 font-bold mb-2 uppercase tracking-tighter">
                                  <Zap size={10} /> {lang === 'zh' ? '前车之鉴 (痛点复盘)' : 'Reflection (Pain Point)'}
                                </div>
                                <div className="italic border-l border-amber-500/30 pl-2 whitespace-pre-line mb-3">
                                  {item.reflection}
                                </div>

                                {item.logs && item.logs.length > 0 && (
                                  <div className="space-y-3 pt-2 border-t border-stone-800">
                                    <div className="flex items-center gap-1 text-emerald-500 font-bold uppercase tracking-tighter">
                                      <History size={10} /> {lang === 'zh' ? '实战记录 (后续结果)' : 'Encounter Logs (Outcomes)'}
                                    </div>
                                    {item.logs.slice(-2).map((log) => (
                                      <div key={log.id} className="bg-stone-900/50 p-2 rounded-lg border border-stone-800/50">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-stone-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                                          <span className={cn(
                                            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-stone-800 text-stone-400"
                                          )}>
                                            {log.choice === 'stuck' ? (lang === 'zh' ? '守住' : 'Stuck') : (lang === 'zh' ? '打破' : 'Broken')}
                                          </span>
                                        </div>
                                        <div className="text-stone-300 mb-1 line-clamp-2">情景: {log.scenario}</div>
                                        <div className="text-amber-500/80 italic line-clamp-2">结果: {log.outcome}</div>
                                      </div>
                                    ))}
                                    {item.logs.length > 2 && (
                                      <div className="text-center text-stone-600 text-[8px]">+{item.logs.length - 2} more logs</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {Date.now() - item.timestamp < 5000 && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={cn("absolute inset-0 blur-xl rounded-full pointer-events-none", category.glow)}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {items.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 mt-12"
                  >
                    <div className="w-16 h-16 rounded-full border border-stone-800 flex items-center justify-center text-stone-700">
                      <Target size={32} />
                    </div>
                    <p className="text-stone-600 italic text-sm text-center max-w-xs">
                      “智慧在于知道该忽略什么。”<br/>开始铸造你的第一块边界。
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
              <AnimatePresence>
                {isAdding ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="bg-stone-900 border border-stone-800 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
                        <ShieldAlert size={14} />
                        {editingItem ? (lang === 'zh' ? '修改边界' : 'Edit Boundary') : (lang === 'zh' ? '铸造边界' : 'Forge Boundary')}
                      </div>
                      <div className="flex items-center gap-3">
                        {!editingItem && (
                          <button 
                            onClick={() => { setIsAdding(false); setCurrentView('audit'); }}
                            className="flex items-center gap-1 text-[10px] font-bold text-stone-500 hover:text-amber-500 transition-colors uppercase tracking-widest"
                          >
                            <History size={12} />
                            {lang === 'zh' ? '黑洞审计' : 'Energy Audit'}
                          </button>
                        )}
                        <button onClick={() => { setIsAdding(false); setEditingItem(null); setInputText(''); setReflection(''); }} className="text-stone-500 hover:text-stone-300">
                          <Plus size={18} className="rotate-45" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                            selectedCategory === cat.id 
                              ? cn("bg-stone-800", cat.color, cat.text) 
                              : "bg-transparent border-stone-800 text-stone-600 hover:border-stone-700"
                          )}
                        >
                          <cat.icon size={12} />
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">{lang === 'zh' ? '不为准则' : 'Not-To-Do Rule'}</label>
                        <input
                          autoFocus
                          type="text"
                          placeholder={lang === 'zh' ? "例如：不刷短视频超过30分钟..." : "e.g., No short videos over 30 mins..."}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1 flex items-center gap-1">
                          <Zap size={10} className="text-amber-500" /> {lang === 'zh' ? '前车之鉴 (我曾遇到过什么？)' : 'Reflection (What happened before?)'}
                        </label>
                        <textarea
                          placeholder={lang === 'zh' ? "描述一次让你后悔的经历及后果..." : "Describe a regretful experience and its consequences..."}
                          value={reflection}
                          onChange={(e) => setReflection(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-3 text-sm text-stone-300 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all resize-none h-20"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handlePyramidAdd}
                      disabled={!inputText.trim()}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] mt-2"
                    >
                      <Sparkles size={18} />
                      {editingItem ? (lang === 'zh' ? '保存修改' : 'Save Changes') : (lang === 'zh' ? '确认不为' : 'Confirm Rule')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAdding(true)}
                    className="w-full py-5 rounded-3xl bg-stone-900 border border-stone-800 text-stone-200 font-bold shadow-2xl flex items-center justify-center gap-3 group hover:border-amber-500/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 group-hover:scale-110 transition-transform">
                      <Plus size={20} />
                    </div>
                    <span>{lang === 'zh' ? '添加“不为”准则' : 'Add Not-To-Do Rule'}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : currentView === 'decisions' ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl px-4 pb-40"
          >
            <div className="grid gap-6">
              {decisions.map((decision) => (
                <motion.div 
                  key={decision.id}
                  layoutId={decision.id}
                  className="bg-stone-900 border border-stone-800 p-6 rounded-3xl shadow-xl relative group"
                >
                  <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Clock size={12} /> {new Date(decision.timestamp).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-stone-100 mb-4">{decision.content}</h3>
                  
                  <div className="bg-stone-950/50 border-l-2 border-amber-500 p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                      <Sparkles size={10} /> {lang === 'zh' ? '十年后的视角' : '10-Year Perspective'}
                    </div>
                    <p className="text-stone-400 text-sm italic leading-relaxed">
                      “{decision.tenYearView}”
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingDecision(decision);
                        setDecisionContent(decision.content);
                        setTenYearView(decision.tenYearView);
                        setIsAddingDecision(true);
                      }}
                      className="text-stone-700 hover:text-amber-400 transition-colors p-1"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setDecisions(decisions.filter(d => d.id !== decision.id))}
                      className="text-stone-700 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {decisions.length === 0 && (
                <div className="text-center py-20">
                  <Brain size={48} className="text-stone-800 mx-auto mb-4" />
                  <p className="text-stone-600 italic text-sm">
                    {lang === 'zh' ? '“最好的投资是投资于你的决策质量。”' : '"The best investment is in the quality of your decisions."'}
                  </p>
                </div>
              )}
            </div>

            {/* Logging Modal */}
            <AnimatePresence>
              {loggingItem && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setLoggingItem(null)}
                    className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="text-amber-500" size={20} />
                        {lang === 'zh' ? '记录实战情景' : 'Log Encounter'}
                      </h3>
                      <button onClick={() => setLoggingItem(null)} className="text-stone-500 hover:text-stone-300">
                        <Plus size={24} className="rotate-45" />
                      </button>
                    </div>

                    <div className="bg-stone-800/30 p-4 rounded-2xl border border-stone-800">
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">{lang === 'zh' ? '正在审计准则' : 'Auditing Rule'}</p>
                      <p className="text-stone-200 font-bold">{loggingItem.text}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">{lang === 'zh' ? '遇到了什么情景？' : 'What was the scenario?'}</label>
                        <textarea
                          autoFocus
                          placeholder={lang === 'zh' ? "描述当时发生的具体情况..." : "Describe what happened..."}
                          value={logScenario}
                          onChange={(e) => setLogScenario(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all h-24 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">{lang === 'zh' ? '你的选择' : 'Your Choice'}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setLogChoice('stuck')}
                            className={cn(
                              "py-3 rounded-xl border font-bold transition-all flex items-center justify-center gap-2",
                              logChoice === 'stuck' ? "bg-stone-800 border-stone-600 text-stone-200" : "bg-stone-800/50 border-stone-700 text-stone-500"
                            )}
                          >
                            <CheckCircle2 size={16} /> {lang === 'zh' ? '守住了' : 'Stuck to it'}
                          </button>
                          <button 
                            onClick={() => setLogChoice('broken')}
                            className={cn(
                              "py-3 rounded-xl border font-bold transition-all flex items-center justify-center gap-2",
                              logChoice === 'broken' ? "bg-stone-800 border-stone-600 text-stone-200" : "bg-stone-800/50 border-stone-700 text-stone-500"
                            )}
                          >
                            <AlertCircle size={16} /> {lang === 'zh' ? '打破了' : 'Broke it'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">{lang === 'zh' ? '后续结果/感悟' : 'Subsequent Result/Insight'}</label>
                        <textarea
                          placeholder={lang === 'zh' ? "这次选择带来了什么后果？有什么新的启发？" : "What were the consequences? Any new insights?"}
                          value={logOutcome}
                          onChange={(e) => setLogOutcome(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-sm text-stone-300 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all h-24 resize-none"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleLogAdd}
                      disabled={!logScenario.trim()}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                      <History size={18} />
                      {lang === 'zh' ? '存入实战档案' : 'Save to Archive'}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Add Decision Modal */}
            <AnimatePresence>
              {isAddingDecision && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingDecision(false);
                    }}
                    className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Brain className="text-amber-500" size={20} />
                        {editingDecision 
                          ? (lang === 'zh' ? '编辑决策' : 'Edit Decision')
                          : (lang === 'zh' ? '决策实验室' : 'Decision Lab')
                        }
                      </h3>
                      <button onClick={() => {
                        setIsAddingDecision(false);
                        setEditingDecision(null);
                        setDecisionContent('');
                        setTenYearView('');
                      }} className="text-stone-500 hover:text-stone-300">
                        <Plus size={24} className="rotate-45" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">{lang === 'zh' ? '当前决策' : 'Current Decision'}</label>
                        <textarea
                          autoFocus
                          placeholder={lang === 'zh' ? "描述你正在面临的决策..." : "Describe the decision you are facing..."}
                          value={decisionContent}
                          onChange={(e) => setDecisionContent(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all h-24 resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1 flex items-center gap-1">
                          <Clock size={10} className="text-amber-500" /> {lang === 'zh' ? '十年后的视角 (影响大吗？)' : '10-Year Perspective (Does it matter?)'}
                        </label>
                        <textarea
                          placeholder={lang === 'zh' ? "站在十年后看今天，这个决策会如何影响你？它是扩展了可能性还是扼杀了可能性？" : "Looking back from 10 years, how does this affect you? Does it expand or kill possibilities?"}
                          value={tenYearView}
                          onChange={(e) => setTenYearView(e.target.value)}
                          className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-sm text-stone-300 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all h-32 resize-none"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleDecisionAdd}
                      disabled={!decisionContent.trim()}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      {editingDecision 
                        ? (lang === 'zh' ? '更新决策' : 'Update Decision')
                        : (lang === 'zh' ? '存入实验室' : 'Save to Lab')
                      }
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Floating Add Decision Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingDecision(true)}
                className="w-full py-5 rounded-3xl bg-stone-900 border border-stone-800 text-stone-200 font-bold shadow-2xl flex items-center justify-center gap-3 group hover:border-amber-500/50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <span>{lang === 'zh' ? '记录新决策' : 'Record New Decision'}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Energy Leak Audit View */
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl px-4 pb-24 relative"
          >
            <button 
              onClick={() => { setAuditStep(0); setCurrentView('pyramid'); }}
              className="absolute -top-4 left-4 flex items-center gap-2 text-stone-500 hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-widest group"
            >
              <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              {lang === 'zh' ? '返回主页' : 'Back to Home'}
            </button>

            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl">
                <History className="text-amber-500 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">{lang === 'zh' ? '能量黑洞审计' : 'Energy Leak Audit'}</h2>
              <p className="text-stone-500 text-sm">{lang === 'zh' ? '通过复盘历史失败，精准识别并封印那些吞噬你能量的“黑洞”。' : 'Identify and seal "black holes" that drain your energy by reviewing past failures.'}</p>
            </div>

            {/* Wizard Steps */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-stone-800">
                <motion.div 
                  className="h-full bg-amber-500"
                  animate={{ width: `${((auditStep + 1) / 4) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                {auditStep === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-widest text-xs">
                      <AlertCircle size={16} /> {lang === 'zh' ? '第一步：回顾失败' : 'Step 1: Review Failure'}
                    </div>
                    <h3 className="text-xl font-semibold text-stone-100">{lang === 'zh' ? '历史上哪次经历让你感到最失败或损失惨重？' : 'Which past experience made you feel most failed or caused significant loss?'}</h3>
                    <textarea 
                      placeholder={lang === 'zh' ? "例如：去年盲目跟风投资某项目，导致半年积蓄归零..." : "e.g., Blindly followed an investment last year, losing half my savings..."}
                      value={auditFailure}
                      onChange={(e) => setAuditFailure(e.target.value)}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all h-32 resize-none"
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setAuditStep(0); setCurrentView('pyramid'); }}
                        className="flex-1 py-4 rounded-2xl bg-stone-800/50 text-stone-500 font-bold hover:bg-stone-800 transition-all"
                      >
                        {lang === 'zh' ? '取消' : 'Cancel'}
                      </button>
                      <button 
                        disabled={!auditFailure.trim()}
                        onClick={() => setAuditStep(1)}
                        className="flex-[2] py-4 rounded-2xl bg-stone-800 text-stone-200 font-bold hover:bg-stone-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {lang === 'zh' ? '下一步分析原因' : 'Next: Analyze Cause'} <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {auditStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-widest text-xs">
                      <Zap size={16} /> {lang === 'zh' ? '第二步：深挖根源' : 'Step 2: Dig to the Root'}
                    </div>
                    <h3 className="text-xl font-semibold text-stone-100">{lang === 'zh' ? '导致这次失败的核心原因或心态是什么？' : 'What was the core reason or mindset behind this failure?'}</h3>
                    <textarea 
                      placeholder={lang === 'zh' ? "例如：贪婪、缺乏独立思考、过度自信、没有设置止损线..." : "e.g., Greed, lack of independent thinking, overconfidence, no stop-loss..."}
                      value={auditCause}
                      onChange={(e) => setAuditCause(e.target.value)}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all h-32 resize-none"
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setAuditStep(0)} 
                        className="flex-1 py-4 rounded-2xl bg-stone-800/50 text-stone-500 font-bold hover:bg-stone-800 transition-all"
                      >
                        {lang === 'zh' ? '上一步' : 'Back'}
                      </button>
                      <button 
                        disabled={!auditCause.trim()}
                        onClick={() => setAuditStep(2)}
                        className="flex-[2] py-4 rounded-2xl bg-stone-800 text-stone-200 font-bold hover:bg-stone-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {lang === 'zh' ? '下一步制定准则' : 'Next: Set Rule'} <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {auditStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-widest text-xs">
                      <ShieldAlert size={16} /> {lang === 'zh' ? '第三步：确立“不为”' : 'Step 3: Establish "Not-To-Do"'}
                    </div>
                    <h3 className="text-xl font-semibold text-stone-100">{lang === 'zh' ? '为了不再重蹈覆辙，你需要建立哪条“不为”准则？' : 'To avoid repeating this, what "Not-To-Do" rule should you establish?'}</h3>
                    <input 
                      placeholder={lang === 'zh' ? "例如：不投资任何自己看不懂的项目" : "e.g., Do not invest in anything I don't understand"}
                      value={auditRule}
                      onChange={(e) => setAuditRule(e.target.value)}
                      className="w-full bg-stone-800/50 border border-stone-700 rounded-2xl px-5 py-4 text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                    />
                    
                    <div className="space-y-3">
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest px-1">选择分类</p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setAuditCategory(cat.id)}
                            className={cn(
                              "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                              auditCategory === cat.id 
                                ? cn("bg-stone-800", cat.color, cat.text) 
                                : "bg-transparent border-stone-800 text-stone-600 hover:border-stone-700"
                            )}
                          >
                            <cat.icon size={12} />
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setAuditStep(1)} 
                        className="flex-1 py-4 rounded-2xl bg-stone-800/50 text-stone-500 font-bold hover:bg-stone-800 transition-all"
                      >
                        {lang === 'zh' ? '上一步' : 'Back'}
                      </button>
                      <button 
                        disabled={!auditRule.trim()}
                        onClick={() => setAuditStep(3)}
                        className="flex-[2] py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                      >
                        {lang === 'zh' ? '预览审计结果' : 'Preview Result'} <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {auditStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mb-2">
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-stone-100">审计完成</h3>
                      <p className="text-stone-500 text-sm">你已成功将一次失败转化为一块坚固的防护砖。</p>
                    </div>

                    <div className="bg-stone-800/30 border border-stone-700 p-6 rounded-2xl space-y-4">
                      <div>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">不为准则</p>
                        <p className="text-lg font-bold text-amber-500">{auditRule}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">历史教训</p>
                          <p className="text-xs text-stone-400 line-clamp-3">{auditFailure}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">根本原因</p>
                          <p className="text-xs text-stone-400 line-clamp-3">{auditCause}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setAuditStep(2)} className="flex-1 py-4 rounded-2xl bg-stone-800/50 text-stone-500 font-bold hover:bg-stone-800 transition-all">修改</button>
                      <button 
                        onClick={completeAudit}
                        className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-black hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-xl"
                      >
                        <Sparkles size={18} />
                        铸造并加入金字塔
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quote */}
            <div className="mt-12 text-center">
              <p className="text-stone-600 italic text-sm">“痛苦 + 反思 = 进步” —— 瑞·达利欧</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Data Management Modal */}
      <AnimatePresence>
        {showDataModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDataModal(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-amber-500" size={20} />
                  {lang === 'zh' ? '设置' : 'Settings'}
                </h3>
                <button onClick={() => setShowDataModal(false)} className="text-stone-500 hover:text-stone-300">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-stone-800/50 rounded-2xl border border-stone-700">
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-4">{lang === 'zh' ? '语言设置' : 'Language Settings'}</p>
                  <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-700">
                    <button 
                      onClick={() => setLang('zh')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        lang === 'zh' ? "bg-amber-500 text-stone-950 shadow-lg" : "text-stone-500 hover:text-stone-300"
                      )}
                    >
                      中文
                    </button>
                    <button 
                      onClick={() => setLang('en')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        lang === 'en' ? "bg-amber-500 text-stone-950 shadow-lg" : "text-stone-500 hover:text-stone-300"
                      )}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-800/50 rounded-2xl border border-stone-700">
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-4">{lang === 'zh' ? 'Markdown 笔记管理' : 'Markdown Note Management'}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={exportMarkdown}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 group"
                    >
                      <FileText className="text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'zh' ? '导出笔记' : 'Export Notes'}</span>
                    </button>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 group cursor-pointer">
                      <Upload className="text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'zh' ? '导入笔记' : 'Import Notes'}</span>
                      <input type="file" accept=".md" onChange={importMarkdown} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-stone-600 leading-relaxed">
                    Markdown 格式适用于在 Notion、Obsidian 等笔记软件中查看，<br/>
                    同时也支持通过导入 Markdown 文件来恢复您的金字塔数据。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Small Data Management Trigger */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button 
          onClick={() => setShowDataModal(true)}
          className="p-3 rounded-full bg-stone-900/50 border border-stone-800 text-stone-600 hover:text-amber-500 hover:border-amber-500/30 transition-all shadow-xl backdrop-blur-sm"
          title="数据管理"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
