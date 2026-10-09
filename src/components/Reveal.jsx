import { motion } from 'framer-motion';

/** Scroll-triggered reveal. Used sparingly; reduced-motion users get no movement. */
export default function Reveal({ children, delay = 0, y = 22, as = 'div', className }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -70px 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
