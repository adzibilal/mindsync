"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/utils/cookies";
import {
  FileText,
  Upload,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const stats = [
    {
      title: "Total Documents",
      value: "0",
      description: "Documents uploaded",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Processed",
      value: "0",
      description: "Successfully processed",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Chat Sessions",
      value: "0",
      description: "Active conversations",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "This Month",
      value: "0",
      description: "Documents this month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ];

  const recentActivities = [
    {
      icon: Upload,
      title: "No recent uploads",
      description: "Upload your first document to get started",
      time: "Just now",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {(userData?.name as string) || "User"}! 👋
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Here&apos;s what&apos;s happening with your documents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest document management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.title}
                    className="flex items-start space-x-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="flex w-full items-center space-x-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Upload Document</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Add new files to your knowledge base
                </p>
              </div>
            </button>

            <button className="flex w-full items-center space-x-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Start Chat</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Chat with your AI assistant
                </p>
              </div>
            </button>

            <button className="flex w-full items-center space-x-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">View Documents</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Browse your uploaded files
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Mindsync</CardTitle>
          <CardDescription>
            Follow these steps to make the most of your second brain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950">
                1
              </div>
              <h3 className="font-semibold">Upload Documents</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start by uploading your documents, PDFs, or text files to build
                your knowledge base.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950">
                2
              </div>
              <h3 className="font-semibold">Configure AI Persona</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Customize your AI assistant&apos;s personality and behavior to match your
                needs.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950">
                3
              </div>
              <h3 className="font-semibold">Start Chatting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use WhatsApp to chat with your AI assistant and access your
                documents anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

