import type { ChartConfig } from "@/components/ui/chart";

// Leads chart
export const leadsChartConfig = {
  newLeads: {
    label: "New Leads",
    color: "hsl(var(--chart-1))",
  },
  disqualified: {
    label: "Disqualified",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const leadsChartData = [
  { date: "1", newLeads: 42, disqualified: 8 },
  { date: "2", newLeads: 58, disqualified: 12 },
  { date: "3", newLeads: 35, disqualified: 6 },
  { date: "4", newLeads: 71, disqualified: 15 },
  { date: "5", newLeads: 63, disqualified: 10 },
  { date: "6", newLeads: 49, disqualified: 9 },
  { date: "7", newLeads: 82, disqualified: 18 },
  { date: "8", newLeads: 55, disqualified: 11 },
  { date: "9", newLeads: 67, disqualified: 14 },
  { date: "10", newLeads: 74, disqualified: 16 },
  { date: "11", newLeads: 39, disqualified: 7 },
  { date: "12", newLeads: 91, disqualified: 20 },
];

// Proposals chart
export const proposalsChartConfig = {
  proposalsSent: {
    label: "Proposals Sent",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const proposalsChartData = [
  { date: "1", proposalsSent: 12 },
  { date: "2", proposalsSent: 18 },
  { date: "3", proposalsSent: 9 },
  { date: "4", proposalsSent: 24 },
  { date: "5", proposalsSent: 21 },
  { date: "6", proposalsSent: 15 },
  { date: "7", proposalsSent: 28 },
  { date: "8", proposalsSent: 19 },
  { date: "9", proposalsSent: 22 },
  { date: "10", proposalsSent: 26 },
  { date: "11", proposalsSent: 11 },
  { date: "12", proposalsSent: 31 },
];

// Revenue chart
export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export const revenueChartData = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 28000 },
  { month: "Mar", revenue: 41000 },
  { month: "Apr", revenue: 38000 },
  { month: "May", revenue: 45000 },
  { month: "Jun", revenue: 52000 },
  { month: "Jul", revenue: 48000 },
  { month: "Aug", revenue: 56050 },
];
