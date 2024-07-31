import styled from "styled-components";
import { CheckIcon } from "../icons";

const CheckBoxWrapper = styled.span`
  vertical-align: middle;
  top: -0.09em;
  position: relative;
  line-height: 1;
  display: inline-block;
  cursor: pointer;
  font-size: 14px;

  &::before {
    width: 24px;
    height: 24px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: "";
    position: absolute;
    display: block;
    border-radius: 50%;
    background-color: transparent;
    box-sizing: border-box;
    transition: background-color 0.1s linear;
  }

  &:hover::before {
    background-color: rgb(242, 243, 245);
  }

  .checkbox-mask {
    position: relative;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    border: 2px solid rgb(229, 230, 235);
    border-radius: 2px;
    background-color: rgb(255, 255, 255);
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: "";
      display: block;
      height: 2px;
      width: 6px;
      background: #fff;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(0);
      position: absolute;
      border-radius: 0.5px;
    }
  }

  .checkbox-mask-icon {
    position: relative;
    height: 100%;
    transform: scale(0);
    color: #fff;
    transform-origin: center 75%;
    margin: 0 auto;
    display: block;
    width: 8px;
  }

  .checked-checkbox-mask {
    border-color: transparent;
    background-color: rgb(22, 93, 255);

    .checkbox-mask-icon {
      transform: scale(1);
    }
  }

  .checkbox-indeterminate {
    border-color: transparent;
    background-color: rgb(22, 93, 255);

    &::after {
      transform: translateX(-50%) translateY(-50%) scale(1);
      transition: transform 0.3s cubic-bezier(0.3, 1.3, 0.3, 1);
    }
  }
`;

function CheckBox({ indeterminate, allChecked, onClick }) {
  return (
    <CheckBoxWrapper>
      <div
        className={`checkbox-mask ${
          allChecked ? "checked-checkbox-mask" : ""
        } ${indeterminate ? "checkbox-indeterminate " : ""}`}
        onClick={() => {
          onClick(allChecked, indeterminate)
        }}
      >
        <CheckIcon styled={{ fill: "#fff" }} />
      </div>
    </CheckBoxWrapper>
  );
}

export default CheckBox;
