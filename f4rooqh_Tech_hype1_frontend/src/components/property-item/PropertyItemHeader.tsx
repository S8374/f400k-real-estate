"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Building2,
  CheckCircle2,
  Edit,
  Home,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";

interface PropertyItemHeaderProps {
  id: string;
  title: string;
  images: string[];
  status: string;
  statusColor: string;
  type?: string;
  isRegaVerified?: boolean;
  gigaProject?: boolean;
  formatCurrency: (amount: number) => string;
  price: string | number;
  deletePropertyLoading: boolean;
  handleDelete: () => void;
}

export function PropertyItemHeader({
  id,
  title,
  images,
  status,
  statusColor,
  type,
  isRegaVerified,
  gigaProject,
  formatCurrency,
  price,
  deletePropertyLoading,
  handleDelete,
}: PropertyItemHeaderProps) {
  const getTypeIcon = (t?: string) => {
    switch (t) {
      case "GOLDEN_VISA":
        return <Sparkles className="h-4 w-4 text-yellow-400" />;
      case "HIGH_YIELD":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "LUXURY":
        return <Building2 className="h-4 w-4 text-purple-400" />;
      default:
        return <Home className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative h-52 overflow-hidden">
      <Image
        src={images?.[0] || "/no-image.png"}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/35 to-transparent" />

      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <Badge className={`${statusColor} border-0 text-white shadow-sm`}>
          {status}
        </Badge>
        {type && (
          <Badge
            variant="outline"
            className="border-emerald-400/40 bg-stone-950/70 text-emerald-300 backdrop-blur-md"
          >
            {getTypeIcon(type)}
            <span className="ml-1">{type?.replace("_", " ")}</span>
          </Badge>
        )}
        {isRegaVerified && (
          <Badge className="border-0 bg-emerald-600/95 text-white shadow-sm">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            REGA Verified
          </Badge>
        )}
        {gigaProject && (
          <Badge className="border-0 bg-violet-600/90 text-white shadow-sm">
            <Award className="h-3 w-3 mr-1" />
            Giga Project
          </Badge>
        )}
      </div>

      {/* Price Badge */}
      <div className="absolute bottom-4 right-4">
        <Badge className="border-0 bg-emerald-500 text-base text-white px-4 py-1.5 shadow-lg shadow-emerald-950/40">
          {formatCurrency(Number(price))}
        </Badge>
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-1 rounded border border-white/20 bg-black/40 p-1 backdrop-blur-xl shadow-lg ring-1 ring-white/10 transition-all hover:bg-black/50">
        <Link href={`/dashboard/my-properties/${id}/edit`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded text-gray-200 transition-all hover:bg-emerald-500/20 hover:text-emerald-400"
            title="Edit Property"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>

        <ConfirmDeleteDialog
          loading={deletePropertyLoading}
          onConfirm={handleDelete}
          title="Delete Property?"
          description="This property will be permanently deleted."
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded text-gray-200 transition-all hover:bg-red-500/20 hover:text-red-400"
              title="Delete Property"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
