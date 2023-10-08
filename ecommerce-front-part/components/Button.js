import styled, {css} from "styled-components"
import { primary } from "@/lib/colors"

export const ButtonStyle = css`
    border: 0;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 15px;
    svg{
        height: 16px;
        margin-right: 5px;
    }
    ${props => props.block === 1 && css`
        display: block;
        width: 100%;
    `}
    ${props => props.white === 1 && props.outline === 0 && css`
        background-color: #fff;
        color: #000;
    `}
    ${props => props.white === 1 && props.outline === 1 && css`
        background-color: transparent;
        color: #fff;
        border: 1px solid #fff;
    `}
    ${props => props.black === 1 && props.outline === 0 && css`
        background-color: #000;
        color: #fff;
    `}
    ${props => props.black === 1 && props.outline === 1 && css`
        background-color: transparent;
        color: #000;
        border: 1px solid #000;
    `}
    ${props => props.primary === 1 && props.outline === 0 && css`
        background-color: ${primary};
        border: 1px solid ${primary};
        color: #FFF;
    `}
    ${props => props.primary === 1 && props.outline === 1 && css`
        background-color: transparent;
        border: 1px solid ${primary};
        color: ${primary};
    `}
    ${props => props.size === 'l' && css`
        font-size: 1.2rem;
        padding: 10px 20px;
        svg{
            height: 20px;
        }
    `}
`
const StyledButton = styled.button`
    ${ButtonStyle}
`

export default function Button({children, outline, block, black, white, primary, ...rest}) {
    return (
        <StyledButton 
        {...rest} 
        outline={outline ? 1 : 0}
        block={block ? 1 : 0}
        black={black ? 1 : 0}
        white={white ? 1 : 0}
        primary={primary ? 1 : 0}
        >{children}</StyledButton> 
    )
}