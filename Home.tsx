import { useState } from "react";
import { useCreateClick, useClickStats } from "@/hooks/use-clicks";
import { ClickButton } from "@/components/ClickButton";
import { FeedbackCard } from "@/components/FeedbackCard";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import type { Click } from "@shared/schema";

const BUTTON_COLORS = [
  { bg: "bg-blue-500", fill: "#3b82f6" },
  { bg: "bg-indigo-500", fill: "#6366f1" },
  { bg: "bg-purple-500", fill: "#a855f7" },
  { bg: "bg-rose-500", fill: "#f43f5e" },
];

export default function Home() {
  const { mutate: createClick, isPending } = useCreateClick();
  const { data: stats = [] } = useClickStats();
  const { toast } = useToast();
  
  const [lastClick, setLastClick] = useState<Click | null>(null);

  const handleButtonClick = (label: string) => {
    createClick({ buttonLabel: label }, {
      onSuccess: (data) => {
        setLastClick(data);
        toast({
          title: "Clique Registado!",
          description: `Você clicou em "${label}". Sequência: #${data.dailySequence}`,
          duration: 3000,
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Não foi possível registar o clique. Tente novamente.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDownload = () => {
    window.location.href = "/api/clicks/today/download";
  };

  const buttons = [
    { label: "Botão 1", color: `${BUTTON_COLORS[0].bg} text-white` },
    { label: "Botão 2", color: `${BUTTON_COLORS[1].bg} text-white` },
    { label: "Botão 3", color: `${BUTTON_COLORS[2].bg} text-white` },
    { label: "Botão 4", color: `${BUTTON_COLORS[3].bg} text-white` },
  ];

  const chartData = buttons.map((btn, index) => {
    const stat = stats.find(s => s.buttonLabel === btn.label);
    return {
      name: btn.label,
      cliques: stat?.count || 0,
      fill: BUTTON_COLORS[index].fill,
    };
  });

  const totalClicks = chartData.reduce((sum, d) => sum + d.cliques, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        className="fixed top-4 right-4 z-50 shadow-lg bg-white/80 backdrop-blur-sm"
        data-testid="button-download"
      >
        <Download className="h-4 w-4" />
      </Button>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <header className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Sistema de Monitorização
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Registo de Cliques
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clique nos botões para registar a atividade. O contador reinicia automaticamente a cada dia.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {buttons.map((btn, index) => (
            <ClickButton
              key={btn.label}
              index={index}
              label={btn.label}
              colorClass={btn.color}
              onClick={() => handleButtonClick(btn.label)}
              disabled={isPending}
            />
          ))}
        </div>

        <FeedbackCard click={lastClick} />

        <Card className="mt-10 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-xl">Estatísticas de Hoje</CardTitle>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              Total: {totalClicks}
            </div>
          </CardHeader>
          <CardContent>
            {totalClicks === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Ainda não há cliques registados hoje. Clique num botão para começar!
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Bar dataKey="cliques" radius={[0, 6, 6, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-rose-200/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
