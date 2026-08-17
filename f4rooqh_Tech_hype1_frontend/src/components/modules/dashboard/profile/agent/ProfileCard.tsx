// components/MinimalProfileCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileCard() {
  return (
    <Card className="w-[320px] border shadow-sm rounded overflow-hidden">
      <CardContent className="p-4 flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Nayan" />
          <AvatarFallback className="bg-zinc-800 text-white text-xl">
            N
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-base leading-none">Nayan</span>
            <span className="text-muted-foreground text-sm leading-none">
              @nayan
            </span>
          </div>

          <p className="text-sm text-muted-foreground truncate">
            nayon@com.gmail.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
}