import { useRef, useEffect } from "react";

type Vec2 = {
  x: number;
  y: number;
};

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const mousePosRef = useRef<Vec2>({ x: 0, y: 0 });
  const prevMousePosRef = useRef<Vec2>({ x: 0, y: 0 });
  const pixelScaleRef = useRef(10);

  const contextRef = useRef<CanvasRenderingContext2D>(
    null,
  ) as React.MutableRefObject<CanvasRenderingContext2D>;

  useEffect(() => {
    let context = canvasRef.current!.getContext("2d") as CanvasRenderingContext2D;
    contextRef.current = context;
  }, []);

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (e.button !== 0) return;
    isDrawingRef.current = true;
    prevMousePosRef.current = { ...mousePosRef.current };
    draw();
  }

  function draw() {
    let line = {
      start: getCanvasSpaceMousePos(mousePosRef.current),
      end: getCanvasSpaceMousePos(prevMousePosRef.current),
    };

    bresenhamLine(line.start.x, line.end.x, line.start.y, line.end.y);

    // ensure we're storing the position of the last drawn pixel
    prevMousePosRef.current = { ...mousePosRef.current };

    if (isDrawingRef.current) requestAnimationFrame(draw);
  }

  function bresenhamLine(x0: number, x1: number, y0: number, y1: number) {
    let dx, dy, sx, sy, error, e2;

    dx = Math.abs(x1 - x0);
    sx = x0 < x1 ? 1 : -1;
    dy = -Math.abs(y1 - y0);
    sy = y0 < y1 ? 1 : -1;
    error = dx + dy;

    while (true) {
      placePixel({ x: x0, y: y0 });
      if (x0 === x1 && y0 === y1) break;
      e2 = 2 * error;
      if (e2 >= dy) {
        if (x0 === x1) break;
        error += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        if (y0 === y1) break;
        error += dx;
        y0 += sy;
      }
    }
  }

  function getCanvasSpaceMousePos(pos: Vec2) {
    let rect = canvasRef.current!.getBoundingClientRect();

    let scaleX = canvasRef.current!.width / rect.width;
    let scaleY = canvasRef.current!.height / rect.height;

    let adjustedX = (pos.x - rect.left) * scaleX;
    let adjustedY = (pos.y - rect.top) * scaleY;

    return {
      x: Math.floor(adjustedX / pixelScaleRef.current),
      y: Math.floor(adjustedY / pixelScaleRef.current),
    };
  }

  function updateMousePos(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  }

  function placePixel(pixel: Vec2) {
    contextRef.current.fillRect(
      pixel.x * pixelScaleRef.current,
      pixel.y * pixelScaleRef.current,
      pixelScaleRef.current,
      pixelScaleRef.current,
    );
  }

  function stopDrawing() {
    isDrawingRef.current = false;
  }

  return (
    <canvas
      ref={canvasRef}
      className="border border-black w-full"
      width={800}
      height={600}
      onMouseDown={startDrawing}
      onMouseMove={updateMousePos}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    ></canvas>
  );
}
