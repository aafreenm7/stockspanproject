import React from 'react';
import { User, Code2, Cpu, GraduationCap, CheckCircle2 } from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  const academicDetails = [
    { label: 'Student', value: 'Aafreen Mujawar' },
    { label: 'PRN', value: '125B1B297' },
    { label: 'Batch', value: 'A3' },
    { label: 'Topic', value: 'Stock Span using Stack' },
    { label: 'Course', value: 'Data Structures and Algorithms (DSA)' },
  ];

  const technologies = [
    { name: 'React', desc: 'Component architecture and state management' },
    { name: 'TypeScript', desc: 'Strict typing for algorithmic models & data contracts' },
    { name: 'Vite', desc: 'Next-generation build tool & dev environment' },
    { name: 'Tailwind CSS', desc: 'Restrained, bespoke design tokens & layout system' },
    { name: 'Recharts', desc: 'Declarative data visualization for price and span metrics' },
    { name: 'Lucide React', desc: 'Clean, semantic icon set' },
  ];

  const coreConcepts = [
    'Stack operations (Push, Pop, Peek/Top)',
    'Monotonic decreasing stack invariants',
    'Historical record ledger vs. active stack decoupling',
    'Amortized O(1) time complexity per element',
    'Overall O(n) linear-time execution across sequence',
    'Data visualization of time-series closing prices and discrete spans',
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
          About Project
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Academic project specification, student credentials, and technical architecture.
        </p>
      </div>

      {/* Project Objective */}
      <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-2">
        <div className="flex items-center space-x-2 text-brand font-semibold text-sm">
          <GraduationCap className="w-4 h-4" />
          <span>Primary Objective</span>
        </div>
        <p className="text-sm text-ink-primary leading-relaxed">
          "To implement the Stock Span Problem using a stack and demonstrate its working through an interactive application."
        </p>
        <p className="text-xs text-ink-secondary leading-relaxed">
          The project serves as an interactive demonstration tool for students and faculty to directly inspect how a monotonic stack reduces the time complexity of calculating consecutive stock spans from quadratic O(n²) to linear O(n).
        </p>
      </div>

      {/* Academic Details Card */}
      <div className="bg-bg-surface border border-line rounded-lg p-5">
        <div className="flex items-center space-x-2 text-ink-primary font-semibold text-sm border-b border-line pb-3 mb-3">
          <User className="w-4 h-4 text-brand" />
          <span>Student & Submission Credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicDetails.map((item, idx) => (
            <div key={idx} className="bg-[#FAFBF9] border border-line rounded p-3 font-mono">
              <span className="text-[10px] uppercase text-ink-secondary tracking-wider block">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-ink-primary mt-1 block">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies & Implementation Stack */}
      <div className="bg-bg-surface border border-line rounded-lg p-5">
        <div className="flex items-center space-x-2 text-ink-primary font-semibold text-sm border-b border-line pb-3 mb-3">
          <Code2 className="w-4 h-4 text-brand" />
          <span>Technologies Utilized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {technologies.map((t, idx) => (
            <div key={idx} className="border border-line rounded p-3 bg-[#FAFBF9]">
              <span className="font-mono text-xs font-semibold text-brand block">
                {t.name}
              </span>
              <span className="text-[11px] text-ink-secondary mt-1 block">
                {t.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Computer Science Concepts */}
      <div className="bg-bg-surface border border-line rounded-lg p-5">
        <div className="flex items-center space-x-2 text-ink-primary font-semibold text-sm border-b border-line pb-3 mb-3">
          <Cpu className="w-4 h-4 text-brand" />
          <span>Demonstrated DSA Concepts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {coreConcepts.map((concept, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-ink-primary font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{concept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Academic Footer */}
      <div className="pt-4 border-t border-line text-center text-xs font-mono text-ink-secondary">
        Stock Span Analyzer · Data Structures and Algorithms Project
      </div>
    </div>
  );
};
