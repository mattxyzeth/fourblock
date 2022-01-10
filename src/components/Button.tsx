import { FC, PointerEvent } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string,
  disabled?: boolean,
  onClick: (e: PointerEvent<HTMLButtonElement>) => void
}

const Button: FC<Props> = ({
  children,
  className,
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}


export default styled(Button)`
  background: rgb(85, 81, 255);
  border: 0px;
  border-radius: 2px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  flex: 0 1 auto;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.011em;
  line-height: 24px;
  margin-bottom: 12px;
  padding: 16px 48px;
  transition: background 0.5s ease 0s, border-color 0.5s ease 0s, color 0.5s ease 0s;

  &:hover {
    background-color: rgb(21 15 249);
  }

  &:disabled {
    background-color: rgb(152 151 211);
    cursor: progress;
  }
`
