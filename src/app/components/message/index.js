"use client";
import styled from "styled-components";
import { useGlobalStore } from "@/app/store/global";
import { SuccessIcon, ErrorIcon } from "@/app/components/icons";
import { useEffect } from "react";

const MessageWrapper = styled.div`
  position: fixed;
  top: 60px;
  left: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  width: auto;
  background: #fff;
  padding: 9px 12px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  gap: 6px;

  .text {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.88);
  }
`;

const icon = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
};

function Message() {
  const { messageInfo, updateMessageInfo } = useGlobalStore((state) => state);
  const { type, content, open } = messageInfo || {};

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        updateMessageInfo({});
      }, 1500);
    }
  }, [open]);

  return (
    <>
      {open ? (
        <MessageWrapper>
          <span className="icon">{icon[type]}</span>
          <span className="text">{content}</span>
        </MessageWrapper>
      ) : null}
    </>
  );
}

export default Message;
