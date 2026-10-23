import React from 'react';
import { Delete } from 'lucide-react';

interface MathKeyboardProps {
  value: string;
  onChange: (next: string) => void;
}

const KEYS = [
  { label: 'x', token: 'x' },
  { label: '^2', token: '^2' },
  { label: '^', token: '^' },
  { label: 'sin(', token: 'sin(' },
  { label: 'cos(', token: 'cos(' },
  { label: 'tan(', token: 'tan(' },
  { label: 'e^x', token: 'e^x' },
  { label: 'abs(', token: 'abs(' },
  { label: '(', token: '(' },
  { label: ')', token: ')' },
  { label: '+', token: ' + ' },
  { label: '-', token: ' - ' },
  { label: '*', token: ' * ' },
  { label: '/', token: ' / ' },
  { label: 'π', token: 'pi' }
];

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ value, onChange }) => {
  const insertToken = (token: string) => {
    onChange(`${value}${token}`);
  };

  const backspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-wrap items-center gap-1 pt-1">
      {KEYS.map((k) => (
        <button
          key={k.label}
          type="button"
          onClick={() => insertToken(k.token)}
          className="btn-chunky px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-200 font-mono text-xs font-bold border border-white/10"
        >
          {k.label}
        </button>
      ))}
      <button
        type="button"
        onClick={backspace}
        title="Backspace"
        className="btn-chunky px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-xs font-bold border border-rose-400/30 flex items-center gap-1"
      >
        <Delete className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange('')}
        className="btn-chunky px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold border border-white/10"
      >
        Clear
      </button>
    </div>
  );
};
