import clsx from "clsx";

interface CounterProps {
  value: number;
  title: string;
  color: string;
}
export default function Counter(props: CounterProps) {
  return (
    <div className="flex-1 flex flex-col p-2 gap-3 w-full bg-zinc-900">
      <p
        className={clsx(
          "text-sm font-bold",
          props.value === 0 ? "text-muted-foreground" : props.color
        )}
      >
        {props.title.toUpperCase()}
      </p>
      <div className="flex-1 flex items-center justify-center">
        <p
          className={clsx(
            "text-5xl font-semibold",
            props.value === 0 ? "text-muted-foreground" : props.color
          )}
        >
          {props.value}
        </p>
      </div>
    </div>
  );
}
