import React, { useState, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from 'formik';
interface GetPasswordProps {
  name: string;
  placeholder: string;
  label: string;
  errorMessage?: ReactNode;
  className?: string;
}
 
const GetPassword: React.FC<GetPasswordProps> = ({
  name,
  placeholder,
  label,
  errorMessage,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className={`mb-4 relative ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor={name} className="block  text-md font-medium">
          {label}
        </Label>
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>
      <div className="relative">
        <Field
          as={Input}
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className="pr-10"
        />

        <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer transition-all duration-300" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 14 14" className="text-gray-500" >
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" >
                <path d="M3.63 3.624C4.621 2.98 5.771 2.5 7 2.5c2.79 0 5.18 2.475 6.23 3.746c.166.207.258.476.258.754c0 .279-.092.547-.258.754c-.579.7-1.565 1.767-2.8 2.583m-1.93.933c-.482.146-.984.23-1.5.23c-2.79 0-5.18-2.475-6.23-3.746A1.2 1.2 0 0 1 .512 7c0-.278.092-.547.258-.754c.333-.402.8-.926 1.372-1.454" />
                <path d="M8.414 8.414a2 2 0 0 0-2.828-2.828M13.5 13.5L.5.5" />
              </g>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 14 14" className="text-gray-500" >
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.23 6.246c.166.207.258.476.258.754c0 .279-.092.547-.258.754C12.18 9.025 9.79 11.5 7 11.5S1.82 9.025.77 7.754A1.2 1.2 0 0 1 .512 7c0-.278.092-.547.258-.754C1.82 4.975 4.21 2.5 7 2.5s5.18 2.475 6.23 3.746" />
                <path d="M7 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
              </g>
            </svg>
          )}
        </div>
      </div>

      
      
    </div>
  );
};

export default GetPassword;
