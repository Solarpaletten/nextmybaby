'use client';

import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { motion } from "framer-motion";

// --- Drag Item (бутылочка, мишка, соска, кроватка) ---
function DraggableItem({ id, src, alt }: { id: string; src: string; alt: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab select-none"
    >
      <Image src={src} alt={alt} width={80} height={80} />
    </div>
  );
}

// --- Draggable Baby ---
function DraggableBaby({ mood }: { mood: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "baby" });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <motion.div
        key={mood}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={
            mood === "happy"
              ? "/mybaby/babysmile.svg"
              : "/mybaby/baby.png"
          }
          alt="Baby"
          width={200}
          height={200}
        />
      </motion.div>
      {mood === "talk" && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow px-3 py-1 text-sm font-medium text-pink-700 border border-pink-300">
          Агу-агу! 💬
        </div>
      )}
    </div>
  );
}

export default function MyBabyPage() {
  const [mood, setMood] = useState<"sad" | "happy" | "sleep" | "play" | "calm" | "talk">("sad");

  function handleDragEnd(event: any) {
    if (event.over?.id === "baby") {
      switch (event.active.id) {
        case "bottle":
          setMood("happy");
          break;
        case "teddy":
          setMood("play");
          break;
        case "crib":
          setMood("sleep");
          break;
        case "pacifier":
          setMood("calm");
          break;
        default:
          setMood("talk");
      }
      setTimeout(() => setMood("sad"), 4000);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 relative">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">My Mini Baby</h1>

      <DndContext onDragEnd={handleDragEnd}>
        {/* Сам малыш теперь draggable */}
        <DraggableBaby mood={mood} />

        <p className="mt-4 text-pink-700 font-semibold">
          {mood === "sad" && "😢 Малыш ждёт заботы..."}
          {mood === "happy" && "😊 Малыш улыбается!"}
          {mood === "sleep" && "😴 Малыш уснул..."}
          {mood === "play" && "🧸 Малыш играет!"}
          {mood === "calm" && "🍼 Малыш сосёт соску и спокоен"}
          {mood === "talk" && "🗣️ Малыш говорит!"}
        </p>

        {/* Предметы */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <DraggableItem id="bottle" src="/mybaby/bottle.png" alt="Bottle" />
          <DraggableItem id="teddy" src="/mybaby/teddy.png" alt="Teddy" />
          <DraggableItem id="crib" src="/mybaby/crib.png" alt="Crib" />
          <DraggableItem id="pacifier" src="/mybaby/pacifier.png" alt="Pacifier" />
        </div>
      </DndContext>
    </div>
  );
}
