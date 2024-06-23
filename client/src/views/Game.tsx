import PixelCanvas from "@/components/PixelCanvas";
import Scoreboard from "@/components/Scoreboard";
import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import ToolButton from "@/components/ToolButton";

export default function Game() {
  return (
    <div className="m-auto w-[60vw]">
      <div className="min-w-[805px]">
        <p className="text-left p-4">Pixl.io</p>
      </div>
      <main className="m-auto grid min-w-[805px] grid-cols-[1fr_3fr_1fr] justify-center gap-1">
        <div className="w-full min-w-[200px] border border-black">
          <Scoreboard />
        </div>
        <div className="w-full min-w-[400px]">
          <div className="mb-1">
            <PixelCanvas />
          </div>
          <div className="flex gap-1">
            <ToolButton toolName={"brush"} />
            <ToolButton toolName={"bucket"} />
            <ToolButton toolName={"line"} />
            <ToolButton toolName={"eraser"} />
          </div>
        </div>
        <div className="flex flex-col w-full min-w-[200px] border border-black bg-gray-200">
          <Chat />
          <div className="w-full mt-auto p-2">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
