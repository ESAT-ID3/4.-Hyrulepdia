import type { ChestButtonType } from "../../types/hyrule.types"
import './ChestButton.css'
import commonChest from '../../assets/chests/chest-common.svg'
import rareChest from '../../assets/chests/chest-rare.svg'
import epicChest from '../../assets/chests/chest-epic.svg'
import rupiaIcon from '../../assets/rupia-icon.png'
import { CardContainer } from "../CardContainer/CardContainer"


//para que cambie la descripción según el tipo de cofre
const displayDescription = (rarity: ChestButtonType['rarity']) => {
    switch (rarity) {
        case 'common':
            return <h3>Contains mostly <br/><span className="chest-button__text__common">COMMON</span> cards</h3>;
        case 'rare':
            return <h3>High chance of <br/><span className="chest-button__text__rare">RARE</span> card</h3>;
        case 'epic':
            return <h3>High chance of <br/><span className="chest-button__text__epic">EPIC</span> card</h3>;
    }
}

//para que cambie el color del texto h1 según el tipo de cofre
const displayRarity = (rarity: ChestButtonType['rarity']) => {
    switch (rarity) {
        case 'common':
            return <span className="chest-button__text__common">{rarity.toUpperCase()}</span>;
        case 'rare':
            return <span className="chest-button__text__rare">{rarity.toUpperCase()}</span>;
        case 'epic':
            return <span className="chest-button__text__epic">{rarity.toUpperCase()}</span>;
    }
}

//para que cambie la imágen según el tipo de cofre
const displayChestType = (
  rarity: ChestButtonType["rarity"],
  isVibrating: boolean
) => {
  const className = `chest-button__img${isVibrating ? " vibrar" : ""}`;

  switch (rarity) {
    case "common":
      return <img className={className} src={commonChest} alt="common chest" />;
    case "rare":
      return <img className={className} src={rareChest} alt="rare chest" />;
    case "epic":
      return <img className={className} src={epicChest} alt="epic chest" />;
  }
};

//para que cambie el color del card container según la rareza
const displayColorClass = (rarity: ChestButtonType['rarity']): 'blue-theme' | 'golden-theme' | 'purple-theme' => {
    switch (rarity) {
        case 'common':
            return 'golden-theme';
        case 'rare':
            return 'blue-theme';
        case 'epic':
            return 'purple-theme';
    }
}


export const ChestButton = ({
    rarity = 'epic',
    price = 500,
    isVibrating = false
} : ChestButtonType ) => {

    console.log(rarity, price)

    return (
        <CardContainer className={`chest-button ${isVibrating ? "vibrar" : ""}`} colorClass={displayColorClass(rarity)}>
            <div className='chset-button__contnt'>
                <h1>
                    {displayRarity(rarity)}
                    <br />
                    CHEST
                </h1>
                {displayChestType(rarity, isVibrating)}
                <div className="chest-price__content">
                    <p className="chest-price">{price}</p>
                    <span><img className="chest-rupia-icon" src={rupiaIcon} alt={rupiaIcon}></img></span>
                </div>
                <div className="chest-button__text">
                    {displayDescription(rarity)}
                </div>
            </div>
        </CardContainer>
    );
    
}