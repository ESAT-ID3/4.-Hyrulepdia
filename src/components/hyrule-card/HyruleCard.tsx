import './hyruleCard.css';
import '../../assets/fonts/title.css';
import chuchu from '../../assets/images/chuchu.png';
import cardFrame from '../../assets/decorations/card-frame.svg';
import cardFrameBlue from '../../assets/decorations/card-frame-blue.svg'
import cardFramePurple from '../../assets/decorations/card-frame-purple.svg'
import monstersIcon from '../../assets/icons/monsters-icon.svg';
import creaturesIcon from '../../assets/icons/creatures-icon.svg';
import materialsIcon from '../../assets/icons/materials-icon.svg';
import treasureIcon from '../../assets/icons/treasure-icon.svg';
import equipmentIcon from '../../assets/icons/equipment-icon.svg';
import { HyruleCardType } from '../../types/hyrule.types';


const displayIcon = (category: HyruleCardType['category']) => {
    switch (category) {
        case 'monsters':
            return <img className='hyrule-card__icon' src={monstersIcon} alt='monsters icon' />;
        case 'creatures':
            return <img className='hyrule-card__icon' src={creaturesIcon} alt='creatures icon' />;
        case 'materials':
            return <img className='hyrule-card__icon' src={materialsIcon} alt='materials icon' />;
        case 'treasure':
            return <img className='hyrule-card__icon' src={treasureIcon} alt='treasure icon' />;
        case 'equipment':
            return <img className='hyrule-card__icon' src={equipmentIcon} alt='equipment icon' />;
        default:
            return <span className='hyrule-card__icon'>?</span>;
    }
};

const rarityFrame = (rarity : HyruleCardType['rarity']) => {
    switch (rarity) {
        case 'common': 
            return <img className='hyrule-card__content__frame' src={cardFrame} alt='card frame' />;
        case 'rare' :
            return <img className='hyrule-card__content__frame' src={cardFrameBlue} alt='card frame' />;
        case 'epic' :
            return <img className='hyrule-card__content__frame' src={cardFramePurple} alt='card frame' />;

    }
};

export const HyruleCard = ({
    id = 84,
    name ='CHUCHU' , 
    points = 200, 
    rarity = 'common', 
    image = 'chuchu' , 
    description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna', 
    location = 'Lorem ipsum dolor sit amet,', 
    items = 'Lorem ipsum dolor sit amet,', 
    category = 'monsters',
    size = 'default',
    disableClick = false,
    isDiscovered= false
} : HyruleCardType )  => {
    
    return (
        <div className={`hyrule-card__border ${rarity} 
            ${!isDiscovered ? 'hidden-card' : ''}   
            ${disableClick ? "card--disabled" : ""}
            ${size === "lg" ? "card--lg" : ""} 
            ${size === "xl" ? "card--xl" : ""}
            ${size === "sm" ? "card--sm" : ""}`}>
            <div className="hyrule-card">
                <div className="hyrule-card__header">
                    <h2>{name}</h2>
                    <div className='hyrule-card__type'>
                        <span className='hyrule-card__points'>{points}</span>
                        {displayIcon(category)}
                    </div>
                </div>
                <div className={`hyrule-card__image ${rarity}-frame`}>
                    <img src={image == 'chuchu' ? chuchu : image} alt={name}></img>
                </div>
                <div className='hyrule-card__content'>
                {rarityFrame(rarity)}
                    <div className='hyrule-card__content__info'>
                        <div className='hyrule-card__description'>
                            <p>{description}</p>
                        </div>
                        <div className='hyrule-card__section'>
                            <h3>Comon Locations</h3>
                            <p>{location}</p>
                        </div>
                        <div className='hyrule-card__section'>
                            <h3>Droppable Items</h3>
                            <p>{items}</p>
                        </div>
                    </div>
                </div>
                <div className='hyrule-card__footer'>{id}/389</div>
            </div>
        </div>
    )
}