import React from 'react';
import './CardContainer.css';
import fill from '../../assets/Fill-10.svg';
import fillBlue from '../../assets/Fill-10-blue.svg';
import fillPurple from '../../assets/Fill-10-purple.svg';

//Props que recibe desde donde se le invoque como App.tsx
//Estos props pueden ser cualquier cosa mientras esten dentro del componente
//CardContainer ej:<h1> HOLA {string dentro del tsx} </h1>
//ClassName para poder hacer cambios dentro del componente desde otro tsx
//ColorClass para decidir color componente
interface CardContainerProps {
  children?: React.ReactNode;
  className?: string;
  colorClass?: 'blue-theme' | 'golden-theme' | 'purple-theme';
  popUp?: boolean;
  hideSvg?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

//Children representa cualquier contenido entre las etiquetas del componente.
//En typescript estoy usando CardContainerProps como tipo
export const CardContainer = ({
  children,
  className = '',
  colorClass = 'golden-theme',
  popUp = false,
  hideSvg = false,
  onClick,
}: CardContainerProps) => {
  return (
    <div
      className={`card ${className} ${colorClass} ${popUp ? 'popup' : ''}`}
      onClick={onClick}
    >
      {!popUp && <div className='bg-image'></div>}
      <div className='bg-overlay'></div>

      {/* SVGs en cada esquina */}
      {!hideSvg && (
        <>
          <div className='svg-wrapper top-left'>
            <img
              src={
                colorClass === 'blue-theme'
                  ? fillBlue
                  : colorClass === 'purple-theme'
                  ? fillPurple
                  : fill
              }
              className='svg-icon'
              alt='svg-top-left'
            />
          </div>
          <div className='svg-wrapper top-right'>
            <img
              src={
                colorClass === 'blue-theme'
                  ? fillBlue
                  : colorClass === 'purple-theme'
                  ? fillPurple
                  : fill
              }
              className='svg-icon'
              alt='svg-top-right'
            />
          </div>
          <div className='svg-wrapper bottom-left'>
            <img
              src={
                colorClass === 'blue-theme'
                  ? fillBlue
                  : colorClass === 'purple-theme'
                  ? fillPurple
                  : fill
              }
              className='svg-icon'
              alt='svg-bottom-left'
            />
          </div>
          <div className='svg-wrapper bottom-right'>
            <img
              src={
                colorClass === 'blue-theme'
                  ? fillBlue
                  : colorClass === 'purple-theme'
                  ? fillPurple
                  : fill
              }
              className='svg-icon'
              alt='svg-bottom-right'
            />
          </div>
        </>
      )}

      {/* líneas y esquinas */}
      <span className='corner-bottom-left'></span>
      <span className='corner-bottom-right'></span>
      <div className='left-top-line'></div>
      <div className='left-bottom-line'></div>
      <div className='right-top-line'></div>
      <div className='right-bottom-line'></div>
      <div className='top-left-line'></div>
      <div className='top-right-line'></div>
      <div className='bottom-left-line'></div>
      <div className='bottom-right-line'></div>

      <div className='card-content'>{children}</div>
    </div>
  );
};
