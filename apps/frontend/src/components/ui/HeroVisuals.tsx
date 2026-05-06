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
  { title: 'Netflix Clone', price: '₹4,999', img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ced95?w=300&h=200&fit=crop' },
  { title: 'AI Chatbot', price: '₹3,499', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop' },
  { title: 'Uber Clone', price: '₹7,999', img: 'https://images.unsplash.com/photo-1449965408869-ebd3fee7bfbd?w=300&h=200&fit=crop' },
  { title: 'LMS Platform', price: '₹5,999', img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop' },
];

export function HeroVisuals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {codeSnippets.map((snippet, i) => {
        const positions = [
          { top: '8%', left: '3%' },
          { top: '15%', right: '2%' },
          { top: '55%', left: '1%' },
          { top: '65%', right: '4%' },
          { bottom: '15%', left: '5%' },
          { bottom: '8%', right: '1%' },
        ];
        return (
          <motion.div
            key={snippet.lang}
            className="absolute hidden lg:block"
            style={positions[i]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.2, duration: 0.6 },
              scale: { delay: 0.5 + i * 0.2, duration: 0.6 },
              y: { delay: 1 + i * 0.3, duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="relative w-52 rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10 bg-white dark:bg-[#0d1117] backdrop-blur-sm">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-[#161b22] border-b border-gray-100 dark:border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] font-mono" style={{ color: snippet.color }}>{snippet.lang}</span>
              </div>
              <pre className="px-3 py-2.5 text-[10px] font-mono leading-relaxed text-gray-600 dark:text-gray-400 overflow-hidden">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </motion.div>
        );
      })}

      {floatingCards.map((card, i) => {
        const cardPositions = [
          { top: '35%', left: '-2%' },
          { top: '25%', right: '-1%' },
          { bottom: '30%', left: '0%' },
          { bottom: '25%', right: '-2%' },
        ];
        return (
          <motion.div
            key={card.title}
            className="absolute hidden xl:block"
            style={cardPositions[i]}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
            transition={{
              opacity: { delay: 1.2 + i * 0.3, duration: 0.8 },
              x: { delay: 1.2 + i * 0.3, duration: 0.8 },
              y: { delay: 1.5 + i * 0.4, duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-44 rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10 bg-white dark:bg-[#0d1117]">
              <img src={card.img} alt={card.title} className="w-full h-20 object-cover" />
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{card.title}</p>
                <p className="text-[10px] font-bold text-accent-blue dark:text-accent-cyan">{card.price}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
