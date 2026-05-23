"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { colorOptions } from "@/utils/Colors.data";
import { hexToRgba } from "@/hooks/useHexToRgba";

const CURRENCIES = [
  { code: "COP", flag: "🇨🇴", name: "Peso Colombiano", symbol: "$" },
  { code: "USD", flag: "🇺🇸", name: "Dólar", symbol: "$" },
  { code: "EUR", flag: "🇪🇺", name: "Euro", symbol: "€" },
] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-400">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

export function SettingsClient() {
  const { colorTheme, setColorTheme } = useSyncColorTheme();
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <motion.div
      className="max-w-xl mx-auto px-6 py-10 sm:py-16"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={fadeUp} className="mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Preferencias
        </h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Personaliza tu experiencia en SpendSage
        </p>
      </motion.div>

      <div className="flex flex-col gap-10">
        {/* ── Apariencia ── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-6">
          <SectionDivider label="Apariencia" />

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-0.5">
              Color del tema
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Define el color principal que aparece en toda la aplicación
            </p>

            <div className="flex flex-wrap gap-3">
              {colorOptions.map((option, i) => {
                const isActive = colorTheme === option.color;
                return (
                  <motion.button
                    key={option.color}
                    onClick={() => setColorTheme(option.color)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: i * 0.04,
                      type: "spring",
                      stiffness: 320,
                      damping: 22,
                    }}
                    aria-label={`Tema ${option.color}`}
                    className="relative h-10 w-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: option.color,
                      boxShadow: isActive
                        ? `0 0 0 2.5px white, 0 0 0 4.5px ${option.color}`
                        : "0 1px 3px rgba(0,0,0,0.12)",
                    }}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check
                            className="w-4 h-4 text-white"
                            strokeWidth={3}
                            style={{
                              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))",
                            }}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Live preview strip */}
            <motion.div
              className="mt-5 h-1 rounded-full"
              animate={{ backgroundColor: colorTheme }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </motion.section>

        {/* ── Regional ── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-6">
          <SectionDivider label="Regional" />

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-0.5">
              Moneda
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Selecciona la moneda con la que trabajas
            </p>

            <div className="grid grid-cols-3 gap-3">
              {CURRENCIES.map((curr) => {
                const isActive = currency === curr.code;
                return (
                  <motion.button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    whileHover={{ y: -3, transition: { duration: 0.18 } }}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border-2 text-center transition-colors duration-300 focus-visible:outline-none"
                    style={{
                      borderColor: isActive ? colorTheme : "rgb(241 245 249)",
                      backgroundColor: isActive
                        ? hexToRgba(colorTheme, 0.05)
                        : "rgb(248 250 252)",
                    }}
                  >
                    <span className="text-3xl leading-none">{curr.flag}</span>
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className="text-sm font-bold leading-none tracking-wide"
                        style={{
                          color: isActive ? colorTheme : "rgb(15 23 42)",
                          transition: "color 0.3s",
                        }}
                      >
                        {curr.code}
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight">
                        {curr.name}
                      </span>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key="dot"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: colorTheme }}
                        >
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
