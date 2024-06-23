import { useChat } from "@/providers/ChatProvider";

export default function Chat() {
  const chat = useChat();

  return (
    <div className="flex flex-col">
      {chat.map((msg, i) =>
        i % 2 == 0 ? (
          <p key={i} className="p-1 bg-gray-300">
            {msg}
          </p>
        ) : (
          <p key={msg} className="p-1">
            {msg}
          </p>
        ),
      )}
    </div>
  );
}
