"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubjectPieProps {
  data: { name: string; color: string; icon: string; minutes: number }[];
}

export function SubjectPie({ data }: SubjectPieProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">科目別割合（過去30日）</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-sm py-8">データなし</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.minutes, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">科目別割合（過去30日）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}分 (${Math.round(Number(v) / total * 100)}%)`, ""]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend
              formatter={(value) => {
                const d = data.find((d) => d.name === value);
                return `${d?.icon ?? ""} ${value}`;
              }}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
