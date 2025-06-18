import './LandingPage.css';
import { Button } from '../../components/button/button';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import SVGSpotlight from '../../components/SVGSpotlight/SVGSpotlight';
import { Footer } from '../../components/footer/footer';
import chestRare from '../../../public/chest-rare-landing.png'
import chestRare2 from '../../../public/chest-rare-landing2.png'
import chestRare3 from '../../../public/chest-rare-landing3.png'
import { PeopleIcon } from '../../components/iconsCards/PeopleIcon';
import { TrophyIcon } from '../../components/iconsCards/TrophyIcon';
import { TreasureChestIcon } from '../../components/iconsCards/TreasureChestIcon';
import { CardsIcon } from '../../components/iconsCards/CardsIcons';
import { Link } from 'react-router-dom';
import { TrebolIcon } from '../../components/iconsCards/TrebolIcon';
import { CompetitionIcon } from '../../components/iconsCards/CompetitionIcon';
import card from '../../../public/card-landing-1.png'
import card2 from '../../../public/card-landing-2.png'
import card3 from '../../../public/card-landing-3.png'
import logo from '../../../public/logo-login.svg'

export const LandingPage = () => {
  return (
    <>
      <header className='header-landing'>
        <div className='header-content-landing'>
          <h2 className='name-header'>HYRULEPEDIA</h2>
        <Link to="/login">
          <Button size="sm" className="btn-link-header">JOIN NOW!</Button>
        </Link>
        </div>
      </header>
      <div className='banner-first'>
        <div className='logo-intro-action'>
          <img src={logo} alt='logo' />
          <Link to="/login">
            <Button size="md" className="btn-link-header">
              PLAY FREE
            </Button>
          </Link>
          <h2 className='texto--img--padding'>BEGIN YOUR ADVENTURE</h2>
          <p className='description-logo-landing'>
            Open chests, collect epic cards, and build the ultimate deck.
          </p>
        </div>
        <div className='cards-img'>
          <div className='cards-img-column'>
            <img className='card-landing float-card-1' src={card} alt="card landing" />
            <img className='card-landing float-card-2' src={card2} alt="card landing" />
          </div>
          <div className='card-img'>
            <img className='card-landing float-card-3' src={card3} alt="card landing" />
          </div>
        </div>
      </div>
      <div className='containers-whit--cardContainer'>
        <div className='container--position'>
          <CardContainer
            className='container-callToaction--with-button float-card'
            colorClass='blue-theme'
          >
            <div className='call-to-action-content'>
              <div className='call-to-action-text'>
                <h2>
                  <span className='highlight-blue'>CHESTS TO OPEN </span>
                  <span>AND EPIC REWARDS</span>
                </h2>
                <p className='card-container-text blue'>
                  Explore magical chests and discover unique cards from the most
                  iconic heroes and enemies of the Zelda world. Each opening is
                  a new surprise on your journey through Hyrule.
                </p>
                <div>
                <Link to="/login">
                  <Button size="md" className="btn-link-header">
                    START
                  </Button>
                </Link>
                </div>
              </div>
              <div className='call-to-action-image float-image'>
                <img
                  src={ chestRare }
                  alt='Zelda Chest'
                />
              </div>
            </div>
          </CardContainer>
        </div>

        <div className='container--position right'>
          <CardContainer
            className='container-callToaction--with-button'
            colorClass='golden-theme'
          >
            <div className='call-to-action-content'>
              <div className='call-to-action-image golden float-image'>
                <img
                  src={ chestRare2 }
                  alt='Zelda Chest'
                />
              </div>
              <div className='call-to-action-text'>
                <h2>
                  <span>COLLECT </span>
                  <span className='highlight-golden'>UNIQUE AND POWERFUL</span>
                  <span> CARDS</span>
                </h2>
                <p className='card-container-text golden'>
                  Embark on an epic journey to collect unique and powerful
                  cards. Each card you find brings you closer to mastering your
                  deck and conquering new challenges across Hyrule.
                </p>
                <div>
                <Link to="/login">
                  <Button size="md" color="secondary" className="btn-link-header">
                    START
                  </Button>
                </Link>
                </div>
              </div>
            </div>
          </CardContainer>
        </div>

        <div className='container--position'>
          <CardContainer
            className='container-callToaction--with-button'
            colorClass='purple-theme'
          >
            <div className='call-to-action-content'>
              <div className='call-to-action-text'>
                <h2>
                  <span className='highlight-purple'>BUILT YOUR DECK </span>
                  <span>AND MASTER YOUR STRATEGY</span>
                </h2>
                <p className='card-container-text'>
                  Build your deck, combine powerful cards, and create the ultimate strategy. 
                  Each choice you make will shape your journey and bring you closer to victory.
                </p>
                <div>
                <Link to="/login">
                  <Button size="md" className="btn-link-header purple">
                    START
                  </Button>
                </Link>
                </div>
              </div>
              <div className='call-to-action-image purple float-image'>
                <img
                  src={ chestRare3 }
                  alt='Zelda Chest'
                />
              </div>
            </div>
          </CardContainer>
        </div>
      </div>
      <div className='landing-banner'>
        <div className='banner-item golden'>
          <div className='banner-item--icon'>
            <CardsIcon />
          </div>
          <div className='heading'>
            <h3>CARDS</h3>
          </div>
          <div className='content'>
            <p className='text-banner'>Over 300 cards to discover.</p>
          </div>
        </div>
        <div className='banner-item'>
          <div className='banner-item--icon'>
            <TreasureChestIcon />
          </div>
          <div className='heading'>
            <h3>CHEST</h3>
          </div>
          <div className='content'>
            <p className='text-banner'>Chests of different rarities</p>
          </div>
        </div>
        <div className='banner-item'>
          <div className='banner-item--icon'>
            <TrophyIcon />
          </div>
          <div className='heading'>
            <h3>ACHIEVEMENTS</h3>
          </div>
          <div className='content'>
            <p className='text-banner'>Level up, unlock special cards...</p>
          </div>
        </div>
        <div className='banner-item'>
          <div className='banner-item--icon'>
            <PeopleIcon />
          </div>
          <div className='heading'>
            <h3>FRIENDS</h3>
          </div>
          <div className='content'>
            <p className='text-banner'>Compare and enjoy with friends.</p>
          </div>
        </div>
      </div>
      <div className='two-column-cardcontainer'>
        <CardContainer className='two-column-content' colorClass='blue-theme'>
          <div className='banner-item'>
            <div className='two-column-text heading'>
              <div className='icon-text'>
                <TrebolIcon/>
                <h3>ENJOYMENT</h3>
              </div>
              <p className='two-column-p'>Feel the thrill of opening each chest.</p>
            </div>
          </div>
        </CardContainer>
        <CardContainer className='two-column-content'>
          <div className='two-column banner-item'>
            <div className='two-column-text heading'>
              <div className='icon-text'>
                <CompetitionIcon/>
                <h3>COMPETITION</h3>
              </div>
              <p className='two-column-p'> Compete with your friends and complete the collection.</p>
            </div>
          </div>
        </CardContainer>
      </div>
      
      <CardContainer
        className='container-callToaction--with-button'
        colorClass='golden-theme'
      >
        <div className='call-to-action-content'>
          <div className='call-to-action-text'>
            <h2>
              <span className='highlight-blue'>CLIMB YOUR </span>
              <span>FREE WELCOME CHEST</span>
            </h2>
            <p className='card-container-text blue'>
              Unlock your free Welcome Chest and start your adventure with
              powerful cards. Each chest brings you closer to building the
              ultimate deck and conquering new challenges.
            </p>
            <div>
            <Link to="/login">
              <Button size="md" className="btn-link-header">
                OPEN NOW
              </Button>
            </Link>
            </div>
          </div>
              <div className='call-to-action-image-last float-image'>
                <img
                  src={ chestRare }
                  alt='Zelda Chest'
                />
              </div>
        </div>
      </CardContainer>
      <SVGSpotlight />
      <Footer />
    </>
  );
};
