import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  example?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, required, optional, example, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy-800">
        {label}
        {required && <span className="text-teal-600 ml-0.5">*</span>}
        {optional && <span className="text-navy-300 font-normal ml-1.5">(optional)</span>}
      </label>
      {children}
      {example && !error && <p className="text-xs text-navy-400">{example}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const baseInputClass =
  'w-full px-4 py-2.5 text-sm text-navy-900 bg-white border border-navy-200 rounded-lg transition-colors placeholder:text-navy-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input className={`${baseInputClass} ${className}`} {...rest} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea className={`${baseInputClass} resize-y ${className}`} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <select className={`${baseInputClass} cursor-pointer ${className}`} {...rest}>
      {children}
    </select>
  );
}
