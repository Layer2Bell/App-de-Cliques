import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Click } from "@shared/schema";

interface HistoryListProps {
  clicks: Click[];
  isLoading: boolean;
}

export function HistoryList({ clicks, isLoading }: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 w-full bg-muted/40 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (clicks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-muted rounded-2xl">
        <p className="text-muted-foreground">Ainda não há registos hoje.</p>
      </div>
    );
  }

  // Sort by created at desc (newest first)
  const sortedClicks = [...clicks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedClicks.map((click, i) => (
        <motion.div
          key={click.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center justify-between p-4 bg-white hover:bg-muted/30 border border-transparent hover:border-border/50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-secondary-foreground font-mono font-medium text-sm">
              #{click.dailySequence}
            </span>
            <span className="font-medium text-foreground">{click.buttonLabel}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {format(new Date(click.createdAt), "dd MMM, HH:mm", { locale: pt })}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
