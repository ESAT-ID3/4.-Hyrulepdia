import plusIcon from '../../assets/icons/icon-plus.svg';
import minusIcon from '../../assets/icons/icon-minus.svg'
import { ReactNode, useState } from 'react';

type Size = 'sm' | 'md' | 'lg';

export interface DropdownButtonProps {
  options: string[];
  onSelect?: (option: string) => void;
  size?: Size;
  children?: ReactNode;
  isModal?: boolean; 
}

export const DropDownButton = ({ options, onSelect, size = 'md', children, isModal }: DropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const toggleDropDown = () => setIsOpen(!isOpen);

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  const handleClearSelection = () => {
    setSelectedOption(''); 
    setIsOpen(false);
    if (onSelect) onSelect('All');
  };

  const buttonClassName = `button outlined ${size}`;

  return (
    <div className="dropdown-button">
      <button onClick={toggleDropDown} className={buttonClassName}>
        <div>
          <span className="right-line-top"></span>
          <span className="right-line-bottom"></span>
          <span className="left-line-top"></span>
          <span className="left-line-bottom"></span>
          <span className="top-line-left"></span>
          <span className="bottom-line-left"></span>
          <span className="top-line-right"></span>
          <span className="bottom-line-right"></span>
        </div>
        {selectedOption === '' ? children : selectedOption}
        <img src={isOpen ? minusIcon : plusIcon} alt="toggle icon" className="dropdown-icon" />
      </button>

      <div className={`dropdown-button__options ${isOpen ? 'open' : ''} ${isModal ? 'static-position' : ''}`}>
        {options.map((option) => (
          <button
            className="dropdown-button__option button"
            key={option}
            onClick={() => handleSelectedOption(option)}
          >
            {option}
          </button>
        ))}
        <button
          className="dropdown-button__option button clear-filter"
          onClick={handleClearSelection}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
