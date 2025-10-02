"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Mail,
  Calendar,
  FileText,
  User,
  Edit,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  interests?: string;
  createdAt?: string;
}

interface ProfileViewProps {
  user: User;
  profileCompletion: number;
  accountStatus: {
    label: string;
    color: string;
  };
  onEditClick: () => void;
}

export function ProfileView({
  user,
  profileCompletion,
  accountStatus,
  onEditClick,
}: ProfileViewProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="size-5 text-primary" />
            Profile Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={onEditClick}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="size-24 border-4 border-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 size-6 rounded-full ${accountStatus.color} flex items-center justify-center`}
              >
                <CheckCircle className="size-3 text-white" />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h3>
                <Badge
                  variant="secondary"
                  className={`${accountStatus.color} text-white`}
                >
                  {accountStatus.label}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                ID: {user.id}
              </p>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Profile Completion
                </div>
                <Progress value={profileCompletion} className="w-full h-2" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="group p-4 border rounded-lg hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                  <Mail className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Email Address
                  </p>
                  <p className="text-sm text-muted-foreground break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-4 border rounded-lg hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Member Since
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">
                  About Me
                </p>
                {user.bio ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No bio added yet. Click edit to add one!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
