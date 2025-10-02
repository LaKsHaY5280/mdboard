"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Clock, TrendingUp, CheckCircle, Award } from "lucide-react";

interface User {
  interests?: string;
}

interface AccountOverviewProps {
  user: User;
  accountAge: string;
  profileCompletion: number;
  accountStatus: {
    label: string;
    color: string;
  };
  roleDisplay: {
    label: string;
    color: string;
  };
}

export function AccountOverview({
  user,
  accountAge,
  profileCompletion,
  accountStatus,
  roleDisplay,
}: AccountOverviewProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="size-5 text-primary" />
          Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Account Age</span>
            </div>
            <span className="text-sm font-semibold">{accountAge}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Profile Score</span>
            </div>
            <span className="text-sm font-semibold">{profileCompletion}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Account Status</span>
            </div>
            <Badge
              variant="secondary"
              className={`${accountStatus.color} text-white`}
            >
              {accountStatus.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Role</span>
            </div>
            <Badge
              variant="secondary"
              className={`${roleDisplay.color} text-white`}
            >
              {roleDisplay.label}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Personal Interests
          </h4>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hobbies</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {user?.interests || "Not set"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
