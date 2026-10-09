import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Toast() {
  const { toast } = useCart();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
          >
            <Check size={16} aria-hidden="true" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
