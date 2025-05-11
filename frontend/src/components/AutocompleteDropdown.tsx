import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteDropdownProps {
  options: { projectName: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  className?: string;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  onFocus,
  className = '',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      value
        ? options.filter(option =>
            option.projectName.toLowerCase().includes(value.toLowerCase())
          )
        : options
    );
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={value}
        placeholder={placeholder}
        onChange={e => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={e => {
          setShowDropdown(true);
          onFocus && onFocus();
        }}
        autoComplete="off"
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filteredOptions.map((option, idx) => (
            <li
              key={option.projectName + '-' + idx}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => {
                onChange(option.projectName);
                setShowDropdown(false);
              }}
            >
              {option.projectName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteDropdown; 