"use client";

import { createClient } from "@/utils/supabase/client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const DeleteMatch = ({
  id,
  fightersIds,
  children,
}: {
  id: string;
  fightersIds: string[];
  children: React.ReactNode;
}) => {
  const supabase = createClient();
  const router = useRouter();

  const deleteMatch = async () => {
    const mat = await supabase
      .from("match_fighters")
      .delete()
      .eq("match_id", id);
    if (mat.error) {
      console.error("Erro ao cancelar luta:", mat.error);
    }
    const fig = await supabase.from("fighters").delete().in("id", fightersIds);
    if (fig.error) {
      console.error("Erro ao cancelar luta:", fig.error);
    }
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) {
      console.error("Erro ao cancelar luta:", error);
    }
    router.refresh();
  };

  return <DropdownMenuItem onClick={deleteMatch}>{children}</DropdownMenuItem>;
};
