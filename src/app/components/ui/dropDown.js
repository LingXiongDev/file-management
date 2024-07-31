import { useEffect, useState } from "react";
import styled from "styled-components";

const DropDownMenu = styled.div`
  position: absolute;
  box-sizing: border-box;
  padding: 4px 0;
  border: 1px solid rgb(229, 230, 235);
  border-radius: 4px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  width: 120px;
  right: 0;
  z-index: 99;
`;

function DropDown(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleChange() {
      setOpen(false);
    }
    if (open) {
      window.addEventListener("click", handleChange);
    } else {
      window.removeEventListener("click", handleChange);
    }
    return () => {
      window.removeEventListener("click", handleChange);
    };
  }, [open]);

  useEffect(() => {
    if (!props.children) {
      setOpen(false)
    }
  }, [props.children])

  return (
    <div
      className={`w-full h-full relative ${props.classname}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      style={props.style}
    >
      {props.children}
      {open ? (
        <DropDownMenu>
          {props.menus?.map((menu) => {
            const { label, value, disabled } = menu;
            const active = props.value === value
            return (
              <div
                key={value}
                className={`flex items-center justify-center p-[6px] cursor-pointer text-[#4e5969] ${
                  disabled
                    ? "cursor-default opacity-[0.3]"
                    : "hover:bg-[#f2f3f5]"
                } ${active ? 'text-[#1d2129] font-[500]' : ''}`}
                onClick={() => {
                  if (disabled) return;
                  props.onClick?.(value);
                }}
              >
                {label}
              </div>
            );
          })}
        </DropDownMenu>
      ) : null}
    </div>
  );
}
export default DropDown;
