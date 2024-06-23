type Tool = "brush" | "bucket" | "line" | "eraser";

type Props = {
  icon: SVGElement;
  toolName: Tool;
};

export default function ToolButton({ toolName }: { toolName: Tool }) {
  return (
    <button type="button" className="h-16 flex-grow border border-black">
      <p>{toolName}</p>
    </button>
  );
}
