import React from "react";
import { ContextModalProps } from "@mantine/modals";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const PublishModalBody = ({
  context,
  id,
  innerProps
}: ContextModalProps<{
  modalBody: string;
  onConfirm: () => void;
  confirmLabel: string;
  isDisabled: boolean;
}>) => {
  return (
    <div className="flex flex-col gap-20">
      <ErrorMessage classname="text-2xl font-medium">{innerProps.modalBody}</ErrorMessage>
      <div className="flex flex-row gap-4 self-end">
        <Button theme="dark" onClick={() => context.closeModal(id)}>
          Back
        </Button>
        <Button
          theme="secondary"
          onClick={() => {
            context.closeModal(id);
            innerProps.onConfirm();
          }}
        >
          {innerProps.confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export default PublishModalBody;
