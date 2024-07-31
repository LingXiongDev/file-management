import styled from "styled-components";

export const UiButton = styled.div`
  padding: 0 15px;
  font-size: 14px;
  height: 32px;
  border-radius: 2px;
  background-color: #fff;
  color: rgb(78, 89, 105);
  border: 1px solid transparent;
  display: inline-block;
  position: relative;
  outline: none;
  font-weight: 400;
  -webkit-appearance: none;
  user-select: none;
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
  white-space: nowrap;
  transition: all 0.1s cubic-bezier(0, 0, 1, 1);
  box-sizing: border-box;
  line-height: 32px;
  opacity: ${(props) => props.disabled ? 0.5 : 1}
`;

export const RaduisButton = styled(UiButton)`
  border: 1px solid #4e5969;
  border-radius: 20px;

  .icon {
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      fill: #4e5969;
    }
  }

  .line {
    width: 1px;
    height: 16px;
    display: inline-block;
    background-color: #4e5969;
  }
`;
