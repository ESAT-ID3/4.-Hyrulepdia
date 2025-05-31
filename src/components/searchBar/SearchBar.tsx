import './search-bar.css';

export interface SearchBarProps {
    onSearch: (query: string) => void;
    value?: string;
    placeholder?: string;
    type?: string;
    id?: string;
    name?: string;
    required?: boolean;
    className?: string;
}

export const SearchBar = ({ 
    onSearch,
    value,
    placeholder,
    type,
    id,
    name,
    required,
    className }: SearchBarProps) => {
    return (
        <div className={`search-bar outlined md ${className}`}>
            <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            required={required}
            placeholder={placeholder}
            />
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
        </div>
    );
};