'use client';

import { motion } from 'framer-motion';

const codeSnippets = [
  { lang: 'React', color: '#61DAFB', code: 'const App = () => {\n  return <Dashboard />\n}' },
  { lang: 'Python', color: '#3776AB', code: 'model = tf.keras.Sequential([\n  layers.Dense(128)\n])' },
  { lang: 'Node.js', color: '#339933', code: 'app.get("/api", (req, res) => {\n  res.json({ data })\n})' },
  { lang: 'Flutter', color: '#02569B', code: 'Widget build(context) {\n  return Scaffold(\n    body: ListView()\n  )\n}' },
  { lang: 'Solidity', color: '#363636', code: 'function mint(address to) {\n  _tokenIds++;\n  _mint(to, id);\n}' },
  { lang: 'Go', color: '#00ADD8', code: 'func handler(w http.Writer,\n  r *http.Request) {\n  json.Encode(w, data)\n}' },
];

const floatingCards = [
  { title: 'Netflix Clone', price: '₹4,999', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop' },
  { title: 'AI Chatbot', price: '₹3,499', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop' },
  { title: 'Uber Clone', price: '₹7,999', img: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&h=200&fit=crop' },
  { title: 'LMS Platform', price: '₹5,999', img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop' },
];

export function HeroVisuals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {codeSnippets.map((snippet, i) => {
        const positions: React.CSSProperties[] = [
          { top: '12%', left: '4%' },
          { top: '10%', right: '4%' },
          { top: '42%', left: '2%' },
          { top: '45%', right: '3%' },
          { top: '72%', left: '6%' },
          { top: '75%', right: '5%' },
        ];
        return (
          <motion.div
            key={snippet.lang}
            className="absolute hidden lg:block"
            style={positions[i]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.2, duration: 0.8 },
              scale: { delay: 0.5 + i * 0.2, duration: 0.8 },
              y: { delay: 1 + i * 0.3, duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-48 rounded-xl overflow-hidden shadow-xl border border-gray-200/60 dark:border-white/10 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#161b22] border-b border-gray-100 dark:border-white/5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="ml-auto text-[9px] font-mono font-medium" style={{ color: snippet.color }}>{snippet.lang}</span>
              </div>
              <pre className="px-3 py-2 text-[9px] font-mono leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre overflow-hidden">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </motion.div>
        );
      })}

      {floatingCards.map((card, i) => {
        const cardPositions: React.CSSProperties[] = [
          { top: '28%', left: '7%' },
          { top: '22%', right: '6%' },
          { top: '60%', left: '4%' },
          { top: '58%', right: '5%' },
        ];
        return (
          <motion.div
            key={card.title}
            className="absolute hidden xl:block"
            style={cardPositions[i]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.95, y: [0, -14, 0] }}
            transition={{
              opacity: { delay: 1.2 + i * 0.3, duration: 0.8 },
              y: { delay: 1.5 + i * 0.4, duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-40 rounded-xl overflow-hidden shadow-xl border border-gray-200/60 dark:border-white/10 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md">
              <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="px-3 py-2">
                <p className="text-[11px] font-semibold text-gray-800 dark:text-white truncate">{card.title}</p>
                <p className="text-[10px] font-bold text-accent-blue dark:text-accent-cyan mt-0.5">{card.price}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
