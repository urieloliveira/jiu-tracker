import clsx from "clsx";
import { Button } from "../ui/button";
import { EndedActionsProps, ScoreActionsProps } from "./types";
import { DialogTrigger } from "../ui/dialog";

export default function ScoreActions(props: ScoreActionsProps) {
  const actions: { label: number | "V" | "P"; disabled: boolean }[] = [
    {
      label: 1,
      disabled: true,
    },
    {
      label: 2,
      disabled: false,
    },
    {
      label: 3,
      disabled: false,
    },
    {
      label: 4,
      disabled: false,
    },
    {
      label: "V",
      disabled: false,
    },
    {
      label: "P",
      disabled: false,
    },
  ];
  const handleClick = (action: "add" | "remove", value: number | "V" | "P") => {
    if (action === "add") {
      if (value === "V") {
        props.setAdvantages((prev) => prev + 1);
      } else if (value === "P") {
        props.setPenalties((prev) => prev + 1);
      } else {
        props.setPoints((prev) => prev + value);
      }
    } else {
      if (value === "V") {
        props.setAdvantages((prev) => Math.max(prev - 1, 0));
      } else if (value === "P") {
        props.setPenalties((prev) => Math.max(prev - 1, 0));
      } else {
        props.setPoints((prev) => Math.max(prev - value, 0));
      }
    }
  };
  return (
    <div className="self-start grid grid-cols-6 h-32">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="p-4 border h-full text-lg font-bold text-green-600 disabled:opacity-50"
          disabled={action.disabled}
          onClick={() => handleClick("add", action.label)}
        >
          +{action.label}
        </Button>
      ))}
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="p-4 border h-full text-lg font-bold text-red-600 disabled:opacity-50"
          disabled={action.disabled}
          onClick={() => handleClick("remove", action.label)}
        >
          -{action.label}
        </Button>
      ))}
    </div>
  );
}

export function EndedActions(props: EndedActionsProps) {
  const actions = [
    {
      label: "Finalização",
      status: "SUBMISSION",
      disabled: false,
    },
    {
      label: "Pontos",
      status: "POINTS",
      disabled: false,
    },
    {
      label: "Decisão",
      status: "DECISION",
      disabled: false,
    },
    {
      label: "Desistência",
      status: "WALKOVER",
      disabled: false,
    },
    {
      label: "Não Compareceu",
      status: "NO_SHOW",
      disabled: false,
    },
    {
      label: "Desqualificação",
      status: "DISQUALIFICATION",
      disabled: false,
    },
  ];
  return (
    <div className="self-start grid grid-cols-4 h-32">
      <div className="col-span-4 text-center text-lg font-bold bg-green-800">
        Vitória por:
      </div>
      {actions.map((action) => (
        <DialogTrigger asChild key={action.label}>
          <Button
            variant="outline"
            className={clsx(
              "p-4 h-full border font-bold disabled:opacity-50",
              action.label === "Pontos" || action.label === "Finalização"
                ? "col-span-2"
                : "col-span-1"
            )}
            onClick={() => props.setWinner(action.status)}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        </DialogTrigger>
      ))}
    </div>
  );
}
