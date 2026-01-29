import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Check, Clock, Hash } from "lucide-react";
import type { Click } from "@shared/schema";

interface FeedbackCardProps {
  click: Click | null;
}

export function FeedbackCard({ click }: FeedbackCardProps) {
  return (
    <div className="h-32 w-full flex items-center justify-center my-8">
      <AnimatePresence mode="wait">
        {click ? (
          <motion.div
            key={click.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full max-w-md bg-white rounded-2xl border border-border/50 shadow-xl shadow-primary/5 p-6 flex items-center justify-between overflow-hidden relative"
          >
            {/* Success Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500" />
            
            <div className="flex-1 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700">
                  <Check className="w-3 h-3" />
                </span>
                <h3 className="text-lg font-bold font-display text-foreground">
                  {click.buttonLabel}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Seq: <strong className="text-foreground font-medium">{click.dailySequence}</strong></span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{format(new Date(click.createdAt), "HH:mm")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground font-medium flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse" />
            À espera do primeiro clique...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
