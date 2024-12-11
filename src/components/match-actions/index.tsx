import { Button } from "../ui/button";

interface MatchActionsProps {
  reset: () => void;
  switchFighters: () => void;
  leaveMatch: () => void;
  endMatch: () => void;
  ended: boolean;
}
export default function MatchActions(props: MatchActionsProps) {
  const actions = [
    {
      label: "Zerar placar",
      onClick: props.reset,
    },
    {
      label: "Trocar de lado",
      onClick: props.switchFighters,
    },
    {
      label: "Sair da luta",
      onClick: props.leaveMatch,
    },
    {
      label: "Finalizar luta",
      onClick: props.endMatch,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 bg-zinc-950">
      {actions.map((action) => (
        <Button
          variant="secondary"
          key={action.label}
          className="p-4 border h-full text-lg font-bold disabled:opacity-50"
          onClick={action.onClick}
          disabled={action.label !== "Finalizar luta" && props.ended}
        >
          {action.label === "Finalizar luta" && props.ended
            ? "Cancelar"
            : action.label}
        </Button>
      ))}
    </div>
  );
}
