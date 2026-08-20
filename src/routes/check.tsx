import { createFileRoute } from "@tanstack/react-router";
import StickerRoom from "@/components/StickerRoom";
import TinyPuzzle from "@/components/TinyPuzzle";
import MysteryBox from "@/components/MysteryBox";
export const Route = createFileRoute("/check")({ component: () => (
  <div style={{display:"flex",gap:20,padding:20,background:"#fdf6ec"}}>
    <div style={{width:380,height:520,position:"relative"}}><div className="page-interactive"><StickerRoom/></div></div>
    <div style={{width:380,height:520,position:"relative"}}><div className="page-interactive"><TinyPuzzle/></div></div>
    <div style={{width:380,height:520,position:"relative"}}><div className="page-interactive"><MysteryBox/></div></div>
  </div>) });
