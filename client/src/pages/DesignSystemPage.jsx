import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Play,
  TrendingUp,
  Clock,
  User,
  Grid,
  Zap,
  Search,
  Check,
  Copy,
  Box,
} from 'lucide-react';

// Design system UI components
import Button from '../components/ui/Button';
import IconButton from '../components/ui/IconButton';
import Card from '../components/ui/Card';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import Toggle from '../components/ui/Toggle';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import CircularProgress from '../components/ui/CircularProgress';
import Spinner from '../components/ui/Spinner';
import { CardSkeleton } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import CosmicHeroVisual from '../components/common/CosmicHeroVisual';
import { THEME_COLORS, TYPOGRAPHY_TOKENS } from '../constants/theme';

const DesignSystemPage = () => {
  // Interactive UI states
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const [motionIndex, setMotionIndex] = useState(0);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const triggerToast = (type, title, message) => {
    setActiveToast({ type, title, message });
    setTimeout(() => setActiveToast(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification Container (Floating) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
          <Toast
            type={activeToast.type}
            title={activeToast.title}
            message={activeToast.message}
            onClose={() => setActiveToast(null)}
          />
        </div>
      )}

      {/* Interactive Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Welcome to Crypto Compass"
        confirmText="Continue"
        cancelText="Cancel"
      >
        <p>
          This is a sample modal dialog built with accessible keyboard navigation, backdrop blur, and the signature neon fintech styling.
        </p>
      </Modal>

      {/* ========================================================================= */}
      {/* HERO SECTION (Faithfully matching the reference visual hierarchy)        */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl fintech-panel border border-white/[0.08] p-6 sm:p-10 overflow-hidden">
        {/* Subtle cosmic background gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Call to Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-neon uppercase">
              <span>UI LIBRARY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
              Design <span className="text-neon-glow">System</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-xl">
              A modern, consistent design language for Crypto Compass.
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-lg">
              Build beautiful, immersive, and educational experiences with reusable components, styles, and patterns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={() => {
                  document.getElementById('components-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Components
              </Button>

              <Button
                variant="secondary"
                size="md"
                icon={Play}
                onClick={() => triggerToast('info', 'Video Overview', 'Interactive Design System tour is ready.')}
              >
                Watch Overview
              </Button>
            </div>

            {/* Feature Pills Row */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-accent" />
                <span>Consistent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neon" />
                <span>Modern</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-accent" />
                <span>Accessible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-neon" />
                <span>Production Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Celestial Cosmic Visual + Stats Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* BTC / ETH / SOL Visual */}
            <CosmicHeroVisual />

            {/* Floating Stats Pill matching reference image */}
            <div className="w-full max-w-md mt-2 rounded-2xl bg-space-900/85 border border-white/10 p-3.5 backdrop-blur-xl shadow-glass-panel flex items-center justify-between text-center">
              <div className="flex-1 border-r border-white/10 pr-2">
                <div className="text-[10px] uppercase font-mono text-gray-400">Components</div>
                <div className="text-lg font-bold font-mono text-white">50+</div>
              </div>

              <div className="flex-1 border-r border-white/10 px-2">
                <div className="text-[10px] uppercase font-mono text-gray-400">Design Tokens</div>
                <div className="text-lg font-bold font-mono text-white">100+</div>
              </div>

              <div className="flex-1 pl-2 flex flex-col items-center">
                <div className="text-[10px] uppercase font-mono text-gray-400">Ready for</div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-neon shadow-glow-neon-sm animate-pulse" />
                  <span>Production</span>
                </div>
              </div>
            </div>

            {/* Vertical Tagline on the far edge */}
            <div className="hidden xl:block absolute -right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[9px] font-mono tracking-widest text-gray-500 uppercase">
              DESIGN BETTER · LEARN BRIGHTER
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 NUMBERED COMPONENT SECTIONS GRID (Matching the reference layout)      */}
      {/* ========================================================================= */}
      <div id="components-grid" className="space-y-6">
        {/* ROW 1: Color System & Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 01. Color System */}
          <div className="lg:col-span-7 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <div className="mb-4">
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2">
                <span className="text-neon">01.</span> Color System
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                A carefully crafted palette for a premium experience.
              </p>
            </div>

            {/* Swatches Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 pt-2">
              {Object.entries(THEME_COLORS).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => copyToClipboard(item.hex)}
                  title={`Click to copy ${item.hex}`}
                  className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1"
                >
                  <div
                    className="w-11 h-11 rounded-xl border border-white/20 shadow-md relative flex items-center justify-center transition-all group-hover:border-white/60"
                    style={{ backgroundColor: item.hex }}
                  >
                    {copiedHex === item.hex && (
                      <Check className="w-4 h-4 text-black drop-shadow" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-gray-300 mt-1.5 text-center truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 text-center truncate w-full">
                    {item.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 02. Typography */}
          <div className="lg:col-span-5 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <div className="mb-3">
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2">
                <span className="text-neon">02.</span> Typography
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Modern, clean, and highly readable.
              </p>
            </div>

            <div className="flex items-start gap-6 pt-1">
              {/* Giant Display Aa */}
              <div className="text-5xl sm:text-6xl font-extrabold text-white select-none drop-shadow leading-none pt-1">
                Aa
              </div>

              {/* Typography Scale List */}
              <div className="flex-1 space-y-1.5 text-xs">
                {TYPOGRAPHY_TOKENS.map((token) => (
                  <div key={token.level} className="flex items-baseline justify-between border-b border-white/[0.04] pb-1">
                    <span className="text-[10px] font-mono text-gray-400 w-16 uppercase">
                      {token.level}
                    </span>
                    <span className="text-gray-200 truncate flex-1 pl-2 font-medium">
                      {token.sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Buttons & Inputs & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* 03. Buttons */}
          <div className="lg:col-span-4 rounded-2xl fintech-panel p-6 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
                <span className="text-neon">03.</span> Buttons
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Multiple variants and states.
              </p>

              {/* Variants Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
                <Button variant="danger" size="sm">Danger</Button>
              </div>

              {/* States Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <Button variant="secondary" size="sm">Default</Button>
                <Button variant="secondary" size="sm" className="border-neon/40 text-neon">Hover</Button>
                <Button variant="secondary" size="sm" isLoading>Loading</Button>
                <Button variant="secondary" size="sm" disabled>Disabled</Button>
              </div>
            </div>

            {/* Icon buttons row */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <IconButton icon={TrendingUp} size="sm" />
              <IconButton icon={Clock} size="sm" />
              <IconButton icon={User} size="sm" />
              <IconButton icon={Grid} size="sm" />
              <Button variant="secondary" size="sm" icon={Zap} className="flex-1">
                Button with Icon
              </Button>
            </div>
          </div>

          {/* 04. Inputs */}
          <div className="lg:col-span-5 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
              <span className="text-neon">04.</span> Inputs
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Clean and accessible form elements.
            </p>

            <div className="space-y-3">
              {/* Row 1: Text input + Focused Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  icon={Search}
                  placeholder="Enter your text..."
                  defaultValue=""
                />
                <Input
                  focused
                  defaultValue="Focused input"
                />
              </div>

              {/* Row 2: Select + Error input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  placeholder="Select an option"
                  options={[
                    { value: 'btc', label: 'Bitcoin (BTC)' },
                    { value: 'eth', label: 'Ethereum (ETH)' },
                    { value: 'sol', label: 'Solana (SOL)' },
                  ]}
                />
                <Input
                  error="Error state"
                  defaultValue="Error state"
                />
              </div>

              {/* Row 3: Checkbox & Toggles & Disabled input */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.06]">
                <Checkbox
                  checked={checkbox1}
                  onChange={setCheckbox1}
                  label="Checkbox"
                />
                <Checkbox
                  checked={checkbox2}
                  onChange={setCheckbox2}
                  label="Checkbox"
                />
                <Toggle
                  checked={toggle1}
                  onChange={setToggle1}
                  label="Toggle On"
                />
                <Toggle
                  checked={toggle2}
                  onChange={setToggle2}
                  label="Toggle Off"
                />
                <span className="text-xs text-gray-500 font-mono">Disabled input</span>
              </div>
            </div>
          </div>

          {/* 05. Badges & Tags */}
          <div className="lg:col-span-3 rounded-2xl fintech-panel p-6 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
                <span className="text-neon">05.</span> Badges & Tags
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Status indicators and labels.
              </p>

              {/* Row 1: Category Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="new">New</Badge>
                <Badge variant="popular">Popular</Badge>
                <Badge variant="learning">Learning</Badge>
              </div>

              {/* Row 2: Level Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="beginner">Beginner</Badge>
                <Badge variant="intermediate">Intermediate</Badge>
                <Badge variant="advanced">Advanced</Badge>
              </div>
            </div>

            {/* Row 3: Status Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
              <Badge variant="success" dot>Success</Badge>
              <Badge variant="warning" dot>Warning</Badge>
              <Badge variant="error" dot>Error</Badge>
              <Badge variant="info" dot>Info</Badge>
            </div>
          </div>
        </div>

        {/* ROW 3: Cards & Progress & Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* 06. Cards */}
          <div className="lg:col-span-5 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
              <span className="text-neon">06.</span> Cards
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Flexible card components.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Default Card */}
              <Card className="p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-white mb-1">Default Card</div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    A clean and simple card for content.
                  </p>
                </div>
              </Card>

              {/* Glass Card */}
              <GlassCard hover className="p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-white mb-1">Glass Card</div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    Modern glassmorphism with subtle blur.
                  </p>
                </div>
              </GlassCard>

              {/* Stat Card */}
              <StatCard
                value="$12,483"
                change="+12.5%"
                isPositive={true}
                className="p-3"
              />
            </div>
          </div>

          {/* 07. Progress */}
          <div className="lg:col-span-4 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
              <span className="text-neon">07.</span> Progress
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Track progress and achievements.
            </p>

            <div className="flex items-center gap-4">
              {/* Left linear progress bars */}
              <div className="flex-1 space-y-3.5">
                <ProgressBar
                  label="Lesson Progress"
                  value={75}
                  variant="green"
                />
                <ProgressBar
                  label="XP Progress"
                  value={60}
                  variant="purple"
                />
              </div>

              {/* Right Circular Progress Ring */}
              <div className="flex-shrink-0 pl-2">
                <CircularProgress value={75} size={72} strokeWidth={6} />
              </div>
            </div>
          </div>

          {/* 08. Loading States */}
          <div className="lg:col-span-3 rounded-2xl fintech-panel p-6 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
                <span className="text-neon">08.</span> Loading States
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Spinners and skeleton screens.
              </p>

              <div className="flex items-center justify-around py-1">
                <div className="flex flex-col items-center gap-1.5">
                  <Spinner size="md" />
                  <span className="text-[10px] font-mono text-gray-400">Spinner</span>
                </div>

                <div className="w-36">
                  <div className="space-y-1.5 p-2 rounded-xl bg-space-900/60 border border-white/5">
                    <div className="h-2 w-16 bg-space-700 rounded animate-pulse" />
                    <div className="h-2 w-24 bg-space-700 rounded animate-pulse" />
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 text-center mt-1">Card Skeleton</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Modal & Toast & Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* 09. Modal / Dialog */}
          <div className="lg:col-span-5 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
              <span className="text-neon">09.</span> Modal / Dialog
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Accessible and flexible modal component.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Trigger Button */}
              <div className="sm:col-span-4">
                <Button
                  variant="purple"
                  size="sm"
                  className="w-full"
                  onClick={() => setModalOpen(true)}
                >
                  Open Modal
                </Button>
              </div>

              {/* Static Preview Card representing the open dialog layout */}
              <div className="sm:col-span-8 rounded-xl bg-space-900/90 border border-white/10 p-3 relative">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/[0.08] pb-1.5 mb-1.5">
                  <span>Welcome to Crypto Compass</span>
                  <span className="text-gray-500 text-xs">×</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-snug mb-2.5">
                  This is a sample modal dialog. It can be used for confirmations, forms, or any important content.
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="px-2 py-1 text-[10px] font-medium text-gray-400 bg-space-800 rounded-lg">Cancel</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold text-black bg-neon rounded-lg shadow-glow-neon-sm">Continue</span>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Toast Notifications */}
          <div className="lg:col-span-4 rounded-2xl fintech-panel p-6 border border-white/[0.08]">
            <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
              <span className="text-neon">10.</span> Toast Notifications
            </h2>
            <p className="text-xs text-gray-400 mb-3">
              Different notification types.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => triggerToast('success', 'Success', 'Action completed!')}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Toast type="success" title="Success" message="Action completed!" />
              </div>

              <div
                onClick={() => triggerToast('info', 'Info', "Here's some info.")}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Toast type="info" title="Info" message="Here's some info." />
              </div>

              <div
                onClick={() => triggerToast('warning', 'Warning', 'This is a warning.')}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Toast type="warning" title="Warning" message="This is a warning." />
              </div>

              <div
                onClick={() => triggerToast('error', 'Error', 'Something went wrong.')}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Toast type="error" title="Error" message="Something went wrong." />
              </div>
            </div>
          </div>

          {/* 11. Motion */}
          <div className="lg:col-span-3 rounded-2xl fintech-panel p-6 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight flex items-center gap-2 mb-1">
                <span className="text-neon">11.</span> Motion
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Smooth, subtle animations.
              </p>

              <div className="flex items-center justify-between py-1">
                {/* Glowing Animated Isometric Cube Icon */}
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple/50 via-cyan/40 to-neon/40 p-2 flex items-center justify-center shadow-glow-purple border border-white/20"
                >
                  <Box className="w-5 h-5 text-white" />
                </motion.div>

                {/* Interactive Hover Me button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3.5 py-1.5 rounded-xl bg-space-850 border border-white/20 text-xs font-semibold text-white hover:border-neon/50 hover:text-neon hover:shadow-glow-neon-sm transition-all"
                >
                  Hover Me
                </motion.button>
              </div>
            </div>

            {/* Pagination / Carousel Dots matching reference */}
            <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/[0.06]">
              {[0, 1, 2, 3].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setMotionIndex(dot)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    motionIndex === dot
                      ? 'bg-neon w-3 shadow-glow-neon-sm'
                      : 'bg-space-600 hover:bg-space-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPage;
