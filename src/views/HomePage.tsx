import '../index.css'
import '../styles/variables.css'
import '../components/button/button.css'
import { DropDownButton } from "../components/button/DropDownButton"

export const HomePage = () => {
    const options = ['Common', 'Rare', 'Epic', 'Clear' ]

    return (
        <div>
            {/* <Button color="outlined" >Button Bigger</Button> */}
            <DropDownButton options={options}>Type</DropDownButton>
        </div>
    )
}