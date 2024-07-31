import styled from "styled-components";

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 12px;
  line-height: 40px;
  color: #4e5969;
  padding-left: ${(props) => (props.level + 1) * 12}px;
  border-radius: 2px;

  &.isLeaf {
    cursor: pointer;
    &:hover {
      background-color: rgb(242, 243, 245);
    }
  }

  &.active-menu {
    color: #165dff;
    background-color: rgb(242, 243, 245);
  }
`;
