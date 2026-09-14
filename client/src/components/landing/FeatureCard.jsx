import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor = '#00F59B',
  delay = 0,
  to = '/learn',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative rounded-3xl bg-[#08111a]/70 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.2] p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Ambient hover glow gradient */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        {/* Icon & Arrow Row */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/[0.08] group-hover:scale-110 transition-transform"
            style={{ color: accentColor }}
          >
            <Icon className="w-6 h-6" />
          </div>

          <Link
            to={to}
            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/[0.1] group-hover:border-white/20 transition-all"
            aria-label={`Explore ${title}`}
          >
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-tight font-sans group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Accent Bar */}
      <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
        <span>Explore Module</span>
        <span
          className="w-2 h-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </motion.div>
  );
}
